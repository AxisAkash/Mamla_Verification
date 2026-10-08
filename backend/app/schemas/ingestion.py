from datetime import datetime
from enum import Enum

from pydantic import Field

from app.schemas.common import APIModel
from app.schemas.facts import NoticeFactResponse


class ProcessingStatus(str, Enum):
    uploaded = "UPLOADED"
    processing = "PROCESSING"
    completed = "COMPLETED"
    empty = "EMPTY"
    failed = "FAILED"


class EvidenceUploadResponse(APIModel):
    case_id: str
    evidence_id: str
    original_filename: str
    media_type: str
    size_bytes: int
    sha256: str
    processing_status: ProcessingStatus
    is_duplicate: bool = False


class OCRPageResponse(APIModel):
    page_number: int = Field(ge=1)
    text: str
    source: str


class OCRResponse(APIModel):
    case_id: str
    evidence_id: str
    status: ProcessingStatus
    raw_text: str | None = None
    normalized_text: str | None = None
    pages: list[OCRPageResponse] = Field(default_factory=list)
    provider: str | None = None
    processed_at: datetime | None = None
    error: str | None = None


class ExtractedFactsResponse(APIModel):
    case_id: str
    evidence_id: str
    status: ProcessingStatus
    overall_confidence: int = Field(ge=0, le=100)
    facts: list[NoticeFactResponse]
    error: str | None = None
