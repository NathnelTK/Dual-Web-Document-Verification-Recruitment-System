# Dual-Web Document Verification & Recruitment System

Two connected web platforms:
- Admin Dashboard (HR): post vacancies, define document requirements, view/contact applicants.
- User Portal (Applicants): browse vacancies, apply, upload docs, get instant verification feedback.

## Tech Stack (initial)
- Frontend: React + Vite + Tailwind (planned)
- Backend: Node.js + Express
- Database: In-memory store (dev). Swap to Firebase/Supabase later.
- OCR/AI: Stubs for OCR.space / Tesseract / OpenAI; ready for integration.

## Repo Structure
```
.
├─ apps/
│  ├─ admin/        # Admin Dashboard (planned)
│  └─ user/         # User Portal (planned)
├─ packages/
│  └─ shared/       # Shared types and utils
└─ server/          # Express API
```

## Getting Started
1) Install dependencies
```bash
npm install
```
2) Run backend (default port 4000)
```bash
npm run start
```
3) Frontend apps will be added in `apps/*` (admin/user). For now, use API with tools like Postman.

## Environment
Create `server/.env` for future integrations:
```
PORT=4000
OCRSPACE_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

## API Overview (v0)
- Vacancies
  - GET   /api/v1/vacancies
  - POST  /api/v1/vacancies
- Applications
  - POST  /api/v1/applications
  - GET   /api/v1/applications?vacancyId=...

## Verification Flow (dev)
- OCR/AI services are mocked with deterministic responses.
- Rule evaluator supports operators: >=, <=, >, <, == for numeric/date; string equality.

## Roadmap
- Add Admin app (vacancy + requirement builder)
- Add User app (vacancy list + apply)
- Integrate OCR.space or Tesseract; OpenAI/HuggingFace for NLP
- Persist to Firebase Firestore or Supabase


