"""Add original-file and OCR processing metadata."""

import sqlalchemy as sa
from alembic import op


revision = "0002_add_ingestion_metadata"
down_revision = "0001_initial_backend"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("notice_facts", sa.Column("source_reference", sa.String(length=255), nullable=True))
    op.add_column("notice_facts", sa.Column("source_text", sa.Text(), nullable=True))

    op.add_column("evidence", sa.Column("original_filename", sa.String(length=255), nullable=True))
    op.add_column("evidence", sa.Column("media_type", sa.String(length=128), nullable=True))
    op.add_column("evidence", sa.Column("size_bytes", sa.Integer(), nullable=True))
    op.add_column("evidence", sa.Column("sha256", sa.String(length=64), nullable=True))
    op.add_column("evidence", sa.Column("storage_key", sa.String(length=255), nullable=True))
    op.add_column("evidence", sa.Column("processing_status", sa.String(length=32), nullable=False, server_default="UPLOADED"))
    op.add_column("evidence", sa.Column("extraction_error", sa.Text(), nullable=True))
    op.add_column("evidence", sa.Column("ocr_raw_text", sa.Text(), nullable=True))
    op.add_column("evidence", sa.Column("normalized_text", sa.Text(), nullable=True))
    op.add_column("evidence", sa.Column("ocr_pages", sa.JSON(), nullable=True))
    op.add_column("evidence", sa.Column("ocr_provider", sa.String(length=128), nullable=True))
    op.add_column("evidence", sa.Column("processed_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("evidence", sa.Column("uploaded_at", sa.DateTime(timezone=True), nullable=True))
    op.create_index("ix_evidence_sha256", "evidence", ["sha256"])
    op.create_index("uq_evidence_storage_key", "evidence", ["storage_key"], unique=True)


def downgrade() -> None:
    op.drop_index("uq_evidence_storage_key", table_name="evidence")
    op.drop_index("ix_evidence_sha256", table_name="evidence")
    for column in (
        "uploaded_at",
        "processed_at",
        "ocr_provider",
        "ocr_pages",
        "normalized_text",
        "ocr_raw_text",
        "extraction_error",
        "processing_status",
        "storage_key",
        "sha256",
        "size_bytes",
        "media_type",
        "original_filename",
    ):
        op.drop_column("evidence", column)
    op.drop_column("notice_facts", "source_text")
    op.drop_column("notice_facts", "source_reference")
