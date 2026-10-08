from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import CaseRecord, NoticeFact, TrafficNotice


class CaseRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get(self, case_id: str) -> CaseRecord | None:
        return self.session.get(CaseRecord, case_id)

    def create(self, case: CaseRecord, notice: TrafficNotice) -> CaseRecord:
        self.session.add(case)
        self.session.add(notice)
        self.session.flush()
        return case

    def get_notice(self, case_id: str) -> TrafficNotice | None:
        return self.session.scalar(select(TrafficNotice).where(TrafficNotice.case_id == case_id))

    def get_facts(self, case_id: str) -> list[NoticeFact]:
        statement = select(NoticeFact).where(NoticeFact.case_id == case_id).order_by(NoticeFact.key)
        return list(self.session.scalars(statement).all())

    def get_fact(self, case_id: str, key: str) -> NoticeFact | None:
        statement = select(NoticeFact).where(NoticeFact.case_id == case_id, NoticeFact.key == key)
        return self.session.scalar(statement)

    def save_fact(self, fact: NoticeFact) -> NoticeFact:
        self.session.add(fact)
        self.session.flush()
        return fact

    def bump_version(self, case: CaseRecord) -> None:
        case.version += 1
        self.session.add(case)
        self.session.flush()
