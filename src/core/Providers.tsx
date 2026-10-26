'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toast';

/** Client-side wiring shared by every route: URL state (nuqs) and toasts. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      {children}
      <Toaster />
    </NuqsAdapter>
  );
}
