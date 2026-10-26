import type { LucideIcon } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export interface Stat {
  label: string;
  value: string;
  Icon: LucideIcon;
  href?: Route;
}

function StatCard({ stat: { label, value, Icon } }: { stat: Stat }) {
  return (
    <Card className="h-full rounded-xl p-4 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <Icon aria-hidden className="size-4 text-accent" />
      </div>
      <p className="mt-2 text-lg font-bold break-words">{value}</p>
    </Card>
  );
}

export function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      {stats.map((s) => (
        <li key={s.label}>
          {s.href ? (
            <Link
              href={s.href}
              className="block h-full rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <StatCard stat={s} />
            </Link>
          ) : (
            <StatCard stat={s} />
          )}
        </li>
      ))}
    </ul>
  );
}
