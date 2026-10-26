'use client';

import { Send } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { submitHandler, useAppForm } from '@/components/ui/form';
import { Modal } from '@/components/ui/Modal';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Customer } from '@/types/customers';
import type { PaymentLink } from '@/types/paymentLinks';
import { createPaymentLink } from '../actions/paymentLinkActions';
import { paymentLinkSchema } from '../schemas/paymentLinkSchema';

export function PaymentLinkFormModal({
  customers,
  onClose,
  onSent,
}: {
  customers: Customer[];
  onClose: () => void;
  onSent: (link: PaymentLink) => void;
}) {
  const { pending, run } = useServerAction();
  const sendNow = useRef(false);
  const first = customers[0];
  const form = useAppForm({
    defaultValues: { customerId: first?.id ?? '', email: first?.email ?? '', description: '', amount: 0, message: '' },
    validators: { onSubmit: paymentLinkSchema },
    onSubmit: ({ value }) =>
      run(
        () => createPaymentLink(value, sendNow.current),
        sendNow.current ? `Email enviado (simulação) para ${value.email}` : 'Link criado como rascunho',
        (link) => {
          onClose();
          if (sendNow.current) onSent(link);
        },
      ),
  });
  const submit = (send: boolean) => {
    sendNow.current = send;
    void form.handleSubmit();
  };
  return (
    <Modal
      open
      onClose={onClose}
      title="Novo Link de Pagamento"
      footer={
        <>
          <Button variant="outline" disabled={pending} onClick={() => submit(false)}>
            Salvar como rascunho
          </Button>
          <Button variant="accent" disabled={pending} onClick={() => submit(true)}>
            <Send aria-hidden className="size-4" /> Criar e enviar email
          </Button>
        </>
      }
    >
      <form noValidate onSubmit={submitHandler(form)} className="space-y-4">
        <form.AppField
          name="customerId"
          listeners={{
            onChange: ({ value }) =>
              form.setFieldValue('email', customers.find((c) => c.id === value)?.email ?? form.getFieldValue('email')),
          }}
        >
          {(f) => (
            <f.SelectField
              label="Cliente"
              placeholder="Selecione um cliente"
              options={customers.map((c) => ({ value: c.id, label: c.name }))}
            />
          )}
        </form.AppField>
        <form.AppField name="email">{(f) => <f.TextField label="Email destinatário" type="email" />}</form.AppField>
        <form.AppField name="description">
          {(f) => <f.TextField label="Descrição da cobrança" placeholder="Ex: Curso de Segurança Aeroportuária" />}
        </form.AppField>
        <form.AppField name="amount">{(f) => <f.NumberField label="Valor (R$)" min={0} step={0.01} />}</form.AppField>
        <form.AppField name="message">
          {(f) => (
            <f.TextAreaField label="Mensagem (opcional)" rows={3} placeholder="Mensagem que aparecerá no email" />
          )}
        </form.AppField>
      </form>
    </Modal>
  );
}
