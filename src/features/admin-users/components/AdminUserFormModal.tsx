'use client';

import { Button } from '@/components/ui/Button';
import { submitHandler, useAppForm } from '@/components/ui/form';
import { Modal } from '@/components/ui/Modal';
import { useServerAction } from '@/components/ui/useServerAction';
import type { AccessProfile, AdminUser } from '@/types/adminUsers';
import type { LoginMethods } from '@/types/auth';
import type { Sector } from '@/types/sectors';
import { saveAdminUser } from '../actions/adminUserActions';
import { AdminUserIdentityFields } from './AdminUserIdentityFields';
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
  methods,
  onClose,
}: {
  /** The password field shows only while password sign-in is on; Microsoft needs none. */
  methods: LoginMethods;
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
        <AdminUserIdentityFields form={form} isNew={!user} methods={methods} />
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
