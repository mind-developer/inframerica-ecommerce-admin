'use client';

import { withForm } from '@/components/ui/form';
import { STATE_OPTIONS, TERMS_URL } from '@/constants/brazil';
import { lookupCep } from '@/services/viaCep';
import { formatDateTime } from '@/utils/format';
import type { CustomerFormValues } from '../schemas/customerSchema';

/** SAP billing data. The CEP fills city, state and IBGE code from ViaCEP; a typed street is kept. */
export const CustomerBillingFields = withForm({
  defaultValues: {} as CustomerFormValues,
  props: {} as { termsAcceptedAt: string | null },
  render: function Render({ form, termsAcceptedAt }) {
    const fillFromCep = async (cep: string) => {
      const found = await lookupCep(cep);
      if (!found) return;
      if (!form.getFieldValue('address')) form.setFieldValue('address', found.address);
      form.setFieldValue('city', found.city);
      form.setFieldValue('state', found.state);
      form.setFieldValue('ibgeCode', found.ibgeCode);
    };
    return (
      <fieldset className="space-y-3 border-t border-border pt-3">
        <legend className="mt-3 mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Dados para faturamento (SAP)
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          <form.AppField name="zipCode">
            {(f) => <f.TextField label="CEP" inputMode="numeric" onBlur={(cep) => void fillFromCep(cep)} />}
          </form.AppField>
          <form.AppField name="address">
            {(f) => <f.TextField label="Endereço" className="sm:col-span-2" />}
          </form.AppField>
          <form.AppField name="city">{(f) => <f.TextField label="Cidade" />}</form.AppField>
          <form.AppField name="state">
            {(f) => <f.SelectField label="Estado" placeholder="Selecione" options={STATE_OPTIONS} />}
          </form.AppField>
          <form.AppField name="ibgeCode">
            {(f) => <f.TextField label="Código IBGE" inputMode="numeric" />}
          </form.AppField>
        </div>
        <form.AppField name="stateRegistration">{(f) => <f.TextField label="Inscrição estadual" />}</form.AppField>
        <p className="text-xs text-muted-foreground">
          {termsAcceptedAt ? `Aceitou a ` : 'Ainda não aceitou a '}
          <a href={TERMS_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            política de uso do e-commerce
          </a>
          {termsAcceptedAt ? ` em ${formatDateTime(termsAcceptedAt)}.` : ' (conta anterior ao aceite).'}
        </p>
      </fieldset>
    );
  },
});
