import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './Button';

/** The "Filtros" card used on list screens, with "Limpar" when any filter is set. */
export function FilterBox({
  active,
  onClear,
  children,
}: {
  active: boolean;
  onClear: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Filtros</p>
        {active && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X aria-hidden className="size-3.5" /> Limpar
          </Button>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}
