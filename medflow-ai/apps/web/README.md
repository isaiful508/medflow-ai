# MedflowAI Client

This is the frontend application for **MedflowAI**, a telemedicine dashboard built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS 4**.

## Quick Start

```bash
cd medflow-ai-client
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the client.

## Project Overview

- `app/` contains the Next.js App Router pages and layouts.
- `components/` contains UI components, dashboard modules, and shared UI helpers.
- `context/` contains the `UserContext` provider.
- `lib/` contains mock data, auth helpers, validations, and utilities.
- `service/AuthService/` contains Server Actions for auth.
- `types/` contains shared TypeScript interfaces.

## Notes

- The app currently supports authentication and static dashboard screens.
- Most dashboard data is static/mock and is not yet fully wired to the backend.
- Auth uses cookies and connects to the backend API via `NEXT_PUBLIC_BASE_API`.

## Backend Integration

The frontend expects the backend API to be available under `http://localhost:5000/api` by default.

Key endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/doctors`

## Available Scripts

- `npm run dev` — Start the frontend in development mode.
- `npm run build` — Build the production app.
- `npm run start` — Start the production server.
- `npm run lint` — Run ESLint.
