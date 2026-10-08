from enum import Enum

from pydantic import Field

from app.schemas.common import APIModel


class EvidenceKind(str, Enum):
    image = "image"
    document = "document"
    url = "url"
    text = "text"


class EvidenceResponse(APIModel):
    id: str
    kind: EvidenceKind
    title: str
    description: str
    source: str
    captured_at: str
    excerpt: str | None = None
    is_demo: bool


class EvidenceListResponse(APIModel):
    case_id: str
    items: list[EvidenceResponse]


class LegalProvisionResponse(APIModel):
    id: str
    document: str
    section: str
    rule_identifier: str
    violation_type: str
    conditions: list[str]
    penalty: str
    location: str
    origin: str
    timeframe: str
    source: str
    source_note: str | None = None
    is_demo: bool


class CitationTargetType(str, Enum):
    case = "case"
    notice = "notice"
    evidence = "evidence"
    provision = "provision"


class CitationResponse(APIModel):
    id: str
    reference: str
    source: str
    note: str
    target_type: CitationTargetType
    target_id: str
    is_demo: bool
