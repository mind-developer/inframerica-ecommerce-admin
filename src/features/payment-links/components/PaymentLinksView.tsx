'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Customer } from '@/types/customers';
import type { PaymentLink } from '@/types/paymentLinks';
import { deletePaymentLink, markPaymentLinkPaid, sendPaymentLink } from '../actions/paymentLinkActions';
import { EmailPreviewModal } from './EmailPreviewModal';
import { PaymentLinkFormModal } from './PaymentLinkFormModal';
import { PaymentLinkRow } from './PaymentLinkRow';

export function PaymentLinksView({ links, customers }: { links: PaymentLink[]; customers: Customer[] }) {
  const [creating, setCreating] = useState(false);
  const [preview, setPreview] = useState<PaymentLink | null>(null);
  const { run } = useServerAction();
  return (
    <>
      <PageHeader
        soon
        title="Links de Pagamento"
        subtitle="Gere e envie cobranças por email"
        actions={
          <Button variant="accent" onClick={() => setCreating(true)}>
            <Plus aria-hidden className="size-4" /> Novo Link
          </Button>
        }
      />
      {links.length === 0 ? (
        <EmptyState title="Nenhum link de pagamento criado." />
      ) : (
        <ul className="grid gap-3">
          {links.map((l) => (
            <PaymentLinkRow
              key={l.id}
              link={l}
              customerName={customers.find((c) => c.id === l.customerId)?.name ?? '—'}
              onSend={() => run(() => sendPaymentLink(l.id), `Email enviado (simulação) para ${l.email}`, setPreview)}
              onPaid={() => run(() => markPaymentLinkPaid(l.id), 'Pagamento confirmado e registrado em Pedidos')}
              onDelete={() => run(() => deletePaymentLink(l.id), 'Link removido')}
            />
          ))}
        </ul>
      )}
      {creating && (
        <PaymentLinkFormModal customers={customers} onClose={() => setCreating(false)} onSent={setPreview} />
      )}
      <EmailPreviewModal link={preview} onClose={() => setPreview(null)} />
    </>
  );
}
