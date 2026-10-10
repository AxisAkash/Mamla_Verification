# Mamla Verification Frontend

The frontend is a Next.js App Router application. It communicates with the FastAPI backend over HTTP and does not import backend code or serve uploaded files.

## Setup

```bash
cd frontend
npm install
copy .env.example .env.local  # Windows
# cp .env.example .env.local  # macOS/Linux
npm run dev
```

`NEXT_PUBLIC_API_BASE_URL` must point to the backend API, normally `http://localhost:8000/api`. Start the backend before uploading a notice. The URL input remains display-only because the backend intentionally does not fetch arbitrary external URLs.

## Validation

```bash
cd frontend
npm run lint
npm run build
```

The verification workspace creates a case, uploads the selected file or pasted text, starts extraction, displays candidate values with source references, and sends user-confirmed values to the backend. The active case ID is kept in browser storage so a refresh can restore the persisted workflow. OCR success is not a legal conclusion; result states remain deterministic workflow classifications with limitations.
