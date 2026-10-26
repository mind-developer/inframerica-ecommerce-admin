'use client';

import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface TabItem<T extends string> {
  id: T;
  label: ReactNode;
}

/** Controlled tab bar (ARIA tabs). Render the active panel yourself with `tabPanelProps(id)`. */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  idPrefix,
  className,
}: {
  tabs: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  idPrefix: string;
  className?: string;
}) {
  return (
    <div role="tablist" className={cn('flex gap-1 overflow-x-auto border-b border-border', className)}>
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${tab.id}`}
            aria-selected={active}
            aria-controls={`${idPrefix}-panel-${tab.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              '-mb-px px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors',
              active ? 'border-b-2 border-gold text-gold' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export const tabPanelProps = (idPrefix: string, id: string) => ({
  role: 'tabpanel' as const,
  id: `${idPrefix}-panel-${id}`,
  'aria-labelledby': `${idPrefix}-tab-${id}`,
});
