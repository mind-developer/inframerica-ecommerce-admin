'use client';

import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from '@/components/ui/toast';
import { PAYMENT_METHOD_LABEL } from '@/constants/labels';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Order } from '@/types/orders';
import { formatBRL } from '@/utils/format';
import { cancelOrder } from '../actions/orderActions';

interface Props {
  order: Order;
  /** Shown up front; the action enforces the same rule. */
  blocked: string | null;
  onClose: () => void;
  onCanceled: () => void;
}

export function CancelOrderModal({ order, blocked, onClose, onCanceled }: Props) {
  const [reason, setReason] = useState('');
  const { pending, run } = useServerAction();
  const confirm = () =>
    run(
      () => cancelOrder(order.id, reason),
      `E-mail de cancelamento enviado.`,
      ({ email }) => {
        toast(
          `Estorno automático iniciado via ${PAYMENT_METHOD_LABEL[order.method]}.`,
          email ? `Cliente avisado em ${email}.` : undefined,
          'success',
        );
        toast('Créditos do pedido retirados.', undefined, 'success');
        onCanceled();
      },
    );
  return (
    <Modal
      open
      onClose={onClose}
      title="Cancelar pedido"
      description={`Pedido ${order.id} — ${formatBRL(order.amount)}`}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Voltar
          </Button>
          <Button variant="destructive" disabled={Boolean(blocked) || pending} onClick={confirm}>
            Confirmar cancelamento
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {blocked && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive"
          >
            <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" /> {blocked}
          </p>
        )}
        <Field id="cancel-reason" label="Justificativa" required>
          <Textarea
            id="cancel-reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explique o motivo do cancelamento…"
          />
        </Field>
      </div>
    </Modal>
  );
}
