from pydantic import Field

from app.schemas.case import VerificationStatus
from app.schemas.common import APIModel
from app.schemas.legal import CitationResponse, EvidenceResponse, LegalProvisionResponse


class ComparisonRow(APIModel):
    label: str
    notice_says: str
    law_says: str


class NextStepResponse(APIModel):
    id: str
    label: str
    description: str
    href: str | None = None
    tone: str | None = None
    action: str | None = None


class VerificationResultResponse(APIModel):
    schema_version: int
    id: str
    case_id: str
    status: VerificationStatus
    headline: str
    claim: str
    summary: str
    reasoning: list[str]
    limitations: list[str]
    comparison: list[ComparisonRow]
    provision_ids: list[str]
    citation_ids: list[str]
    evidence_ids: list[str]
    generated_at: str
    confidence: int = Field(ge=0, le=100)
    next_steps: list[NextStepResponse]


class VerificationEnvelope(APIModel):
    result: VerificationResultResponse
