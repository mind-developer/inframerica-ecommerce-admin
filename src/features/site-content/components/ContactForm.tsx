'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { submitHandler, useAppForm } from '@/components/ui/form';
import { useServerAction } from '@/components/ui/useServerAction';
import type { SiteContent } from '@/types/content';
import { saveContact } from '../actions/contentActions';
import { contactSchema } from '../schemas/contentSchemas';
import { SaveRow } from './SaveRow';

export function ContactForm({ contact }: { contact: SiteContent['contact'] }) {
  const { pending, run } = useServerAction();
  const form = useAppForm({
    defaultValues: contact,
    validators: { onSubmit: contactSchema },
    onSubmit: ({ value }) => run(() => saveContact(value), 'Contato salvo'),
  });
  return (
    <Card>
      <CardContent className="pt-6">
        <form noValidate onSubmit={submitHandler(form)} className="space-y-4">
          <form.AppField name="email">{(f) => <f.TextField label="E-mail" type="email" />}</form.AppField>
          <form.AppField name="phone">{(f) => <f.TextField label="Telefone" type="tel" />}</form.AppField>
          <form.AppField name="address">{(f) => <f.TextAreaField label="Endereço" rows={2} />}</form.AppField>
          <SaveRow label="Salvar contato" pending={pending} />
        </form>
      </CardContent>
    </Card>
  );
}
