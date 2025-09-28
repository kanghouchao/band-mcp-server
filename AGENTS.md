# Repository Guidelines

## Project Structure & Module Organization
Application code lives in `src/`, grouped by Band API feature folders (e.g., `posts/`, `writeComment/`) that surface `ToolDefinition` exports to `src/tools.ts`. Shared helpers reside in `src/pagination`, `src/config.ts`, and `src/types/`, while Jest specs sit in `src/__tests__/` and release automation in `specs/`. Build output lands in `dist/`, and the CLI wrapper `bin/band-mcp-server` boots the compiled server; keep feature-specific fixtures next to the handler they exercise.

## Build, Test, and Development Commands
- `npm run build` / `make build` — compile TypeScript with `tsc` into `dist/`.
- `npm run dev` (`make dev`) — watch `src/index.ts` with `tsx` for local iteration.
- `npm test` — run the Jest suite; `npm run test:watch` keeps it hot while developing.
- `npm run lint` / `npm run lint:fix` — enforce ESLint rules before review.
- `make docker-build` / `make docker-run` — produce and validate the production image with `BAND_ACCESS_TOKEN` injected.

## Coding Style & Naming Conventions
Code is strict TypeScript targeting ES2022 modules; rely on two-space indentation and keep exports named to mirror the Band capability (e.g., `removePost.handleToolCall`). DTOs and schema types belong in `types/`, and shared pagination utilities stay centralized to avoid drift. Run the linter prior to commits and keep `zod` validations adjacent to their handlers so errors remain localized.

## Testing Guidelines
Jest with `ts-jest` powers the unit tests; keep files in `src/__tests__/` using the `<feature>.<behavior>.test.ts` pattern such as `pagination.adapter.test.ts`. Mock axios calls to avoid live Band traffic and cover success, validation, and error paths whenever introducing or changing a tool handler. Execute `npm test` (or `npm run test:watch`) before pushing and add regression cases when triaging bugs.

## Commit & Pull Request Guidelines
Recent history favors `<type>: summary (#issue)` subjects (`feat: pagination adapter + ...`), optionally mixing languages; stick to imperative mood and keep commits scoped. PRs should describe the Band surface area touched, list manual verification steps (CLI, Docker, or tests), and link the relevant issue. Include screenshots only when the change affects human-facing output or logs.

## Security & Configuration Tips
Never commit secrets or `.env` files; set `BAND_ACCESS_TOKEN` via the shell when running `npm run dev` or Docker targets. Trim sensitive payloads from logs and confirm any new configuration defaults are documented in `README.md` before release.
