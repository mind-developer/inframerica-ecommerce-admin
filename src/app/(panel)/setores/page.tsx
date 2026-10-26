import type { Metadata } from 'next';
import { SectorsPage } from '@/features/sectors/server';

export const metadata: Metadata = { title: 'Setores' };

export default function Page() {
  return <SectorsPage />;
}
