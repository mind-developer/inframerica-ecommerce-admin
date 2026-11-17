# Production image (admin). Build: docker build -t inframerica-admin .
# Runtime config comes only from environment variables; no .env file is copied.

FROM node:26-slim AS build
WORKDIR /app
# Node 25+ ships without Corepack: install the pnpm version pinned in package.json.
RUN npm install -g pnpm@11.3.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Inlined at build time: the storefront address shown in admin links.
ARG NEXT_PUBLIC_STOREFRONT_URL=http://localhost:3000
ENV NEXT_PUBLIC_STOREFRONT_URL=$NEXT_PUBLIC_STOREFRONT_URL
RUN pnpm build

FROM node:26-slim
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3001
WORKDIR /app
# output: 'standalone' plus the static assets server.js serves by itself.
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3001
CMD ["node", "server.js"]
