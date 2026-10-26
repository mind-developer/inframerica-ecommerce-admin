'use client';

import type { ReactNode } from 'react';
import type { ActionResult } from '@/types/common';
import { ConfirmModal } from './ConfirmModal';
import { useServerAction } from './useServerAction';

interface Props<T> {
  /** The item being acted on; null keeps the modal closed. */
  target: T | null;
  title: (target: T) => string;
  message?: ReactNode;
  confirmLabel?: string;
  success: string;
  action: (target: T) => Promise<ActionResult<unknown>>;
  onClose: () => void;
}

/** Destructive confirmation that runs a server action, toasts the outcome and closes on success. */
export function ConfirmActionModal<T>({
  target,
  title,
  message,
  confirmLabel = 'Remover',
  success,
  action,
  onClose,
}: Props<T>) {
  const { pending, run } = useServerAction();
  return (
    <ConfirmModal
      open={target !== null}
      title={target !== null ? title(target) : ''}
      message={message}
      confirmLabel={confirmLabel}
      destructive
      pending={pending}
      onClose={onClose}
      onConfirm={() => target !== null && run(() => action(target), success, onClose)}
    />
  );
}
