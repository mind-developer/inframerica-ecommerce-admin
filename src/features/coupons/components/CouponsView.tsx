'use client';

import { Plus } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import { useServerAction } from '@/components/ui/useServerAction';
import type { Course } from '@/types/catalog';
import type { Coupon } from '@/types/coupons';
import type { Customer } from '@/types/customers';
import { deleteCoupon } from '../actions/couponActions';
import { CouponCard } from './CouponCard';
import { CouponFormModal } from './CouponFormModal';

export function CouponsView({
  coupons,
  courses,
  customers,
}: {
  coupons: Coupon[];
  courses: Course[];
  customers: Customer[];
}) {
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''));
  const [editing, setEditing] = useState<Coupon | 'new' | null>(null);
  const [removing, setRemoving] = useState<Coupon | null>(null);
  const { pending, run } = useServerAction();
  const q = query.trim().toLowerCase();
  const shown = q
    ? coupons.filter((c) => c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    : coupons;
  const customerName = (id?: string | null) => customers.find((c) => c.id === id)?.name ?? null;

  return (
    <>
      <PageHeader
        title="Cupons"
        subtitle={`${coupons.length} cupons cadastrados · usados ${coupons.reduce((n, c) => n + c.uses, 0)} vezes`}
        actions={
          <Button onClick={() => setEditing('new')}>
            <Plus aria-hidden className="size-4" /> Novo Cupom
          </Button>
        }
      />
      <SearchInput
        className="mb-5 max-w-md"
        value={query}
        onChange={(v) => void setQuery(v || null)}
        placeholder="Buscar por código ou descrição"
      />
      {shown.length === 0 ? (
        <EmptyState title={q ? 'Nenhum cupom corresponde à busca.' : 'Nenhum cupom cadastrado.'} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {shown.map((c) => (
            <CouponCard
              key={c.id}
              coupon={c}
              customerName={customerName(c.customerId)}
              onEdit={() => setEditing(c)}
              onDelete={() => setRemoving(c)}
            />
          ))}
        </div>
      )}
      {editing && (
        <CouponFormModal
          coupon={editing === 'new' ? null : editing}
          courses={courses}
          customers={customers}
          onClose={() => setEditing(null)}
        />
      )}
      <ConfirmModal
        open={Boolean(removing)}
        title={`Remover o cupom ${removing?.code ?? ''}?`}
        confirmLabel="Remover"
        destructive
        pending={pending}
        onClose={() => setRemoving(null)}
        onConfirm={() =>
          removing &&
          run(
            () => deleteCoupon(removing.id),
            'Cupom removido',
            () => setRemoving(null),
          )
        }
      />
    </>
  );
}
