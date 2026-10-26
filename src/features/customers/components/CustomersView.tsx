'use client';

import { parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmActionModal } from '@/components/ui/ConfirmActionModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import type { Customer } from '@/types/customers';
import type { Order } from '@/types/orders';
import type { Sector } from '@/types/sectors';
import { deleteCustomer } from '../actions/customerActions';
import { CustomerModal } from './CustomerModal';
import { CustomersTable } from './CustomersTable';

const params = {
  q: parseAsString.withDefault(''),
  tag: parseAsStringLiteral(['account_holder', 'exempt'] as const),
  id: parseAsString,
};

export function CustomersView({
  customers,
  sectors,
  orders,
}: {
  customers: Customer[];
  sectors: Sector[];
  orders: Order[];
}) {
  // `?id=` opens a customer directly (links from the orders screen).
  const [{ q, tag, id }, setParams] = useQueryStates(params, { history: 'replace' });
  const [removing, setRemoving] = useState<Customer | null>(null);
  const term = q.toLowerCase();
  const shown = customers.filter(
    (c) =>
      (!tag || c.billingTag === tag) &&
      [c.name, c.email, c.company, c.document].some((v) => (v ?? '').toLowerCase().includes(term)),
  );
  const open = customers.find((c) => c.id === id);
  const tagButton = (value: 'account_holder' | 'exempt', label: string) => (
    <Button
      variant={tag === value ? 'primary' : 'outline'}
      aria-pressed={tag === value}
      onClick={() => void setParams({ tag: tag === value ? null : value })}
    >
      {label}
    </Button>
  );
  return (
    <>
      <PageHeader
        title="Clientes"
        subtitle={`${customers.length} clientes cadastrados`}
        actions={
          <p className="max-w-xs text-right text-xs text-muted-foreground">
            Clientes são criados automaticamente a partir do cadastro e das compras no site.
          </p>
        }
      />
      <div className="mb-5 flex flex-wrap gap-3">
        <SearchInput
          className="min-w-[220px] flex-1"
          value={q}
          onChange={(v) => void setParams({ q: v || null })}
          placeholder="Buscar por nome, email, empresa..."
        />
        {tagButton('account_holder', 'Mensalistas')}
        {tagButton('exempt', 'Isentos')}
      </div>
      {shown.length === 0 ? (
        <EmptyState title="Nenhum cliente encontrado." />
      ) : (
        <CustomersTable
          customers={shown}
          sectors={sectors}
          onOpen={(c) => void setParams({ id: c.id })}
          onDelete={setRemoving}
        />
      )}
      {open && (
        <CustomerModal
          key={open.id}
          customer={open}
          orders={orders}
          sectors={sectors}
          onClose={() => void setParams({ id: null })}
        />
      )}
      <ConfirmActionModal
        target={removing}
        title={(c) => `Remover ${c.name}?`}
        success="Cliente removido"
        action={(c) => deleteCustomer(c.id)}
        onClose={() => setRemoving(null)}
      />
    </>
  );
}
