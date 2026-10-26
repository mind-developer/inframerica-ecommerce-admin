'use client';

import type { ReactNode } from 'react';
import { Button, type ButtonProps } from '../Button';
import { useFormContext } from './formContext';

/** Disabled while the form submits or is known to be invalid. */
export function SubmitButton({ children, pendingLabel, ...props }: ButtonProps & { pendingLabel?: ReactNode }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
      {([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={!canSubmit || isSubmitting} {...props}>
          {isSubmitting && pendingLabel ? pendingLabel : children}
        </Button>
      )}
    </form.Subscribe>
  );
}
