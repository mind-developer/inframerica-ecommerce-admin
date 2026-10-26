'use client';

import type { ReactNode } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Voltar',
  destructive,
  pending,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={message}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? 'destructive' : 'primary'} onClick={onConfirm} disabled={pending}>
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
