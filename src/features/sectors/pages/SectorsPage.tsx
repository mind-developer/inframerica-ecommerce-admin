import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireAdmin } from '@/features/auth/server';
import { getCourses } from '@/features/courses/server';
import { SectorsView } from '../components/SectorsView';
import { getSectors } from '../data/sectors';

export function SectorsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SectorsContent />
    </Suspense>
  );
}

async function SectorsContent() {
  await requireAdmin();
  const [sectors, courses] = await Promise.all([getSectors(), getCourses()]);
  const courseCountBySector = courses.reduce<Record<string, number>>(
    (acc, c) => ({ ...acc, [c.sectorId]: (acc[c.sectorId] ?? 0) + 1 }),
    {},
  );
  return <SectorsView sectors={sectors} courseCountBySector={courseCountBySector} />;
}
