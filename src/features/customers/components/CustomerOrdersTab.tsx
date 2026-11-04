import Link from 'next/link';
import type { Route } from 'next';
import { ComingSoonBadge } from '@/components/ui/ComingSoonBadge';
import { PendingRuleBadge } from '@/components/ui/PendingRuleBadge';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { ORDER_STATUS_LABEL } from '@/constants/labels';
import type { Order } from '@/types/orders';
import { formatBRL, formatDate } from '@/utils/format';

/** The customer's 10 most recent orders, with a link to all of them on the orders screen. */
export function CustomerOrdersTab({ customerId, orders }: { customerId: string; orders: Order[] }) {
  const recent = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ComingSoonBadge />
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {orders.length > 10 ? '10 pedidos mais recentes' : `${orders.length} pedido(s)`}
          {orders.length > 10 && (
            <PendingRuleBadge text="Quantidade exibida aqui ainda não foi definida entre mostrar um recorte fixo (10/20 mais recentes) ou paginação." />
          )}
        </p>
        <Link
          href={`/pedidos?cliente=${customerId}` as Route}
          className="text-xs font-medium text-accent hover:underline"
        >
          Ver todos os pedidos deste cliente →
        </Link>
      </div>
      {recent.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Nenhum pedido deste cliente.</p>
      ) : (
        <Table>
          <THead>
            <tr>
              <TH>Pedido</TH>
              <TH>Descrição</TH>
              <TH>Valor</TH>
              <TH>Status</TH>
              <TH>Data</TH>
            </tr>
          </THead>
          <TBody>
            {recent.map((o) => (
              <TR key={o.id}>
                <TD className="font-mono text-xs">{o.reference || o.id}</TD>
                <TD>{o.description}</TD>
                <TD>{formatBRL(o.amount)}</TD>
                <TD>{ORDER_STATUS_LABEL[o.status]}</TD>
                <TD>{formatDate(o.createdAt)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
