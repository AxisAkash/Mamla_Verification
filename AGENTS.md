<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `frontend/node_modules/next/dist/docs/` before writing frontend code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `frontend/node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Repository guidance

- **Purpose:** Build Mamla Verification, an evidence-oriented legal and traffic-notice verification experience with separate frontend and backend applications. Treat all current case, citation, and provision data as illustrative mock data.
- **Stack:** Frontend uses Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, and Lucide React. Backend uses FastAPI, SQLAlchemy, PostgreSQL/SQLite, and Alembic.
- **Architecture:** Keep frontend route composition in `frontend/src/app`, reusable UI in `frontend/src/components`, shared constants/utilities in `frontend/src/lib`, domain models in `frontend/src/types`, and temporary demo records in `frontend/src/data`. Keep backend routes, services, repositories, and models under `backend/app`.
- **Components:** Organize frontend components by feature (`landing`, `verification`, `evidence`, `legal`, `shared`). Keep visual components free of API/backend implementations; the boundary is frontend HTTP calls to backend routes.
- **TypeScript:** Prefer explicit domain types and narrow unions. Avoid `any`; use typed mock data and accessible semantic HTML.
- **Design:** Preserve the calm legal-tech palette (emerald, warm gold, off-white), Manrope/Noto Sans Bengali typography, clear Claim → Evidence → Law → Result traceability, responsive layouts, visible focus states, and the legal disclaimer. Never present mock law or results as authoritative.
- **UX principles:** Answer first, keep proof one tap away, let users confirm extracted facts before checking law, make uncertainty useful, keep chat optional, and treat Bangla as a first-class language foundation.
- **Dependencies:** Keep frontend npm and backend Python dependencies independent. Add only dependencies needed by the current application.
- **Git:** `akash` is the development branch. `main` is the integration/merge branch and must not receive direct development commits. Never force-push.
- **Validation:** Run `npm run lint` and `npm run build` before committing. Do not bypass TypeScript or ESLint errors.
- **Scope:** Avoid authentication, AI/RAG, payments, and external API work unless explicitly requested. Avoid unrelated file changes.
