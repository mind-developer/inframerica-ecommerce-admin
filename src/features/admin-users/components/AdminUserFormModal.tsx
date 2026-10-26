'use client';

import { Button } from '@/components/ui/Button';
import { submitHandler, useAppForm } from '@/components/ui/form';
import { Modal } from '@/components/ui/Modal';
import { ADMIN_ROLE_LABEL } from '@/constants/labels';
import { useServerAction } from '@/components/ui/useServerAction';
import type { AdminUser } from '@/types/adminUsers';
import type { Sector } from '@/types/sectors';
import { saveAdminUser } from '../actions/adminUserActions';
import { ADMIN_ROLES, adminUserSchema, emptyAdminUser } from '../schemas/adminUserSchema';

export function AdminUserFormModal({
  user,
  sectors,
  onClose,
}: {
  user: AdminUser | null;
  sectors: Sector[];
  onClose: () => void;
}) {
  const { pending, run } = useServerAction();
  const form = useAppForm({
    defaultValues: user
      ? { name: user.name, email: user.email, role: user.role, sectorId: user.sectorId ?? '', active: user.active }
      : emptyAdminUser,
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
        <form.AppField name="role">
          {(f) => (
            <f.SelectField label="Papel" options={ADMIN_ROLES.map((r) => ({ value: r, label: ADMIN_ROLE_LABEL[r] }))} />
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
