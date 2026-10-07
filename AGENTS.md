<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Repository guidance

- **Purpose:** Build Mamla Verification, a frontend-only legal and traffic-notice verification experience. Treat all current case, citation, and provision data as illustrative mock data.
- **Stack:** Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, and Lucide React. Use npm and the `@/*` alias.
- **Architecture:** Keep route composition in `src/app`, reusable feature UI in `src/components`, shared constants/utilities in `src/lib`, domain models in `src/types`, and temporary demo records in `src/data`.
- **Components:** Organize by feature (`landing`, `verification`, `evidence`, `legal`, `shared`). Keep visual components free of API/backend implementations.
- **TypeScript:** Prefer explicit domain types and narrow unions. Avoid `any`; use typed mock data and accessible semantic HTML.
- **Design:** Preserve the calm legal-tech palette (emerald, warm gold, off-white), clear evidence/citation traceability, responsive layouts, visible focus states, and the legal disclaimer. Never present mock law or results as authoritative.
- **Dependencies:** Add only dependencies needed by the current frontend. Do not add state, data-fetching, animation, or form libraries without a concrete requirement.
- **Git:** `akash` is the development branch. `main` is the integration/merge branch and must not receive direct development commits. Never force-push.
- **Validation:** Run `npm run lint` and `npm run build` before committing. Do not bypass TypeScript or ESLint errors.
- **Scope:** Avoid backend, database, authentication, AI/RAG, payments, and external API work during the frontend phase. Avoid unrelated file changes.
