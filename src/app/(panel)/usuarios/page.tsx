import type { Metadata } from 'next';
import { AdminUsersPage } from '@/features/admin-users/server';

export const metadata: Metadata = { title: 'Usuários' };

export default function Page() {
  return <AdminUsersPage />;
}
