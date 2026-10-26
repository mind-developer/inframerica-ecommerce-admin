'use client';

import { withForm } from '@/components/ui/form';
import { emptyCoupon } from '../schemas/couponSchema';

/** Discount type and value; the value's label and bound follow the type. */
export const CouponDiscountFields = withForm({
  defaultValues: emptyCoupon,
  render: function Render({ form }) {
    return (
      <div className="grid grid-cols-2 gap-3">
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
              {(f) => (
                <f.NumberField
                  label={type === 'percent' ? 'Percentual' : 'Valor em R$'}
                  min={0}
                  max={type === 'percent' ? 100 : undefined}
                />
              )}
            </form.AppField>
          )}
        </form.Subscribe>
      </div>
    );
  },
});
