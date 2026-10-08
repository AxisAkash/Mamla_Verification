import pytest


@pytest.mark.parametrize(
    ("case_id", "expected_status"),
    [
        ("MV-2026-0417", "POTENTIALLY_NONCOMPLIANT"),
        ("MV-2026-0418", "INSUFFICIENT_INFORMATION"),
        ("MV-2026-0419", "CONFORMS"),
        ("MV-2026-0420", "MANUAL_LEGAL_REVIEW"),
    ],
)
def test_demo_verification_statuses(client, case_id, expected_status):
    response = client.post(f"/api/cases/{case_id}/verify")
    assert response.status_code == 200
    result = response.json()["result"]
    assert result["status"] == expected_status
    assert result["limitations"]


def test_missing_case_verification_is_not_found(client):
    response = client.post("/api/cases/MV-DOES-NOT-EXIST/verify")
    assert response.status_code == 404
