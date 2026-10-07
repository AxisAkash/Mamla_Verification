# Mamla Verification

**Verify Before You Pay. Know What the Law Says.**

Mamla Verification is an AI-assisted legal and traffic-notice verification frontend. It presents an evidence-oriented workflow for structuring a traffic notice, reviewing supporting material, tracing legal citations, and understanding the limits of a result.

> This repository currently contains a frontend demonstration only. Its case records, citations, provisions, and outcomes are mock data and are not legal advice or official records.

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

## Design direction

The interface uses a calm legal-tech visual system: deep emerald, warm gold accents, off-white surfaces, restrained status colors, editorial typography, and evidence that stays traceable to its source. Responsive layouts preserve the investigation workspace on desktop and move evidence into a drawer on smaller screens.

## Current scope

The current phase is frontend only. The submission flow is simulated and uses local mock data. OCR, AI/RAG, authentication, persistence, external APIs, payments, and backend services are not implemented.

## Future integration

Feature UI reads explicit TypeScript domain models and mock records from `src/data/mock-data.ts`. A future service layer can replace the mock data source while keeping route composition and feature components separate. Backend, database, authentication, model, retrieval, and external API work should be introduced in a separate phase.

## Git branch strategy

- `main` → protected integration/merge branch
- `akash` → active development branch

Develop and commit on `akash`. Do not make direct development commits to `main`; merge reviewed work into `main` through the repository's integration workflow.
