import type { Metadata } from 'next';
import { CohortsPage } from '@/features/cohorts/server';

export const metadata: Metadata = { title: 'Turmas' };

export default function Page() {
  return <CohortsPage />;
}
