import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireScreen } from '@/features/auth/server';
import { getSectors } from '@/features/sectors/server';
import { CredentialsView } from '../components/CredentialsView';
import { getCredentials } from '../data/credentials';

export function CredentialsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CredentialsContent />
    </Suspense>
  );
}

async function CredentialsContent() {
  await requireScreen('credentials');
  const [credentials, sectors] = await Promise.all([getCredentials(), getSectors()]);
  return <CredentialsView credentials={credentials} sectors={sectors} />;
}
