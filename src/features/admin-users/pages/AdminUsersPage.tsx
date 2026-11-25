import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireScreen } from '@/features/auth/server';
import { getSectors } from '@/features/sectors/server';
import { listProfileOptions } from '@/services/access.service';
import { getLoginMethods } from '@/services/adminAuth.service';
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
  await requireScreen('users');
  const [users, sectors, profiles, methods] = await Promise.all([
    getAdminUsers(),
    getSectors(),
    listProfileOptions(),
    getLoginMethods(),
  ]);
  return <AdminUsersView users={users} sectors={sectors} profiles={profiles} methods={methods} />;
}
