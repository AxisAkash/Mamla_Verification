from dataclasses import dataclass
from io import BytesIO
from typing import Protocol

from PIL import Image


class OCRProcessingError(Exception):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code
        self.message = message


@dataclass(frozen=True)
class OCRPage:
    page_number: int
    text: str
    source: str
    confidence: int | None = None


class OCRProvider(Protocol):
    name: str

    def recognize_image(self, image_bytes: bytes, page_number: int = 1) -> OCRPage:
        ...


class TesseractOCRProvider:
    name = "tesseract"

    def __init__(self, languages: str = "eng+ben", command: str | None = None) -> None:
        import pytesseract

        self._pytesseract = pytesseract
        self.languages = languages
        if command:
            self._pytesseract.pytesseract.tesseract_cmd = command

    def recognize_image(self, image_bytes: bytes, page_number: int = 1) -> OCRPage:
        try:
            with Image.open(BytesIO(image_bytes)) as image:
                text = self._pytesseract.image_to_string(image, lang=self.languages)
        except self._pytesseract.TesseractNotFoundError as exc:
            raise OCRProcessingError("ocr_unavailable", "Tesseract is unavailable. Install Tesseract with the configured language packs and set TESSERACT_CMD when it is not on PATH.") from exc
        except self._pytesseract.TesseractError as exc:
            raise OCRProcessingError("ocr_failed", "Tesseract could not process the image. Check OCR_LANGUAGES and the installed language packs.") from exc
        except Exception as exc:
            raise OCRProcessingError("ocr_failed", "The image could not be processed by the OCR engine.") from exc
        try:
            version = str(self._pytesseract.get_tesseract_version()).splitlines()[0].strip()
        except Exception:
            version = "unknown"
        return OCRPage(page_number=page_number, text=text, source=f"ocr:tesseract/{version}")
