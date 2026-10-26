'use client';

import { useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from '@/components/ui/toast';
import { adminCancelBlockReason } from '@/domain/enrollmentRules';
import type { Order } from '@/types/orders';
import type { useOrderFilters } from '../hooks/useOrderFilters';
import type { OrderLookups } from '../utils/orderLookups';
import { CancelOrderModal } from './CancelOrderModal';
import { LinkCreditModal, type LinkTarget } from './LinkCreditModal';
import { OrderDetailModal } from './OrderDetailModal';
import { OrdersTable } from './OrdersTable';
import { linkBlockReason } from './OrderStudentRow';

interface Props {
  orders: Order[];
  allOrders: Order[];
  lookups: OrderLookups;
  controls: ReturnType<typeof useOrderFilters>;
}

/** Table plus its modals; the open order lives in `?pedido=` so it survives reloads and can be linked. */
export function OrdersList({ orders, allOrders, lookups, controls }: Props) {
  const [linking, setLinking] = useState<LinkTarget | null>(null);
  const [canceling, setCanceling] = useState(false);
  const open = allOrders.find((o) => o.id === controls.params.pedido);
  const close = () => void controls.set({ pedido: null });
  const customerEmail = open ? (lookups.customerOf(open.customerId)?.email ?? null) : null;
  const cancelBlocked = (o: Order) => {
    const students = lookups.studentsOf(o);
    return adminCancelBlockReason({
      anyStudentStarted: students.some((m) => m.status === 'in_progress' || m.status === 'completed'),
      paidAtIso: o.paidAt,
      isCanceled: o.status === 'refunded',
      isPaid: o.status === 'paid',
    });
  };
  return (
    <>
      {orders.length === 0 ? (
        <EmptyState title="Nenhum pedido encontrado com os filtros atuais." />
      ) : (
        <OrdersTable
          orders={orders}
          customerOf={lookups.customerOf}
          coursesOf={lookups.coursesOf}
          studentsOf={lookups.studentsOf}
          onOpen={(o) => void controls.set({ pedido: o.id })}
        />
      )}
      {open && (
        <OrderDetailModal
          key={open.id}
          order={open}
          lookups={lookups}
          onClose={close}
          onResendEmail={() => toast(`E-mail reenviado para ${customerEmail ?? 'cliente'}.`, undefined, 'success')}
          onChangeLink={(student, cohortId) => {
            const blocked = linkBlockReason(student);
            if (blocked) return toast(blocked, undefined, 'error');
            setLinking({ student, cohortId });
          }}
          onCancel={() => setCanceling(true)}
        />
      )}
      {open && linking && (
        <LinkCreditModal
          target={linking}
          cohorts={lookups.cohortsOfCourse(linking.student.courseId)}
          customerEmail={customerEmail}
          onClose={() => setLinking(null)}
        />
      )}
      {open && canceling && (
        <CancelOrderModal
          order={open}
          blocked={cancelBlocked(open)}
          onClose={() => setCanceling(false)}
          onCanceled={() => {
            setCanceling(false);
            close();
          }}
        />
      )}
    </>
  );
}
