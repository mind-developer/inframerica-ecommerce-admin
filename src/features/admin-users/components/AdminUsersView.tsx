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
import type { AccessProfile, AdminUser } from '@/types/adminUsers';
import type { Sector } from '@/types/sectors';
import { deleteAdminUser } from '../actions/adminUserActions';
import { AdminUserFormModal } from './AdminUserFormModal';

export function AdminUsersView({
  users,
  sectors,
  profiles,
}: {
  users: AdminUser[];
  sectors: Sector[];
  profiles: AccessProfile[];
}) {
  const [editing, setEditing] = useState<AdminUser | 'new' | null>(null);
  const [removing, setRemoving] = useState<AdminUser | null>(null);
  const sectorName = (id: string | null) => (id ? (sectors.find((s) => s.id === id)?.name ?? '—') : 'Todos os setores');

  return (
    <>
      <PageHeader
        title="Usuários do Sistema"
        subtitle={`${users.length} usuários com acesso administrativo`}
        actions={
          <Button variant="accent" onClick={() => setEditing('new')}>
            <Plus aria-hidden className="size-4" /> Novo Usuário
          </Button>
        }
      />
      {users.length === 0 ? (
        <EmptyState title="Nenhum usuário admin cadastrado." />
      ) : (
        <ul className="grid gap-3">
          {users.map((u) => (
            <Card key={u.id} className="flex items-center justify-between rounded-xl px-6 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-semibold text-foreground">{u.name}</h2>
                  <Badge tone="info">{u.profile?.name ?? 'Acesso total'}</Badge>
                  <Badge tone={u.active ? 'success' : 'danger'}>{u.active ? 'Ativo' : 'Inativo'}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{u.email}</p>
                <p className="mt-0.5 text-xs text-muted-foreground/80">Setor: {sectorName(u.sectorId)}</p>
              </div>
              <div className="ml-4 flex items-center gap-2">
                {!u.owner && (
                  <>
                    <IconButton label={`Editar ${u.name}`} onClick={() => setEditing(u)}>
                      <Pencil aria-hidden className="size-4" />
                    </IconButton>
                    <IconButton label={`Remover ${u.name}`} onClick={() => setRemoving(u)}>
                      <Trash2 aria-hidden className="size-4 text-destructive" />
                    </IconButton>
                  </>
                )}
              </div>
            </Card>
          ))}
        </ul>
      )}
      {editing && (
        <AdminUserFormModal
          user={editing === 'new' ? null : editing}
          sectors={sectors}
          profiles={profiles}
          onClose={() => setEditing(null)}
        />
      )}
      <ConfirmActionModal
        target={removing}
        title={(u) => `Remover ${u.name}?`}
        success="Usuário removido"
        action={(u) => deleteAdminUser(u.id)}
        onClose={() => setRemoving(null)}
      />
    </>
  );
}
