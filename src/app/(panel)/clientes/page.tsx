import type { Metadata } from 'next';
import { CustomersPage } from '@/features/customers/server';

export const metadata: Metadata = { title: 'Clientes' };

export default function Page() {
  return <CustomersPage />;
}
