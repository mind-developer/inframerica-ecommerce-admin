import type { Metadata } from 'next';
import { PermissionsPage } from '@/features/permissions/server';

export const metadata: Metadata = { title: 'Permissões' };

export default function Page() {
  return <PermissionsPage />;
}
