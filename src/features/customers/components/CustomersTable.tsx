'use client';

import { Mail, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { toast } from '@/components/ui/toast';
import { BILLING_TAG_LABEL } from '@/constants/labels';
import type { Customer } from '@/types/customers';
import type { Sector } from '@/types/sectors';

export function CustomersTable({
  customers,
  sectors,
  onOpen,
  onDelete,
}: {
  customers: Customer[];
  sectors: Sector[];
  onOpen: (c: Customer) => void;
  onDelete: (c: Customer) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <Table>
        <THead>
          <tr>
            <TH>Cliente</TH>
            <TH>Contato</TH>
            <TH>Empresa / Documento</TH>
            <TH>Setor</TH>
            <TH className="text-right">Ações</TH>
          </tr>
        </THead>
        <TBody>
          {customers.map((c) => {
            const sector = sectors.find((s) => s.id === c.sectorId);
            return (
              <TR key={c.id}>
                <TD className="font-medium text-foreground">
                  <button
                    type="button"
                    onClick={() => onOpen(c)}
                    className="flex flex-wrap items-center gap-2 text-left hover:underline"
                  >
                    {c.name}
                    {c.billingTag && c.billingTag !== 'paying' && (
                      <Badge tone={c.billingTag === 'exempt' ? 'success' : 'info'}>
                        {BILLING_TAG_LABEL[c.billingTag]}
                      </Badge>
                    )}
                  </button>
                </TD>
                <TD className="text-sm text-muted-foreground">
                  {c.email}
                  <br />
                  {c.phone || '—'}
                </TD>
                <TD className="text-sm text-muted-foreground">
                  {c.company || '—'}
                  <br />
                  {c.cnpj || c.document || '—'}
                </TD>
                <TD>{sector ? <Badge tone="info">{sector.name}</Badge> : '—'}</TD>
                <TD className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <IconButton
                      label="Reenviar e-mail de definição de senha"
                      onClick={() =>
                        toast(`E-mail de definição de senha reenviado para ${c.email}`, undefined, 'success')
                      }
                    >
                      <Mail aria-hidden className="size-4" />
                    </IconButton>
                    <IconButton label={`Editar ${c.name}`} onClick={() => onOpen(c)}>
                      <Pencil aria-hidden className="size-4" />
                    </IconButton>
                    <IconButton label={`Remover ${c.name}`} onClick={() => onDelete(c)}>
                      <Trash2 aria-hidden className="size-4 text-destructive" />
                    </IconButton>
                  </div>
                </TD>
              </TR>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
}
