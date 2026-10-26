import { Trophy } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatBRL } from '@/utils/format';
import type { RankedCustomer } from '../utils/dashboardMetrics';

export function TopCustomersCard({ customers }: { customers: RankedCustomer[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy aria-hidden className="size-4 text-accent" /> Top clientes
          </CardTitle>
          <CardDescription>Receita confirmada no período e filtros selecionados</CardDescription>
        </div>
        <span className="text-xs text-muted-foreground">{customers.length} clientes</span>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma venda confirmada para os filtros selecionados.</p>
        ) : (
          <ol className="space-y-2">
            {customers.map((c, i) => (
              <li key={c.id} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                <span
                  aria-hidden
                  className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold"
                >
                  {i + 1}
                </span>
                <Link
                  href={`/clientes?id=${c.id}` as Route}
                  className="min-w-0 flex-1 truncate text-sm font-medium hover:underline"
                >
                  {c.name}
                </Link>
                <span className="text-xs whitespace-nowrap text-muted-foreground">{c.orders} pedido(s)</span>
                <span className="text-sm font-bold whitespace-nowrap">{formatBRL(c.revenue)}</span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
