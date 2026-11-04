'use client';

import { CheckCircle2, Copy, Send, Trash2 } from 'lucide-react';
import { Badge, type Tone } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { toast } from '@/components/ui/toast';
import { PAYMENT_LINK_STATUS_LABEL } from '@/constants/labels';
import type { PaymentLink, PaymentLinkStatus } from '@/types/paymentLinks';
import { formatBRL } from '@/utils/format';

const TONE: Record<PaymentLinkStatus, Tone> = { draft: 'neutral', sent: 'info', paid: 'success', expired: 'danger' };

export function PaymentLinkRow({
  link: l,
  customerName,
  onSend,
  onPaid,
  onDelete,
}: {
  link: PaymentLink;
  customerName: string;
  onSend: () => void;
  onPaid: () => void;
  onDelete: () => void;
}) {
  const copy = () => void navigator.clipboard.writeText(l.url).then(() => toast('Link copiado', undefined, 'success'));
  return (
    <Card className="flex items-start justify-between gap-4 rounded-xl px-6 py-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-semibold text-foreground">{l.description}</h2>
          <Badge tone={TONE[l.status]}>{PAYMENT_LINK_STATUS_LABEL[l.status].toUpperCase()}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {customerName} · {l.email}
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">{formatBRL(l.amount)}</p>
        <p className="mt-2 max-w-md truncate rounded-md bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground">
          {l.url}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <IconButton label="Copiar link" safeInReadOnly onClick={copy}>
          <Copy aria-hidden className="size-4" />
        </IconButton>
        {l.status === 'draft' && (
          <IconButton label="Enviar email" onClick={onSend}>
            <Send aria-hidden className="size-4 text-accent" />
          </IconButton>
        )}
        {l.status === 'sent' && (
          <IconButton label="Marcar como pago" onClick={onPaid}>
            <CheckCircle2 aria-hidden className="size-4 text-success" />
          </IconButton>
        )}
        <IconButton label="Remover link" onClick={onDelete}>
          <Trash2 aria-hidden className="size-4 text-destructive" />
        </IconButton>
      </div>
    </Card>
  );
}
