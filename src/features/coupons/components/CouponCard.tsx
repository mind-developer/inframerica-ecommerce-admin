'use client';

import { Copy, Pencil, Ticket, Trash2 } from 'lucide-react';
import { Badge, type Tone } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { Progress } from '@/components/ui/Progress';
import { toast } from '@/components/ui/toast';
import { couponState, type CouponState } from '@/domain/coupons';
import type { Coupon } from '@/types/coupons';
import { civilToday } from '@/utils/civilDate';
import { formatBRL, formatDate } from '@/utils/format';

const STATE: Record<CouponState, { label: string; tone: Tone }> = {
  active: { label: 'Ativo', tone: 'primary' },
  inactive: { label: 'Inativo', tone: 'neutral' },
  expired: { label: 'Expirado', tone: 'danger' },
  exhausted: { label: 'Esgotado', tone: 'danger' },
};

export function CouponCard({
  coupon: c,
  customerName,
  onEdit,
  onDelete,
}: {
  coupon: Coupon;
  customerName: string | null;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const state = STATE[couponState(c, civilToday())];
  const pct = c.maxUses && c.maxUses > 0 ? Math.min(100, Math.round((c.uses / c.maxUses) * 100)) : null;
  const copy = () =>
    void navigator.clipboard.writeText(c.code).then(() => toast('Código copiado', undefined, 'success'));
  const detail = (label: string, value: string) => (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-sm font-semibold">{value}</dd>
    </div>
  );
  return (
    <Card className="rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Ticket aria-hidden className="size-4 shrink-0 text-accent" />
            <button
              type="button"
              onClick={copy}
              title="Copiar código"
              className="inline-flex items-center gap-1 font-mono font-bold tracking-wide hover:text-accent"
            >
              {c.code} <Copy aria-hidden className="size-3 opacity-50" />
            </button>
            <Badge tone={state.tone}>{state.label}</Badge>
            {c.customerId ? (
              <Badge tone="violet">Direcionado — {customerName ?? 'cliente removido'}</Badge>
            ) : (
              <Badge>Público</Badge>
            )}
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">{c.description}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <IconButton label={`Editar ${c.code}`} onClick={onEdit}>
            <Pencil aria-hidden className="size-4" />
          </IconButton>
          <IconButton label={`Remover ${c.code}`} onClick={onDelete}>
            <Trash2 aria-hidden className="size-4 text-destructive" />
          </IconButton>
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-3 text-xs">
        {detail('Desconto', c.type === 'percent' ? `${c.value}%` : formatBRL(c.value))}
        {detail('Pedido mínimo', c.minimumAmount > 0 ? formatBRL(c.minimumAmount) : '—')}
        {detail('Validade', c.validUntil ? formatDate(c.validUntil) : 'Sem prazo')}
        {detail('Usos', `${c.uses}${c.maxUses !== null ? ` / ${c.maxUses}` : ' (ilimitado)'}`)}
      </dl>
      {pct !== null && <Progress value={pct} className="mt-3" label={`${pct}% dos usos`} />}
      {c.courseIds.length > 0 && (
        <p className="mt-3 text-[11px] text-muted-foreground">Restrito a {c.courseIds.length} curso(s)</p>
      )}
    </Card>
  );
}
