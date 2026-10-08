import logging
from datetime import UTC, datetime
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.exc import SQLAlchemyError

from app.ingestion.storage import FileStorage
from app.models import CaseRecord, Evidence, NoticeFact
from app.repositories.case_repository import CaseRepository
from app.repositories.evidence_repository import EvidenceRepository
from app.schemas.facts import ExtractionResponse, FactListResponse
from app.schemas.ingestion import ExtractedFactsResponse, EvidenceUploadResponse, OCRPageResponse, OCRResponse, ProcessingStatus
from app.services.errors import CaseNotFoundError
from app.services.mappers import to_fact_response
from app.services.ocr_service import OCRProcessingError, OCRProvider
from app.services.structured_extraction import StructuredNoticeExtractionService
from app.services.text_extraction import DocumentTextExtractionService
from app.services.text_normalization import normalize_ocr_text

logger = logging.getLogger(__name__)


class EvidenceIngestionService:
    def __init__(
        self,
        cases: CaseRepository,
        evidence: EvidenceRepository,
        storage: FileStorage,
        ocr_provider: OCRProvider,
        max_document_pages: int,
    ) -> None:
        self.cases = cases
        self.evidence = evidence
        self.storage = storage
        self.document_extractor = DocumentTextExtractionService(ocr_provider, max_document_pages)
        self.structured_extractor = StructuredNoticeExtractionService()

    def upload(self, case_id: str, upload: UploadFile) -> EvidenceUploadResponse:
        case = self.cases.get(case_id)
        if case is None:
            raise CaseNotFoundError(case_id)
        stored = self.storage.store_upload(upload)
        duplicate = self.evidence.find_duplicate(case_id, stored.sha256)
        if duplicate is not None:
            self.storage.delete(stored.storage_key)
            return self._upload_response(case_id, duplicate, True)
        evidence = Evidence(
            id=f"ev-{uuid4().hex}",
            kind=stored.kind,
            title=stored.original_filename,
            description="Original file uploaded for notice extraction.",
            source="Uploaded by applicant",
            captured_at=datetime.now(UTC).isoformat(),
            excerpt=None,
            is_demo=False,
            original_filename=stored.original_filename,
            media_type=stored.media_type,
            size_bytes=stored.size_bytes,
            sha256=stored.sha256,
            storage_key=stored.storage_key,
            processing_status=ProcessingStatus.uploaded.value,
            ocr_pages=[],
        )
        try:
            self.evidence.create_for_case(case, evidence)
        except Exception:
            self.storage.delete(stored.storage_key)
            raise
        return self._upload_response(case_id, evidence, False)

    def extract_case(self, case_id: str) -> ExtractionResponse:
        case = self.cases.get(case_id)
        if case is None:
            raise CaseNotFoundError(case_id)
        evidence = self.evidence.latest_for_case(case_id)
        if evidence is None:
            facts = self.cases.get_facts(case_id)
            return ExtractionResponse(
                case_id=case_id,
                source_label=case.source_label,
                overall_confidence=self._confidence(facts),
                fields=[to_fact_response(fact) for fact in facts],
            )
        result = self.process(case, evidence)
        return ExtractionResponse(
            case_id=case_id,
            source_label=case.source_label,
            overall_confidence=result.overall_confidence,
            fields=result.facts,
            status=result.status.value,
            evidence_id=evidence.id,
            error=result.error,
        )

    def process_evidence(self, case_id: str, evidence_id: str) -> ExtractedFactsResponse:
        case = self.cases.get(case_id)
        if case is None:
            raise CaseNotFoundError(case_id)
        evidence = self.evidence.get_for_case(case_id, evidence_id)
        if evidence is None:
            raise CaseNotFoundError(evidence_id)
        return self.process(case, evidence)

    def get_ocr(self, case_id: str, evidence_id: str) -> OCRResponse:
        evidence = self.evidence.get_for_case(case_id, evidence_id)
        if self.cases.get(case_id) is None or evidence is None:
            raise CaseNotFoundError(evidence_id)
        return OCRResponse(
            case_id=case_id,
            evidence_id=evidence.id,
            status=ProcessingStatus(evidence.processing_status),
            raw_text=evidence.ocr_raw_text,
            normalized_text=evidence.normalized_text,
            pages=[OCRPageResponse(page_number=int(page.get("page_number", 1)), text=str(page.get("text", "")), source=str(page.get("source", "unknown"))) for page in (evidence.ocr_pages or [])],
            provider=evidence.ocr_provider,
            processed_at=evidence.processed_at,
            error=evidence.extraction_error,
        )

    def get_facts(self, case_id: str, evidence_id: str | None = None) -> FactListResponse:
        case = self.cases.get(case_id)
        if case is None:
            raise CaseNotFoundError(case_id)
        evidence = self.evidence.get_for_case(case_id, evidence_id) if evidence_id else self.evidence.latest_for_case(case_id)
        if evidence_id and evidence is None:
            raise CaseNotFoundError(evidence_id)
        facts = self.cases.get_facts(case_id)
        if evidence is None:
            return FactListResponse(case_id=case_id, status="UPLOADED", overall_confidence=self._confidence(facts), facts=[to_fact_response(fact) for fact in facts])
        return FactListResponse(case_id=case_id, evidence_id=evidence.id, status=evidence.processing_status, overall_confidence=self._confidence(facts), facts=[to_fact_response(fact) for fact in facts], error=evidence.extraction_error)

    def process(self, case: CaseRecord, evidence: Evidence) -> ExtractedFactsResponse:
        if evidence.processing_status in {ProcessingStatus.completed.value, ProcessingStatus.empty.value}:
            facts = self.cases.get_facts(case.id)
            return ExtractedFactsResponse(case_id=case.id, evidence_id=evidence.id, status=ProcessingStatus(evidence.processing_status), overall_confidence=self._confidence(facts), facts=[to_fact_response(fact) for fact in facts], error=evidence.extraction_error)
        if not evidence.storage_key:
            return self._failed(case, evidence, "The original file is unavailable for processing.")

        evidence.processing_status = ProcessingStatus.processing.value
        evidence.extraction_error = None
        self.evidence.save(evidence)
        try:
            document = self.document_extractor.extract(self.storage.path_for(evidence.storage_key), evidence.media_type or "")
            normalized = normalize_ocr_text(document.raw_text)
            extracted = self.structured_extractor.extract(document.raw_text)
            facts = [
                NoticeFact(
                    case_id=case.id,
                    key=item.key,
                    label=item.label,
                    extracted_value=item.value,
                    confirmed_value=None,
                    confidence=item.confidence,
                    evidence_ids=[evidence.id],
                    source_reference=item.source_reference,
                    source_text=item.source_text,
                    is_user_confirmed=False,
                )
                for item in extracted
            ]
            self.cases.replace_extracted_facts(case.id, facts)
            evidence.ocr_raw_text = document.raw_text
            evidence.normalized_text = normalized
            evidence.ocr_pages = [{"page_number": page.page_number, "text": page.text, "source": page.source} for page in document.pages]
            evidence.ocr_provider = document.provider
            evidence.processing_status = ProcessingStatus.completed.value if normalized else ProcessingStatus.empty.value
            evidence.processed_at = datetime.now(UTC)
            self.evidence.save(evidence)
            self.cases.bump_version(case)
            current_facts = self.cases.get_facts(case.id)
            return ExtractedFactsResponse(case_id=case.id, evidence_id=evidence.id, status=ProcessingStatus(evidence.processing_status), overall_confidence=self._confidence(current_facts), facts=[to_fact_response(fact) for fact in current_facts], error=None)
        except OCRProcessingError as exc:
            return self._failed(case, evidence, exc.message)
        except SQLAlchemyError:
            raise
        except Exception:
            logger.exception("Evidence extraction failed for evidence_id=%s", evidence.id)
            return self._failed(case, evidence, "The uploaded file could not be processed.")

    def _failed(self, case: CaseRecord, evidence: Evidence, message: str) -> ExtractedFactsResponse:
        evidence.processing_status = ProcessingStatus.failed.value
        evidence.extraction_error = message
        evidence.processed_at = datetime.now(UTC)
        self.evidence.save(evidence)
        facts = self.cases.get_facts(case.id)
        return ExtractedFactsResponse(case_id=case.id, evidence_id=evidence.id, status=ProcessingStatus.failed, overall_confidence=self._confidence(facts), facts=[to_fact_response(fact) for fact in facts], error=message)

    @staticmethod
    def _confidence(facts: list[NoticeFact]) -> int:
        values = [fact.confidence for fact in facts if fact.confidence is not None]
        return round(sum(values) / len(values)) if values else 0

    @staticmethod
    def _upload_response(case_id: str, evidence: Evidence, duplicate: bool) -> EvidenceUploadResponse:
        return EvidenceUploadResponse(case_id=case_id, evidence_id=evidence.id, original_filename=evidence.original_filename or evidence.title, media_type=evidence.media_type or "application/octet-stream", size_bytes=evidence.size_bytes or 0, sha256=evidence.sha256 or "", processing_status=ProcessingStatus(evidence.processing_status), is_duplicate=duplicate)
