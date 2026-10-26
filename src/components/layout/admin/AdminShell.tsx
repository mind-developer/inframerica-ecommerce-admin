import { Suspense, type ReactNode } from 'react';
import { CurrentAdminBadge } from '@/features/auth/server';
import { AdminSidebar } from './AdminSidebar';

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-4 pl-14 lg:px-6">
          <span className="text-sm font-medium text-muted-foreground">Gestão Administrativa</span>
          <Suspense fallback={null}>
            <CurrentAdminBadge />
          </Suspense>
        </header>
        <main id="conteudo" className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
