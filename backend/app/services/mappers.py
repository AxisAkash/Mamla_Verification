from app.models import CaseRecord, Evidence, NoticeFact, TrafficNotice
from app.schemas.case import CaseResponse, TrafficNoticeResponse, VehicleResponse
from app.schemas.facts import NoticeFactResponse
from app.schemas.legal import EvidenceResponse


def to_case_response(case: CaseRecord) -> CaseResponse:
    return CaseResponse.model_validate(case)


def to_notice_response(notice: TrafficNotice) -> TrafficNoticeResponse:
    return TrafficNoticeResponse(
        notice_type=notice.notice_type,
        notice_number=notice.notice_number,
        issuing_authority=notice.issuing_authority,
        issued_at=notice.issued_at,
        location=notice.location,
        violation_description=notice.violation_description,
        penalty_amount=notice.penalty_amount,
        vehicle=VehicleResponse(
            registration_number=notice.vehicle_registration_number,
            type=notice.vehicle_type,
            make=notice.vehicle_make,
            model=notice.vehicle_model,
            color=notice.vehicle_color,
        ),
    )


def to_fact_response(fact: NoticeFact) -> NoticeFactResponse:
    value = fact.confirmed_value or fact.extracted_value or "Not provided"
    return NoticeFactResponse(
        key=fact.key,
        label=fact.label,
        value=value,
        extracted_value=fact.extracted_value,
        confirmed_value=fact.confirmed_value,
        confidence=fact.confidence,
        evidence_ids=list(fact.evidence_ids or []),
        source_reference=fact.source_reference,
        source_text=fact.source_text,
        is_user_confirmed=fact.is_user_confirmed,
    )


def to_evidence_response(evidence: Evidence) -> EvidenceResponse:
    return EvidenceResponse.model_validate(evidence)
