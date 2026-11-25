'use client';

import { withForm } from '@/components/ui/form';
import type { LoginMethods } from '@/types/auth';
import { emptyAdminUser } from '../schemas/adminUserSchema';

/** Who the person is and, while password sign-in is on, their password. */
export const AdminUserIdentityFields = withForm({
  defaultValues: emptyAdminUser,
  props: {} as { isNew: boolean; methods: LoginMethods },
  render: function Render({ form, isNew, methods }) {
    return (
      <>
        <form.AppField name="name">{(f) => <f.TextField label="Nome" required />}</form.AppField>
        <form.AppField name="email">
          {(f) => (
            <f.TextField
              label="Email"
              type="email"
              required
              help={methods.microsoft ? 'O mesmo e-mail da conta Microsoft da pessoa.' : undefined}
            />
          )}
        </form.AppField>
        {methods.password && (
          <form.AppField name="password">
            {(f) => (
              <f.TextField
                label={
                  !isNew
                    ? 'Nova senha (opcional)'
                    : methods.microsoft
                      ? 'Senha provisória (opcional)'
                      : 'Senha provisória'
                }
                type="password"
                autoComplete="new-password"
                required={isNew && !methods.microsoft}
              />
            )}
          </form.AppField>
        )}
      </>
    );
  },
});
