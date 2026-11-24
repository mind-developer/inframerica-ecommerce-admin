import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireScreen } from '@/features/auth/server';
import { getCourses } from '@/features/courses/server';
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
  const [credentials, sectors, courses] = await Promise.all([getCredentials(), getSectors(), getCourses()]);
  const coursesByCredential = Object.fromEntries(
    credentials.map((c) => [c.id, courses.filter((k) => k.credentialIds.includes(c.id)).length]),
  );
  return <CredentialsView credentials={credentials} sectors={sectors} coursesByCredential={coursesByCredential} />;
}
