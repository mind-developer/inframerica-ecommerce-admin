import type { Metadata } from 'next';
import { CouponsPage } from '@/features/coupons/server';

export const metadata: Metadata = { title: 'Cupons' };

export default function Page() {
  return <CouponsPage />;
}
