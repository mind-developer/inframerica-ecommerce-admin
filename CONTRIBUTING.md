# Contributing

## Conventions

### Lint and formatting

`pnpm lint` runs **ESLint**, which also enforces the layer boundaries (`eslint-plugin-boundaries`) and the size limits: files warn above 150 lines and fail above 250, functions warn above 80 (blank lines and comments not counted; mocks, constants and tests exempt). `pnpm format` runs **Prettier** with Tailwind class sorting.

Code that fails lint, typecheck or tests doesn't go to `main`.

### Naming

- **Code in English, UI in Portuguese (pt-BR).** Identifiers, files, comments and commit messages are English; every text the user reads is pt-BR.
- Files: `PascalCase.tsx` for components, `camelCase.ts` for the rest, `kebab-case` in the API (`admin-customers.service.ts`). Tests sit next to the code: `*.test.ts(x)` (API e2e: `test/**/*.e2e-spec.ts`).
- Types and components `PascalCase`, functions and variables `camelCase`, constants `UPPER_SNAKE_CASE`. Database columns `snake_case`.
- Routes and URLs in Portuguese (`/clientes`, `/setores`); API resources in English (`/admin/customers`).

### Layout

`src/app/` holds routes only; each domain lives in `src/features/<domain>/` (`pages/`, `components/`, `data/`, `actions/`, `schemas/`…) and other features import it only through its `index.ts` (client) or `server.ts` (server). Primitives in `src/components/ui/`, pure rules in `src/domain/`. Details in [`CLAUDE.md`](CLAUDE.md).

### Commits

```
[TASK-n] type(scope): what changed, in the imperative
```

- `[TASK-n]` is the card number on the hub (card #49 → `[TASK-49]`). Pushing a commit with it moves the card, so put it first.
- `type`: `feat`, `fix`, `refactor`, `test`, `docs`, `ci`, `chore`. `scope`: the feature or module (`auth`, `sectors`, `customers`…).
- One task per commit when possible; the body explains _why_ when the diff doesn't.
