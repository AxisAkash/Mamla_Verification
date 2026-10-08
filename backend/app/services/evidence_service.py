from app.repositories.case_repository import CaseRepository
from app.repositories.evidence_repository import EvidenceRepository
from app.schemas.legal import EvidenceListResponse
from app.services.errors import CaseNotFoundError
from app.services.mappers import to_evidence_response


class EvidenceService:
    def __init__(self, cases: CaseRepository, evidence: EvidenceRepository) -> None:
        self.cases = cases
        self.evidence = evidence

    def list_for_case(self, case_id: str) -> EvidenceListResponse:
        if self.cases.get(case_id) is None:
            raise CaseNotFoundError(case_id)
        return EvidenceListResponse(
            case_id=case_id,
            items=[to_evidence_response(item) for item in self.evidence.list_for_case(case_id)],
        )
