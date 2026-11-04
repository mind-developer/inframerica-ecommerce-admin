import type { ReactNode } from 'react';
import { ComingSoonBadge } from './ComingSoonBadge';

export function PageHeader({
  title,
  subtitle,
  actions,
  soon,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  soon?: boolean;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
          {soon && <ComingSoonBadge />}
        </div>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
