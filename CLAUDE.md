# CLAUDE.md — inframerica-ecommerce-admin

@AGENTS.md

Admin panel of **SkyPass / Inframérica**: the back office of the airport-services e-commerce (training courses, credentialing, VIP lounge) for Brasília airport. The team manages the catalog (courses, credentials, sectors), sales (orders, customers, coupons, payment links), cohorts and their people, site content (texts, banners), store settings and admin users. The dashboard summarizes revenue with charts.

The storefront is a separate app: `../inframerica-ecommerce`. Visual and behavioural reference: the prototype `../remix-of-infra-america-skypass` (its `docs/` explain every flow and rule; admin screens live in `src/pages/admin`).

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript (strict, `noUncheckedIndexedAccess`); pnpm
- **Cache Components** (`cacheComponents` + `partialPrefetching`): readers are cached with `'use cache'` + `cacheTag` + `cacheLife`, but only read after `requireAdmin()` inside `<Suspense>`, so no admin data lands in the static shell
- **Mutations:** Server Actions wrapped in `adminMutation(tags, run, storefrontTags?)`: checks the session, runs the service, `updateTag(...)` here and, for public data, notifies the storefront (`POST {STOREFRONT_URL}/api/revalidate`)
- **URL state:** nuqs (filters, searches, tabs, the open record: `?id=`, `?pedido=`, `?editar=`, `?aba=`)
- **Client state:** Zustand only for the toast store. Server data never goes in a store.
- **Forms:** TanStack Form (`useAppForm`/`withForm` from `components/ui/form`, `FormModal` for modal forms) + Zod
- **Charts:** shadcn Charts (`components/ui/chart.tsx`, generated, Recharts) themed with the `--chart-*`/navy tokens
- **Styling:** Tailwind v4 mapped to tokens (`src/styles/tokens.css`); Tailwind's default palette is removed
- **UI:** our own primitives in `components/ui` (native `<dialog>`, `<details>`, `<select>`); shadcn only for charts. Icons: lucide-react
- **Tests:** Vitest + Testing Library, `*.test.ts(x)` next to the code. TDD: write or port the test first.

## Commands

`pnpm dev` (port 3001 via `.claude/launch.json`) · `pnpm build` · `pnpm typecheck` · `pnpm lint` · `pnpm format` · `pnpm test` / `pnpm test:watch`

Sign-in needs the API running (`../inframerica-ecommerce-api`, port 3333). Demo admin (API seed): `admin@inframerica.com` / `123456`. **Provisional:** the API checks the e-mail/password, then the panel keeps its own signed session cookie and reads "still active" from the mock admin users. The client uses Microsoft SSO, which replaces this whole flow (`services/adminAuth.service.ts`).

## Structure

```
src/
  app/                 # routes only: login + (panel)/ group (dashboard, pedidos, clientes, cursos, turmas, ...)
  core/                # wiring: Providers (nuqs, toasts), fonts, metadata
  features/<domain>/   # auth, dashboard, orders, customers, courses, cohorts, coupons, payment-links,
                       # credentials, sectors, admin-users, site-content, settings
    pages/             #   composition (Suspense + requireAdmin + data)
    components/        #   one component per file
    data/              #   'use cache' readers (server-only)
    actions/           #   'use server' actions (tested)
    hooks/ schemas/ utils/
    index.ts           #   client-safe public surface
    server.ts          #   server-only public surface (pages, data)
  components/ui/       # primitives: no domain, no data (form kit in ui/form, shadcn chart.tsx)
  components/layout/   # admin shell (sidebar, nav, top bar)
  services/            # the "API client": <domain>.service.ts over services/mock (in-memory, server-only)
  mocks/               # seed data, temporary (deleted when the API ships)
  domain/              # pure business rules (enrollment deadlines, coupons, order courses, sales report CSV)
  hooks/ utils/ constants/ types/ styles/ test/   # generic, shared
  proxy.ts             # optimistic guard: everything but /login needs the admin cookie
```

Enforced by ESLint (`pnpm lint` fails):

- **File size:** warn above 150 lines, error above 250 (blank lines and comments not counted); functions warn above 80. Mocks, constants, tests and the generated `chart.tsx` exempt. Split: sections → components (`withForm` for form sections), logic → hooks/utils, tables → `.ts`.
- **Imports** (`eslint-plugin-boundaries`): app → core, features, layout, ui, shared · core → features, ui, services, shared · layout → features, ui, shared · features → ui, services, shared, other features only through `index.ts`/`server.ts` · ui → shared · services → mocks, shared · shared → shared. Tests may import anything.

## Data and caching

- Flow: server component → feature `data/` (`'use cache'`) or action → `services/<domain>.service.ts` → `services/mock` (until the API exists; see the prototype's `docs/API_CONTRATO.md`).
- Tags live in `constants/cacheTags.ts`. Orders and enrollments use `cacheLife('minutes')` (they change from the store); catalog and settings use hours/days.
- Never call `cookies()`/`connection()` inside `'use cache'`. Every page renders `requireAdmin()` + data inside `<Suspense>`; the build fails otherwise (blocking route).
- The mock store is per process: edits here don't reach the storefront's mock until both talk to the API. The revalidate webhook is wired for when they do.

## Hard rules

1. **Every action re-checks the session** (`adminMutation` / `requireAdmin`); the proxy is only an optimistic redirect.
2. **Enrollment rules are shared:** `domain/enrollmentRules.ts` is identical in both apps (15-day link window, 7-day cancellation, 7 days before an in-person cohort, 3-month credit). Change both copies together, with tests. The UI shows the block reason up front; the action enforces it again.
3. **Justification is mandatory** for cancelling an order and for linking/unlinking a credit (action-enforced).
4. **A2 is open:** the admin's `Order`/`Enrollment` model is separate from the customer area's (`AccountOrder`/`Seat`/`Person`). Students are matched to orders by customer name (`domain/orderCourses.ts`) because `Enrollment` has no `customerId` yet.
5. **Order amount semantics (prototype item 7):** the sales report reads `Order.amount` as net; the orders KPI labels the same sum "Valor bruto". Decide with the API contract.
6. **Locale:** UI text pt-BR; code and domain names in English. Money via `formatBRL` (`formatBRLWhole` for KPI tiles); dates `dd/MM/yyyy` in `America/Sao_Paulo` (`utils/format.ts`, `utils/civilDate.ts`). Labels in `constants/labels.ts`.
7. **Open product rules** show `<PendingRuleBadge>` ("Regra em definição") instead of inventing behaviour.
8. **Mocked integrations stay visibly mocked:** invoice/billing flags on orders, BI token, auto-cancel job, synthetic report rows.
9. **Accessibility:** semantic HTML, labels on icon buttons, visible focus, no hover-only interaction, `prefers-reduced-motion`.
10. Components never `fetch`; they use actions or server data.

## Project memory

Decisions and context live in the Obsidian vault: `~/workspace/obsidian/morandim-vault/wiki/projects/inframerica/` (brief, ADRs). Sprints will be added there.
