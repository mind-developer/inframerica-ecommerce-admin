'use client';

import { Mail } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { ErrorMessage } from '@/components/ui/Field';
import { submitHandler, useAppForm } from '@/components/ui/form';
import { signIn } from '../actions/authActions';
import { signInSchema } from '../schemas/signInSchema';

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [redirectTo] = useQueryState('redirect');
  const form = useAppForm({
    defaultValues: { email: '', password: '' },
    validators: { onSubmit: signInSchema },
    onSubmit: async ({ value }) => {
      const r = await signIn(value, redirectTo);
      if (r) setError(r.error);
    },
  });
  return (
    <form noValidate onSubmit={submitHandler(form)} className="space-y-3">
      <ErrorMessage
        error={error ?? undefined}
        className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2"
      />
      <form.AppField name="email">
        {(f) => <f.TextField type="email" placeholder="Email" icon={Mail} autoComplete="username" />}
      </form.AppField>
      <form.AppField name="password">
        {(f) => <f.TextField type="password" placeholder="Senha" autoComplete="current-password" />}
      </form.AppField>
      <form.AppForm>
        <form.SubmitButton variant="accent" className="h-11 w-full rounded-xl" pendingLabel="Entrando…">
          Entrar
        </form.SubmitButton>
      </form.AppForm>
    </form>
  );
}
