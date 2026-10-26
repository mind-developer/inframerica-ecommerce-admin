import { CheckCircle2, Clock, RotateCcw, XCircle } from 'lucide-react';
import { Badge, type Tone } from '@/components/ui/Badge';
import { ORDER_STATUS_LABEL } from '@/constants/labels';
import type { OrderStatus } from '@/types/orders';

const STYLE: Record<OrderStatus, { tone: Tone; Icon: typeof Clock }> = {
  paid: { tone: 'success', Icon: CheckCircle2 },
  pending: { tone: 'warning', Icon: Clock },
  failed: { tone: 'danger', Icon: XCircle },
  refunded: { tone: 'neutral', Icon: RotateCcw },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { tone, Icon } = STYLE[status];
  return (
    <Badge tone={tone} className="text-[11px]">
      <Icon aria-hidden className="size-3" /> {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}
