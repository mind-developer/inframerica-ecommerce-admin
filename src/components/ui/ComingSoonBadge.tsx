import { cn } from '@/utils/cn';
import { Badge } from './Badge';

/** Marks a screen or feature that is not finished yet: still on mock data, or with nothing behind it. */
export function ComingSoonBadge({ className }: { className?: string }) {
  return (
    <Badge tone="gold" className={cn('shrink-0', className)}>
      Em breve
    </Badge>
  );
}
