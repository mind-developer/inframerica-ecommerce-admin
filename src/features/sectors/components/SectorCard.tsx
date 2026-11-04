'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import type { Sector } from '@/types/sectors';

export function SectorCard({
  sector,
  courses,
  onEdit,
  onRemove,
}: {
  sector: Sector;
  courses: number;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <Card className="flex items-center justify-between rounded-xl px-6 py-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-semibold text-foreground">{sector.name}</h2>
          <Badge tone="info">
            {courses} curso{courses !== 1 ? 's' : ''}
          </Badge>
          <Badge tone={sector.active ? 'success' : 'danger'}>{sector.active ? 'Ativo' : 'Inativo'}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{sector.description}</p>
        <p className="mt-1 text-xs text-muted-foreground">Responsável: {sector.manager || '—'}</p>
      </div>
      <div className="ml-4 flex items-center gap-2">
        <IconButton label={`Editar ${sector.name}`} onClick={onEdit}>
          <Pencil aria-hidden className="size-4" />
        </IconButton>
        <IconButton label={`Remover ${sector.name}`} onClick={onRemove}>
          <Trash2 aria-hidden className="size-4 text-destructive" />
        </IconButton>
      </div>
    </Card>
  );
}
