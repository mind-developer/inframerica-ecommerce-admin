import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

/** Disclosure on native <details>: works without JavaScript and in server components. */
export function AccordionItem({
  title,
  children,
  defaultOpen,
  className,
  summaryClassName,
}: {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  summaryClassName?: string;
}) {
  return (
    <details open={defaultOpen} className={cn('group border-b border-border', className)}>
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-medium [&::-webkit-details-marker]:hidden',
          summaryClassName,
        )}
      >
        {title}
        <ChevronDown aria-hidden className="size-4 shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-4">{children}</div>
    </details>
  );
}
