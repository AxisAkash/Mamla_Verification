def test_create_and_get_case(client):
    created = client.post("/api/cases", json={"inputType": "text", "sourceLabel": "submitted note.txt"})
    assert created.status_code == 201
    case = created.json()["case"]
    assert case["id"].startswith("MV-")
    assert case["status"] == "INSUFFICIENT_INFORMATION"

    retrieved = client.get(f"/api/cases/{case['id']}")
    assert retrieved.status_code == 200
    assert retrieved.json()["case"]["id"] == case["id"]
    assert retrieved.json()["notice"]["noticeNumber"] == "Not provided"


def test_missing_case_is_not_found(client):
    response = client.get("/api/cases/MV-DOES-NOT-EXIST")
    assert response.status_code == 404
    assert response.json()["error"]["code"] == "case_not_found"


def test_case_validation_failure(client):
    response = client.post("/api/cases", json={"inputType": "audio", "sourceLabel": ""})
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"
