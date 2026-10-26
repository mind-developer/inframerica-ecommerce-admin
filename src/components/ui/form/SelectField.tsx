'use client';

import type { ReactNode } from 'react';
import { firstError } from '@/utils/formErrors';
import { Field } from '../Field';
import { Select, type SelectOption } from '../Select';
import { useFieldContext } from './formContext';

export function SelectField({
  label,
  options,
  placeholder,
  help,
  className,
}: {
  label?: ReactNode;
  options: SelectOption[];
  placeholder?: string;
  help?: ReactNode;
  className?: string;
}) {
  const field = useFieldContext<string>();
  const id = `field-${field.name}`;
  const error = field.state.meta.isTouched ? firstError(field.state.meta.errors) : undefined;
  return (
    <Field id={id} label={label} error={error} help={help} className={className}>
      <Select
        id={id}
        name={field.name}
        options={options}
        placeholder={placeholder}
        value={field.state.value ?? ''}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </Field>
  );
}
