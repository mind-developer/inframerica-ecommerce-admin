import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireScreen } from '@/features/auth/server';
import { listProfiles } from '@/services/access.service';
import { PermissionsView } from '../components/PermissionsView';

export function PermissionsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PermissionsContent />
    </Suspense>
  );
}

async function PermissionsContent() {
  const admin = await requireScreen('permissions');
  return <PermissionsView profiles={await listProfiles()} held={admin.permissions} ownProfileId={admin.profile?.id} />;
}
