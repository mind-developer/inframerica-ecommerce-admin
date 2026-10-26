'use client';

import type { ReactNode } from 'react';
import { firstError } from '@/utils/formErrors';
import { controlStyles } from '../controlStyles';
import { Field } from '../Field';
import { useFieldContext } from './formContext';

/** Number input; an empty box becomes `null` (e.g. "unlimited"), otherwise a number. */
export function NumberField({
  label,
  min,
  max,
  step,
  placeholder,
  help,
  nullable,
  className,
}: {
  label?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  help?: ReactNode;
  nullable?: boolean;
  className?: string;
}) {
  const field = useFieldContext<number | null>();
  const id = `field-${field.name}`;
  const error = field.state.meta.isTouched ? firstError(field.state.meta.errors) : undefined;
  return (
    <Field id={id} label={label} error={error} help={help} className={className}>
      <input
        id={id}
        name={field.name}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        value={field.state.value ?? ''}
        onChange={(e) => field.handleChange(e.target.value === '' && nullable ? null : Number(e.target.value))}
        onBlur={field.handleBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={controlStyles}
      />
    </Field>
  );
}
