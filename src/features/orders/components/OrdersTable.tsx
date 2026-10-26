'use client';

import { ExternalLink } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { PAYMENT_METHOD_LABEL } from '@/constants/labels';
import type { Course } from '@/types/catalog';
import type { Customer } from '@/types/customers';
import type { Enrollment } from '@/types/enrollments';
import type { Order } from '@/types/orders';
import { formatBRL, formatDateTime, formatDocument } from '@/utils/format';
import { OrderStatusBadge } from './OrderStatusBadge';

interface Props {
  orders: Order[];
  customerOf: (id: string) => Customer | undefined;
  coursesOf: (o: Order) => Course[];
  studentsOf: (o: Order) => Enrollment[];
  onOpen: (o: Order) => void;
}

function CreditsCell({ students }: { students: Enrollment[] }) {
  if (students.length === 0) return <span className="text-xs text-muted-foreground">—</span>;
  if (students.some((m) => m.status === 'pending')) return <Badge tone="warning">Crédito em aberto</Badge>;
  return (
    <Badge
      tone="success"
      title={students.map((m) => `${m.personName} · CPF ${formatDocument(m.personCpf)} · ${m.personEmail}`).join('\n')}
    >
      Vinculado
    </Badge>
  );
}

export function OrdersTable({ orders, customerOf, coursesOf, studentsOf, onOpen }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <THead>
          <tr>
            <TH>Pedido</TH>
            <TH>Data</TH>
            <TH>Cliente</TH>
            <TH>Produtos</TH>
            <TH>Valor</TH>
            <TH>Status</TH>
            <TH>Créditos</TH>
          </tr>
        </THead>
        <TBody>
          {orders.map((o) => {
            const customer = customerOf(o.customerId);
            const courses = coursesOf(o);
            return (
              <TR key={o.id}>
                <TD>
                  <button
                    type="button"
                    onClick={() => onOpen(o)}
                    className="text-left font-mono text-xs font-semibold hover:underline"
                  >
                    {o.reference !== '—' ? o.reference : o.id}
                  </button>
                  <p className="text-[11px] text-muted-foreground">{PAYMENT_METHOD_LABEL[o.method]}</p>
                </TD>
                <TD className="text-xs whitespace-nowrap">{formatDateTime(o.createdAt)}</TD>
                <TD>
                  {customer ? (
                    <>
                      <Link
                        href={`/clientes?id=${customer.id}` as Route}
                        className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                      >
                        {customer.name} <ExternalLink aria-hidden className="size-3" />
                      </Link>
                      <p className="font-mono text-[11px] text-muted-foreground">{formatDocument(customer.document)}</p>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">Cliente removido</span>
                  )}
                </TD>
                <TD className="max-w-[220px]">
                  <p className="truncate text-xs">
                    {courses.length > 0 ? courses.map((c) => c.title).join(', ') : o.description}
                  </p>
                </TD>
                <TD className="text-sm font-semibold whitespace-nowrap">{formatBRL(o.amount)}</TD>
                <TD>
                  <OrderStatusBadge status={o.status} />
                </TD>
                <TD>
                  <CreditsCell students={studentsOf(o)} />
                </TD>
              </TR>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
}
