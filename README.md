# Mamla Verification

**Verify Before You Pay. Know What the Law Says.**

Mamla Verification is an evidence-oriented legal and traffic-notice verification application. The frontend and backend are independent applications connected only through the HTTP API. Current case records, citations, provisions, and outcomes are illustrative data and are not legal advice or official records.

## Repository structure

```text
Mamla_Verification/
├── frontend/                 Next.js App Router application
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── next.config.ts
├── backend/                  FastAPI application
│   ├── app/
│   ├── tests/
│   ├── alembic/
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
├── docs/                     Shared API contract
├── AGENTS.md
├── .gitignore
└── README.md
```

## Frontend

The frontend uses Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, and Lucide React.

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

Frontend validation:

```bash
cd frontend
npm run lint
npm run build
```

Frontend routes include `/`, `/verify`, and `/result/[id]`. Demonstration pages retain typed fixture records, while the verification workspace uses the HTTP adapter in `frontend/src/lib/services/api-service.ts`. Set `NEXT_PUBLIC_API_BASE_URL` in `frontend/.env.local` to connect it to the backend.

## Backend

The backend uses FastAPI, Pydantic, SQLAlchemy, PostgreSQL/SQLite, Alembic, and pytest. It provides case management, secure notice ingestion, OCR/text extraction, structured fact extraction, evidence retrieval, and deterministic demonstration verification states.

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

Install and configure:

```bash
python -m pip install -r requirements.txt
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux
```

The backend defaults to a local SQLite database when no `.env` is present. PostgreSQL is the intended deployment database. OCR additionally requires the Tesseract executable and `eng`/`ben` language data; configure `TESSERACT_CMD` when it is not on `PATH`.

Run migrations and start the API:

```bash
cd backend
alembic upgrade head
uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`. OpenAPI and ReDoc are available at `/docs` and `/redoc`; health is available at `/api/health`.

Backend tests:

```bash
cd backend
pytest
```

Useful migration commands:

```bash
cd backend
alembic current
alembic history
alembic upgrade head
```

## API boundary

```text
frontend browser application -> HTTP JSON/multipart API -> backend services -> database/storage
```

The frontend does not import Python code or backend internals. API request and response shapes are documented in [`docs/api-contract.md`](docs/api-contract.md). The backend also exposes equivalent legacy `/api/v1` case paths for compatibility.

## Current scope

OCR and notice ingestion are implemented behind replaceable service boundaries. The current local OCR adapter is Tesseract with `eng+ben`; it requires the executable and both language packs, and accuracy varies with scan quality, layout, handwriting, and mixed-script identifiers. RAG, LLM integration, training datasets, authentication, payments, external legal data, and authoritative legal verification remain out of scope. Deterministic result states are workflow classifications only and must not be presented as legal conclusions.

## Design principles

The product preserves a calm legal-tech palette and a Claim -> Evidence -> Law -> Result traceability model. Users can review extracted facts before legal comparison, uncertainty remains explicit, and evidence provenance stays visible. The frontend supports English and Bangla presentation; the backend OCR configuration defaults to English plus Bangla Tesseract language packs.

## Git branch strategy

- `main` is the protected integration branch.
- `akash` is the active development branch.

Develop and push only on `akash`. Never force-push or push directly to `main`.
