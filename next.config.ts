import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Cache Components + Partial Prefetching (ADR-0005): data is cached with `'use cache'` + `cacheTag`,
  // request-time reads (session, cart) stream behind <Suspense>.
  cacheComponents: true,
  partialPrefetching: true,
  typedRoutes: true,
  turbopack: {
    rules: {
      '*.css': { loaders: ['@tailwindcss/turbopack'], as: '*.css' },
    },
  },
};

export default nextConfig;
