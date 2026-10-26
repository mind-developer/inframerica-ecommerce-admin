import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireAdmin } from '@/features/auth/server';
import { getSectors } from '@/features/sectors/server';
import { AdminUsersView } from '../components/AdminUsersView';
import { getAdminUsers } from '../data/adminUsers';

export function AdminUsersPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AdminUsersContent />
    </Suspense>
  );
}

async function AdminUsersContent() {
  await requireAdmin();
  const [users, sectors] = await Promise.all([getAdminUsers(), getSectors()]);
  return <AdminUsersView users={users} sectors={sectors} />;
}
