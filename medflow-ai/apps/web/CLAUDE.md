# CLAUDE.md — MedflowAI Client

> **Project Roadmap:** See [`PROJECT_ROADMAP.md`](../../PROJECT_ROADMAP.md) for the full development plan, feature tracking, and phase progress. Update the roadmap when completing features.

## Project Overview

**MedflowAI** is a telemedicine platform dashboard built with Next.js 16 (App Router), React 19, and TypeScript. It provides AI-powered symptom checking, appointment booking, video calls, chat, and health analytics for patients, doctors, and admins.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| UI | React 19.2.4, Tailwind CSS 4 |
| Components | shadcn/ui + custom shared components |
| Language | TypeScript 5 |
| Forms | React Hook Form + Zod 4.3.6 |
| Auth | JWT (cookie-based, `jwt-decode`) |
| HTTP | Fetch + Server Actions |
| Icons | Lucide React |
| Styling | CSS custom properties (dual-theme) |

## Architecture

### Route Structure

```
app/
├── layout.tsx                     # Root layout: theme script, Providers, metadata
├── page.tsx                       # Redirects to /dashboard
├── globals.css                    # Tailwind and theme variables
├── providers.tsx                  # `UserProvider` wrapper
├── login/page.tsx                 # Login page
├── register/page.tsx              # Register page
└── (dashboard)/                   # Protected dashboard route group
    ├── layout.tsx                 # Dashboard layout with sidebar + navbar
    ├── dashboard/page.tsx         # Dashboard screen
    ├── ai-checker/page.tsx        # AI Checker screen
    ├── appointments/page.tsx      # Appointments screen
    ├── chat/page.tsx              # Chat screen
    ├── profile/page.tsx           # Profile screen
    ├── video-call/page.tsx        # Video call screen
    ├── analytics/page.tsx         # Analytics screen
    ├── doctors/page.tsx           # Doctors admin screen
    └── patients/page.tsx          # Patients admin screen
```

### Auth Flow

1. **Register**: `service/AuthService/index.ts` → `registerUser()` server action → POST `/auth/register` → sets `accessToken` cookie
2. **Login**: `loginUser()` server action → POST `/auth/login` → sets `accessToken` cookie
3. **Current User**: `getCurrentUser()` reads `accessToken` cookie → decodes JWT with `jwt-decode`
4. **Logout**: `logout()` deletes `accessToken` cookie
5. **Context**: `UserContext` provides `user`, `setUser`, and `isLoading` across the app

### Dashboard Page Components

Each dashboard route renders a screen component from `components/modules/dashboard/`:
- `dashboard/page.tsx` → `DashboardScreen`
- `ai-checker/page.tsx` → `AiCheckerScreen`
- `appointments/page.tsx` → `AppointmentsScreen`
- `chat/page.tsx` → `ChatScreen`
- `profile/page.tsx` → `ProfileScreen`
- `video-call/page.tsx` → `VideoCallScreen`
- `analytics/page.tsx` → `AnalyticsScreen`
- `doctors/page.tsx` → `DoctorsScreen`
- `patients/page.tsx` → `PatientsScreen`

### Key Files

| File | Purpose |
|---|---|
| `app/layout.tsx` | Root layout with theme script and Providers |
| `app/page.tsx` | Redirects to `/dashboard` |
| `app/(dashboard)/layout.tsx` | Dashboard layout with `AppSidebar` and `Navbar` |
| `providers/providers.tsx` | Wraps app with `UserProvider` |
| `service/AuthService/index.ts` | Server Actions for auth |
| `context/UserContext.tsx` | User authentication state and data |
| `lib/medflow-ai-data.ts` | Static dashboard data and type definitions |
| `lib/auth.ts` | Client auth helpers |
| `lib/auth-server.ts` | Server-side auth helpers for cookies |
| `lib/validations/auth.ts` | Zod form schemas |
| `components/shared/app-sidebar.tsx` | Sidebar navigation layout |
| `components/shared/navbar.tsx` | Top navigation bar |
| `components/shared/ui-helpers.tsx` | Shared UI helpers and reusable UI pieces |

## Coding Conventions

### Directives
- `"use client"` on every interactive component
- `"use server"` only on Server Actions

### Path Aliases
- `@/*` resolves to project root via `tsconfig.json`

### Styling
- Tailwind CSS is the primary styling method
- Use CSS custom properties for theme-aware colors
- Use `cn()` for merging class names
- Maintain dark/light theme support in all UI

### Components
- Use `components/modules/<feature>/` for page-specific UI
- Use `components/shared/` for reusable UI and helpers
- Avoid new CSS frameworks or styling patterns

### Forms
- Use React Hook Form + Zod
- Define schemas in `lib/validations/`
- Infer form types with `z.infer<typeof schema>`

### Data
- Dashboard data is mainly static/mock in `lib/medflow-ai-data.ts`
- Use existing helper functions in `lib/auth.ts` and `lib/auth-server.ts`
- Avoid introducing global state libraries

## Development

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Environment

- `NEXT_PUBLIC_BASE_API` — backend API base URL (default: `http://localhost:5000/api`)

## Notes

- Current backend integration is limited to auth and static dashboard data.
- The dashboard uses route-based pages in `app/(dashboard)/` instead of a single client screen router.
- New feature pages should be added as `app/(dashboard)/<page>/page.tsx` with a corresponding screen component under `components/modules/dashboard/`.
