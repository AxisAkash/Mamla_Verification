def test_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["database"] == "ok"


def test_openapi_docs_are_available(client):
    assert client.get("/docs").status_code == 200
    assert client.get("/redoc").status_code == 200
