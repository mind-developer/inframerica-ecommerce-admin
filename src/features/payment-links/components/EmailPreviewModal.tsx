'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { PaymentLink } from '@/types/paymentLinks';
import { formatBRL } from '@/utils/format';

/** What the customer would receive (the e-mail itself is simulated). */
export function EmailPreviewModal({ link, onClose }: { link: PaymentLink | null; onClose: () => void }) {
  return (
    <Modal
      open={Boolean(link)}
      onClose={onClose}
      title="Email enviado"
      description="Simulação do email entregue ao cliente"
      footer={<Button onClick={onClose}>Fechar</Button>}
    >
      {link && (
        <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4 text-sm">
          <p>
            <span className="text-xs text-muted-foreground">Para:</span>{' '}
            <span className="font-medium">{link.email}</span>
          </p>
          <p>
            <span className="text-xs text-muted-foreground">Assunto:</span>{' '}
            <span className="font-medium">Cobrança Inframérica - {link.description}</span>
          </p>
          <div className="space-y-2 border-t border-border pt-3">
            <p>Olá,</p>
            <p>
              Você recebeu uma cobrança de <strong>{formatBRL(link.amount)}</strong> referente a{' '}
              <strong>{link.description}</strong>.
            </p>
            <p>Para concluir o pagamento, acesse:</p>
            <p className="rounded bg-background p-2 font-mono text-xs break-all">{link.url}</p>
            <p className="text-xs text-muted-foreground">Atenciosamente, Inframérica</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
