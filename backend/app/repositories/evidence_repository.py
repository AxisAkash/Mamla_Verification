from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Evidence, case_evidence


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
