# inframerica-ecommerce-admin

Admin panel of **Inframérica** (Brasília airport services): dashboard with revenue charts, orders (filters, refunds, credit linking, sales report CSV), customers, courses and their public preview, cohorts and enrolled people, coupons, payment links, credentials, sectors, site content and banners, store settings and admin users. Next.js 16 App Router with Cache Components.

Ported from the front-end prototype (`remix-of-infra-america-skypass`). The storefront lives in [`inframerica-ecommerce`](https://github.com/mind-developer/inframerica-ecommerce).

## Getting started

```bash
pnpm install
cp .env.example .env.local   # optional in development
pnpm dev --port 3001          # http://localhost:3001
```

Sign-in needs the API running ([`inframerica-ecommerce-api`](https://github.com/mind-developer/inframerica-ecommerce-api), `pnpm dev` on port 3333). Demo admin `admin@inframerica.com` / `123456` (API seed). Data not yet in the API is an in-memory mock on the server, reset on restart.

## Scripts

| Script                      | What it does                                            |
| --------------------------- | ------------------------------------------------------- |
| `pnpm dev`                  | Development server                                      |
| `pnpm build` / `pnpm start` | Production build / server                               |
| `pnpm test`                 | Vitest (`pnpm test:watch` to watch)                     |
| `pnpm lint`                 | ESLint, including layer boundaries and file-size limits |
| `pnpm typecheck`            | Route types + `tsc`                                     |
| `pnpm format`               | Prettier (with Tailwind class sorting)                  |

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn Charts (Recharts) · nuqs · Zustand · Zod · TanStack Form · Vitest + Testing Library.

Architecture: [`CLAUDE.md`](CLAUDE.md). Conventions and how to contribute: [`CONTRIBUTING.md`](CONTRIBUTING.md).
