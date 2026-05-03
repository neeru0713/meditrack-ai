# MediTrack AI

MediTrack AI is an intelligent personal health management platform where users manage health records and receive AI-powered wellness insights.

## Tech Stack
- Framework: Next.js 15 (App Router, RSC, Route Handlers)
- Language: TypeScript
- Database: MongoDB Atlas + Mongoose
- Auth: NextAuth v5 (Credentials + Google OAuth, JWT sessions)
- AI: Vercel AI SDK + Groq
- UI: Tailwind CSS
- Charts: Recharts
- Testing: Vitest (+ Playwright config scaffold)
- CI: GitHub Actions

## Core Features
- Health Record CRUD
  - Vitals (blood pressure, glucose, weight)
  - Medications (dosage schedules)
  - Appointments
  - Symptoms
- User-linked data model
  - Every health record is linked to `userId`
  - Compound indexes for time-series reads
- Authentication and authorization
  - Credentials login and Google OAuth
  - Role model: `user` and `doctor`
  - Doctor can access assigned patient records
- Dashboard
  - SSR data fetching
  - Vitals trend chart
  - Module summary cards
- Route protection
  - Middleware-based protection for dashboard and API routes
- Footer requirement
  - Includes name + GitHub + LinkedIn links

## AI Features
- Pattern detection insights
  - Endpoint: `POST /api/ai/insights`
  - Uses recent vitals and medications to generate actionable observations
- Symptom analysis chat
  - Endpoint: `POST /api/ai/chat`
  - Conversational symptom interpretation with structured guidance
- Weekly health digest
  - Endpoint: `POST /api/ai/digest`
  - Summarizes weekly trends, adherence risks, and follow-ups
- Streaming responses
  - AI responses are streamed from backend to frontend
- Medical safety disclaimer
  - AI output includes explicit guidance to consult professionals

## Backend API Overview
- Auth
  - `POST /api/auth/register`
  - `GET/POST /api/auth/[...nextauth]`
- Doctor workflows
  - `POST /api/doctor/assign`
- Vitals
  - `GET/POST /api/vitals`
  - `PATCH/DELETE /api/vitals/:id`
- Medications
  - `GET/POST /api/medications`
  - `PATCH/DELETE /api/medications/:id`
- Appointments
  - `GET/POST /api/appointments`
  - `PATCH/DELETE /api/appointments/:id`
- Symptoms
  - `GET/POST /api/symptoms`
  - `PATCH/DELETE /api/symptoms/:id`
- AI
  - `POST /api/ai/insights`
  - `POST /api/ai/chat`
  - `POST /api/ai/digest`

## Project Structure
```text
meditrack-ai/
├── app/
│   ├── (auth)/login, register
│   ├── (dashboard)/page.tsx, vitals/, medications/, appointments/, symptoms/
│   └── api/
│       ├── auth/[...nextauth]
│       ├── auth/register
│       ├── doctor/assign
│       ├── vitals, medications, appointments, symptoms
│       └── ai/insights, ai/chat, ai/digest
├── components/charts/
├── components/ui/
├── lib/
│   ├── db.ts
│   ├── ai.ts
│   ├── auth.ts
│   └── models/
├── middleware.ts
├── __tests__/
└── .github/workflows/ci.yml
```

## Environment Variables
Create `.env.local` using `.env.example`.

Required variables:
- `MONGODB_URI`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `GROQ_API_KEY`
- `NEXTAUTH_URL` (default: `http://localhost:3000`)

## How to Run (Local)
1. Navigate to project:
   - `cd /Users/ritishgupta/Documents/healthcare-assignment/meditrack-ai`
2. Create env file:
   - `cp .env.example .env.local`
3. Fill all required env variables in `.env.local`.
4. Install dependencies:
   - `npm install`
5. Start dev server:
   - `npm run dev`
6. Open app:
   - `http://localhost:3000`

## Build and Test
- Run unit tests:
  - `npm run test`
- Build production bundle:
  - `npm run build`
- Start production server:
  - `npm run start`

## Demo Flow (Suggested)
1. Register a new user account.
2. Login with credentials.
3. Add vitals, medications, appointments, and symptoms.
4. Open dashboard and verify SSR cards + vitals trend chart.
5. Trigger AI Insights and Symptom Chat from dashboard.
6. (Optional) Login as doctor and test assigned patient access.

## Deployment Notes
- Optimized for Vercel deployment.
- CI workflow (`.github/workflows/ci.yml`) runs Vitest on push/PR.
- Add production env variables in Vercel project settings before deploy.
