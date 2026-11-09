'use client';

import type { ReactNode } from 'react';
import { firstError } from '@/utils/formErrors';
import { Checkbox } from '../Checkbox';
import { ErrorMessage } from '../Field';
import { useFieldContext } from './formContext';

/** A single yes/no box (e.g. accepting terms). The label may hold links. */
export function CheckboxField({ label }: { label: ReactNode }) {
  const field = useFieldContext<boolean>();
  const id = `field-${field.name}`;
  const error = field.state.meta.isTouched ? firstError(field.state.meta.errors) : undefined;
  return (
    <div className="space-y-1">
      <Checkbox
        id={id}
        name={field.name}
        label={label}
        checked={Boolean(field.state.value)}
        onChange={(e) => field.handleChange(e.target.checked)}
        onBlur={field.handleBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="items-start [&>input]:mt-0.5"
      />
      <ErrorMessage id={`${id}-error`} error={error} />
    </div>
  );
}
