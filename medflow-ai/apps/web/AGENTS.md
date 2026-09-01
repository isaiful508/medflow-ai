# AGENTS.md — MedflowAI Client

## Agent Guidelines

### First Run

1. Read `CLAUDE.md` and `PROJECT_ROADMAP.md` first.
2. Confirm the current frontend route structure and auth flow before making changes.
3. Only update docs and code paths that match the client app structure.

### Roadmap Awareness

- Always consult `PROJECT_ROADMAP.md` to understand phase priorities.
- Update the roadmap when completing features or adding new modules.
- Avoid implementing later-phase features before earlier-phase backend integration is complete.

### Before Every Task

1. Understand the current route structure in `app/`.
2. Keep changes limited to the relevant feature area.
3. Preserve theme support in every UI update.
4. Prefer small, incremental changes over large refactors.

### Working Rules

- Do not introduce new state management libraries. Use React Context + `useState`.
- Do not add new CSS frameworks or styling approaches. Use Tailwind + CSS variables.
- Do not change the existing routing pattern. The dashboard uses `app/(dashboard)/` pages.
- Add `"use client"` to every interactive component.
- Use `cn()` for class name merging.
- Use existing shared UI components from `components/shared/ui-helpers.tsx`.
- Define Zod schemas for forms in `lib/validations/`.
- Co-locate static data and types in `lib/medflow-ai-data.ts`.

### File Creation Patterns

| Need | Location |
|---|---|
| New dashboard screen | `components/modules/dashboard/<name>-screen.tsx` |
| New auth component | `components/modules/auth/<name>/index.tsx` |
| New shared UI component | `components/shared/ui-helpers.tsx` |
| New base UI component | `components/ui/<name>.tsx` |
| New validation schema | `lib/validations/<domain>.ts` |
| New Server Action | `service/<Name>/index.ts` |
| New context | `context/<Name>Context.tsx` |
| New types | `types/index.ts` or co-locate with feature |

### Adding a New Dashboard Page

1. Create `app/(dashboard)/<page>/page.tsx` for the new route.
2. Create the screen component in `components/modules/dashboard/<name>-screen.tsx`.
3. Add the page route to `navItems` in `lib/medflow-ai-data.ts` if it should appear in navigation.
4. Add the page title to the `DashboardLayout` route tracking logic in `app/(dashboard)/layout.tsx` if necessary.
5. Keep page state local unless shared state is required.

### Adding a New Auth Flow

1. Add Zod schema to `lib/validations/auth.ts`.
2. Add Server Action to `service/AuthService/index.ts`.
3. Create the auth form component in `components/modules/auth/<name>/index.tsx`.
4. Create the page in `app/<name>/page.tsx`.

### Theme Support Checklist

- [ ] Use CSS variable-based colors, not hardcoded hex/rgba.
- [ ] Prefer theme-aware Tailwind utilities.
- [ ] Use `GlassCard` or consistent card styles.
- [ ] Validate the UI in both dark and light themes.
- [ ] Preserve layout spacing and responsiveness.

### Code Style

- Use TypeScript strict mode.
- Prefer named exports for components.
- Use default exports only for page-level components.
- Keep components under 200 lines where possible.
- Use `React.ComponentProps<"element">` for prop inheritance when needed.

### Testing Changes

- Run `npm run lint` before committing.
- Verify the frontend builds with `npm run build`.
- Test dark and light themes.
- Test responsiveness across mobile and desktop layouts.

### What NOT to Do

- Do not modify `node_modules` or `package-lock.json` directly.
- Do not commit `.env` files.
- Do not use `any` types.
- Do not use inline styles unless absolutely necessary.
- Do not introduce new runtime dependencies without approval.
- Do not change the app route pattern or dashboard layout without a strong reason.
