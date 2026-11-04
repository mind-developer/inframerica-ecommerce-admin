'use server';

import { adminCancelBlockReason, adminLinkBlockReason } from '@/domain/enrollmentRules';
import { studentsOfOrder } from '@/domain/orderCourses';
import { adminMutation } from '@/features/auth/server';
import { coursesService } from '@/services/catalog.service';
import { customersService, ordersService } from '@/services/commerce.service';
import { listEnrollments, setEnrollmentCohort } from '@/services/enrollments.service';
import type { ActionResult } from '@/types/common';

const fail = (error: string) => ({ ok: false as const, error });

async function studentsOf(orderId: string) {
  const [order, courses, enrollments, customers] = await Promise.all([
    ordersService.get(orderId),
    coursesService.list(),
    listEnrollments(),
    customersService.list(),
  ]);
  if (!order) throw new Error('Pedido não encontrado');
  return {
    order,
    students: studentsOfOrder(order, courses, enrollments, customers),
    customer: customers.find((c) => c.id === order.customerId),
  };
}

/**
 * Cancels with an automatic (simulated) refund: same 7-day / training-started / paid rules as the
 * customer area, enforced here. The order's credits are withdrawn (students unlinked from cohorts).
 */
export async function cancelOrder(orderId: string, reason: string): Promise<ActionResult<{ email: string | null }>> {
  if (!reason.trim()) return fail('Informe a justificativa antes de confirmar.');
  const { order, students, customer } = await studentsOf(orderId);
  const blocked = adminCancelBlockReason({
    anyStudentStarted: students.some((m) => m.status === 'in_progress' || m.status === 'completed'),
    paidAtIso: order.paidAt,
    isCanceled: order.status === 'refunded',
    isPaid: order.status === 'paid',
  });
  if (blocked) return fail(blocked);
  return adminMutation('orders', ['orders', 'enrollments'], async () => {
    await ordersService.update(orderId, {
      status: 'refunded',
      cancellationReason: reason.trim(),
      canceledAt: new Date().toISOString(),
    });
    for (const m of students.filter((s) => s.cohortId !== null)) await setEnrollmentCohort(m.id, null);
    return { email: customer?.email ?? null };
  });
}

/** Links a student to a cohort or unlinks them (null), with a mandatory reason and the 15-day rule. */
export async function setStudentCohort(
  enrollmentId: string,
  cohortId: string | null,
  reason: string,
): Promise<ActionResult<unknown>> {
  if (!reason.trim()) return fail('Informe a justificativa antes de confirmar.');
  const enrollment = (await listEnrollments()).find((e) => e.id === enrollmentId);
  if (!enrollment) return fail('Matrícula não encontrada.');
  const blocked = adminLinkBlockReason({
    inProgress: enrollment.status === 'in_progress',
    completed: enrollment.status === 'completed',
    linkedAtIso: enrollment.updatedAt,
  });
  if (blocked) return fail(blocked);
  return adminMutation('orders', ['enrollments'], () => setEnrollmentCohort(enrollmentId, cohortId));
}
