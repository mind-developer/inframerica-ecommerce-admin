'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Sector } from '@/types/sectors';
import { deleteSector } from '../actions/sectorActions';
import { SectorFormModal } from './SectorFormModal';

export function SectorsView({
  sectors,
  courseCountBySector,
}: {
  sectors: Sector[];
  courseCountBySector: Record<string, number>;
}) {
  const [editing, setEditing] = useState<Sector | 'new' | null>(null);
  const [removing, setRemoving] = useState<Sector | null>(null);
  const { pending, run } = useServerAction();

  return (
    <>
      <PageHeader
        title="Setores"
        subtitle={`${sectors.length} setores · cada setor agrupa um tipo de curso`}
        actions={
          <Button variant="accent" onClick={() => setEditing('new')}>
            <Plus aria-hidden className="size-4" /> Novo Setor
          </Button>
        }
      />
      {sectors.length === 0 ? (
        <EmptyState title="Nenhum setor cadastrado." />
      ) : (
        <ul className="grid gap-4">
          {sectors.map((s) => {
            const courses = courseCountBySector[s.id] ?? 0;
            return (
              <Card key={s.id} className="flex items-center justify-between rounded-xl px-6 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-semibold text-foreground">{s.name}</h2>
                    <Badge tone="info">
                      {courses} curso{courses !== 1 ? 's' : ''}
                    </Badge>
                    <Badge tone={s.active ? 'success' : 'danger'}>{s.active ? 'Ativo' : 'Inativo'}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Responsável: {s.manager || '—'}</p>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <IconButton label={`Editar ${s.name}`} onClick={() => setEditing(s)}>
                    <Pencil aria-hidden className="size-4" />
                  </IconButton>
                  <IconButton label={`Remover ${s.name}`} onClick={() => setRemoving(s)}>
                    <Trash2 aria-hidden className="size-4 text-destructive" />
                  </IconButton>
                </div>
              </Card>
            );
          })}
        </ul>
      )}
      {editing && <SectorFormModal sector={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />}
      <ConfirmModal
        open={Boolean(removing)}
        title={`Remover ${removing?.name ?? ''}?`}
        confirmLabel="Remover"
        destructive
        pending={pending}
        onClose={() => setRemoving(null)}
        onConfirm={() =>
          removing &&
          run(
            () => deleteSector(removing.id),
            'Setor removido',
            () => setRemoving(null),
          )
        }
      />
    </>
  );
}
