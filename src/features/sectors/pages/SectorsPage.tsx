import { createLoader, type SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireScreen } from '@/features/auth/server';
import { getCourses } from '@/features/courses/server';
import { listSectorPage } from '@/services/sectors.service';
import { SectorsView } from '../components/SectorsView';
import { sectorListParams } from '../utils/sectorListParams';

const loadParams = createLoader(sectorListParams);

export function SectorsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SectorsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SectorsContent({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireScreen('sectors');
  const params = await loadParams(searchParams);
  const [sectors, courses] = await Promise.all([listSectorPage(params), getCourses()]);
  const courseCountBySector = courses.reduce<Record<string, number>>(
    (acc, c) => ({ ...acc, [c.sectorId]: (acc[c.sectorId] ?? 0) + 1 }),
    {},
  );
  return <SectorsView result={sectors} courseCountBySector={courseCountBySector} />;
}
