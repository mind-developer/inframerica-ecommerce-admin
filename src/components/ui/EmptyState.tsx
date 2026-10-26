import { Inbox, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function EmptyState({
  icon: Icon = Inbox,
  title,
  children,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-14 text-center', className)}>
      <Icon aria-hidden className="mb-3 size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}
