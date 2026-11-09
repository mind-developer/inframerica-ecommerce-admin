'use client';

import { KeyRound, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { withForm } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import { PUBLIC_SPHERE_LABEL } from '@/constants/brazil';
import { BILLING_TAG_LABEL, CUSTOMER_CATEGORY_LABEL } from '@/constants/labels';
import { useServerAction } from '@/components/ui/useServerAction';
import { generatePasswordLink, sendPasswordEmail } from '../actions/customerActions';
import type { CustomerFormValues } from '../schemas/customerSchema';
import { CustomerBillingFields } from './CustomerBillingFields';

const options = <K extends string>(labels: Record<K, string>) =>
  (Object.keys(labels) as K[]).map((value) => ({ value, label: labels[value] }));

export const CustomerDataForm = withForm({
  defaultValues: {} as CustomerFormValues,
  props: {} as { customerId: string; email: string; termsAcceptedAt: string | null },
  render: function Render({ form, customerId, email, termsAcceptedAt }) {
    const { pending, run } = useServerAction();
    const copyLink = (url: string) =>
      void navigator.clipboard.writeText(url).then(
        () => toast('Link copiado. Ele vale por 1 hora.', undefined, 'success'),
        () => toast('Não foi possível copiar o link.', undefined, 'error'),
      );
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
              <div className="grid gap-4 sm:grid-cols-2">
                <form.AppField name="cnpj">
                  {(f) => <f.TextField label="CNPJ" placeholder="00.000.000/0001-00" />}
                </form.AppField>
                {category === 'public_agency' && (
                  <form.AppField name="publicSphere">
                    {(f) => (
                      <f.SelectField
                        label="Esfera do órgão"
                        placeholder="Selecione"
                        options={options(PUBLIC_SPHERE_LABEL)}
                      />
                    )}
                  </form.AppField>
                )}
              </div>
            )
          }
        </form.Subscribe>
        <CustomerBillingFields form={form} termsAcceptedAt={termsAcceptedAt} />
        <div className="border-t border-border pt-3">
          <p className="mt-3 mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Senha de acesso
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() => run(() => sendPasswordEmail(customerId), `E-mail enviado para ${email}`)}
            >
              <KeyRound aria-hidden className="size-3.5" /> Reenviar link para cadastrar senha
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() => run(() => generatePasswordLink(customerId), undefined, copyLink)}
            >
              <LinkIcon aria-hidden className="size-3.5" /> Gerar link
            </Button>
          </div>
        </div>
      </div>
    );
  },
});
