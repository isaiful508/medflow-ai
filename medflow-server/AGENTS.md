# AGENTS.md — MedFlow AI Server

This file guides AI coding agents (Claude Code, Cursor, etc.) working on the MedFlow AI server. It describes **what to do** and **how to do it** in this codebase.

---

## First Run

1. Copy `.env.example` → `.env` and fill in real values.
2. `npm install`
3. `npm run dev` (starts the dev server with hot reload via `ts-node-dev`)

---

## Project Overview

MedFlow AI is a healthcare platform backend built with **Express.js 5**, **TypeScript**, **MongoDB/Mongoose**, and **JWT authentication**. It supports three user roles: `patient`, `doctor`, and `admin`.

### Key Dependencies

| Package | Purpose |
|---|---|
| `express` (v5) | HTTP framework |
| `mongoose` (v8) | MongoDB ODM |
| `zod` (v3) | Request validation |
| `jsonwebtoken` (v9) | JWT auth (access + refresh tokens) |
| `bcrypt` (v5) | Password hashing |
| `http-status` / `http-status-codes` | HTTP status code constants |
| `cors` | CORS middleware |
| `stripe` (v18) | Payment processing (installed, not yet integrated) |
| `dotenv` | Environment variable loading |

---

## Directory Structure

```
src/
├── server.ts                  # Entry point: connects to MongoDB, starts Express
├── app.ts                     # Express app setup (middleware, routes, error handler)
└── app/
    ├── config/
    │   └── index.ts           # Loads .env and exports config object
    ├── errors/
    │   └── AppError.ts        # Custom error class with statusCode
    ├── middlewares/
    │   ├── auth.ts            # JWT auth middleware (Bearer token)
    │   └── globalErrorHandler.ts  # Global error handler (Zod + generic)
    ├── modules/
    │   ├── auth/              # Authentication module
    │   │   ├── auth.interface.ts
    │   │   ├── auth.validation.ts
    │   │   ├── auth.controller.ts
    │   │   ├── auth.service.ts
    │   │   └── auth.route.ts
    │   ├── user/              # User model (shared by auth and other modules)
    │   │   ├── user.interface.ts
    │   │   └── user.model.ts
    │   └── counter/           # Auto-increment utility for userId
    │       ├── counter.interface.ts
    │       ├── counter.model.ts
    │       └── counter.utils.ts
    └── routers/
        └── index.ts           # Root router — mounts all module routes
```

---

## Architecture & Patterns

### Module Pattern

Every feature module follows a **5-file structure**:

```
module-name/
├── module.interface.ts    # TypeScript types
├── module.validation.ts   # Zod schemas (if input validation needed)
├── module.controller.ts   # Express request handlers
├── module.service.ts      # Business logic
└── module.route.ts        # Express Router with route definitions
```

**When adding a new module**, create all 5 files and mount the route in `src/app/routers/index.ts`.

### Layered Request Flow

```
Request → Route → Controller → Service → Model (Mongoose)
                         ↓
                    Validation (Zod) happens in controller before service call
```

- **Controller**: Validates input with Zod, calls service, sends response. Uses `try/catch` with `next(error)`.
- **Service**: Pure business logic. Throws `AppError` for known errors. No Express types.
- **Model**: Mongoose schema + model. Interface file defines the TypeScript type.

### Error Handling

- **Custom errors**: Always throw `AppError(statusCode, message)` from services.
- **Zod validation errors**: Caught automatically by `globalErrorHandler` → returns 400 with field-level details.
- **Generic errors**: Caught by `globalErrorHandler` → returns statusCode or 500.
- **Controller pattern**: Wrap handler logic in `try/catch` and call `next(error)`.

### Validation

- All request bodies are validated with **Zod schemas** defined in `*.validation.ts`.
- Validation is called in the **controller** via `schema.parse(req.body)`.
- Zod errors are handled globally — do **not** catch Zod errors manually in controllers.

### Authentication

- **Access token**: Short-lived JWT (default 7d), sent as `Bearer <token>` in `Authorization` header.
- **Refresh token**: Long-lived JWT (default 30d), stored in user document, used to get new access tokens.
- **Auth middleware**: `src/app/middlewares/auth.ts` — verifies Bearer token, attaches `req.user`.
- **Protected routes**: Add `auth` middleware in the route file: `router.get("/profile", auth, Controller.handler)`.

### Response Format

All responses follow this structure:

```json
// Success
{ "success": true, "message": "...", "data": {...} }

// Error
{ "success": false, "message": "...", "errors": [...] }  // Zod validation
{ "success": false, "message": "..." }                     // Generic error
```

---

## Environment Variables

Defined in `src/app/config/index.ts`. All are read from `.env`:

| Variable | Default | Description |
|---|---|---|
| `PORT` | — | Server port |
| `DATABASE_URL` | — | MongoDB connection string |
| `JWT_SECRET` | — | JWT signing secret |
| `JWT_EXPIRE` | `7d` | Access token expiry |
| `JWT_REFRESH_SECRET` | — | Refresh token signing secret |
| `JWT_REFRESH_EXPIRE` | `30d` | Refresh token expiry |
| `BCRYPT_SALT_ROUNDS` | `10` | Bcrypt salt rounds |

Additional env vars in `.env.example` (for future features): `OPENAI_API_KEY`, `REDIS_URL`, `EMAIL_*`, `TURN_*`, `FILE_UPLOAD_PATH`, `RATE_LIMIT_*`, `ALLOWED_ORIGINS`.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run prod` | Run compiled JS from `dist/` |
| `npm run lint` | Run ESLint on `src/` |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format with Prettier |

---

## Code Style

- **TypeScript strict mode** is enabled.
- **Single quotes** (Prettier config).
- **Semicolons** required (Prettier config).
- **ESLint rules**: `no-unused-vars: error`, `no-unused-expressions: error`, `prefer-const: error`, `no-console: warn`, `no-undef: error`.
- **CommonJS** module output (`"module": "commonjs"` in tsconfig).
- **Target**: ES2016.

---

## Adding a New Module (Step-by-Step)

1. Create the directory: `src/app/modules/<feature>/`
2. Define interfaces in `<feature>.interface.ts`
3. Define Zod schemas in `<feature>.validation.ts`
4. Create the Mongoose model in `<feature>.model.ts` (if needed)
5. Implement business logic in `<feature>.service.ts`
6. Create controllers in `<feature>.controller.ts` (validate with Zod, call service, respond)
7. Define routes in `<feature>.route.ts`
8. Mount the route in `src/app/routers/index.ts`

---

## MongoDB Patterns

- **Auto-incrementing IDs**: Use the counter utility (`counter/utils.ts`) for sequential numeric IDs. The `userId` field uses this pattern.
- **Sensitive fields**: Use `select: false` in schema for fields like `password` and `refreshToken`. Explicitly `.select("+password")` when needed.
- **Timestamps**: Enabled via `{ timestamps: true }` in schema options.
- **Version key**: Disabled via `{ versionKey: false }`.

---

## Security Notes

- Passwords are hashed with bcrypt before storage.
- JWT secrets must be strong and unique in production.
- The `.env` file is gitignored — never commit secrets.
- CORS is configured for `http://localhost:3000` — update `app.ts` for production origins.
- Rate limiting env vars are defined but not yet implemented.
