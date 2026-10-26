'use client';

import { Ticket } from 'lucide-react';
import { submitHandler, useAppForm } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Customer } from '@/types/customers';
import { createTargetedCoupon } from '../actions/customerActions';
import { emptyTargetedCoupon, targetedCouponSchema } from '../schemas/customerSchema';

export function TargetedCouponForm({ customer }: { customer: Customer }) {
  const { run } = useServerAction();
  const form = useAppForm({
    defaultValues: emptyTargetedCoupon,
    validators: { onSubmit: targetedCouponSchema },
    onSubmit: ({ value }) =>
      run(
        () => createTargetedCoupon(customer.id, customer.name, value),
        undefined,
        (coupon) => {
          form.reset();
          toast(`Cupom ${coupon.code} enviado por e-mail para ${customer.email}`, undefined, 'success');
        },
      ),
  });
  return (
    <form noValidate onSubmit={submitHandler(form)} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Cria um cupom direcionado exclusivamente a este cliente — não fica público, é enviado por e-mail.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <form.AppField name="code">
          {(f) => <f.TextField label="Código" placeholder="EX: VIP10" inputClassName="font-mono uppercase" />}
        </form.AppField>
        <form.AppField name="type">
          {(f) => (
            <f.SelectField
              label="Tipo de desconto"
              options={[
                { value: 'percent', label: 'Percentual (%)' },
                { value: 'fixed', label: 'Valor fixo (R$)' },
              ]}
            />
          )}
        </form.AppField>
        <form.Subscribe selector={(s) => s.values.type}>
          {(type) => (
            <form.AppField name="value">
              {(f) => <f.NumberField label={type === 'percent' ? 'Percentual' : 'Valor em R$'} min={0} />}
            </form.AppField>
          )}
        </form.Subscribe>
        <form.AppField name="maxUses">
          {(f) => <f.NumberField label="Quantidade de usos" min={0} placeholder="Ilimitado" nullable />}
        </form.AppField>
      </div>
      <form.AppForm>
        <form.SubmitButton pendingLabel="Enviando…">
          <Ticket aria-hidden className="size-4" /> Criar cupom para este cliente
        </form.SubmitButton>
      </form.AppForm>
    </form>
  );
}
