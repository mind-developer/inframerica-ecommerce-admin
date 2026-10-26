import type { Metadata } from 'next';
import { BannersPage } from '@/features/site-content/server';

export const metadata: Metadata = { title: 'Banners' };

export default function Page() {
  return <BannersPage />;
}
