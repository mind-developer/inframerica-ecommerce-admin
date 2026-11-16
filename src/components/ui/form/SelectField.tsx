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
  required,
  className,
}: {
  label?: ReactNode;
  options: SelectOption[];
  placeholder?: string;
  help?: ReactNode;
  required?: boolean;
  className?: string;
}) {
  const field = useFieldContext<string>();
  const id = `field-${field.name}`;
  const error = field.state.meta.isTouched ? firstError(field.state.meta.errors) : undefined;
  return (
    <Field id={id} label={label} required={required} error={error} help={help} className={className}>
      <Select
        id={id}
        name={field.name}
        options={options}
        placeholder={placeholder}
        value={field.state.value ?? ''}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </Field>
  );
}
