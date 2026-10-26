import type { Metadata } from 'next';
import { CredentialsPage } from '@/features/credentials/server';

export const metadata: Metadata = { title: 'Credenciais' };

export default function Page() {
  return <CredentialsPage />;
}
