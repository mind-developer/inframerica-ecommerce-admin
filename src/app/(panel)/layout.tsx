import { Suspense, type ReactNode } from 'react';
import { AccessProvider } from '@/components/layout/admin/AccessProvider';
import { AdminShell } from '@/components/layout/admin/AdminShell';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireAdmin } from '@/features/auth/server';

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PanelAccess>{children}</PanelAccess>
    </Suspense>
  );
}

async function PanelAccess({ children }: { children: ReactNode }) {
  const { permissions } = await requireAdmin();
  return (
    <AccessProvider permissions={permissions}>
      <AdminShell>{children}</AdminShell>
    </AccessProvider>
  );
}
