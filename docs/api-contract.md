# Mamla Verification API Contract

This document is the frontend integration contract for the FastAPI backend. The current implementation is a deterministic backend foundation. Case records, provisions, evidence, and verification outcomes marked `isDemo: true` are illustrative only and are not legal advice, official records, or authoritative law.

## Conventions

- JSON over HTTP under `/api`; equivalent legacy paths are available under `/api/v1`.
- IDs are opaque strings. Timestamps are ISO 8601 strings.
- JSON fields use camelCase.
- Validation failures return HTTP 422 with `{ "error": { "code", "message" } }`.
- Missing cases return HTTP 404 with error code `case_not_found`.
- Server failures return a safe generic error without stack traces.
- Request bodies are limited by `MAX_REQUEST_BYTES` (12 MiB by default); individual files are limited by `MAX_UPLOAD_BYTES` (10 MiB by default).

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

## Evidence upload and ingestion

### `POST /api/cases/{caseId}/evidence`

Accepts `multipart/form-data` with one `file` part. Supported pairs are:

| Extension | MIME type | Processing |
| --- | --- | --- |
| `.jpg`, `.jpeg` | `image/jpeg` | Tesseract OCR |
| `.png` | `image/png` | Tesseract OCR |
| `.webp` | `image/webp` | Tesseract OCR |
| `.pdf` | `application/pdf` | Embedded text, then scanned-page OCR fallback |
| `.txt`, `.text` | `text/plain` | UTF-8 text extraction |

The server validates the filename, declared MIME type, magic signature, decodability, PDF page count, and file size before storage. Original files are written under the private `STORAGE_ROOT` using a generated immutable storage key; client filenames are metadata only. Duplicate uploads for the same case return the existing evidence ID with `isDuplicate: true`.

Response HTTP 201:

```json
{
  "caseId": "MV-2026-0417",
  "evidenceId": "ev-2f2d...",
  "originalFilename": "notice-photo.jpg",
  "mediaType": "image/jpeg",
  "sizeBytes": 284120,
  "sha256": "...",
  "processingStatus": "UPLOADED",
  "isDuplicate": false
}
```

Unsupported types return 415, oversized files return 413, and malformed files return 415. No uploaded content is included in error logs.

### `POST /api/cases/{caseId}/evidence/{evidenceId}/extract`

Runs the ingestion pipeline synchronously for the selected original. It is safe to retry completed or empty evidence: the stored result is returned without rerunning extraction. Failed evidence can be retried. Response:

```json
{
  "caseId": "MV-2026-0417",
  "evidenceId": "ev-2f2d...",
  "status": "COMPLETED",
  "overallConfidence": 84,
  "facts": [],
  "error": null
}
```

`status` is `UPLOADED`, `PROCESSING`, `COMPLETED`, `EMPTY`, or `FAILED`. `EMPTY` means the source was valid but no text was returned. `FAILED` includes a safe processing error and never substitutes invented text.

## OCR and text extraction

### `POST /api/cases/{caseId}/extract`

This existing endpoint remains compatible. For a case with uploaded evidence it processes the latest uploaded item and returns the existing extraction shape plus optional `status`, `evidenceId`, and `error` fields. For seeded demo cases without uploaded evidence it returns their retained fixture facts as before.

The OCR provider is behind an `OCRProvider` interface. The current adapter calls Tesseract with `OCR_LANGUAGES=eng+ben`; no AI API or legal source is called. PDF pages with embedded text are extracted directly. Empty pages are rendered and sent through the OCR provider. Raw page output is retained exactly in the database, while `normalizedText` is a separate Unicode/whitespace-normalized copy.

### `GET /api/cases/{caseId}/evidence/{evidenceId}/ocr`

Returns raw text, normalized text, page references, provider name, processing status, and safe error state:

```json
{
  "caseId": "MV-2026-0417",
  "evidenceId": "ev-2f2d...",
  "status": "COMPLETED",
  "rawText": "Notice number: DT-2026-4471\nLocation: Banani, Dhaka",
  "normalizedText": "Notice number: DT-2026-4471\nLocation: Banani, Dhaka",
  "pages": [{"pageNumber": 1, "text": "...", "source": "ocr:tesseract"}],
  "provider": "tesseract",
  "processedAt": "2026-01-14T09:20:00Z",
  "error": null
}
```

## Structured extracted facts

### `GET /api/cases/{caseId}/facts`

Returns only facts found in the retained text. Supported extracted keys include `noticeType`, `noticeNumber`, `issuingAuthority`, `violation`, `penaltyAmount`, `date`, `time`, `location`, `vehicleRegistration`, `vehicleType`, `vehicleMake`, and `vehicleModel`. Missing fields are omitted; they are never filled with assumptions.

Each fact carries `value`, heuristic `confidence` (0-100), `sourceReference`, `sourceText`, and `evidenceIds`. Confidence describes extraction signal quality, not legal certainty.

```json
{
  "caseId": "MV-2026-0417",
  "evidenceId": "ev-2f2d...",
  "status": "COMPLETED",
  "overallConfidence": 84,
  "facts": [
    {
      "key": "noticeNumber",
      "label": "Notice number",
      "value": "DT-2026-4471",
      "extractedValue": "DT-2026-4471",
      "confirmedValue": null,
      "confidence": 92,
      "evidenceIds": ["ev-2f2d..."],
      "sourceReference": "raw_chars:15-29",
      "sourceText": "Notice number: DT-2026-4471",
      "isUserConfirmed": false
    }
  ],
  "error": null
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
