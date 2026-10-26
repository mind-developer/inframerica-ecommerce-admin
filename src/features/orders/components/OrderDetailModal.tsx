'use client';

import { Ban, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PAYMENT_METHOD_LABEL, SERVICE_TYPE_LABEL } from '@/constants/labels';
import type { Enrollment } from '@/types/enrollments';
import type { Order } from '@/types/orders';
import { formatBRL } from '@/utils/format';
import type { OrderLookups } from '../utils/orderLookups';
import { DetailSection } from './DetailSection';
import { OrderCoursesSection } from './OrderCoursesSection';
import { OrderCustomerSection } from './OrderCustomerSection';
import { OrderHistory } from './OrderHistory';
import { OrderPaymentSection } from './OrderPaymentSection';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderStudentRow } from './OrderStudentRow';

interface Props {
  order: Order;
  lookups: OrderLookups;
  onClose: () => void;
  onResendEmail: () => void;
  onChangeLink: (student: Enrollment, cohortId: string | null) => void;
  onCancel: () => void;
}

export function OrderDetailModal({ order, lookups, onClose, onResendEmail, onChangeLink, onCancel }: Props) {
  const customer = lookups.customerOf(order.customerId);
  const students = lookups.studentsOf(order);
  return (
    <Modal open onClose={onClose} size="lg" title={`Pedido ${order.id}`} description={order.description}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <Badge>{PAYMENT_METHOD_LABEL[order.method]}</Badge>
          <Badge>{SERVICE_TYPE_LABEL[order.serviceType ?? 'training']}</Badge>
          <span className="ml-auto text-lg font-bold">{formatBRL(order.amount)}</span>
        </div>
        <OrderHistory order={order} onResendEmail={onResendEmail} />
        <OrderPaymentSection order={order} />
        <OrderCustomerSection customer={customer} sectorName={lookups.sectorName(customer?.sectorId ?? null)} />
        <OrderCoursesSection courses={lookups.coursesOf(order)} />
        <DetailSection
          title={
            <>
              <Users aria-hidden className="size-3.5" /> Alunos vinculados — créditos deste pedido
            </>
          }
        >
          {students.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma pessoa vinculada às vagas deste pedido.</p>
          ) : (
            <ul className="space-y-2">
              {students.map((m) => (
                <OrderStudentRow
                  key={m.id}
                  student={m}
                  onUnlink={() => onChangeLink(m, null)}
                  onLink={() => onChangeLink(m, lookups.cohortsOfCourse(m.courseId)[0]?.id ?? null)}
                />
              ))}
            </ul>
          )}
        </DetailSection>
        <div className="flex justify-end border-t border-border pt-3">
          <Button variant="destructive" disabled={order.status === 'refunded'} onClick={onCancel}>
            <Ban aria-hidden className="size-4" /> Cancelar pedido
          </Button>
        </div>
      </div>
    </Modal>
  );
}
