import type { Metadata } from 'next';
import { EmptyState } from '@/components/ui/EmptyState';

export const metadata: Metadata = { title: 'Sem acesso' };

export default function Page() {
  return <EmptyState title="Seu perfil ainda não tem acesso a nenhuma aba. Fale com um administrador." />;
}
