import { Card } from '@/components/ui/Card';
import { formatBRL } from '@/utils/format';
import type { orderTotals } from '../utils/orderFilters';

export function OrderKpis({ totals }: { totals: ReturnType<typeof orderTotals> }) {
  const items = [
    { label: 'Pedidos', value: String(totals.count) },
    { label: 'Valor bruto', value: formatBRL(totals.gross) },
    { label: 'Recebido', value: formatBRL(totals.received) },
    { label: 'A receber', value: formatBRL(totals.receivable) },
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((i) => (
        <Card key={i.label} className="rounded-xl p-4">
          <dt className="text-xs text-muted-foreground">{i.label}</dt>
          <dd className="mt-1 text-lg font-bold">{i.value}</dd>
        </Card>
      ))}
    </dl>
  );
}
