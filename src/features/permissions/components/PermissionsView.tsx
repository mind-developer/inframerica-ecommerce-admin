'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmActionModal } from '@/components/ui/ConfirmActionModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { SCREENS } from '@/constants/access';
import type { AccessProfile } from '@/types/adminUsers';
import { deleteProfile } from '../actions/permissionActions';
import { ProfileFormModal } from './ProfileFormModal';

const summary = ({ permissions }: AccessProfile) => {
  const count = (action: string) => SCREENS.filter((s) => permissions.includes(`${s.resource}.${action}`)).length;
  const read = count('read');
  return `${read} ${read === 1 ? 'aba visível' : 'abas visíveis'} · ações em ${count('manage')}`;
};

export function PermissionsView({
  profiles,
  held,
  ownProfileId,
}: {
  profiles: AccessProfile[];
  held: string[];
  ownProfileId?: string;
}) {
  const [editing, setEditing] = useState<AccessProfile | 'new' | null>(null);
  const [removing, setRemoving] = useState<AccessProfile | null>(null);
  return (
    <>
      <PageHeader
        title="Permissões"
        subtitle="Perfis de acesso dos usuários internos: o que cada um vê e onde pode agir"
        actions={
          <Button variant="accent" onClick={() => setEditing('new')}>
            <Plus aria-hidden className="size-4" /> Novo Perfil
          </Button>
        }
      />
      {profiles.length === 0 ? (
        <EmptyState title="Nenhum perfil criado." />
      ) : (
        <ul className="grid gap-3">
          {profiles.map((p) => (
            <Card key={p.id} className="flex items-center justify-between rounded-xl px-6 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-semibold text-foreground">{p.name}</h2>
                  <Badge tone="info">
                    {p.members} {p.members === 1 ? 'usuário' : 'usuários'}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{summary(p)}</p>
              </div>
              {p.id !== ownProfileId && (
                <div className="ml-4 flex items-center gap-2">
                  <IconButton label={`Editar ${p.name}`} onClick={() => setEditing(p)}>
                    <Pencil aria-hidden className="size-4" />
                  </IconButton>
                  <IconButton label={`Remover ${p.name}`} onClick={() => setRemoving(p)}>
                    <Trash2 aria-hidden className="size-4 text-destructive" />
                  </IconButton>
                </div>
              )}
            </Card>
          ))}
        </ul>
      )}
      {editing && (
        <ProfileFormModal profile={editing === 'new' ? null : editing} held={held} onClose={() => setEditing(null)} />
      )}
      <ConfirmActionModal
        target={removing}
        title={(p) => `Remover ${p.name}?`}
        success="Perfil removido"
        action={(p) => deleteProfile(p.id)}
        onClose={() => setRemoving(null)}
      />
    </>
  );
}
