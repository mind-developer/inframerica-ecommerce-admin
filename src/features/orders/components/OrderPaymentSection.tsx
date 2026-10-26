import { PAYMENT_METHOD_LABEL } from '@/constants/labels';
import type { Order } from '@/types/orders';
import { formatDateTime } from '@/utils/format';
import { DetailSection } from './DetailSection';

export function OrderPaymentSection({ order }: { order: Order }) {
  const rows = [
    [
      'Referência',
      <span key="r" className="font-mono text-xs">
        {order.reference || '—'}
      </span>,
    ],
    ['Método', PAYMENT_METHOD_LABEL[order.method]],
    ['Criado em', formatDateTime(order.createdAt)],
    ['Pago em', order.paidAt ? formatDateTime(order.paidAt) : '—'],
  ] as const;
  return (
    <DetailSection title="Pagamento">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </DetailSection>
  );
}
