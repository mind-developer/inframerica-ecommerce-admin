'use client';

import { useQueryStates } from 'nuqs';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmActionModal } from '@/components/ui/ConfirmActionModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { SearchInput } from '@/components/ui/SearchInput';
import type { Page } from '@/types/common';
import type { Customer } from '@/types/customers';
import type { Order } from '@/types/orders';
import { deleteCustomer } from '../actions/customerActions';
import { customerListParams } from '../utils/customerListParams';
import { CustomerModal } from './CustomerModal';
import { CustomersTable } from './CustomersTable';

export function CustomersView({
  result,
  opened,
  orders,
}: {
  result: Page<Customer>;
  /** The customer `?id=` points to, found by the server even off this page. */
  opened: Customer | null;
  orders: Order[];
}) {
  const { items: customers, total, page, pageSize } = result;
  // `?id=` opens a customer directly (links from the orders screen).
  // `shallow: false`: search and tag are filtered by the API, each change asks the server again.
  const [{ q, tag, id }, setParams] = useQueryStates(customerListParams, {
    history: 'replace',
    shallow: false,
    throttleMs: 400,
  });
  const [removing, setRemoving] = useState<Customer | null>(null);
  const tagButton = (value: 'account_holder' | 'exempt', label: string) => (
    <Button
      variant={tag === value ? 'primary' : 'outline'}
      aria-pressed={tag === value}
      onClick={() => void setParams({ tag: tag === value ? null : value, page: null })}
    >
      {label}
    </Button>
  );
  return (
    <>
      <PageHeader
        title="Clientes"
        subtitle={countLabel(total, Boolean(q || tag))}
        actions={
          <p className="max-w-xs text-right text-xs text-muted-foreground">
            Clientes são criados automaticamente a partir do cadastro no site.
          </p>
        }
      />
      <div className="mb-5 flex flex-wrap gap-3">
        <SearchInput
          className="min-w-[220px] flex-1"
          value={q}
          onChange={(v) => void setParams({ q: v || null, page: null })}
          placeholder="Buscar por nome, email, empresa..."
        />
        {tagButton('account_holder', 'Mensalistas')}
        {tagButton('exempt', 'Isentos')}
      </div>
      {customers.length === 0 ? (
        <EmptyState title="Nenhum cliente encontrado." />
      ) : (
        <CustomersTable customers={customers} onOpen={(c) => void setParams({ id: c.id })} onDelete={setRemoving} />
      )}
      <Pagination page={page} pageSize={pageSize} total={total} onChange={(p) => void setParams({ page: p })} />
      {opened && id === opened.id && (
        <CustomerModal key={opened.id} customer={opened} orders={orders} onClose={() => void setParams({ id: null })} />
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

/** "1 cliente cadastrado" / "3 clientes encontrados": found while filtering, registered otherwise. */
function countLabel(count: number, filtering: boolean) {
  const noun = count === 1 ? 'cliente' : 'clientes';
  const verb = filtering ? 'encontrado' : 'cadastrado';
  return `${count} ${noun} ${count === 1 ? verb : `${verb}s`}`;
}
