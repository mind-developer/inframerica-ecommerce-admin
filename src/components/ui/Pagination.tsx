'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

/** Previous/next over a server-paginated list. Renders nothing when everything fits on one page. */
export function Pagination({
  page,
  pageSize,
  total,
  onChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  return (
    <nav aria-label="Paginação" className="mt-5 flex items-center justify-between gap-3">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft aria-hidden className="size-4" /> Anterior
      </Button>
      <p aria-live="polite" className="text-sm text-muted-foreground">
        Página {page} de {pages}
      </p>
      <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Próxima <ChevronRight aria-hidden className="size-4" />
      </Button>
    </nav>
  );
}
