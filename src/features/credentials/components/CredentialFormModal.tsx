'use client';

import { Button } from '@/components/ui/Button';
import { submitHandler, useAppForm } from '@/components/ui/form';
import { Modal } from '@/components/ui/Modal';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Credential } from '@/types/catalog';
import type { Sector } from '@/types/sectors';
import { saveCredential } from '../actions/credentialActions';
import { credentialSchema, emptyCredential } from '../schemas/credentialSchema';

export function CredentialFormModal({
  credential,
  sectors,
  onClose,
}: {
  credential: Credential | null;
  sectors: Sector[];
  onClose: () => void;
}) {
  const { pending, run } = useServerAction();
  const form = useAppForm({
    defaultValues: credential
      ? {
          name: credential.name,
          acronym: credential.acronym,
          description: credential.description,
          validityMonths: credential.validityMonths,
          sectorIds: credential.sectorIds,
          active: credential.active,
        }
      : emptyCredential,
    validators: { onSubmit: credentialSchema },
    onSubmit: ({ value }) =>
      run(
        () => saveCredential(credential?.id ?? null, value),
        credential ? 'Credencial atualizada' : 'Credencial criada',
        onClose,
      ),
  });
  return (
    <Modal
      open
      onClose={onClose}
      title={credential ? 'Editar Credencial' : 'Nova Credencial'}
      description="A credencial define quais setores o portador está habilitado a operar."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={pending} onClick={() => void form.handleSubmit()}>
            Salvar
          </Button>
        </>
      }
    >
      <form noValidate onSubmit={submitHandler(form)} className="space-y-4">
        <div className="grid grid-cols-[1fr_120px] gap-3">
          <form.AppField name="name">
            {(f) => <f.TextField label="Nome" placeholder="Ex: Credencial Aeroportuária (ANAC)" required />}
          </form.AppField>
          <form.AppField name="acronym">
            {(f) => <f.TextField label="Sigla" placeholder="CA" inputClassName="uppercase" required />}
          </form.AppField>
        </div>
        <form.AppField name="description">
          {(f) => <f.TextAreaField label="Descrição" rows={3} placeholder="O que esta credencial habilita" />}
        </form.AppField>
        <form.AppField name="validityMonths">
          {(f) => <f.NumberField label="Validade (meses)" min={0} help="0 = sem validade definida" />}
        </form.AppField>
        <form.AppField name="sectorIds">
          {(f) => (
            <f.CheckboxListField
              label="Setores habilitados"
              options={sectors.map((s) => ({ value: s.id, label: s.name }))}
              help={(n) => `${n} setor(es) selecionado(s)`}
            />
          )}
        </form.AppField>
        <form.AppField name="active">
          {(f) => (
            <f.SwitchField label="Credencial ativa" help="Credenciais inativas não aparecem nos filtros do site." />
          )}
        </form.AppField>
      </form>
    </Modal>
  );
}
