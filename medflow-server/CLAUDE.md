# CLAUDE.md — MedFlow AI Server

> **Project Roadmap:** See [`PROJECT_ROADMAP.md`](../../PROJECT_ROADMAP.md) for the full development plan, feature tracking, and phase progress. Update the roadmap when completing features.

> **Self-update rule:** Whenever you add, remove, or modify modules, dependencies, environment variables, architectural patterns, or project structure, you MUST update this file and `AGENTS.md` to reflect the changes. These files are the single source of truth for project documentation.

---

## Project Summary

**MedFlow AI** — Healthcare platform backend. Express.js 5 + TypeScript + MongoDB/Mongoose + JWT auth. Three roles: `patient`, `doctor`, `admin`.

## Quick Start

```bash
cp .env.example .env    # fill in real values
npm install
npm run dev             # hot-reload dev server
```

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js 5 |
| Language | TypeScript (strict, CommonJS, ES2016) |
| Database | MongoDB via Mongoose 8 |
| Auth | JWT (access + refresh) + bcrypt |
| Validation | Zod 3 |
| Payments | Stripe 18 (installed, not yet used) |
| Linting | ESLint 9 + Prettier 3 |

## Directory Structure

```
src/
├── server.ts                     # Entry: MongoDB connect + listen
├── app.ts                        # Express setup (CORS, JSON, routes, error handler)
└── app/
    ├── config/index.ts           # dotenv config exporter
    ├── errors/AppError.ts        # Custom error class (statusCode + message)
    ├── middlewares/
    │   ├── auth.ts               # JWT Bearer token auth middleware
    │   └── globalErrorHandler.ts # Zod + generic error handler
    ├── modules/
    │   ├── auth/                 # Register, login, refresh, logout
    │   │   ├── auth.interface.ts
    │   │   ├── auth.validation.ts
    │   │   ├── auth.controller.ts
    │   │   ├── auth.service.ts
    │   │   └── auth.route.ts
    │   ├── user/                 # User Mongoose model
    │   │   ├── user.interface.ts
    │   │   └── user.model.ts
    │   └── counter/              # Auto-increment sequence utility
    │       ├── counter.interface.ts
    │       ├── counter.model.ts
    │       └── counter.utils.ts
    └── routers/index.ts          # Root router (mounts /auth etc.)
```

## Module Pattern (5-file convention)

Every feature module **must** follow this structure:

```
modules/<feature>/
├── <feature>.interface.ts    # TypeScript types
├── <feature>.validation.ts   # Zod schemas
├── <feature>.controller.ts   # Express handlers (validate → service → respond)
├── <feature>.service.ts      # Business logic (throw AppError)
├── <feature>.route.ts        # Express Router
└── <feature>.model.ts        # Mongoose schema (if DB needed)
```

**To add a new module:** create the 5 files above, then mount the route in `src/app/routers/index.ts`.

## Request Flow

```
Request → Route → Controller (Zod parse) → Service → Mongoose Model
                                   ↓
                            next(error) on failure
                                   ↓
                         globalErrorHandler (Zod + generic)
```

## Key Conventions

### Controllers
- Validate with Zod: `schema.parse(req.body)` at the top of the handler.
- Call service, send `{ success: true, message, data }`.
- Wrap in `try/catch`, call `next(error)` on failure.
- Export as `export const FeatureController = { ... }`.

### Services
- Pure business logic — no Express types (`Request`, `Response`).
- Throw `AppError(statusCode, message)` for known errors.
- Return plain objects or typed data.
- Export as `export const FeatureService = { ... }`.

### Models
- Mongoose schema with `{ timestamps: true, versionKey: false }`.
- Sensitive fields use `select: false`; query with `.select("+fieldName")` when needed.
- Separate interface file exports the TypeScript type and `Model` type.

### Validation
- Zod schemas in `*.validation.ts`.
- Called in controllers via `.parse()` — errors are caught globally.

### Error Handling
- `AppError` extends `Error` with `statusCode`.
- `globalErrorHandler` handles Zod errors (400) and generic errors (statusCode or 500).
- Never catch Zod errors manually in controllers.

### Authentication
- Access token: JWT Bearer, `Authorization: Bearer <token>`.
- Auth middleware: `src/app/middlewares/auth.ts` → sets `req.user`.
- Protect routes: `router.get("/path", auth, Controller.handler)`.

### Response Format
```json
// Success
{ "success": true, "message": "...", "data": {...} }
// Zod Error
{ "success": false, "message": "Validation error", "errors": [{ "path": "...", "message": "..." }] }
// Generic Error
{ "success": false, "message": "..." }
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | — | Server port |
| `DATABASE_URL` | — | MongoDB URI |
| `JWT_SECRET` | — | Access token secret |
| `JWT_EXPIRE` | `7d` | Access token TTL |
| `JWT_REFRESH_SECRET` | — | Refresh token secret |
| `JWT_REFRESH_EXPIRE` | `30d` | Refresh token TTL |
| `BCRYPT_SALT_ROUNDS` | `10` | Bcrypt rounds |

Future env vars (in `.env.example`): `OPENAI_API_KEY`, `REDIS_URL`, `EMAIL_*`, `TURN_*`, `FILE_UPLOAD_PATH`, `RATE_LIMIT_*`, `ALLOWED_ORIGINS`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server with hot reload (`ts-node-dev`) |
| `npm run build` | Compile to `dist/` |
| `npm run prod` | Run compiled `dist/server.js` |
| `npm run lint` | ESLint `src/` |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run format` | Prettier format |

## Code Style

- Single quotes, semicolons (`.prettierrc`).
- Strict TypeScript.
- ESLint: `no-unused-vars: error`, `no-console: warn`, `prefer-const: error`.

## MongoDB Patterns

- **Auto-increment IDs:** Use `getNextSequenceValue(key)` from `counter/utils.ts`.
- **Sensitive fields:** `select: false` in schema, `.select("+field")` in queries.
- **Timestamps:** `{ timestamps: true }`.

## API Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/refresh` | No | Refresh access token |
| POST | `/api/auth/logout` | No | Logout (clear refresh token) |

## Security

- Passwords hashed with bcrypt.
- `.env` is gitignored — never commit secrets.
- CORS: configured for `http://localhost:3000` in `app.ts`.
- Rate limiting: env vars defined, not yet implemented.
