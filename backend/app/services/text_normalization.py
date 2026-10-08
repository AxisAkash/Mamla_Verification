import re
import unicodedata


def normalize_ocr_text(raw_text: str) -> str:
    """Create a search-friendly copy without changing the retained raw text."""

    normalized = unicodedata.normalize("NFC", raw_text).replace("\r\n", "\n").replace("\r", "\n")
    normalized = "\n".join(re.sub(r"[\t ]+", " ", line).strip() for line in normalized.split("\n"))
    return re.sub(r"\n{3,}", "\n\n", normalized).strip()
