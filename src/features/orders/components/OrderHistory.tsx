import { Ban, Calendar, CreditCard, History, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PAYMENT_METHOD_LABEL } from '@/constants/labels';
import type { Order } from '@/types/orders';
import { formatDateTime } from '@/utils/format';
import { DetailSection } from './DetailSection';

export function OrderHistory({ order, onResendEmail }: { order: Order; onResendEmail: () => void }) {
  return (
    <DetailSection
      title={
        <>
          <History aria-hidden className="size-3.5" /> Histórico do pedido
        </>
      }
    >
      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2">
          <Calendar aria-hidden className="size-3.5 shrink-0 text-muted-foreground" /> Compra realizada em{' '}
          {formatDateTime(order.createdAt)}
        </li>
        <li className="flex items-center gap-2">
          <CreditCard aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
          Pagamento {order.paidAt ? `confirmado em ${formatDateTime(order.paidAt)}` : 'ainda não confirmado'} via{' '}
          {PAYMENT_METHOD_LABEL[order.method]}
        </li>
        {order.status === 'refunded' && (
          <li className="flex items-center gap-2 text-destructive">
            <Ban aria-hidden className="size-3.5 shrink-0" />
            Pedido cancelado{order.canceledAt ? ` em ${formatDateTime(order.canceledAt)}` : ''}
            {order.cancellationReason ? ` — motivo: ${order.cancellationReason}` : ''}
          </li>
        )}
      </ul>
      <Button variant="outline" size="sm" className="mt-3" onClick={onResendEmail}>
        <Mail aria-hidden className="size-3.5" /> Reenviar e-mail
      </Button>
    </DetailSection>
  );
}
