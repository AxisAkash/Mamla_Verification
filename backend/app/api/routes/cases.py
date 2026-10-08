from fastapi import APIRouter, Depends, File, Path, UploadFile, status

from app.api.dependencies import (
    get_case_service,
    get_evidence_service,
    get_ingestion_service,
    get_verification_service,
)
from app.schemas.case import CaseCreateRequest, CaseDetailResponse, CreateCaseResponse
from app.schemas.facts import ExtractionResponse, FactListResponse, FactsUpdateRequest, FactsUpdateResponse
from app.schemas.ingestion import ExtractedFactsResponse, EvidenceUploadResponse, OCRResponse
from app.schemas.legal import EvidenceListResponse
from app.schemas.result import VerificationEnvelope
from app.services.case_service import CaseService
from app.services.evidence_service import EvidenceService
from app.services.ingestion_service import EvidenceIngestionService
from app.services.verification_service import VerificationService

router = APIRouter(prefix="/cases", tags=["cases"])


@router.post("", response_model=CreateCaseResponse, status_code=status.HTTP_201_CREATED, summary="Create a verification case")
def create_case(request: CaseCreateRequest, service: CaseService = Depends(get_case_service)) -> CreateCaseResponse:
    return CreateCaseResponse(case=service.create_case(request))


@router.get("/{case_id}", response_model=CaseDetailResponse, summary="Get a case and its traffic notice")
def get_case(
    case_id: str = Path(min_length=1, max_length=64),
    service: CaseService = Depends(get_case_service),
) -> CaseDetailResponse:
    return service.get_case(case_id)


@router.post("/{case_id}/evidence", response_model=EvidenceUploadResponse, status_code=status.HTTP_201_CREATED, summary="Upload original notice evidence")
def upload_evidence(
    file: UploadFile = File(...),
    case_id: str = Path(min_length=1, max_length=64),
    service: EvidenceIngestionService = Depends(get_ingestion_service),
) -> EvidenceUploadResponse:
    return service.upload(case_id, file)


@router.post("/{case_id}/extract", response_model=ExtractionResponse, summary="Extract notice facts from the latest evidence")
@router.post("/{case_id}/notice-extraction", response_model=ExtractionResponse, include_in_schema=False)
def extract_notice(
    case_id: str = Path(min_length=1, max_length=64),
    service: EvidenceIngestionService = Depends(get_ingestion_service),
) -> ExtractionResponse:
    return service.extract_case(case_id)


@router.post("/{case_id}/evidence/{evidence_id}/extract", response_model=ExtractedFactsResponse, summary="Process one uploaded evidence item")
def extract_evidence(
    case_id: str = Path(min_length=1, max_length=64),
    evidence_id: str = Path(min_length=1, max_length=64),
    service: EvidenceIngestionService = Depends(get_ingestion_service),
) -> ExtractedFactsResponse:
    return service.process_evidence(case_id, evidence_id)


@router.get("/{case_id}/evidence/{evidence_id}/ocr", response_model=OCRResponse, summary="Retrieve raw and normalized OCR text")
def get_ocr(
    case_id: str = Path(min_length=1, max_length=64),
    evidence_id: str = Path(min_length=1, max_length=64),
    service: EvidenceIngestionService = Depends(get_ingestion_service),
) -> OCRResponse:
    return service.get_ocr(case_id, evidence_id)


@router.get("/{case_id}/facts", response_model=FactListResponse, summary="Retrieve extracted notice facts")
def get_facts(
    case_id: str = Path(min_length=1, max_length=64),
    evidence_id: str | None = None,
    service: EvidenceIngestionService = Depends(get_ingestion_service),
) -> FactListResponse:
    return service.get_facts(case_id, evidence_id)


@router.patch("/{case_id}/facts", response_model=FactsUpdateResponse, summary="Confirm notice facts")
def update_facts(
    request: FactsUpdateRequest,
    case_id: str = Path(min_length=1, max_length=64),
    service: CaseService = Depends(get_case_service),
) -> FactsUpdateResponse:
    return service.update_facts(case_id, request)


@router.post("/{case_id}/verify", response_model=VerificationEnvelope, summary="Run deterministic demo verification")
@router.post("/{case_id}/verification", response_model=VerificationEnvelope, include_in_schema=False)
def verify_case(
    case_id: str = Path(min_length=1, max_length=64),
    service: VerificationService = Depends(get_verification_service),
) -> VerificationEnvelope:
    return VerificationEnvelope(result=service.verify(case_id))


@router.get("/{case_id}/evidence", response_model=EvidenceListResponse, summary="Get evidence linked to a case")
def get_evidence(
    case_id: str = Path(min_length=1, max_length=64),
    service: EvidenceService = Depends(get_evidence_service),
) -> EvidenceListResponse:
    return service.list_for_case(case_id)


@router.get("/{case_id}/result", response_model=VerificationEnvelope, summary="Get the current verification result")
def get_result(
    case_id: str = Path(min_length=1, max_length=64),
    service: VerificationService = Depends(get_verification_service),
) -> VerificationEnvelope:
    return VerificationEnvelope(result=service.get_result(case_id))
