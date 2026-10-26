'use client';

import type { ReactNode } from 'react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { submitHandler } from './index';

interface FormModalProps {
  form: { handleSubmit: () => unknown };
  title: string;
  description?: ReactNode;
  size?: 'md' | 'lg' | 'xl';
  pending: boolean;
  onClose: () => void;
  submitLabel?: string;
  children: ReactNode;
}

/** A modal holding one form, with the usual Cancelar / Salvar footer. */
export function FormModal({
  form,
  title,
  description,
  size,
  pending,
  onClose,
  submitLabel = 'Salvar',
  children,
}: FormModalProps) {
  return (
    <Modal
      open
      onClose={onClose}
      title={title}
      description={description}
      size={size}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="accent" disabled={pending} onClick={() => void form.handleSubmit()}>
            {pending ? 'Salvando…' : submitLabel}
          </Button>
        </>
      }
    >
      <form noValidate onSubmit={submitHandler(form)} className="space-y-4">
        {children}
      </form>
    </Modal>
  );
}
