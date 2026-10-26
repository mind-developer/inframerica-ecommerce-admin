'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { submitHandler, useAppForm } from '@/components/ui/form';
import { Modal } from '@/components/ui/Modal';
import { tabPanelProps, Tabs } from '@/components/ui/Tabs';
import { BILLING_TAG_LABEL } from '@/constants/labels';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Customer } from '@/types/customers';
import type { Order } from '@/types/orders';
import type { Sector } from '@/types/sectors';
import { saveCustomer } from '../actions/customerActions';
import { customerSchema, type CustomerFormValues } from '../schemas/customerSchema';
import { CustomerDataForm } from './CustomerDataForm';
import { CustomerOrdersTab } from './CustomerOrdersTab';
import { TargetedCouponForm } from './TargetedCouponForm';

type Tab = 'dados' | 'pedidos' | 'cupom';

const toValues = (c: Customer): CustomerFormValues => ({
  name: c.name,
  email: c.email,
  phone: c.phone,
  company: c.company,
  document: c.document,
  sectorId: c.sectorId ?? '',
  cnpj: c.cnpj ?? '',
  category: c.category ?? 'company',
  billingTag: c.billingTag ?? 'paying',
  address: c.address ?? '',
  city: c.city ?? '',
  state: c.state ?? '',
  zipCode: c.zipCode ?? '',
  stateRegistration: c.stateRegistration ?? '',
});

export function CustomerModal({
  customer,
  orders,
  sectors,
  onClose,
}: {
  customer: Customer;
  orders: Order[];
  sectors: Sector[];
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>('dados');
  const { pending, run } = useServerAction();
  const form = useAppForm({
    defaultValues: toValues(customer),
    validators: { onSubmit: customerSchema },
    onSubmit: ({ value }) => run(() => saveCustomer(customer.id, value), 'Cliente atualizado', onClose),
  });
  const tag = customer.billingTag;
  return (
    <Modal
      open
      size="lg"
      onClose={onClose}
      title={customer.name}
      description={
        <span className="flex flex-wrap items-center gap-2">
          Dados cadastrais, pedidos e cupom direcionado.
          {tag && tag !== 'paying' && (
            <Badge tone={tag === 'exempt' ? 'success' : 'info'}>{BILLING_TAG_LABEL[tag]}</Badge>
          )}
        </span>
      }
      footer={
        tab === 'dados' && (
          <>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="accent" disabled={pending} onClick={() => void form.handleSubmit()}>
              {pending ? 'Salvando…' : 'Salvar'}
            </Button>
          </>
        )
      }
    >
      <Tabs<Tab>
        idPrefix="cliente"
        className="mb-4"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'dados', label: 'Dados' },
          { id: 'pedidos', label: 'Pedidos' },
          { id: 'cupom', label: 'Cupom' },
        ]}
      />
      <div {...tabPanelProps('cliente', tab)}>
        {tab === 'dados' && (
          <form noValidate onSubmit={submitHandler(form)}>
            <CustomerDataForm form={form} sectors={sectors} />
          </form>
        )}
        {tab === 'pedidos' && (
          <CustomerOrdersTab customerId={customer.id} orders={orders.filter((o) => o.customerId === customer.id)} />
        )}
        {tab === 'cupom' && <TargetedCouponForm customer={customer} />}
      </div>
    </Modal>
  );
}
