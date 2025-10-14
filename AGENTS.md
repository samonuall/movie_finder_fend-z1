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
