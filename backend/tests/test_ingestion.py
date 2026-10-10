from io import BytesIO

from PIL import Image
from pypdf import PdfWriter

from app.services.ocr_service import OCRPage, OCRProcessingError


class StaticOCRProvider:
    name = "test-ocr"

    def __init__(self, text: str = "", fail: bool = False) -> None:
        self.text = text
        self.fail = fail

    def recognize_image(self, image_bytes: bytes, page_number: int = 1) -> OCRPage:
        del image_bytes
        if self.fail:
            raise OCRProcessingError("ocr_failed", "Test OCR failed.")
        return OCRPage(page_number, self.text, self.name)


def create_case(client, input_type: str = "image") -> str:
    response = client.post("/api/cases", json={"inputType": input_type, "sourceLabel": "uploaded-notice"})
    assert response.status_code == 201
    return response.json()["case"]["id"]


def png_bytes() -> bytes:
    output = BytesIO()
    Image.new("RGB", (2, 2), color="white").save(output, format="PNG")
    return output.getvalue()


def pdf_bytes(page_count: int = 1) -> bytes:
    output = BytesIO()
    writer = PdfWriter()
    for _ in range(page_count):
        writer.add_blank_page(width=200, height=200)
    writer.write(output)
    return output.getvalue()


def upload(client, case_id: str, filename: str, content: bytes, media_type: str):
    return client.post(f"/api/cases/{case_id}/evidence", files={"file": (filename, content, media_type)})


def test_valid_image_upload_preserves_original_metadata(client):
    case_id = create_case(client)
    response = upload(client, case_id, "notice.png", png_bytes(), "image/png")
    assert response.status_code == 201
    body = response.json()
    assert body["caseId"] == case_id
    assert body["originalFilename"] == "notice.png"
    assert body["mediaType"] == "image/png"
    assert body["sizeBytes"] > 0
    assert body["processingStatus"] == "UPLOADED"

    evidence = client.get(f"/api/cases/{case_id}/evidence").json()["items"]
    assert evidence[0]["originalFilename"] == "notice.png"
    assert evidence[0]["processingStatus"] == "UPLOADED"

    duplicate = upload(client, case_id, "renamed.png", png_bytes(), "image/png")
    assert duplicate.status_code == 201
    assert duplicate.json()["isDuplicate"] is True
    assert duplicate.json()["evidenceId"] == body["evidenceId"]


def test_invalid_file_type_and_oversized_file_are_rejected(client):
    case_id = create_case(client, "text")
    invalid = upload(client, case_id, "notice.exe", b"MZ\x00\x01", "application/octet-stream")
    assert invalid.status_code == 415
    assert invalid.json()["error"]["code"] == "unsupported_file_type"

    oversized = upload(client, case_id, "notice.txt", b"x" * 2048, "text/plain")
    assert oversized.status_code == 413
    assert oversized.json()["error"]["code"] == "file_too_large"


def test_file_signature_and_path_traversal_are_handled_safely(client):
    case_id = create_case(client)
    bad_signature = upload(client, case_id, "notice.png", b"not a png", "image/png")
    assert bad_signature.status_code == 415
    assert bad_signature.json()["error"]["code"] == "invalid_file_signature"

    safe_upload = upload(client, case_id, "../../outside.txt", b"Notice number: SAFE-2026-1", "text/plain")
    assert safe_upload.status_code == 201
    assert safe_upload.json()["originalFilename"] == "outside.txt"
    storage_root = client.app.state.file_storage.root
    stored_files = [path for path in storage_root.iterdir() if not path.name.startswith(".upload-")]
    assert stored_files
    assert all(path.parent == storage_root for path in stored_files)


def test_text_ingestion_and_structured_extraction(client):
    client.app.state.ocr_provider = StaticOCRProvider()
    case_id = create_case(client, "text")
    content = (
        "Notice number: DT-2026-1234\n"
        "Location: Banani, Dhaka\n"
        "Violation: signal non-compliance\n"
        "Fine: 500\n"
        "Date: 14/01/2026\n"
        "Time: 08:41\n"
        "Vehicle registration: DHA-MET-4471\n"
        "বাংলা notice text"
    ).encode("utf-8")
    uploaded = upload(client, case_id, "notice.txt", content, "text/plain")
    evidence_id = uploaded.json()["evidenceId"]

    extracted = client.post(f"/api/cases/{case_id}/evidence/{evidence_id}/extract")
    assert extracted.status_code == 200
    body = extracted.json()
    assert body["status"] == "COMPLETED"
    fields = {item["key"]: item for item in body["facts"]}
    assert fields["noticeNumber"]["value"] == "DT-2026-1234"
    assert fields["location"]["value"] == "Banani, Dhaka"
    assert fields["noticeNumber"]["confidence"] > 0
    assert fields["noticeNumber"]["sourceReference"].startswith("raw_chars:")
    assert ";page:1" in fields["noticeNumber"]["sourceReference"]
    assert "DT-2026-1234" in fields["noticeNumber"]["sourceText"]
    assert "issuingAuthority" not in fields
    assert "vehicleType" not in fields

    ocr = client.get(f"/api/cases/{case_id}/evidence/{evidence_id}/ocr").json()
    assert ocr["rawText"] == content.decode("utf-8")
    assert ocr["normalizedText"] != ""
    assert ocr["pages"][0]["source"] == "text:file"

    facts = client.get(f"/api/cases/{case_id}/facts").json()
    assert facts["status"] == "COMPLETED"
    assert facts["evidenceId"] == evidence_id

    retry = client.post(f"/api/cases/{case_id}/evidence/{evidence_id}/extract")
    assert retry.json()["status"] == "COMPLETED"
    assert retry.json()["facts"] == body["facts"]


def test_pdf_ingestion_uses_ocr_fallback_and_mixed_text(client):
    client.app.state.ocr_provider = StaticOCRProvider("নোটিশ নম্বর: DT-2026-9988\nLocation: Dhaka")
    case_id = create_case(client, "document")
    uploaded = upload(client, case_id, "scanned.pdf", pdf_bytes(), "application/pdf")
    assert uploaded.status_code == 201
    evidence_id = uploaded.json()["evidenceId"]

    response = client.post(f"/api/cases/{case_id}/evidence/{evidence_id}/extract")
    assert response.status_code == 200
    assert response.json()["status"] == "COMPLETED"
    pdf_facts = {item["key"]: item for item in response.json()["facts"]}
    assert pdf_facts["noticeNumber"]["value"] == "DT-2026-9988"
    ocr = client.get(f"/api/cases/{case_id}/evidence/{evidence_id}/ocr").json()
    assert ocr["rawText"] == "নোটিশ নম্বর: DT-2026-9988\nLocation: Dhaka"
    assert ocr["pages"][0]["source"] == "test-ocr"


def test_scanned_pdf_processes_every_page(client):
    client.app.state.ocr_provider = StaticOCRProvider("Page text বাংলা")
    case_id = create_case(client, "document")
    uploaded = upload(client, case_id, "multi-page.pdf", pdf_bytes(2), "application/pdf")
    evidence_id = uploaded.json()["evidenceId"]

    response = client.post(f"/api/cases/{case_id}/evidence/{evidence_id}/extract")
    assert response.status_code == 200
    ocr = client.get(f"/api/cases/{case_id}/evidence/{evidence_id}/ocr").json()
    assert len(ocr["pages"]) == 2
    assert [page["pageNumber"] for page in ocr["pages"]] == [1, 2]
    assert ocr["rawText"] == "Page text বাংলা\nPage text বাংলা"


def test_confirmed_facts_survive_retrieval_after_extraction(client):
    case_id = create_case(client, "text")
    uploaded = upload(client, case_id, "notice.txt", b"Location: Banani, Dhaka\nViolation: signal non-compliance", "text/plain")
    evidence_id = uploaded.json()["evidenceId"]
    assert client.post(f"/api/cases/{case_id}/evidence/{evidence_id}/extract").status_code == 200

    updated = client.patch(
        f"/api/cases/{case_id}/facts",
        json={"facts": [
            {"key": "location", "label": "Location", "value": "Confirmed Dhaka", "isUserConfirmed": True},
            {"key": "violation", "label": "Alleged violation", "value": "signal non-compliance", "isUserConfirmed": True},
        ]},
    )
    assert updated.status_code == 200
    refreshed = client.get(f"/api/cases/{case_id}/facts").json()
    location = next(item for item in refreshed["facts"] if item["key"] == "location")
    assert location["value"] == "Confirmed Dhaka"
    assert location["extractedValue"] == "Banani, Dhaka"
    assert location["isUserConfirmed"] is True
    result = client.post(f"/api/cases/{case_id}/verify")
    assert result.status_code == 200
    assert result.json()["result"]["status"] == "POTENTIALLY_NONCOMPLIANT"


def test_empty_and_failed_ocr_are_explicit_states(client):
    client.app.state.ocr_provider = StaticOCRProvider("")
    empty_case = create_case(client)
    empty_upload = upload(client, empty_case, "empty.png", png_bytes(), "image/png")
    empty_id = empty_upload.json()["evidenceId"]
    empty_result = client.post(f"/api/cases/{empty_case}/evidence/{empty_id}/extract")
    assert empty_result.json()["status"] == "EMPTY"
    assert empty_result.json()["facts"] == []

    client.app.state.ocr_provider = StaticOCRProvider(fail=True)
    failed_case = create_case(client)
    failed_upload = upload(client, failed_case, "failed.png", png_bytes(), "image/png")
    failed_id = failed_upload.json()["evidenceId"]
    failed_result = client.post(f"/api/cases/{failed_case}/evidence/{failed_id}/extract")
    assert failed_result.json()["status"] == "FAILED"
    assert failed_result.json()["error"] == "Test OCR failed."


def test_upload_and_processing_missing_case_are_safe_errors(client):
    response = upload(client, "MV-MISSING", "notice.txt", b"text", "text/plain")
    assert response.status_code == 404
    assert response.json()["error"]["code"] == "case_not_found"
