'use client';

import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { ErrorMessage } from '@/components/ui/Field';
import { submitHandler, useAppForm } from '@/components/ui/form';
import { signIn } from '../actions/authActions';
import { signInSchema } from '../schemas/signInSchema';

const DEMO = { email: 'admin@inframerica.com', password: '123456' };

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
    <>
      <form noValidate onSubmit={submitHandler(form)} className="space-y-3">
        <ErrorMessage
          error={error ?? undefined}
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2"
        />
        <form.AppField name="email">
          {(f) => <f.TextField type="email" placeholder="Email" icon={Mail} autoComplete="username" />}
        </form.AppField>
        <form.AppField name="password">
          {(f) => <f.TextField type="password" placeholder="Senha" icon={Lock} autoComplete="current-password" />}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton variant="accent" className="h-11 w-full rounded-xl" pendingLabel="Entrando…">
            Entrar
          </form.SubmitButton>
        </form.AppForm>
      </form>
      {/* PROTOTYPE ONLY: demo credentials, removed with the mock authentication. */}
      <button
        type="button"
        onClick={() => {
          form.setFieldValue('email', DEMO.email);
          form.setFieldValue('password', DEMO.password);
        }}
        className="mt-5 flex w-full items-center gap-3 rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-left hover:border-gold/40"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ShieldCheck aria-hidden className="size-4" />
        </span>
        <span className="min-w-0 text-xs">
          <span className="block font-semibold">Administrador · demonstração</span>
          <span className="block truncate font-mono text-[11px] text-muted-foreground">
            {DEMO.email} / {DEMO.password}
          </span>
        </span>
      </button>
    </>
  );
}
