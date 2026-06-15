# LexAI Web

AI-powered personal legal assistant — upload a legal document and get a plain-English summary, risk flag analysis, and an interactive Q&A chat. Built for people who need to understand contracts without a law degree.

---

## Prerequisites

- Node.js 20+
- npm 10+
- A running instance of [lexai-backend](https://github.com/your-org/lexai-backend) (or set `VITE_API_BASE_URL` to a deployed URL)

---

## Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd lexai-web

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend URL

# 4. Start the dev server
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint and auto-fix issues |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without formatting |
| `npm run type-check` | Run TypeScript compiler check |
| `npm test` | Run unit tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests and generate coverage report |
| `npm run test:e2e` | Run Playwright e2e smoke tests (requires `npm run build` first) |

### Running e2e tests locally

```bash
# First time only — install Playwright browsers
npx playwright install chromium

# Build the app then run e2e tests
npm run build && npm run test:e2e
```

The e2e tests mock all API responses via Playwright's route interception — **no running backend is required**.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | Yes | `http://localhost:3000` | Backend REST API base URL (no trailing slash) |

---

## Folder Structure

```
src/
├── components/
│   ├── auth/         # ProtectedRoute, GuestRoute guards
│   ├── layout/       # AppShell, PublicHeader, PublicFooter
│   └── ui/           # Design-system components (Button, Input, Badge, Modal, Toast, …)
├── contexts/
│   └── ToastContext.tsx  # Global toast notifications + useToast hook
├── hooks/            # useDocuments, useUsage, useSessionRestore
├── layouts/
│   ├── AppLayout.tsx     # Authenticated app shell (nav + sidebar, ProtectedRoute)
│   └── PublicLayout.tsx  # Unauthenticated pages wrapper
├── lib/
│   ├── api.ts        # Axios instance with Bearer auth + 401 refresh + 5xx event
│   ├── authApi.ts    # login, register, getMe
│   ├── analysisApi.ts# triggerAnalysis, getAnalysis, getChatHistory, sendChatMessage
│   ├── dateUtils.ts  # formatDistanceToNow, formatDate
│   ├── documentsApi.ts # getDocuments, getDocument, getUsage
│   ├── uploadApi.ts  # uploadDocument with progress callback
│   └── utils.ts      # cn() (clsx + tailwind-merge)
├── pages/
│   ├── app/          # Dashboard, Upload, DocumentDetail, DocumentChat, Profile
│   ├── auth/         # Login, Register
│   ├── dev/          # ComponentsPage (dev-only showcase, /dev/components)
│   └── LandingPage, NotFoundPage
├── stores/
│   └── authStore.ts  # Zustand auth state (persisted to localStorage)
├── test/             # Vitest unit tests + setup.ts
├── types/            # Shared TypeScript interfaces (User, LexDocument, ChatMessage, …)
├── App.tsx           # Root component (QueryClient, ToastProvider, RouterProvider)
├── router.tsx        # React Router v6 route definitions
└── main.tsx          # App entry point (wrapped in ErrorBoundary)

e2e/                  # Playwright smoke tests
.github/workflows/    # CI pipeline (lint → type-check → unit tests → build → e2e)
```

---

## Tech Stack

| Category | Library |
|---|---|
| Framework | React 19 + TypeScript via Vite |
| Styling | Tailwind CSS v4 (custom theme: navy `#1E4D8C`, semantic risk colours) |
| Routing | React Router v7 |
| Data fetching | TanStack Query v5 (React Query) |
| HTTP client | Axios with Bearer auth interceptor + token refresh + 5xx global toast |
| Global state | Zustand v5 (auth/session only) |
| Forms/validation | React Hook Form + Zod |
| Icons | lucide-react |
| Testing (unit) | Vitest + React Testing Library |
| Testing (e2e) | Playwright (chromium, route-mocked) |
| CI | GitHub Actions |

---

## Project Status / Roadmap

### Implemented ✅

- [x] Task 1 — Project scaffolding: Vite + React + TypeScript, Tailwind v4 custom theme, ESLint + Prettier, React Router layouts, Axios instance
- [x] Task 2 — Shared UI component library: Button, Input, Textarea, Card, Badge (with risk/status variants), Modal, Spinner, EmptyState, Skeleton, Toast system; AppShell with responsive nav; `/dev/components` showcase
- [x] Task 3 — Authentication: Zustand auth store, login/register pages (RHF + Zod), Axios interceptors (token attach + refresh on 401), session restore on load, ProtectedRoute/GuestRoute
- [x] Task 4 — Dashboard: document list with status badges, usage progress widget, skeleton loading, error state with retry
- [x] Task 5 — Document upload: drag-and-drop zone, client-side validation (type + size), Axios progress bar, trust message
- [x] Task 6 — Document detail: plain-English summary, risk flags sorted by severity with colour-coded left borders and blockquote clause text, "Analyse" trigger with encouraging copy, polling for status, FAILED retry
- [x] Task 7 — Document chat: message bubbles, optimistic updates, typing indicator, starter question chips, legal disclaimer, Enter-to-send + Shift+Enter newline
- [x] Task 8 — User profile: account info, plan badge, usage bar, upgrade CTA placeholder, sign-out
- [x] Task 9 — Public landing page: hero, how-it-works steps, risk detection list, trust/disclaimer section, final CTA — fully responsive
- [x] Task 10 — Polish: global `ErrorBoundary`, `NotFoundPage`, 5xx global toast via `CustomEvent`, `scrollIntoView` stub for tests, canonical Tailwind v4 class names, ARIA labels throughout
- [x] Task 11 — Testing & CI: 24 unit tests (auth forms, upload, chat), 5 Playwright smoke tests, GitHub Actions pipeline

### Future (post-MVP)

- Premium billing integration (Stripe)
- Multilingual document support
- Voice interface / audio summary
- Document generator (fill-in-the-blank contracts)
- Collaborative document review (share with a lawyer)

---

## Known Assumptions & TODOs

> These items need to be reconciled with the `lexai-backend` team before shipping.

| Area | Assumption |
|---|---|
| `GET /documents` | Response shape `{ data, total, page, limit }` is assumed — verify with backend |
| Token storage | `localStorage` used for MVP. Revisit `httpOnly` cookies before production (see `src/lib/api.ts`) |
| `POST /documents/:id/chat` | Response shape `{ message: ChatMessage }` — verify with backend |
| `POST /auth/register` | Returns `{ accessToken, refreshToken }` — if it only returns a user, the auto-login step in RegisterPage handles it |
