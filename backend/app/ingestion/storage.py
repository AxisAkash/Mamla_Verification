import hashlib
import os
import tempfile
from dataclasses import dataclass
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.ingestion.file_validation import UploadValidationError, validate_declared_upload, validate_file_signature


@dataclass(frozen=True)
class StoredUpload:
    original_filename: str
    media_type: str
    kind: str
    size_bytes: int
    sha256: str
    storage_key: str
    path: Path


class FileStorage:
    def __init__(self, root: str, max_upload_bytes: int, max_document_pages: int) -> None:
        self.root = Path(root).resolve()
        self.max_upload_bytes = max_upload_bytes
        self.max_document_pages = max_document_pages

    def store_upload(self, upload: UploadFile) -> StoredUpload:
        filename, media_type, kind = validate_declared_upload(upload.filename, upload.content_type)
        self.root.mkdir(parents=True, exist_ok=True)
        temp_path: Path | None = None
        size = 0
        digest = hashlib.sha256()
        suffix = Path(filename).suffix.lower()
        try:
            with tempfile.NamedTemporaryFile(prefix=".upload-", suffix=".tmp", dir=self.root, delete=False) as temp:
                temp_path = Path(temp.name)
                while True:
                    chunk = upload.file.read(1024 * 1024)
                    if not chunk:
                        break
                    size += len(chunk)
                    if size > self.max_upload_bytes:
                        raise UploadValidationError("file_too_large", "The uploaded file exceeds the configured size limit.")
                    digest.update(chunk)
                    temp.write(chunk)
            validate_file_signature(temp_path, media_type, kind, self.max_document_pages)
            storage_key = f"{uuid4().hex}{suffix}"
            destination = self.root / storage_key
            try:
                os.link(temp_path, destination)
            except FileExistsError as exc:
                raise UploadValidationError("storage_collision", "The file could not be stored safely. Please retry.") from exc
            temp_path.unlink(missing_ok=True)
            temp_path = None
            return StoredUpload(filename, media_type, kind, size, digest.hexdigest(), storage_key, destination)
        except UploadValidationError:
            raise
        except OSError as exc:
            raise UploadValidationError("storage_error", "The uploaded file could not be stored safely.") from exc
        finally:
            if temp_path is not None:
                temp_path.unlink(missing_ok=True)

    def path_for(self, storage_key: str) -> Path:
        candidate = (self.root / storage_key).resolve()
        if self.root not in candidate.parents or not candidate.is_file():
            raise FileNotFoundError("Stored evidence is unavailable")
        return candidate

    def delete(self, storage_key: str) -> None:
        path = self.path_for(storage_key)
        path.unlink(missing_ok=True)
