from datetime import UTC, datetime
from secrets import token_hex

from app.models import NextStep, VerificationResult
from app.repositories.case_repository import CaseRepository
from app.repositories.evidence_repository import EvidenceRepository
from app.repositories.verification_repository import VerificationRepository
from app.schemas.case import VerificationStatus
from app.schemas.result import ComparisonRow, NextStepResponse, VerificationResultResponse
from app.services.errors import CaseNotFoundError


class VerificationService:
    """Applies only transparent demo rules; this is not legal reasoning."""

    def __init__(self, cases: CaseRepository, evidence: EvidenceRepository, results: VerificationRepository) -> None:
        self.cases = cases
        self.evidence = evidence
        self.results = results

    def verify(self, case_id: str) -> VerificationResultResponse:
        case = self.cases.get(case_id)
        if case is None:
            raise CaseNotFoundError(case_id)
        existing = self.results.get(case_id)
        if existing is not None:
            return self._to_response(existing)

        notice = self.cases.get_notice(case_id)
        if notice is None:
            raise CaseNotFoundError(case_id)
        status = self._determine_status(notice.violation_description, notice.location)
        result_id = f"RES-{token_hex(3).upper()}"
        generated_at = datetime.now(UTC).isoformat()
        comparison = self._comparison(status, notice.violation_description, notice.location)
        result = VerificationResult(
            id=result_id,
            case_id=case_id,
            schema_version=1,
            status=status.value,
            headline=self._headline(status),
            claim=f"The submitted material describes: {notice.violation_description}.",
            summary="This deterministic demonstration classification uses retained fields only and does not establish a legal conclusion.",
            reasoning=["No OCR, external source, legal database, or AI model was used.", "The status was selected from the completeness and wording of retained demo fields."],
            limitations=["This output is illustrative demo data, not legal advice or an official record.", "A qualified professional and the official source should be consulted before acting."],
            comparison=comparison,
            confidence=30 if status == VerificationStatus.INSUFFICIENT_INFORMATION else 45,
            generated_at=generated_at,
        )
        steps = [NextStep(id=f"{result_id}-review", result_id=result_id, label="Review the submitted information", description="Confirm the notice and add supporting material before relying on any result.", tone="attention", action="review-evidence")]
        evidence_ids = [item.id for item in self.evidence.list_for_case(case_id)]
        self.results.save(result, steps, [], [], evidence_ids)
        case.status = status.value
        case.summary = result.summary
        self.cases.session.add(case)
        return self._to_response(result)

    def get_result(self, case_id: str) -> VerificationResultResponse:
        if self.cases.get(case_id) is None:
            raise CaseNotFoundError(case_id)
        result = self.results.get(case_id)
        if result is None:
            raise CaseNotFoundError(case_id)
        return self._to_response(result)

    def _to_response(self, result: VerificationResult) -> VerificationResultResponse:
        provision_ids, citation_ids, evidence_ids = self.results.get_ids(result.id)
        return VerificationResultResponse(
            schema_version=result.schema_version,
            id=result.id,
            case_id=result.case_id,
            status=VerificationStatus(result.status),
            headline=result.headline,
            claim=result.claim,
            summary=result.summary,
            reasoning=list(result.reasoning or []),
            limitations=list(result.limitations or []),
            comparison=[ComparisonRow.model_validate(row) for row in result.comparison or []],
            provision_ids=provision_ids,
            citation_ids=citation_ids,
            evidence_ids=evidence_ids,
            generated_at=result.generated_at,
            confidence=result.confidence,
            next_steps=[NextStepResponse.model_validate(step) for step in self.results.get_next_steps(result.id)],
        )

    @staticmethod
    def _determine_status(violation: str, location: str) -> VerificationStatus:
        if violation == "Not provided" or location == "Not provided":
            return VerificationStatus.INSUFFICIENT_INFORMATION
        lowered = violation.lower()
        if "lane" in lowered or "disputed" in lowered:
            return VerificationStatus.MANUAL_LEGAL_REVIEW
        if "signal" in lowered:
            return VerificationStatus.POTENTIALLY_NONCOMPLIANT
        return VerificationStatus.CONFORMS

    @staticmethod
    def _headline(status: VerificationStatus) -> str:
        return {
            VerificationStatus.CONFORMS: "Retained fields show no conflict in this demonstration",
            VerificationStatus.POTENTIALLY_NONCOMPLIANT: "A possible conflict requires human confirmation",
            VerificationStatus.INSUFFICIENT_INFORMATION: "Not enough retained information for comparison",
            VerificationStatus.MANUAL_LEGAL_REVIEW: "The context requires qualified manual review",
        }[status]

    @staticmethod
    def _comparison(status: VerificationStatus, violation: str, location: str) -> list[dict[str, str]]:
        return [
            {"label": "Reported violation", "noticeSays": violation, "lawSays": "No live legal provision was retrieved for this demo."},
            {"label": "Location", "noticeSays": location, "lawSays": "A source and context review are required."},
            {"label": "Classification", "noticeSays": status.value, "lawSays": "This is a deterministic workflow state, not a legal finding."},
        ]
