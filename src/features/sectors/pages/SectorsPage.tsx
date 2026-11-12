import { createLoader, type SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { requireScreen } from '@/features/auth/server';
import { getCourses } from '@/features/courses/server';
import { getCredentials } from '@/features/credentials/server';
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
  const [sectors, courses, credentials] = await Promise.all([listSectorPage(params), getCourses(), getCredentials()]);
  const linksBySector = Object.fromEntries(
    sectors.items.map((s) => [
      s.id,
      {
        courses: courses.filter((c) => c.sectorId === s.id).length,
        credentials: credentials.filter((c) => c.sectorIds.includes(s.id)).length,
      },
    ]),
  );
  return <SectorsView result={sectors} linksBySector={linksBySector} />;
}
