import type { Metadata } from 'next';
import { CohortPeoplePage } from '@/features/cohorts/server';

export const metadata: Metadata = { title: 'Pessoas da turma' };

export default function Page({ params }: PageProps<'/turmas/[id]/pessoas'>) {
  return <CohortPeoplePage params={params} />;
}
