# Mamla Verification

**Verify Before You Pay. Know What the Law Says.**

Mamla Verification is an AI-assisted legal and traffic-notice verification frontend. It presents an evidence-oriented workflow for structuring a traffic notice, confirming extracted facts, comparing the notice with retained legal conditions, and understanding the limits of a result.

> The frontend and backend currently use illustrative case records, citations, provisions, and outcomes. They are not legal advice or official records.

## Technology stack

- Next.js 16 App Router
- React and TypeScript
- Tailwind CSS 4
- shadcn/ui (Base UI primitives)
- Lucide React
- npm

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Validation commands:

```bash
npm run lint
npm run build
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Product landing page and experience preview |
| `/verify` | Mock notice submission, extraction, conversation, and evidence workspace |
| `/result/[id]` | Evidence-oriented demonstration report for a mock case |

## Project structure

```text
public/
  images/                  Static image assets
  icons/                   Static icon assets
src/
  app/                     App Router pages, layouts, and global styles
  components/
    ui/                    shadcn/ui primitives
    landing/               Landing page sections
    verification/          Notice composer and investigation workspace
    evidence/              Evidence cards, previews, and drawer
    legal/                 Citations, provisions, statuses, and reports
    shared/                Logo, container, and section heading
  data/                    Typed demonstration records
  lib/                     Shared constants and utilities
  types/                   Case, verification, and legal domain models
```

## Design philosophy

The product is designed around calm competence rather than chatbot novelty. It answers first, keeps proof one tap away, shows the Notice vs Law comparison, makes honest uncertainty a first-class result, and lets the user confirm extracted facts before any legal comparison. The visual system uses deep emerald, restrained warm gold, off-white surfaces, Manrope for Latin UI, Noto Sans Bengali as the language foundation, and evidence that stays traceable to its source.

## Current scope

The frontend submission flow and report remain local mock data. The FastAPI backend now provides typed case, fact, evidence, and deterministic demo verification endpoints with SQLAlchemy persistence prepared for PostgreSQL. OCR, AI/RAG, authentication, external APIs, payments, and real legal data are not implemented.

## Backend

The backend is documented in [`backend/README.md`](backend/README.md). Start it independently from the frontend:

```bash
cd backend
python -m venv .venv
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

OpenAPI UI and ReDoc are available at `http://localhost:8000/docs` and `http://localhost:8000/redoc`.

## Future frontend integration

Feature UI reads explicit TypeScript domain models and mock records from `src/data/mock-data.ts`. A future service layer can replace the mock data source while keeping route composition and feature components separate. Backend, database, authentication, model, retrieval, and external API work should be introduced in a separate phase.

## Git branch strategy

- `main` → protected integration/merge branch
- `akash` → active development branch

Develop and commit on `akash`. Do not make direct development commits to `main`; merge reviewed work into `main` through the repository's integration workflow.

## Backend-readiness boundary

The frontend now keeps route composition, typed domain models, and mock-backed
case operations separate. The service boundary in
`src/lib/services/case-service.ts` is the only UI-facing access path for
case workflow data. It can later be replaced by an API adapter without adding
backend behavior to this repository.

The endpoint shapes for create/get case, notice extraction, fact
confirmation, verification, and evidence retrieval are documented in
[`docs/api-contract.md`](docs/api-contract.md). The backend's current
verification states are deterministic demo classifications and must not be
presented as authoritative legal results.
