'use client';

import { Menu, X } from 'lucide-react';
import { Suspense, useState } from 'react';
import { cn } from '@/utils/cn';
import { AdminNav, AdminNavLinks } from './AdminNav';

import { STOREFRONT_URL as STOREFRONT } from '@/constants/links';

/** Fixed on desktop, a drawer on phones (toggle in the header). */
export function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <button
        type="button"
        aria-label="Abrir menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="fixed top-3.5 left-4 z-30 text-foreground lg:hidden"
      >
        <Menu aria-hidden className="size-5" />
      </button>
      {open && <div aria-hidden className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={close} />}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-primary text-primary-foreground transition-transform duration-200 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-start justify-between border-b border-white/10 p-6">
          <div>
            <p className="font-heading text-lg font-bold tracking-tight">Inframérica</p>
            <p className="mt-1 text-xs text-white/60">Painel Administrativo</p>
          </div>
          <button type="button" aria-label="Fechar menu" onClick={close} className="text-white/70 lg:hidden">
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <Suspense fallback={<AdminNavLinks pathname={null} />}>
          <AdminNav onNavigate={close} />
        </Suspense>
        <div className="border-t border-white/10 p-4">
          <a href={STOREFRONT} className="text-xs text-white/50 transition-colors hover:text-white/80">
            ← Voltar ao site
          </a>
        </div>
      </aside>
    </>
  );
}
