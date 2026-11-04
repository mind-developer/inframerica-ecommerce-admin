'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useServerAction } from '@/components/ui/useServerAction';
import type { AccessProfile } from '@/types/adminUsers';
import { saveProfile } from '../actions/permissionActions';
import { PermissionMatrix } from './PermissionMatrix';

export function ProfileFormModal({
  profile,
  held,
  onClose,
}: {
  profile: AccessProfile | null;
  held: string[];
  onClose: () => void;
}) {
  const [name, setName] = useState(profile?.name ?? '');
  const [permissions, setPermissions] = useState(profile?.permissions ?? []);
  const { pending, run } = useServerAction();
  const save = () =>
    run(
      () => saveProfile(profile?.id ?? null, { name, permissions }),
      profile ? 'Perfil atualizado' : 'Perfil criado',
      onClose,
    );
  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      title={profile ? 'Editar perfil de acesso' : 'Novo perfil de acesso'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="accent" disabled={pending || name.trim().length < 2} onClick={save}>
            Salvar
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field id="profile-name" label="Nome do perfil" required>
          <Input
            id="profile-name"
            maxLength={80}
            placeholder="Ex.: Financeiro, Operação"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <PermissionMatrix value={permissions} held={held} onChange={setPermissions} />
        <p className="text-xs text-muted-foreground">Só ficam liberados os acessos que você mesmo tem.</p>
      </div>
    </Modal>
  );
}
