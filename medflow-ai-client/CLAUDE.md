# CLAUDE.md — MedflowAI Client

## Project Overview

**MedflowAI** is a telemedicine platform dashboard built with Next.js 16 (App Router), React 19, and TypeScript. It provides AI-powered symptom checking, appointment booking, video calls, chat, and health analytics for patients and doctors.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| UI | React 19.2.4, Tailwind CSS 4 |
| Components | shadcn/ui (Radix UI, "radix-nova" style) |
| Language | TypeScript 5 |
| Forms | React Hook Form + Zod 4.3.6 |
| Auth | JWT (cookie-based, `jwt-decode`) |
| HTTP | Axios (auth only; dashboard uses static data) |
| Icons | Lucide React |
| Styling | CSS custom properties (dual-theme) |

## Architecture

### Route Structure

```
app/
├── layout.tsx          # Root: theme script, UserProvider, metadata
├── page.tsx            # Home → renders DashboardShell
├── providers.tsx       # Client-side UserProvider wrapper
├── globals.css         # Tailwind + CSS variable theming (dark/light)
├── login/page.tsx      # Renders LoginForm
└── register/page.tsx   # Renders RegisterForm
```

### Dashboard (SPA-style)

The `DashboardShell` component (`components/modules/dashboard/dashboard-shell.tsx`) is the main orchestrator:
- Manages `screen` state for internal view switching
- Contains the top bar (search, theme toggle, notifications)
- Renders one of 7 screens based on `screen` state:
  - `dashboard` → `DashboardScreen` (stats, appointments, notifications)
  - `ai-checker` → `AiCheckerScreen` (symptom chat with AI)
  - `appointments` → `AppointmentsScreen` (doctor select, calendar, time slots)
  - `video-call` → `VideoCallScreen` (video call UI + in-call chat)
  - `chat` → `ChatScreen` (conversation list + messages)
  - `profile` → `ProfileScreen` (info/history/vitals tabs)
  - `analytics` → `AnalyticsScreen` (charts + patient table)

### Auth Flow

1. **Register**: `service/AuthService/index.ts` → `registerUser()` Server Action → POST `/auth/register` → sets `accessToken` cookie
2. **Login**: `loginUser()` Server Action → POST `/auth/login` → sets `accessToken` cookie
3. **Current User**: `getCurrentUser()` reads `accessToken` cookie → decodes JWT with `jwt-decode`
4. **Logout**: `logout()` deletes `accessToken` cookie
5. **Context**: `UserContext` fetches current user on mount, provides `user`/`setUser`/`isLoading` app-wide

### Key Files

| File | Purpose |
|---|---|
| `service/AuthService/index.ts` | Server Actions for auth (register, login, current user, logout) |
| `context/UserContext.tsx` | React context for user state |
| `lib/validations/auth.ts` | Zod schemas: `loginSchema`, `registerSchema` |
| `lib/medflow-ai-data.ts` | All static/mock data + TypeScript types |
| `lib/auth.ts` | Auth response parsing helpers |
| `types/index.ts` | `IUser`, `AuthResponse` interfaces |
| `components/app-sidebar.tsx` | Collapsible sidebar with nav + user menu + logout |
| `components/shared/ui-helpers.tsx` | Reusable UI: `GlassCard`, `Avatar`, `CircleButton`, `toneClass`, etc. |
| `components/ui/` | shadcn/ui base components (button, input, card, sidebar) |
| `.env` | `NEXT_PUBLIC_BASE_API=http://localhost:5000/api` |

## Coding Conventions

### Directives
- `"use client"` on **every interactive component** (forms, hooks, state)
- `"use server"` on **Server Actions** only (`service/AuthService/index.ts`)

### Path Aliases
- `@/*` resolves to project root (configured in `tsconfig.json`)

### Styling
- Use **Tailwind CSS classes** as primary styling method
- Use **CSS custom properties** (`--mc-*`, `--color-*`) for theme-aware values
- Use `cn()` from `@/lib/utils` to merge class strings
- Theme is toggled via `data-theme` attribute on `<html>` and persisted in `localStorage`
- MedflowAI-specific CSS classes follow `.medflow-*` pattern (e.g., `.medflow-ai-card`, `.medflow-ai-sidebar`)

### Components
- Follow shadcn/ui patterns: `cva` for variants, `className` prop with `cn()` for overrides
- Shared UI primitives go in `components/shared/ui-helpers.tsx`
- Feature components go in `components/modules/<feature>/`
- Base UI components go in `components/ui/`

### Forms
- Use `react-hook-form` with `@hookform/resolvers/zod`
- Define Zod schemas in `lib/validations/`
- Infer TypeScript types with `z.infer<typeof schema>`

### Data
- All dashboard data is **static/mock** (in `lib/medflow-ai-data.ts`)
- No real API integration beyond auth yet
- Types and mock data are co-located in `lib/medflow-ai-data.ts`

## Development

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## Environment

- `NEXT_PUBLIC_BASE_API` — Backend API base URL (default: `http://localhost:5000/api`)

## Key Implementation Details

- **Theme**: Dual dark/light theme with CSS variables. A blocking script in `layout.tsx` prevents FOUC by reading `localStorage` before first paint.
- **Sidebar**: Uses a custom lightweight sidebar (`components/ui/sidebar.tsx`), not the shadcn sidebar primitive — it supports collapsed state.
- **Dashboard routing is client-side**: Screen changes happen via `useState`, not Next.js navigation.
- **Axios instance** exists in `lib/api.ts` but is not yet used for data fetching.

## Before Making Changes

1. Read the relevant source files to understand current patterns
2. Follow existing architecture (don't introduce new patterns without reason)
3. Preserve the dual-theme support for any new UI
4. Keep dashboard screens as client components with `"use client"`
5. Use existing shared UI helpers (`GlassCard`, `Avatar`, `toneClass`, etc.)
6. Prefer minimal changes — don't refactor unrelated code
