'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { submitHandler, useAppForm } from '@/components/ui/form';
import { Modal } from '@/components/ui/Modal';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Sector } from '@/types/sectors';
import { saveSector } from '../actions/sectorActions';
import { emptySector, sectorSchema, type SectorFormValues } from '../schemas/sectorSchema';
import { deactivationWarning, type SectorLinks } from '../utils/sectorLinks';

export function SectorFormModal({
  sector,
  links,
  onClose,
}: {
  sector: Sector | null;
  links: SectorLinks;
  onClose: () => void;
}) {
  const { pending, run } = useServerAction();
  /** Values held while the admin confirms deactivating a sector that still has links (#52). */
  const [confirming, setConfirming] = useState<SectorFormValues | null>(null);
  const warning = deactivationWarning(links);
  const save = (value: SectorFormValues) =>
    run(() => saveSector(sector?.id ?? null, value), sector ? 'Setor atualizado' : 'Setor criado', onClose);
  const form = useAppForm({
    defaultValues: sector
      ? { name: sector.name, description: sector.description, manager: sector.manager, active: sector.active }
      : emptySector,
    validators: { onSubmit: sectorSchema },
    onSubmit: ({ value }) => (sector?.active && !value.active && warning ? setConfirming(value) : save(value)),
  });
  // The confirmation is a sibling, not a child: React's onClose bubbles, and "Voltar" would close the form too.
  return (
    <>
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
      <ConfirmModal
        open={confirming !== null}
        title="Desativar setor?"
        message={warning}
        confirmLabel="Desativar setor"
        destructive
        pending={pending}
        onConfirm={() => confirming && save(confirming)}
        onClose={() => setConfirming(null)}
      />
    </>
  );
}
