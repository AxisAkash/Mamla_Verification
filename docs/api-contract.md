# Mamla Verification API Contract

This document is the frontend integration contract for the FastAPI backend. The current implementation is a deterministic backend foundation. Case records, provisions, evidence, and verification outcomes marked `isDemo: true` are illustrative only and are not legal advice, official records, or authoritative law.

## Conventions

- JSON over HTTP under `/api`; equivalent legacy paths are available under `/api/v1`.
- IDs are opaque strings. Timestamps are ISO 8601 strings.
- JSON fields use camelCase.
- Validation failures return HTTP 422 with `{ "error": { "code", "message" } }`.
- Missing cases return HTTP 404 with error code `case_not_found`.
- Server failures return a safe generic error without stack traces.
- Request bodies are limited by `MAX_REQUEST_BYTES` (1 MiB by default).

## Verification states

`status` is always one of:

- `CONFORMS`
- `POTENTIALLY_NONCOMPLIANT`
- `INSUFFICIENT_INFORMATION`
- `MANUAL_LEGAL_REVIEW`

These are machine-readable workflow classifications. They do not determine guilt, authenticity, liability, or legal entitlement. A result must include `limitations`.

## Cases

### `POST /api/cases`

Request:

```json
{
  "inputType": "image",
  "sourceLabel": "notice-photo.jpg"
}
```

`inputType` is `image`, `document`, `url`, or `text`. `sourceLabel` is required and is limited to 255 characters. Response is HTTP 201:

```json
{
  "case": {
    "id": "MV-2026-A1B2",
    "reference": "MV-2026-A1B2",
    "title": "Traffic notice review",
    "createdAt": "2026-01-14T09:12:00Z",
    "updatedAt": "2026-01-14T09:12:00Z",
    "inputType": "image",
    "sourceLabel": "notice-photo.jpg",
    "status": "INSUFFICIENT_INFORMATION",
    "summary": "A notice has been received.",
    "isDemo": false
  }
}
```

### `GET /api/cases/{caseId}`

Response:

```json
{
  "case": {},
  "notice": {
    "noticeType": "traffic",
    "noticeNumber": "DT-2026-4471",
    "issuingAuthority": "Submitted authority",
    "issuedAt": "2026-01-14T08:41:00+06:00",
    "location": "Submitted location",
    "violationDescription": "Submitted allegation",
    "penaltyAmount": null,
    "vehicle": {
      "registrationNumber": "Submitted registration",
      "type": "Private car"
    }
  },
  "status": "INSUFFICIENT_INFORMATION",
  "version": 1
}
```

## Notice extraction

### `POST /api/cases/{caseId}/extract`

The current service does not perform OCR or call an AI provider. It returns retained deterministic demo facts, or an empty field list for a newly-created case. Response:

```json
{
  "caseId": "MV-2026-0417",
  "sourceLabel": "notice-photo.jpg",
  "overallConfidence": 89,
  "fields": [
    {
      "key": "noticeNumber",
      "label": "Notice number",
      "value": "DT-2026-4471",
      "extractedValue": "DT-2026-4471",
      "confirmedValue": null,
      "confidence": 96,
      "evidenceIds": ["ev-photo"],
      "isUserConfirmed": false
    }
  ]
}
```

## Fact confirmation

### `PATCH /api/cases/{caseId}/facts`

Request:

```json
{
  "facts": [
    {
      "key": "location",
      "label": "Location",
      "value": "Banani, Dhaka",
      "isUserConfirmed": true
    }
  ]
}
```

Allowed keys are `noticeNumber`, `issuingAuthority`, `issuedAt`, `location`, `violation`, `vehicleRegistration`, `vehicleType`, and `penaltyAmount`. Values are limited to 2,000 characters. The database retains `extractedValue` and `confirmedValue` separately:

```json
{
  "caseId": "MV-2026-0417",
  "version": 2,
  "facts": []
}
```

## Verification

### `POST /api/cases/{caseId}/verify`

Response HTTP 200:

```json
{
  "result": {
    "schemaVersion": 1,
    "id": "RES-0417",
    "caseId": "MV-2026-0417",
    "status": "POTENTIALLY_NONCOMPLIANT",
    "headline": "Possible conflict with an illustrative provision",
    "claim": "The demo notice alleges signal non-compliance.",
    "summary": "The retained demo fields suggest a possible conflict.",
    "reasoning": ["Demo fields were retained from a fixture."],
    "limitations": ["This is not legal advice or an official record."],
    "comparison": [
      {
        "label": "Reported violation",
        "noticeSays": "Crossing against a red signal",
        "lawSays": "Signal state would need corroboration"
      }
    ],
    "provisionIds": ["prov-signal"],
    "citationIds": ["cite-provision"],
    "evidenceIds": ["ev-photo"],
    "generatedAt": "2026-01-14T09:20:00+06:00",
    "confidence": 68,
    "nextSteps": []
  }
}
```

The current verification service is deliberately deterministic and transparent. It does not infer real legal meaning, retrieve current law, or claim that a notice is valid or invalid.

### `GET /api/cases/{caseId}/result`

Returns the same verification envelope after a result exists. A case without a result returns HTTP 404.

## Evidence

### `GET /api/cases/{caseId}/evidence`

Returns only evidence linked to the requested case:

```json
{
  "caseId": "MV-2026-0417",
  "items": [
    {
      "id": "ev-photo",
      "kind": "image",
      "title": "Notice photograph",
      "description": "Submitted notice image used by the demo workflow.",
      "source": "Uploaded by applicant",
      "capturedAt": "2026-01-14T09:10:00+06:00",
      "excerpt": "DT-2026-4471 - Banani - signal allegation",
      "isDemo": true
    }
  ]
}
```

## Health and documentation

- `GET /api/health` checks the API database connection.
- `/docs` provides interactive OpenAPI documentation.
- `/redoc` provides reference documentation.
