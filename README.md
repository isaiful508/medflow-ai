# 🏥 MedflowAI — Telemedicine Platform

> **AI-powered telemedicine SaaS** — Connecting patients with doctors through AI symptom checking, appointment booking, video calls, and real-time chat.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Frontend](https://img.shields.io/badge/frontend-Next.js%2016-blue)
![Backend](https://img.shields.io/badge/backend-Express.js%205-green)
![Database](https://img.shields.io/badge/database-MongoDB-orange)

---

## 📋 Quick Links

| Document | Description |
|---|---|
| [`PROJECT_ROADMAP.md`](./PROJECT_ROADMAP.md) | **Full development plan** — phases, feature tracking, architecture |
| [`medflow-ai-client/CLAUDE.md`](./medflow-ai-client/CLAUDE.md) | Frontend documentation & conventions |
| [`medflow-server/CLAUDE.md`](./medflow-server/CLAUDE.md) | Backend documentation & conventions |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Frontend
```bash
cd medflow-ai-client
cp .env.example .env    # Set NEXT_PUBLIC_BASE_API
npm install
npm run dev             # http://localhost:3000
```

### Backend
```bash
cd medflow-server
cp .env.example .env    # Fill in real values (JWT secrets, DB URL)
npm install
npm run dev             # http://localhost:5000
```

### Notes
- The backend listens on `http://localhost:5000` and mounts API routes under `/api`
- Auth endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`
- Doctor creation endpoint: `POST /api/doctors`

---

## 🏗️ Project Structure

```
medflow-ai/
├── PROJECT_ROADMAP.md          # ← Start here for project plan
├── medflow-ai-client/          # Next.js 16 frontend (React 19, Tailwind 4)
│   ├── app/                    # Pages (App Router)
│   ├── components/             # UI components
│   │   ├── modules/            # Feature screens (dashboard, auth)
│   │   ├── shared/             # Shared UI helpers
│   │   └── ui/                 # Base UI (shadcn)
│   ├── context/                # React context (UserContext)
│   ├── lib/                    # Utilities, validations, mock data
│   ├── service/                # Server Actions (AuthService)
│   └── types/                  # TypeScript interfaces
│
└── medflow-server/             # Express.js 5 backend (TypeScript)
    └── src/
        ├── server.ts           # Entry point
        ├── app.ts              # Express setup
        └── app/
            ├── config/         # Environment config
            ├── errors/         # AppError class
            ├── middlewares/    # Auth, error handler
            ├── modules/        # Feature modules (auth, user, counter)
            └── routers/        # Route mounting
```

---

## 📊 Current Progress

| Phase | Name | Status |
|---|---|---|
| 1 | Core Backend & Data Layer | 🔴 Not Started |
| 2 | Frontend-Backend Integration | 🔴 Not Started |
| 3 | Real-time Features | 🔴 Not Started |
| 4 | AI Symptom Checker | 🔴 Not Started |
| 5 | Payments & Subscriptions | 🔴 Not Started |
| 6 | Doctor & Admin Panels | 🔴 Not Started |
| 7 | Communication & Notifications | 🔴 Not Started |
| 8 | European Market Readiness | 🔴 Not Started |
| 9 | DevOps & Deployment | 🔴 Not Started |
| 10 | Testing & Quality | 🔴 Not Started |

**Overall: ~30-35% complete** — Auth + UI foundation done, backend features and integration pending.

---

## 🎯 Key Features (Planned)

- 🔐 **Authentication** — JWT with refresh tokens, Google OAuth, role-based access
- 🤖 **AI Symptom Checker** — OpenAI-powered health assessment
- 📅 **Appointments** — Book, manage, cancel with real-time availability
- 💬 **Real-time Chat** — Patient ↔ Doctor messaging with Socket.io
- 📹 **Video Calls** — WebRTC-based consultations
- 💳 **Payments** — Stripe subscriptions and consultation fees
- 📊 **Analytics** — Health dashboards for patients, revenue for doctors
- 🌍 **Multi-language** — EN, DE, FR, ES, PL for European market
- 🔒 **GDPR Compliant** — Privacy-first design

---

## 📝 Development Guidelines

1. **Read `PROJECT_ROADMAP.md`** before starting any work
2. **Follow the module pattern** for backend features (5-file structure)
3. **Use existing conventions** — match the project's patterns exactly
4. **Update the roadmap** when completing features (check the boxes)
5. **Never commit secrets** — `.env` files are gitignored
6. **Test before committing** — lint, build, verify both themes

---

## 📄 License

Private — All rights reserved.
