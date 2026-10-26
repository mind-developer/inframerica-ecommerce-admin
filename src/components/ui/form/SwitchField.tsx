'use client';

import type { ReactNode } from 'react';
import { Switch } from '../Switch';
import { useFieldContext } from './formContext';

export function SwitchField({ label, help }: { label: ReactNode; help?: ReactNode }) {
  const field = useFieldContext<boolean>();
  const id = `field-${field.name}`;
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {help && <p className="text-xs text-muted-foreground">{help}</p>}
      </div>
      <Switch id={id} checked={Boolean(field.state.value)} onCheckedChange={field.handleChange} />
    </div>
  );
}
