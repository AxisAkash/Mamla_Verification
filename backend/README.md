# Mamla Verification Backend

FastAPI backend foundation for the Mamla Verification frontend. Current records and verification results are deterministic demonstration data only. They are not official records, legal advice, or a substitute for qualified review.

## Architecture

```text
HTTP routes -> services -> repositories -> SQLAlchemy -> PostgreSQL
                    |                          |
             typed Pydantic schemas      Alembic migrations
```

- `app/api/`: FastAPI routes and request-scoped dependencies
- `app/services/`: case, OCR/text extraction, conservative structured extraction, evidence, verification, and future legal-retrieval seams
- `app/ingestion/`: MIME/signature validation and filesystem storage of immutable originals
- `app/repositories/`: database access only
- `app/models/`: SQLAlchemy tables and normalized association tables
- `app/schemas/`: typed API request and response models
- `app/seed/`: development-only demo fixtures matching the frontend cases
- `tests/`: deterministic API tests using an isolated SQLite database

## Requirements and setup

Python 3.11 or newer is recommended.

```bash
cd backend
python -m venv .venv
```

Activate the environment:

```bash
# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# macOS/Linux
source .venv/bin/activate
```

Install dependencies and configure the environment:

```bash
python -m pip install -r requirements.txt
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux
```

For local PostgreSQL, create a database and set `DATABASE_URL` in `.env`, for example:

```text
postgresql+psycopg://mamla:change-me@localhost:5432/mamla_verification
```

The default without `.env` is a local SQLite file for development convenience. PostgreSQL is the intended deployment database.

Image and scanned-PDF OCR also require the Tesseract executable and its `eng` and `ben` language data to be installed on the host. Set `TESSERACT_CMD` when the executable is not on `PATH`. The Python `pytesseract` package is only the adapter; it does not bundle the OCR engine or language files.

## Configuration

- `APP_ENV`: environment name, default `development`
- `DATABASE_URL`: SQLAlchemy database URL
- `CORS_ORIGINS`: comma-separated browser origins, default `http://localhost:3000`
- `SEED_DEMO_DATA`: seed the four frontend-aligned demo cases, default `true`
- `AUTO_CREATE_TABLES`: create tables on startup for local development; use Alembic in deployments
- `MAX_REQUEST_BYTES`: request body limit, default 12 MiB
- `MAX_UPLOAD_BYTES`: per-file limit, default 10 MiB
- `STORAGE_ROOT`: private filesystem root for original uploads, default `./storage`
- `OCR_LANGUAGES`: Tesseract language packs, default `eng+ben`
- `TESSERACT_CMD`: optional path to the Tesseract executable
- `MAX_DOCUMENT_PAGES`: PDF page limit, default 50

Never commit `.env` or credentials.

## Migrations and running

Use Alembic for a PostgreSQL deployment:

```bash
alembic upgrade head
uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`. OpenAPI UI and ReDoc are available at `/docs` and `/redoc`.

## API

- `GET /api/health`
- `POST /api/cases`
- `GET /api/cases/{case_id}`
- `POST /api/cases/{case_id}/extract`
- `PATCH /api/cases/{case_id}/facts`
- `POST /api/cases/{case_id}/verify`
- `GET /api/cases/{case_id}/evidence`
- `POST /api/cases/{case_id}/evidence` (multipart upload)
- `POST /api/cases/{case_id}/evidence/{evidence_id}/extract`
- `GET /api/cases/{case_id}/evidence/{evidence_id}/ocr`
- `GET /api/cases/{case_id}/facts`
- `GET /api/cases/{case_id}/result`

The legacy `/api/v1` paths map to the same handlers. Request and response details are maintained in [`../docs/api-contract.md`](../docs/api-contract.md).

## Tests

```bash
pytest
```

Tests use SQLite, generated files, and a fake OCR provider; they do not call external services or claim real legal verification.

## Current limitations and future architecture

There is no authentication, external legal source, AI model, RAG, vector search, payments, or external API integration. Uploads are stored under a private configured filesystem root and are not served directly. Tesseract must be installed separately when image/scanned-PDF OCR is enabled; unavailable engines return a `FAILED` processing state instead of fabricated text. The verification service uses explicit workflow rules solely to exercise the frontend contract.

The OCR provider is isolated behind `OCRProvider` and currently has a Tesseract adapter configured for English and Bangla language packs. PDF ingestion first uses embedded text and renders scanned pages for OCR fallback. A later verification orchestrator can combine confirmed facts, retrieved provisions, and evidence while preserving limitations and human review states. Those additions must not turn demo provisions into authoritative law without verified sources and appropriate review.
