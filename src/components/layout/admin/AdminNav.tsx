'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { NAV_ITEMS } from './navItems';

/** Highlights the current section. Reads the URL, so it streams in behind <Suspense>. */
export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  return <AdminNavLinks pathname={usePathname()} onNavigate={onNavigate} />;
}

/** With `pathname` null (the static shell) nothing is highlighted yet. */
export function AdminNavLinks({ pathname, onNavigate }: { pathname: string | null; onNavigate?: () => void }) {
  return (
    <nav aria-label="Painel" className="flex-1 space-y-1 overflow-y-auto p-4">
      {NAV_ITEMS.map(({ href, label, Icon, exact }) => {
        const active = pathname !== null && (exact ? pathname === href : pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
              active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white',
            )}
          >
            <Icon aria-hidden className="size-4" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
