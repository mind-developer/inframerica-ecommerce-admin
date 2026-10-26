import type { Metadata } from 'next';
import { LoginPage } from '@/features/auth/server';

export const metadata: Metadata = { title: 'Entrar' };

export default function Page() {
  return <LoginPage />;
}
