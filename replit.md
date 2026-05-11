# ResumeAI

An AI-powered resume builder that lets users craft a polished, professional resume with a live preview and AI writing assistance.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/resume-ai run dev` — run the frontend (port 18731)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui, Zustand (state), wouter (routing)
- API: Express 5
- AI: Replit AI Integrations (OpenAI via `@workspace/integrations-openai-ai-server`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle for API), Vite (frontend)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod schemas for server
- `artifacts/resume-ai/src/` — frontend React app
- `artifacts/resume-ai/src/lib/store.ts` — Zustand store (all resume state)
- `artifacts/resume-ai/src/components/resume-form.tsx` — multi-section form with AI buttons
- `artifacts/resume-ai/src/components/resume-preview.tsx` — live resume preview
- `artifacts/api-server/src/routes/ai.ts` — AI enhancement endpoints

## Architecture decisions

- **Frontend-only state**: All resume data lives in Zustand (no DB persistence). The backend only handles AI calls.
- **AI routes**: POST `/api/ai/enhance` for text enhancement, POST `/api/ai/suggest-skills` for skill suggestions — both call OpenAI via Replit AI Integrations proxy.
- **PDF export**: Uses `window.print()` with print CSS (hides form, shows full-width preview).
- **Dark mode forced**: App always renders in dark mode via `.dark` class on root. Resume preview has white background even in dark UI.
- **No auth**: Public, single-user tool. No accounts or persistence needed.

## Product

- Two-column split layout: collapsible form sections on the left, live resume preview on the right
- Sections: Contact Info, Skills, Experience, Education, Projects, Certifications, Languages
- AI features: Write summary, suggest skills by role, enhance experience/project descriptions
- PDF download via browser print
- Clear All to reset

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After each OpenAPI spec change, re-run codegen before using updated types
- Zustand store is reset on page refresh (no localStorage persistence)
- AI routes use `gpt-5.1` model — no `temperature` parameter (fixed at 1)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
