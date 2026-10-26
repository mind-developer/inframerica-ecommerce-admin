'use client';

import type { LucideIcon } from 'lucide-react';
import type { HTMLAttributes, HTMLInputTypeAttribute, ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { firstError } from '@/utils/formErrors';
import { controlStyles } from '../controlStyles';
import { Field } from '../Field';
import { useFieldContext } from './formContext';

export interface TextFieldProps {
  label?: ReactNode;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  help?: ReactNode;
  icon?: LucideIcon;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  inputClassName?: string;
  className?: string;
  onBlur?: (value: string) => void;
}

export function TextField({
  label,
  type = 'text',
  icon: Icon,
  onBlur,
  inputClassName,
  className,
  help,
  required,
  ...rest
}: TextFieldProps) {
  const field = useFieldContext<string>();
  const id = `field-${field.name}`;
  const error = field.state.meta.isTouched ? firstError(field.state.meta.errors) : undefined;
  return (
    <Field id={id} label={label} required={required} error={error} help={help} className={className}>
      <div className="relative">
        {Icon && <Icon aria-hidden className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />}
        <input
          id={id}
          name={field.name}
          type={type}
          value={field.state.value ?? ''}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={() => {
            field.handleBlur();
            onBlur?.(field.state.value);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-label={typeof label === 'string' ? undefined : rest.placeholder}
          required={required}
          className={cn(controlStyles, Icon && 'pl-10', inputClassName)}
          {...rest}
        />
      </div>
    </Field>
  );
}
