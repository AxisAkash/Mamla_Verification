from enum import Enum

from pydantic import Field

from app.schemas.common import APIModel


class NoticeFactKey(str, Enum):
    """Stable frontend-compatible fact keys."""

    notice_number = "noticeNumber"
    issuing_authority = "issuingAuthority"
    issued_at = "issuedAt"
    location = "location"
    violation = "violation"
    vehicle_registration = "vehicleRegistration"
    vehicle_type = "vehicleType"
    penalty_amount = "penaltyAmount"


FACT_KEYS = frozenset(
    {
        "noticeNumber",
        "issuingAuthority",
        "issuedAt",
        "location",
        "violation",
        "vehicleRegistration",
        "vehicleType",
        "penaltyAmount",
    }
)


class NoticeFactInput(APIModel):
    key: NoticeFactKey
    label: str = Field(min_length=1, max_length=255)
    value: str = Field(min_length=1, max_length=2_000)
    is_user_confirmed: bool = True


class NoticeFactResponse(APIModel):
    key: str
    label: str
    value: str
    extracted_value: str | None = None
    confirmed_value: str | None = None
    confidence: int | None = Field(default=None, ge=0, le=100)
    evidence_ids: list[str] = Field(default_factory=list)
    is_user_confirmed: bool


class FactsUpdateRequest(APIModel):
    facts: list[NoticeFactInput] = Field(min_length=1, max_length=32)


class FactsUpdateResponse(APIModel):
    case_id: str
    version: int
    facts: list[NoticeFactResponse]


class ExtractionResponse(APIModel):
    case_id: str
    source_label: str
    overall_confidence: int = Field(ge=0, le=100)
    fields: list[NoticeFactResponse]
