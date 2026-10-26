import { Building2, Mail, Phone } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import type { Customer } from '@/types/customers';
import { formatDocument } from '@/utils/format';
import { DetailSection } from './DetailSection';

export function OrderCustomerSection({ customer, sectorName }: { customer: Customer | undefined; sectorName: string }) {
  return (
    <DetailSection title="Cliente">
      {customer ? (
        <div className="space-y-1.5 rounded-xl border border-border p-3 text-sm">
          <p className="flex items-center gap-1.5 font-semibold">
            <Building2 aria-hidden className="size-4 shrink-0 text-accent" />
            <Link href={`/clientes?id=${customer.id}` as Route} className="text-accent hover:underline">
              {customer.name}
            </Link>
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            {formatDocument(customer.document)}
            {customer.cnpj && customer.cnpj !== customer.document && ` · CNPJ ${formatDocument(customer.cnpj)}`}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail aria-hidden className="size-3.5 shrink-0" /> {customer.email}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Phone aria-hidden className="size-3.5 shrink-0" /> {customer.phone}
          </p>
          <p className="text-xs text-muted-foreground">
            Empresa: {customer.company} · Setor: {sectorName}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Cliente removido.</p>
      )}
    </DetailSection>
  );
}
