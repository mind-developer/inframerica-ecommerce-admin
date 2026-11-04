'use client';

import { Button } from '@/components/ui/Button';
import { submitHandler, useAppForm } from '@/components/ui/form';
import { Modal } from '@/components/ui/Modal';
import { useServerAction } from '@/components/ui/useServerAction';
import type { AccessProfile, AdminUser } from '@/types/adminUsers';
import type { Sector } from '@/types/sectors';
import { saveAdminUser } from '../actions/adminUserActions';
import { adminUserSchema, emptyAdminUser } from '../schemas/adminUserSchema';

const toValues = (user: AdminUser) => ({
  name: user.name,
  email: user.email,
  profileId: user.profile?.id ?? '',
  sectorId: user.sectorId ?? '',
  active: user.active,
  password: '',
});

export function AdminUserFormModal({
  user,
  sectors,
  profiles,
  onClose,
}: {
  user: AdminUser | null;
  sectors: Sector[];
  profiles: AccessProfile[];
  onClose: () => void;
}) {
  const { pending, run } = useServerAction();
  const form = useAppForm({
    defaultValues: user ? toValues(user) : emptyAdminUser,
    validators: { onSubmit: adminUserSchema },
    onSubmit: ({ value }) =>
      run(() => saveAdminUser(user?.id ?? null, value), user ? 'Usuário atualizado' : 'Usuário criado', onClose),
  });
  return (
    <Modal
      open
      onClose={onClose}
      title={user ? 'Editar Usuário' : 'Novo Usuário'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="accent" disabled={pending} onClick={() => void form.handleSubmit()}>
            Salvar
          </Button>
        </>
      }
    >
      <form noValidate onSubmit={submitHandler(form)} className="space-y-4">
        <form.AppField name="name">{(f) => <f.TextField label="Nome" required />}</form.AppField>
        <form.AppField name="email">{(f) => <f.TextField label="Email" type="email" required />}</form.AppField>
        <form.AppField name="password">
          {(f) => (
            <f.TextField
              label={user ? 'Nova senha (opcional)' : 'Senha provisória'}
              type="password"
              autoComplete="new-password"
              required={!user}
            />
          )}
        </form.AppField>
        <form.AppField name="profileId">
          {(f) => (
            <f.SelectField
              label="Perfil de acesso"
              placeholder="Escolha um perfil"
              options={profiles.map((p) => ({ value: p.id, label: p.name }))}
            />
          )}
        </form.AppField>
        <form.AppField name="sectorId">
          {(f) => (
            <f.SelectField
              label="Setor"
              options={[
                { value: '', label: 'Todos os setores' },
                ...sectors.map((s) => ({ value: s.id, label: s.name })),
              ]}
            />
          )}
        </form.AppField>
        <form.AppField name="active">{(f) => <f.SwitchField label="Ativo" />}</form.AppField>
      </form>
    </Modal>
  );
}
