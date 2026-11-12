import type { Metadata } from 'next';
import type { Route } from 'next';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { EmptyState } from '@/components/ui/EmptyState';
import { firstScreen, requireAdmin } from '@/features/auth/server';

export const metadata: Metadata = { title: 'Acesso restrito' };

/** Where a page outside the admin's profile sends them. */
export default async function Page() {
  const first = firstScreen(await requireAdmin());
  return (
    <EmptyState
      icon={ShieldAlert}
      title={
        first
          ? 'Acesso restrito: seu perfil não tem acesso a esta aba. Fale com um administrador.'
          : 'Acesso restrito: seu perfil ainda não tem acesso a nenhuma aba. Fale com um administrador.'
      }
    >
      {first && (
        <Link
          href={first.href as Route}
          className={buttonStyles({ variant: 'outline', size: 'sm', className: 'mt-4' })}
        >
          Ir para {first.label}
        </Link>
      )}
    </EmptyState>
  );
}
