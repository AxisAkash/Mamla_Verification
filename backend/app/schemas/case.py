from datetime import datetime
from enum import Enum

from pydantic import Field

from app.schemas.common import APIModel


class InputType(str, Enum):
    image = "image"
    document = "document"
    url = "url"
    text = "text"


class VerificationStatus(str, Enum):
    CONFORMS = "CONFORMS"
    POTENTIALLY_NONCOMPLIANT = "POTENTIALLY_NONCOMPLIANT"
    INSUFFICIENT_INFORMATION = "INSUFFICIENT_INFORMATION"
    MANUAL_LEGAL_REVIEW = "MANUAL_LEGAL_REVIEW"


class CaseCreateRequest(APIModel):
    input_type: InputType
    source_label: str = Field(min_length=1, max_length=255)


class VehicleResponse(APIModel):
    registration_number: str
    type: str
    make: str | None = None
    model: str | None = None
    color: str | None = None


class TrafficNoticeResponse(APIModel):
    notice_type: str
    notice_number: str
    issuing_authority: str
    issued_at: str
    location: str
    violation_description: str
    penalty_amount: str | None = None
    vehicle: VehicleResponse


class CaseResponse(APIModel):
    id: str
    reference: str
    title: str
    created_at: datetime
    updated_at: datetime | None = None
    input_type: InputType
    source_label: str
    status: VerificationStatus
    summary: str
    is_demo: bool


class CreateCaseResponse(APIModel):
    case: CaseResponse


class CaseDetailResponse(APIModel):
    case: CaseResponse
    notice: TrafficNoticeResponse
    status: VerificationStatus
    version: int
