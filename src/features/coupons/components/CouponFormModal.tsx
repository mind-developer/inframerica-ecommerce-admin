'use client';

import { useAppForm } from '@/components/ui/form';
import { FormModal } from '@/components/ui/form/FormModal';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Course } from '@/types/catalog';
import type { Coupon } from '@/types/coupons';
import type { Customer } from '@/types/customers';
import { CouponDiscountFields } from './CouponDiscountFields';
import { CouponScopeFields } from './CouponScopeFields';
import { saveCoupon } from '../actions/couponActions';
import { couponSchema, emptyCoupon, type CouponFormValues } from '../schemas/couponSchema';

const toValues = (c: Coupon): CouponFormValues => ({
  code: c.code,
  description: c.description,
  type: c.type,
  value: c.value,
  validUntil: c.validUntil ?? '',
  maxUses: c.maxUses,
  minimumAmount: c.minimumAmount,
  courseIds: c.courseIds,
  customerId: c.customerId ?? '',
  active: c.active,
});

export function CouponFormModal({
  coupon,
  courses,
  customers,
  onClose,
}: {
  coupon: Coupon | null;
  courses: Course[];
  customers: Customer[];
  onClose: () => void;
}) {
  const { pending, run } = useServerAction();
  const form = useAppForm({
    defaultValues: coupon ? toValues(coupon) : emptyCoupon,
    validators: { onSubmit: couponSchema },
    onSubmit: ({ value }) =>
      run(() => saveCoupon(coupon?.id ?? null, value), coupon ? 'Cupom atualizado' : 'Cupom criado', onClose),
  });
  return (
    <FormModal
      form={form}
      pending={pending}
      onClose={onClose}
      title={coupon ? 'Editar Cupom' : 'Novo Cupom'}
      description="O desconto é validado no checkout: código, prazo, limite de usos, valor mínimo e cursos aplicáveis."
    >
      <form.AppField name="code">
        {(f) => <f.TextField label="Código" placeholder="INFRA10" inputClassName="font-mono uppercase" required />}
      </form.AppField>
      <form.AppField name="description">
        {(f) => <f.TextField label="Descrição" placeholder="10% de desconto em toda a plataforma" />}
      </form.AppField>
      <CouponDiscountFields form={form} />
      <div className="grid grid-cols-2 gap-3">
        <form.AppField name="validUntil">
          {(f) => <f.TextField label="Válido até" type="date" help="Vazio = sem prazo" />}
        </form.AppField>
        <form.AppField name="maxUses">
          {(f) => <f.NumberField label="Limite de usos" min={0} placeholder="Ilimitado" nullable />}
        </form.AppField>
      </div>
      <form.AppField name="minimumAmount">
        {(f) => <f.NumberField label="Valor mínimo do pedido (R$)" min={0} />}
      </form.AppField>
      <CouponScopeFields form={form} courses={courses} customers={customers} />
      <form.AppField name="active">{(f) => <f.SwitchField label="Cupom ativo" />}</form.AppField>
    </FormModal>
  );
}
