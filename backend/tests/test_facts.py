def test_extract_and_update_facts(client):
    extracted = client.post("/api/cases/MV-2026-0417/extract")
    assert extracted.status_code == 200
    assert extracted.json()["overallConfidence"] > 0

    updated = client.patch(
        "/api/cases/MV-2026-0417/facts",
        json={"facts": [{"key": "location", "label": "Location", "value": "Confirmed demo location", "isUserConfirmed": True}]},
    )
    assert updated.status_code == 200
    fact = next(item for item in updated.json()["facts"] if item["key"] == "location")
    assert fact["value"] == "Confirmed demo location"
    assert fact["extractedValue"] == "Banani, Dhaka - intersection 4"
    assert fact["isUserConfirmed"] is True


def test_invalid_facts_are_rejected(client):
    response = client.patch(
        "/api/cases/MV-2026-0417/facts",
        json={"facts": [{"key": "unknown", "label": "Unknown", "value": "value"}]},
    )
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"
