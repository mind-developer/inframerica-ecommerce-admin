import type { Metadata } from 'next';
import { SiteContentPage } from '@/features/site-content/server';

export const metadata: Metadata = { title: 'Conteúdo do Site' };

export default function Page() {
  return <SiteContentPage />;
}
