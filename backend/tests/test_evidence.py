def test_evidence_is_scoped_to_case(client):
    response = client.get("/api/cases/MV-2026-0417/evidence")
    assert response.status_code == 200
    assert response.json()["caseId"] == "MV-2026-0417"
    assert response.json()["items"]


def test_missing_case_evidence_is_not_found(client):
    response = client.get("/api/cases/MV-DOES-NOT-EXIST/evidence")
    assert response.status_code == 404
