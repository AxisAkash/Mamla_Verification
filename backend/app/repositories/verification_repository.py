from sqlalchemy import delete, insert, select
from sqlalchemy.orm import Session

from app.models import (
    NextStep,
    VerificationResult,
    result_citations,
    result_evidence,
    result_provisions,
)


class VerificationRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get(self, case_id: str) -> VerificationResult | None:
        statement = select(VerificationResult).where(VerificationResult.case_id == case_id)
        return self.session.scalar(statement)

    def get_next_steps(self, result_id: str) -> list[NextStep]:
        statement = select(NextStep).where(NextStep.result_id == result_id).order_by(NextStep.id)
        return list(self.session.scalars(statement).all())

    def get_ids(self, result_id: str) -> tuple[list[str], list[str], list[str]]:
        provisions = list(self.session.scalars(select(result_provisions.c.provision_id).where(result_provisions.c.result_id == result_id)).all())
        citations = list(self.session.scalars(select(result_citations.c.citation_id).where(result_citations.c.result_id == result_id)).all())
        evidence = list(self.session.scalars(select(result_evidence.c.evidence_id).where(result_evidence.c.result_id == result_id)).all())
        return provisions, citations, evidence

    def save(
        self,
        result: VerificationResult,
        next_steps: list[NextStep],
        provision_ids: list[str],
        citation_ids: list[str],
        evidence_ids: list[str],
    ) -> VerificationResult:
        self.session.add(result)
        self.session.add_all(next_steps)
        self.session.flush()
        if provision_ids:
            self.session.execute(insert(result_provisions), [{"result_id": result.id, "provision_id": value} for value in provision_ids])
        if citation_ids:
            self.session.execute(insert(result_citations), [{"result_id": result.id, "citation_id": value} for value in citation_ids])
        if evidence_ids:
            self.session.execute(insert(result_evidence), [{"result_id": result.id, "evidence_id": value} for value in evidence_ids])
        self.session.flush()
        return result
