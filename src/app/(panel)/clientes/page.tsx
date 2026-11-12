import type { Metadata } from 'next';
import type { SearchParams } from 'nuqs/server';
import { CustomersPage } from '@/features/customers/server';

export const metadata: Metadata = { title: 'Clientes' };

export default function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <CustomersPage searchParams={searchParams} />;
}
