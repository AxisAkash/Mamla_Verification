from sqlalchemy import insert, select
from sqlalchemy.orm import Session

from app.models import CaseRecord, Evidence, case_evidence


class EvidenceRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def list_for_case(self, case_id: str) -> list[Evidence]:
        statement = (
            select(Evidence)
            .join(case_evidence, case_evidence.c.evidence_id == Evidence.id)
            .where(case_evidence.c.case_id == case_id)
            .order_by(Evidence.captured_at, Evidence.id)
        )
        return list(self.session.scalars(statement).all())

    def get_for_case(self, case_id: str, evidence_id: str) -> Evidence | None:
        statement = (
            select(Evidence)
            .join(case_evidence, case_evidence.c.evidence_id == Evidence.id)
            .where(case_evidence.c.case_id == case_id, Evidence.id == evidence_id)
        )
        return self.session.scalar(statement)

    def find_duplicate(self, case_id: str, sha256: str) -> Evidence | None:
        statement = (
            select(Evidence)
            .join(case_evidence, case_evidence.c.evidence_id == Evidence.id)
            .where(case_evidence.c.case_id == case_id, Evidence.sha256 == sha256)
            .order_by(Evidence.id)
        )
        return self.session.scalar(statement)

    def latest_for_case(self, case_id: str) -> Evidence | None:
        statement = (
            select(Evidence)
            .join(case_evidence, case_evidence.c.evidence_id == Evidence.id)
            .where(case_evidence.c.case_id == case_id, Evidence.is_demo.is_(False))
            .order_by(Evidence.uploaded_at.desc(), Evidence.id.desc())
        )
        return self.session.scalar(statement)

    def create_for_case(self, case: CaseRecord, evidence: Evidence) -> Evidence:
        self.session.add(evidence)
        self.session.flush()
        self.session.execute(insert(case_evidence).values(case_id=case.id, evidence_id=evidence.id))
        self.session.flush()
        return evidence

    def save(self, evidence: Evidence) -> Evidence:
        self.session.add(evidence)
        self.session.flush()
        return evidence
