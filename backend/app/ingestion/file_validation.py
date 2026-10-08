from pathlib import Path

from PIL import Image
from pypdf import PdfReader


ALLOWED_UPLOADS: dict[str, tuple[str, str]] = {
    ".jpg": ("image/jpeg", "image"),
    ".jpeg": ("image/jpeg", "image"),
    ".png": ("image/png", "image"),
    ".webp": ("image/webp", "image"),
    ".pdf": ("application/pdf", "document"),
    ".txt": ("text/plain", "text"),
    ".text": ("text/plain", "text"),
}


class UploadValidationError(Exception):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code
        self.message = message


def safe_filename(filename: str | None) -> str:
    if not filename or "\x00" in filename:
        raise UploadValidationError("invalid_filename", "A safe filename is required.")
    normalized = filename.replace("\\", "/").split("/")[-1].strip()
    if not normalized or normalized in {".", ".."} or len(normalized) > 255:
        raise UploadValidationError("invalid_filename", "A safe filename is required.")
    return normalized


def validate_declared_upload(filename: str | None, media_type: str | None) -> tuple[str, str, str]:
    clean_name = safe_filename(filename)
    suffix = Path(clean_name).suffix.lower()
    expected = ALLOWED_UPLOADS.get(suffix)
    if expected is None:
        raise UploadValidationError("unsupported_file_type", "Only JPG, JPEG, PNG, WEBP, PDF, and plain text files are supported.")
    declared_media_type = (media_type or "").split(";", 1)[0].strip().lower()
    if declared_media_type != expected[0]:
        raise UploadValidationError("invalid_media_type", "The declared media type does not match the supported file type.")
    return clean_name, expected[0], expected[1]


def validate_file_signature(path: Path, media_type: str, kind: str, max_document_pages: int) -> None:
    with path.open("rb") as stream:
        signature = stream.read(16)
    if kind == "image":
        valid_signature = (
            (media_type == "image/jpeg" and signature.startswith(b"\xff\xd8\xff"))
            or (media_type == "image/png" and signature.startswith(b"\x89PNG\r\n\x1a\n"))
            or (media_type == "image/webp" and signature.startswith(b"RIFF") and signature[8:12] == b"WEBP")
        )
        if not valid_signature:
            raise UploadValidationError("invalid_file_signature", "The uploaded image is not a valid file of its declared type.")
        try:
            with Image.open(path) as image:
                image.verify()
        except Exception as exc:
            raise UploadValidationError("invalid_image", "The uploaded image could not be safely decoded.") from exc
    elif kind == "document":
        if not signature.startswith(b"%PDF-"):
            raise UploadValidationError("invalid_file_signature", "The uploaded document is not a valid PDF.")
        try:
            reader = PdfReader(str(path), strict=False)
            if len(reader.pages) > max_document_pages:
                raise UploadValidationError("too_many_pages", "The PDF contains more pages than the configured limit.")
        except UploadValidationError:
            raise
        except Exception as exc:
            raise UploadValidationError("invalid_pdf", "The uploaded PDF could not be safely read.") from exc
    else:
        try:
            path.read_bytes().decode("utf-8")
        except (UnicodeDecodeError, OSError) as exc:
            raise UploadValidationError("invalid_text", "Plain text uploads must be valid UTF-8.") from exc
