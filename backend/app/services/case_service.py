from datetime import UTC, datetime
from secrets import token_hex

from app.models import CaseRecord, TrafficNotice
from app.repositories.case_repository import CaseRepository
from app.schemas.case import CaseCreateRequest, CaseDetailResponse, CaseResponse, VerificationStatus
from app.schemas.facts import FACT_KEYS, FactsUpdateRequest, FactsUpdateResponse
from app.services.errors import CaseNotFoundError, InvalidFactsError
from app.services.mappers import to_case_response, to_fact_response, to_notice_response


PLACEHOLDER = "Not provided"


class CaseService:
    def __init__(self, repository: CaseRepository) -> None:
        self.repository = repository

    def create_case(self, request: CaseCreateRequest) -> CaseResponse:
        year = datetime.now(UTC).year
        reference = self._new_reference(year)
        case = CaseRecord(
            id=reference,
            reference=reference,
            title="Traffic notice review",
            input_type=request.input_type.value,
            source_label=request.source_label,
            status=VerificationStatus.INSUFFICIENT_INFORMATION.value,
            summary="A notice has been received. No extraction or legal comparison has been completed.",
            is_demo=False,
            version=1,
        )
        notice = TrafficNotice(
            case_id=reference,
            notice_number=PLACEHOLDER,
            issuing_authority=PLACEHOLDER,
            issued_at=PLACEHOLDER,
            location=PLACEHOLDER,
            violation_description=PLACEHOLDER,
            penalty_amount=None,
            vehicle_registration_number=PLACEHOLDER,
            vehicle_type=PLACEHOLDER,
        )
        self.repository.create(case, notice)
        return to_case_response(case)

    def get_case(self, case_id: str) -> CaseDetailResponse:
        case = self.repository.get(case_id)
        if case is None:
            raise CaseNotFoundError(case_id)
        notice = self.repository.get_notice(case_id)
        if notice is None:
            raise CaseNotFoundError(case_id)
        return CaseDetailResponse(
            case=to_case_response(case),
            notice=to_notice_response(notice),
            status=VerificationStatus(case.status),
            version=case.version,
        )

    def update_facts(self, case_id: str, request: FactsUpdateRequest) -> FactsUpdateResponse:
        case = self.repository.get(case_id)
        if case is None:
            raise CaseNotFoundError(case_id)
        for item in request.facts:
            key = item.key.value
            if key not in FACT_KEYS:
                raise InvalidFactsError(key)
            existing = self.repository.get_fact(case_id, key)
            if existing is None:
                from app.models import NoticeFact

                self.repository.save_fact(
                    NoticeFact(
                        case_id=case_id,
                        key=key,
                        label=item.label,
                        extracted_value=None,
                        confirmed_value=item.value,
                        confidence=None,
                        evidence_ids=[],
                        is_user_confirmed=item.is_user_confirmed,
                    )
                )
            else:
                existing.label = item.label
                existing.confirmed_value = item.value
                existing.is_user_confirmed = item.is_user_confirmed
        self.repository.bump_version(case)
        return FactsUpdateResponse(
            case_id=case_id,
            version=case.version,
            facts=[to_fact_response(fact) for fact in self.repository.get_facts(case_id)],
        )

    def _new_reference(self, year: int) -> str:
        for _ in range(10):
            reference = f"MV-{year}-{token_hex(2).upper()}"
            if self.repository.get(reference) is None:
                return reference
        raise RuntimeError("Unable to allocate a case reference")
