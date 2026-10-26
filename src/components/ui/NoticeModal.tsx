'use client';

import type { ReactNode } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

/** "You can't do this, here's why" — one OK button. */
export function NoticeModal({
  open,
  title,
  message,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  message?: ReactNode;
  onClose: () => void;
  children?: ReactNode;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={message}
      footer={<Button onClick={onClose}>Entendi</Button>}
    >
      {children}
    </Modal>
  );
}
