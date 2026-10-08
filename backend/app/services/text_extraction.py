from dataclasses import dataclass
from pathlib import Path

from pypdf import PdfReader

from app.services.ocr_service import OCRPage, OCRProcessingError, OCRProvider


@dataclass(frozen=True)
class ExtractedDocument:
    raw_text: str
    pages: list[OCRPage]
    provider: str


class DocumentTextExtractionService:
    def __init__(self, ocr_provider: OCRProvider, max_document_pages: int = 50) -> None:
        self.ocr_provider = ocr_provider
        self.max_document_pages = max_document_pages

    def extract(self, path: Path, media_type: str) -> ExtractedDocument:
        if media_type == "text/plain":
            try:
                text = path.read_bytes().decode("utf-8")
            except UnicodeDecodeError as exc:
                raise OCRProcessingError("invalid_text", "The text file is not valid UTF-8.") from exc
            return ExtractedDocument(text, [OCRPage(1, text, "text:file")], "text:file")
        if media_type == "application/pdf":
            return self._extract_pdf(path)
        return self._extract_image(path)

    def _extract_image(self, path: Path) -> ExtractedDocument:
        return self._document_from_pages([self.ocr_provider.recognize_image(path.read_bytes())])

    def _extract_pdf(self, path: Path) -> ExtractedDocument:
        try:
            reader = PdfReader(str(path), strict=False)
            if len(reader.pages) > self.max_document_pages:
                raise OCRProcessingError("too_many_pages", "The PDF contains more pages than the configured limit.")
            pages: list[OCRPage] = []
            for page_number, page in enumerate(reader.pages, start=1):
                text = page.extract_text() or ""
                pages.append(OCRPage(page_number, text, "pdf:text"))
        except OCRProcessingError:
            raise
        except Exception as exc:
            raise OCRProcessingError("pdf_text_failed", "The PDF text could not be read.") from exc

        if all(not page.text.strip() for page in pages):
            return self._ocr_pdf_pages(path, len(pages))
        missing_pages = [page.page_number for page in pages if not page.text.strip()]
        if missing_pages:
            ocr_pages = self._render_pdf_pages(path, missing_pages)
            ocr_by_number = {page.page_number: page for page in ocr_pages}
            pages = [ocr_by_number.get(page.page_number, page) if not page.text.strip() else page for page in pages]
        return self._document_from_pages(pages)

    def _ocr_pdf_pages(self, path: Path, page_count: int) -> ExtractedDocument:
        return self._document_from_pages(self._render_pdf_pages(path, list(range(1, page_count + 1))))

    def _render_pdf_pages(self, path: Path, page_numbers: list[int]) -> list[OCRPage]:
        try:
            import fitz

            document = fitz.open(str(path))
            pages: list[OCRPage] = []
            for page_number in page_numbers:
                page = document.load_page(page_number - 1)
                pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
                pages.append(self.ocr_provider.recognize_image(pixmap.tobytes("png"), page_number))
            document.close()
            return pages
        except OCRProcessingError:
            raise
        except Exception as exc:
            raise OCRProcessingError("pdf_ocr_failed", "The scanned PDF could not be processed by the OCR engine.") from exc

    @staticmethod
    def _document_from_pages(pages: list[OCRPage]) -> ExtractedDocument:
        return ExtractedDocument("".join(page.text for page in pages), pages, ";".join(sorted({page.source for page in pages})))
