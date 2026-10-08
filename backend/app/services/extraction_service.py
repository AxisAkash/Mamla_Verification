from app.repositories.case_repository import CaseRepository
from app.schemas.facts import ExtractionResponse
from app.services.errors import CaseNotFoundError
from app.services.mappers import to_fact_response


class NoticeExtractionService:
    """Returns retained deterministic fixture facts; OCR is intentionally absent."""

    def __init__(self, repository: CaseRepository) -> None:
        self.repository = repository

    def extract(self, case_id: str) -> ExtractionResponse:
        case = self.repository.get(case_id)
        if case is None:
            raise CaseNotFoundError(case_id)
        facts = self.repository.get_facts(case_id)
        confidences = [fact.confidence for fact in facts if fact.confidence is not None]
        overall_confidence = round(sum(confidences) / len(confidences)) if confidences else 0
        return ExtractionResponse(
            case_id=case_id,
            source_label=case.source_label,
            overall_confidence=overall_confidence,
            fields=[to_fact_response(fact) for fact in facts],
        )
