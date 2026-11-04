'use client';

import { KeyRound, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { withForm } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import { BILLING_TAG_LABEL, CUSTOMER_CATEGORY_LABEL } from '@/constants/labels';
import { passwordLink } from '@/utils/passwordLink';
import type { CustomerFormValues } from '../schemas/customerSchema';

const options = <K extends string>(labels: Record<K, string>) =>
  (Object.keys(labels) as K[]).map((value) => ({ value, label: labels[value] }));

export const CustomerDataForm = withForm({
  defaultValues: {} as CustomerFormValues,
  render: function Render({ form }) {
    const copyLink = () =>
      void navigator.clipboard.writeText(passwordLink()).then(() => toast('Link copiado', undefined, 'success'));
    return (
      <div className="space-y-4">
        <form.AppField name="name">{(f) => <f.TextField label="Nome completo" required />}</form.AppField>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="email">{(f) => <f.TextField label="Email" type="email" required />}</form.AppField>
          <form.AppField name="phone">{(f) => <f.TextField label="Telefone" type="tel" />}</form.AppField>
          <form.AppField name="company">{(f) => <f.TextField label="Empresa" />}</form.AppField>
          <form.AppField name="document">{(f) => <f.TextField label="CPF" />}</form.AppField>
          <form.AppField name="category">
            {(f) => <f.SelectField label="Categoria" options={options(CUSTOMER_CATEGORY_LABEL)} />}
          </form.AppField>
          <form.AppField name="billingTag">
            {(f) => <f.SelectField label="Tipo de faturamento" options={options(BILLING_TAG_LABEL)} />}
          </form.AppField>
        </div>
        <form.Subscribe selector={(s) => s.values.category}>
          {(category) =>
            category !== 'individual' && (
              <form.AppField name="cnpj">
                {(f) => <f.TextField label="CNPJ" placeholder="00.000.000/0001-00" />}
              </form.AppField>
            )
          }
        </form.Subscribe>
        <fieldset className="space-y-3 border-t border-border pt-3">
          <legend className="mt-3 mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Dados para faturamento (SAP)
          </legend>
          <form.AppField name="address">{(f) => <f.TextField label="Endereço" />}</form.AppField>
          <div className="grid grid-cols-3 gap-3">
            <form.AppField name="city">{(f) => <f.TextField label="Cidade" />}</form.AppField>
            <form.AppField name="state">
              {(f) => <f.TextField label="Estado" inputClassName="uppercase" />}
            </form.AppField>
            <form.AppField name="zipCode">{(f) => <f.TextField label="CEP" />}</form.AppField>
          </div>
          <form.AppField name="stateRegistration">{(f) => <f.TextField label="Inscrição estadual" />}</form.AppField>
        </fieldset>
        <div className="border-t border-border pt-3">
          <p className="mt-3 mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Senha de acesso
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast(
                  `Link de definição de senha reenviado para ${form.getFieldValue('email') || 'o cliente'}`,
                  undefined,
                  'success',
                )
              }
            >
              <KeyRound aria-hidden className="size-3.5" /> Reenviar link para cadastrar senha
            </Button>
            <Button variant="outline" size="sm" onClick={copyLink}>
              <LinkIcon aria-hidden className="size-3.5" /> Gerar link
            </Button>
          </div>
        </div>
      </div>
    );
  },
});
