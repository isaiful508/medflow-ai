# AGENTS.md — MedflowAI Client

## Agent Guidelines

### First Run

On the first interaction, read `CLAUDE.md` and `PROJECT_ROADMAP.md` (in project root) to understand the project, its current phase, and what features are next. Do not ask the user to repeat information that is already in these files.

### Roadmap Awareness

- **Always** check `PROJECT_ROADMAP.md` before starting work to understand current phase priorities
- **Update** `PROJECT_ROADMAP.md` feature tracking checkboxes when completing features
- **Follow** the phase order — don't jump ahead to later phases without completing earlier ones
- **Reference** the roadmap's architecture section when adding new modules or components

### Before Every Task

1. **Understand the scope** — read relevant files before making changes
2. **Follow existing patterns** — match the project's conventions exactly
3. **Minimize changes** — only touch files necessary for the task
4. **Preserve theming** — all new UI must support dark/light themes

### Working Rules

- **Never** introduce new state management libraries (use React Context + `useState`)
- **Never** add new CSS frameworks or styling approaches (use Tailwind + CSS variables)
- **Never** change the routing pattern (client-side screen switching in `DashboardShell`)
- **Always** add `"use client"` to interactive components
- **Always** use `cn()` for class merging
- **Always** use existing shared UI components from `components/shared/ui-helpers.tsx`
- **Always** define Zod schemas for new forms in `lib/validations/`
- **Always** co-locate types with their data in `lib/medflow-ai-data.ts` for static data

### File Creation Patterns

| Need | Location |
|---|---|
| New dashboard screen | `components/modules/dashboard/<name>-screen.tsx` |
| New auth component | `components/modules/auth/<name>/index.tsx` |
| New shared UI component | `components/shared/ui-helpers.tsx` |
| New base UI component | `components/ui/<name>.tsx` |
| New validation schema | `lib/validations/<domain>.ts` |
| New service (Server Action) | `service/<Name>/index.ts` |
| New context | `context/<Name>Context.tsx` |
| New types | `types/index.ts` or co-locate with feature |

### Adding a New Dashboard Screen

1. Add the screen ID to the `ScreenId` type in `lib/medflow-ai-data.ts`
2. Add the nav item to `navItems` in `lib/medflow-ai-data.ts`
3. Add the icon mapping to `navIcons` in `components/app-sidebar.tsx`
4. Create the screen component in `components/modules/dashboard/<name>-screen.tsx`
5. Add the screen rendering in `dashboard-shell.tsx` (import + conditional render)
6. Add any necessary state to `DashboardShell` and pass it as props

### Adding a New Auth Flow

1. Add Zod schema to `lib/validations/auth.ts`
2. Add Server Action to `service/AuthService/index.ts`
3. Create form component in `components/modules/auth/<name>/index.tsx`
4. Create page in `app/<name>/page.tsx`

### Theme Support Checklist

When creating new UI components, ensure:
- [ ] Uses CSS variable-based colors (not hardcoded hex/rgba)
- [ ] Backgrounds use `--mc-*` variables or Tailwind theme tokens
- [ ] Text uses `text-white/##` with `.medflow-ai-shell` parent or theme tokens
- [ ] Borders use `border-white/10` or `var(--mc-border)`
- [ ] Cards use `GlassCard` or follow the `medflow-ai-card` pattern
- [ ] Tested in both dark and light themes

### Code Style

- Use TypeScript strict mode (already configured)
- Use `type` over `interface` for new types (project uses both; follow local convention)
- Use named exports for components
- Use default exports only for page-level components
- Keep components under 200 lines; split into sub-components if needed
- Use `React.ComponentProps<"element">` for prop inheritance

### Testing Changes

- Run `npm run lint` before committing
- Verify the app builds with `npm run build`
- Test in both dark and light themes
- Test responsive behavior (sidebar collapses on mobile)

### What NOT to Do

- Don't modify `node_modules` or `package-lock.json` directly
- Don't commit `.env` files
- Don't add `any` types — use proper typing
- Don't use inline styles unless absolutely necessary (use Tailwind)
- Don't bypass the theme system with hardcoded colors
- Don't add runtime dependencies without user approval
