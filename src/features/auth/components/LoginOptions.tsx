'use client';

import { useQueryState } from 'nuqs';
import { ErrorMessage } from '@/components/ui/Field';
import type { LoginMethods } from '@/types/auth';
import { entraErrorMessage } from '../utils/entraErrors';
import { LoginForm } from './LoginForm';
import { MicrosoftButton } from './MicrosoftButton';

/** The sign-in methods the API has on: Microsoft, the password form, or both while one replaces the other. */
export function LoginOptions({ methods }: { methods: LoginMethods }) {
  const [error] = useQueryState('erro');
  const [redirectTo] = useQueryState('redirect');
  return (
    <div className="space-y-4">
      <ErrorMessage
        error={entraErrorMessage(error) ?? undefined}
        className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2"
      />
      {methods.microsoft && <MicrosoftButton redirectTo={redirectTo} />}
      {methods.microsoft && methods.password && (
        <p className="text-center text-xs text-muted-foreground">ou com e-mail e senha</p>
      )}
      {methods.password && <LoginForm />}
    </div>
  );
}
