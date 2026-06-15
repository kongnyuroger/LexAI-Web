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
| `npm run format:check` | Check formatting without writing |
| `npm run type-check` | Run TypeScript compiler check |
| `npm test` | Run unit tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests and generate coverage report |

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
│   └── ui/           # Reusable design-system components (Button, Input, Badge, …)
├── layouts/
│   ├── AppLayout.tsx     # Authenticated app shell (nav + sidebar)
│   └── PublicLayout.tsx  # Unauthenticated pages wrapper
├── lib/
│   └── api.ts        # Configured Axios instance with auth interceptors
├── pages/
│   ├── app/          # Authenticated pages (Dashboard, DocumentDetail, Chat, Profile)
│   └── auth/         # Public auth pages (Login, Register)
├── hooks/            # Custom React hooks (useDocuments, useUsage, useAuth, …)
├── stores/           # Zustand global state (auth store)
├── types/            # Shared TypeScript interfaces
├── test/             # Test setup and fixtures
├── App.tsx           # Root component with providers
├── router.tsx        # React Router v6 route definitions
└── main.tsx          # App entry point
```

---

## Tech Stack

| Category | Library |
|---|---|
| Framework | React 19 + TypeScript via Vite |
| Styling | Tailwind CSS v4 (custom theme) |
| Routing | React Router v7 |
| Data fetching | TanStack Query (React Query) |
| HTTP client | Axios (with auth interceptors) |
| Global state | Zustand (auth/session only) |
| Forms/validation | React Hook Form + Zod |
| Icons | lucide-react |
| Testing (unit) | Vitest + React Testing Library |
| Testing (e2e) | Playwright |

---

## Project Status / Roadmap

### Implemented
- [x] Task 1 — Project scaffolding: Vite + React + TypeScript, Tailwind v4 custom theme, ESLint + Prettier, React Router layouts, Axios instance with auth interceptors, type definitions

### In Progress / Planned
- [ ] Task 2 — Shared UI component library (Button, Input, Badge, Modal, Toast, AppShell …)
- [ ] Task 3 — Authentication (login, register, token refresh, protected routes)
- [ ] Task 4 — Dashboard & document list
- [ ] Task 5 — Document upload flow (drag-and-drop, progress, validation)
- [ ] Task 6 — Document detail & analysis view (summary + risk flags)
- [ ] Task 7 — Document chat (Q&A interface)
- [ ] Task 8 — User profile & plan page
- [ ] Task 9 — Public landing page
- [ ] Task 10 — Responsive design, accessibility & error-handling polish
- [ ] Task 11 — Testing & CI pipeline

### Future (post-MVP)
- Multilingual document support
- Voice interface
- Document generator
- Premium billing integration

---

## Notes

- Token storage uses `localStorage` for the MVP. This is a known security trade-off (vs. `httpOnly` cookies). Before a production launch this should be revisited in `src/lib/api.ts`.
- The `GET /documents` endpoint shape is assumed (see `src/types/index.ts`). Reconcile with the `lexai-backend` team before shipping.
