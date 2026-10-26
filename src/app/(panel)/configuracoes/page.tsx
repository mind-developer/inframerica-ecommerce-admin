import type { Metadata } from 'next';
import { SettingsPage } from '@/features/settings/server';

export const metadata: Metadata = { title: 'Configurações' };

export default function Page() {
  return <SettingsPage />;
}
