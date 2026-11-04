'use client';

import { Plus } from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { SearchInput } from '@/components/ui/SearchInput';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Sector, SectorPage } from '@/types/sectors';
import { deleteSector } from '../actions/sectorActions';
import { sectorListParams } from '../utils/sectorListParams';
import { SectorCard } from './SectorCard';
import { SectorFormModal } from './SectorFormModal';

export function SectorsView({
  result,
  courseCountBySector,
}: {
  result: SectorPage;
  courseCountBySector: Record<string, number>;
}) {
  const [editing, setEditing] = useState<Sector | 'new' | null>(null);
  const [removing, setRemoving] = useState<Sector | null>(null);
  const { pending, run } = useServerAction();
  // `shallow: false`: filters and page live on the server, each change asks the API again.
  const [{ q, status }, setParams] = useQueryStates(sectorListParams, {
    history: 'replace',
    shallow: false,
    throttleMs: 400,
  });
  const { items: sectors, total, page, pageSize } = result;
  const setStatus = (value: 'active' | 'inactive') =>
    void setParams({ status: status === value ? null : value, page: null });
  const confirmRemoval = () =>
    removing &&
    run(
      () => deleteSector(removing.id),
      'Setor removido',
      () => setRemoving(null),
    );
  return (
    <>
      <PageHeader
        title="Setores"
        subtitle={`${total} ${total === 1 ? 'setor' : 'setores'} · cada setor agrupa um tipo de curso`}
        actions={
          <Button variant="accent" onClick={() => setEditing('new')}>
            <Plus aria-hidden className="size-4" /> Novo Setor
          </Button>
        }
      />
      <div className="mb-5 flex flex-wrap gap-3">
        <SearchInput
          className="min-w-[220px] flex-1"
          value={q}
          onChange={(v) => void setParams({ q: v || null, page: null })}
          placeholder="Buscar por nome ou responsável..."
        />
        <StatusButton label="Ativos" pressed={status === 'active'} onToggle={() => setStatus('active')} />
        <StatusButton label="Inativos" pressed={status === 'inactive'} onToggle={() => setStatus('inactive')} />
      </div>
      {sectors.length === 0 ? (
        <EmptyState title={q || status ? 'Nenhum setor encontrado.' : 'Nenhum setor cadastrado.'} />
      ) : (
        <ul className="grid gap-4">
          {sectors.map((s) => (
            <SectorCard
              key={s.id}
              sector={s}
              courses={courseCountBySector[s.id] ?? 0}
              onEdit={() => setEditing(s)}
              onRemove={() => setRemoving(s)}
            />
          ))}
        </ul>
      )}
      <Pagination page={page} pageSize={pageSize} total={total} onChange={(p) => void setParams({ page: p })} />
      {editing && <SectorFormModal sector={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />}
      <ConfirmModal
        open={Boolean(removing)}
        title={`Remover ${removing?.name ?? ''}?`}
        confirmLabel="Remover"
        destructive
        pending={pending}
        onClose={() => setRemoving(null)}
        onConfirm={confirmRemoval}
      />
    </>
  );
}

function StatusButton({ label, pressed, onToggle }: { label: string; pressed: boolean; onToggle: () => void }) {
  return (
    <Button variant={pressed ? 'primary' : 'outline'} aria-pressed={pressed} onClick={onToggle}>
      {label}
    </Button>
  );
}
