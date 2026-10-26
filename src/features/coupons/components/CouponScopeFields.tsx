'use client';

import { withForm } from '@/components/ui/form';
import type { Course } from '@/types/catalog';
import type { Customer } from '@/types/customers';
import { emptyCoupon } from '../schemas/couponSchema';

/** Where the coupon applies: courses (none = whole catalog) and an optional target customer. */
export const CouponScopeFields = withForm({
  defaultValues: emptyCoupon,
  props: { courses: [] as Course[], customers: [] as Customer[] },
  render: function Render({ form, courses, customers }) {
    return (
      <>
        <form.AppField name="courseIds">
          {(f) => (
            <f.CheckboxListField
              label="Cursos aplicáveis"
              options={courses.map((c) => ({ value: c.id, label: c.title }))}
              help={(n) =>
                n === 0 ? 'Nenhum selecionado = vale para todo o catálogo' : `${n} curso(s) selecionado(s)`
              }
            />
          )}
        </form.AppField>
        <form.AppField name="customerId">
          {(f) => (
            <f.SelectField
              label="Cliente (cupom direcionado)"
              options={[
                { value: '', label: 'Nenhum — público' },
                ...customers.map((c) => ({ value: c.id, label: c.name })),
              ]}
              help="Quando selecionado, o cupom vale só para este cliente e não é anunciado publicamente."
            />
          )}
        </form.AppField>
      </>
    );
  },
});
