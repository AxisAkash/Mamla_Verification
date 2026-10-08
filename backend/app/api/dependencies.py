from collections.abc import Generator

from fastapi import Depends, Request
from sqlalchemy.orm import Session

from app.repositories.case_repository import CaseRepository
from app.repositories.evidence_repository import EvidenceRepository
from app.repositories.verification_repository import VerificationRepository
from app.services.case_service import CaseService
from app.services.evidence_service import EvidenceService
from app.services.ingestion_service import EvidenceIngestionService
from app.services.verification_service import VerificationService


def get_db(request: Request) -> Generator[Session, None, None]:
    session = request.app.state.session_factory()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_case_service(db: Session = Depends(get_db)) -> CaseService:
    return CaseService(CaseRepository(db))


def get_ingestion_service(request: Request, db: Session = Depends(get_db)) -> EvidenceIngestionService:
    return EvidenceIngestionService(
        CaseRepository(db),
        EvidenceRepository(db),
        request.app.state.file_storage,
        request.app.state.ocr_provider,
        request.app.state.settings.max_document_pages,
    )


def get_evidence_service(db: Session = Depends(get_db)) -> EvidenceService:
    return EvidenceService(CaseRepository(db), EvidenceRepository(db))


def get_verification_service(db: Session = Depends(get_db)) -> VerificationService:
    return VerificationService(CaseRepository(db), EvidenceRepository(db), VerificationRepository(db))
