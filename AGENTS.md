# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router routes, handlers, and layouts; keep feature logic within the owning segment.
- `components/`: Shared UI built on shadcn/Radix primitives plus `components/ui` atoms; keep client components composable.
- `lib/`: Supabase helpers, data shapers, and external API utilities; isolate side effects here.
- `__tests__/`: Jest suites mirroring `app/` and `lib/`; store reusable mocks inside `__tests__/__mocks__`.
- `public/` holds static assets, `styles/` carries Tailwind extensions, and reports sit in `coverage/`—do not commit them.

## Build, Test, and Development Commands
- `pnpm dev`: Start the server at `http://localhost:3000` with hot reload.
- `pnpm build`: Produce a production bundle; run before tagging releases.
- `pnpm start`: Serve the latest build for smoke tests.
- `pnpm lint`: Run ESLint with the Next.js config; add `--fix` to resolve formatting.
- `pnpm test`, `pnpm test:watch`, `pnpm test:coverage`: Run Jest once, in watch mode, or with coverage.

## Coding Style & Naming Conventions
- TypeScript with React function components; choose server components unless interactivity demands `use client`.
- Prettier + ESLint enforce two-space indentation, consistent quotes, and Tailwind class ordering through lint-staged.
- Use kebab-case for route folders, PascalCase for component files, and suffix hooks/utilities with `.ts`.
- Export one default component per UI file; keep supporting helpers as named exports in `lib/`.

## Testing Guidelines
- Write tests with `@testing-library/react` and Jest; share mocks via `__tests__/__mocks__`.
- Name files `*.test.ts` or `*.test.tsx` and mirror the source directory to keep imports predictable.
- Review `coverage/lcov-report/index.html` and protect key flows (auth gating, infinite scroll, query caching) before merging.
- Run `pnpm test:watch` during feature work and gate pull requests with `pnpm test`.

## Commit & Pull Request Guidelines
- Follow the concise, imperative commit voice shown in history (`add observer`, `change tests to work with react query`).
- Keep commits focused, and run `pnpm lint` plus relevant tests before staging.
- Husky and lint-staged reformat staged `*.ts/tsx`; let the hook finish rather than bypassing it.
- Pull requests should explain user impact, list verification steps (commands run, UI evidence), and link related issues or Supabase changes.

## Environment & Security Notes
- Store secrets in `.env.local`; never commit Supabase keys or TMDB tokens.
- Document new `NEXT_PUBLIC_*` variables in the PR body and provide safe defaults in `.env.example`.
- Updates touching auth must be validated against `middleware.ts` to ensure protected routes remain guarded.

## MCP Tooling
- Use the Supabase MCP server for schema intel: call `supabase__list_projects` to locate the project ID, then `supabase__list_tables` (and, when needed, `supabase__execute_sql`) to inspect tables, columns, policies, and sample data without touching app code.
- Run read-only queries first; keep track of the project ID (`.env.local` mirrors it) so you do not query the wrong instance.
- Prefer MCP requests over ad-hoc SQL files; summarize findings in responses rather than copying raw JSON.

## Chrome DevTools MCP
- After `pnpm dev`, attach via the Chrome DevTools MCP server to audit the running site: use `chrome-devtools__take_snapshot` for DOM diffs, `chrome-devtools__list_console_messages` to confirm clean logs, and `chrome-devtools__performance_start_trace`/`__performance_stop_trace` for Core Web Vitals insights.
- Capture console output before and after your change; surface new warnings or errors in code reviews.
- For regressions, combine screenshots (`chrome-devtools__take_screenshot`) and performance traces with the relevant code diff so reviewers can verify quickly.
