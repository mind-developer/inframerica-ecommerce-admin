import type { Metadata } from 'next';
import type { SearchParams } from 'nuqs/server';
import { SectorsPage } from '@/features/sectors/server';

export const metadata: Metadata = { title: 'Setores' };

export default function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <SectorsPage searchParams={searchParams} />;
}
