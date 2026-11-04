'use client';

import { Plus } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmActionModal } from '@/components/ui/ConfirmActionModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import type { Credential } from '@/types/catalog';
import type { Sector } from '@/types/sectors';
import { deleteCredential } from '../actions/credentialActions';
import { CredentialCard } from './CredentialCard';
import { CredentialFormModal } from './CredentialFormModal';

export function CredentialsView({ credentials, sectors }: { credentials: Credential[]; sectors: Sector[] }) {
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''));
  const [editing, setEditing] = useState<Credential | 'new' | null>(null);
  const [removing, setRemoving] = useState<Credential | null>(null);
  const sectorName = (id: string) => sectors.find((s) => s.id === id)?.name ?? 'Setor removido';
  const q = query.trim().toLowerCase();
  const shown = q
    ? credentials.filter((c) =>
        [c.name, c.acronym, ...c.sectorIds.map(sectorName)].some((t) => t.toLowerCase().includes(q)),
      )
    : credentials;

  return (
    <>
      <PageHeader
        soon
        title="Credenciais"
        subtitle={`${credentials.length} credenciais cadastradas · cada uma habilita um ou mais setores`}
        actions={
          <Button onClick={() => setEditing('new')}>
            <Plus aria-hidden className="size-4" /> Nova Credencial
          </Button>
        }
      />
      <SearchInput
        className="mb-5 max-w-md"
        value={query}
        onChange={(v) => void setQuery(v || null)}
        placeholder="Buscar por nome, sigla ou setor"
      />
      {shown.length === 0 ? (
        <EmptyState title={q ? 'Nenhuma credencial corresponde à busca.' : 'Nenhuma credencial cadastrada.'} />
      ) : (
        <ul className="space-y-3">
          {shown.map((c) => (
            <CredentialCard
              key={c.id}
              credential={c}
              sectorName={sectorName}
              onEdit={() => setEditing(c)}
              onDelete={() => setRemoving(c)}
            />
          ))}
        </ul>
      )}
      {editing && (
        <CredentialFormModal
          credential={editing === 'new' ? null : editing}
          sectors={sectors}
          onClose={() => setEditing(null)}
        />
      )}
      <ConfirmActionModal
        target={removing}
        title={(r) => `Remover ${r.name}?`}
        confirmLabel="Remover"
        success="Credencial removida"
        action={(r) => deleteCredential(r.id)}
        onClose={() => setRemoving(null)}
      />
    </>
  );
}
