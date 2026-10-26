'use client';

import { Button } from '@/components/ui/Button';
import { submitHandler, useAppForm } from '@/components/ui/form';
import { Modal } from '@/components/ui/Modal';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Sector } from '@/types/sectors';
import { saveSector } from '../actions/sectorActions';
import { emptySector, sectorSchema } from '../schemas/sectorSchema';

export function SectorFormModal({ sector, onClose }: { sector: Sector | null; onClose: () => void }) {
  const { pending, run } = useServerAction();
  const form = useAppForm({
    defaultValues: sector
      ? { name: sector.name, description: sector.description, manager: sector.manager, active: sector.active }
      : emptySector,
    validators: { onSubmit: sectorSchema },
    onSubmit: ({ value }) =>
      run(() => saveSector(sector?.id ?? null, value), sector ? 'Setor atualizado' : 'Setor criado', onClose),
  });
  return (
    <Modal
      open
      onClose={onClose}
      title={sector ? 'Editar Setor' : 'Novo Setor'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="accent" disabled={pending} onClick={() => void form.handleSubmit()}>
            Salvar
          </Button>
        </>
      }
    >
      <form noValidate onSubmit={submitHandler(form)} className="space-y-4">
        <form.AppField name="name">{(f) => <f.TextField label="Nome" required />}</form.AppField>
        <form.AppField name="description">{(f) => <f.TextAreaField label="Descrição" rows={3} />}</form.AppField>
        <form.AppField name="manager">{(f) => <f.TextField label="Responsável" />}</form.AppField>
        <form.AppField name="active">{(f) => <f.SwitchField label="Ativo" />}</form.AppField>
      </form>
    </Modal>
  );
}
