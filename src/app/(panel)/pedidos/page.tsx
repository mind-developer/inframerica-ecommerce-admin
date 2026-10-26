import type { Metadata } from 'next';
import { OrdersPage } from '@/features/orders/server';

export const metadata: Metadata = { title: 'Pedidos' };

export default function Page() {
  return <OrdersPage />;
}
