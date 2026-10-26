'use client';

import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { firstError } from '@/utils/formErrors';
import { controlStyles } from '../controlStyles';
import { Field } from '../Field';
import { useFieldContext } from './formContext';

export function TextAreaField({
  label,
  rows = 4,
  placeholder,
  help,
  className,
}: {
  label?: ReactNode;
  rows?: number;
  placeholder?: string;
  help?: ReactNode;
  className?: string;
}) {
  const field = useFieldContext<string>();
  const id = `field-${field.name}`;
  const error = field.state.meta.isTouched ? firstError(field.state.meta.errors) : undefined;
  return (
    <Field id={id} label={label} error={error} help={help} className={className}>
      <textarea
        id={id}
        name={field.name}
        rows={rows}
        placeholder={placeholder}
        value={field.state.value ?? ''}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlStyles, 'h-auto')}
      />
    </Field>
  );
}
