from uuid import UUID, uuid4

from sqlalchemy import Boolean, Column, ForeignKey, Index, Integer, JSON, String, Table, Text, Uuid, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


case_evidence = Table(
    "case_evidence",
    Base.metadata,
    Column("case_id", String(64), ForeignKey("cases.id", ondelete="CASCADE"), primary_key=True),
    Column("evidence_id", String(64), ForeignKey("evidence.id", ondelete="CASCADE"), primary_key=True),
)

result_provisions = Table(
    "result_provisions",
    Base.metadata,
    Column("result_id", String(64), ForeignKey("verification_results.id", ondelete="CASCADE"), primary_key=True),
    Column("provision_id", String(64), ForeignKey("legal_provisions.id", ondelete="RESTRICT"), primary_key=True),
)

result_citations = Table(
    "result_citations",
    Base.metadata,
    Column("result_id", String(64), ForeignKey("verification_results.id", ondelete="CASCADE"), primary_key=True),
    Column("citation_id", String(64), ForeignKey("citations.id", ondelete="RESTRICT"), primary_key=True),
)

result_evidence = Table(
    "result_evidence",
    Base.metadata,
    Column("result_id", String(64), ForeignKey("verification_results.id", ondelete="CASCADE"), primary_key=True),
    Column("evidence_id", String(64), ForeignKey("evidence.id", ondelete="CASCADE"), primary_key=True),
)


class CaseRecord(TimestampMixin, Base):
    __tablename__ = "cases"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    reference: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    input_type: Mapped[str] = mapped_column(String(32), nullable=False)
    source_label: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    is_demo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)


class TrafficNotice(Base):
    __tablename__ = "traffic_notices"

    id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4)
    case_id: Mapped[str] = mapped_column(ForeignKey("cases.id", ondelete="CASCADE"), unique=True, nullable=False)
    notice_type: Mapped[str] = mapped_column(String(32), nullable=False, default="traffic")
    notice_number: Mapped[str] = mapped_column(String(255), nullable=False)
    issuing_authority: Mapped[str] = mapped_column(String(255), nullable=False)
    issued_at: Mapped[str] = mapped_column(String(128), nullable=False)
    location: Mapped[str] = mapped_column(String(500), nullable=False)
    violation_description: Mapped[str] = mapped_column(Text, nullable=False)
    penalty_amount: Mapped[str | None] = mapped_column(String(255), nullable=True)
    vehicle_registration_number: Mapped[str] = mapped_column(String(128), nullable=False)
    vehicle_type: Mapped[str] = mapped_column(String(128), nullable=False)
    vehicle_make: Mapped[str | None] = mapped_column(String(128), nullable=True)
    vehicle_model: Mapped[str | None] = mapped_column(String(128), nullable=True)
    vehicle_color: Mapped[str | None] = mapped_column(String(128), nullable=True)


class NoticeFact(Base):
    __tablename__ = "notice_facts"
    __table_args__ = (UniqueConstraint("case_id", "key", name="uq_notice_fact_case_key"), Index("ix_notice_facts_case_id", "case_id"))

    id: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4)
    case_id: Mapped[str] = mapped_column(ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    key: Mapped[str] = mapped_column(String(64), nullable=False)
    label: Mapped[str] = mapped_column(String(255), nullable=False)
    extracted_value: Mapped[str | None] = mapped_column(Text, nullable=True)
    confirmed_value: Mapped[str | None] = mapped_column(Text, nullable=True)
    confidence: Mapped[int | None] = mapped_column(Integer, nullable=True)
    evidence_ids: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    is_user_confirmed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)


class Evidence(Base):
    __tablename__ = "evidence"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    kind: Mapped[str] = mapped_column(String(32), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    source: Mapped[str] = mapped_column(String(255), nullable=False)
    captured_at: Mapped[str] = mapped_column(String(128), nullable=False)
    excerpt: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_demo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)


class LegalProvision(Base):
    __tablename__ = "legal_provisions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    document: Mapped[str] = mapped_column(String(255), nullable=False)
    section: Mapped[str] = mapped_column(String(255), nullable=False)
    rule_identifier: Mapped[str] = mapped_column(String(128), nullable=False)
    violation_type: Mapped[str] = mapped_column(String(255), nullable=False)
    conditions: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    penalty: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    origin: Mapped[str] = mapped_column(String(255), nullable=False)
    timeframe: Mapped[str] = mapped_column(String(255), nullable=False)
    source: Mapped[str] = mapped_column(String(255), nullable=False)
    source_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_demo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)


class Citation(Base):
    __tablename__ = "citations"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    reference: Mapped[str] = mapped_column(String(255), nullable=False)
    source: Mapped[str] = mapped_column(String(255), nullable=False)
    note: Mapped[str] = mapped_column(Text, nullable=False)
    target_type: Mapped[str] = mapped_column(String(32), nullable=False)
    target_id: Mapped[str] = mapped_column(String(64), nullable=False)
    is_demo: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)


class VerificationResult(TimestampMixin, Base):
    __tablename__ = "verification_results"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    case_id: Mapped[str] = mapped_column(ForeignKey("cases.id", ondelete="CASCADE"), unique=True, nullable=False)
    schema_version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    status: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    headline: Mapped[str] = mapped_column(String(500), nullable=False)
    claim: Mapped[str] = mapped_column(Text, nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    reasoning: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    limitations: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    comparison: Mapped[list[dict[str, str]]] = mapped_column(JSON, nullable=False, default=list)
    confidence: Mapped[int] = mapped_column(Integer, nullable=False)
    generated_at: Mapped[str] = mapped_column(String(128), nullable=False)


class NextStep(Base):
    __tablename__ = "next_steps"
    __table_args__ = (Index("ix_next_steps_result_id", "result_id"),)

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    result_id: Mapped[str] = mapped_column(ForeignKey("verification_results.id", ondelete="CASCADE"), nullable=False)
    label: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    href: Mapped[str | None] = mapped_column(String(500), nullable=True)
    tone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    action: Mapped[str | None] = mapped_column(String(64), nullable=True)
