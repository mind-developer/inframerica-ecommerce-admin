/**
 * Link/unlink and cancellation deadlines — the product's most critical rules.
 *
 * Pure functions consumed by the customer area, the mock API (services) and, in the admin app, the operator screens, so the two
 * sides can't diverge. They take only the primitive fields each rule needs. The same module lives in
 * inframerica-ecommerce-admin; keep both copies identical until the rules move to the API.
 */
import type { RuleResult } from '@/types/common';
import { daysSince } from '@/utils/civilDate';

export { daysSince, daysUntil } from '@/utils/civilDate';

/** Days a person can be linked/unlinked/swapped after being linked to a seat. */
export const LINK_WINDOW_DAYS = 15;
/** Days after payment during which an order can be canceled with an automatic refund. */
export const CANCEL_WINDOW_DAYS = 7;

export const isLinkWindowExpired = (linkedAtIso: string | null, now: Date = new Date()): boolean =>
  linkedAtIso ? daysSince(linkedAtIso, now) > LINK_WINDOW_DAYS : false;

export const isCancelWindowExpired = (paidAtIso: string | null, now: Date = new Date()): boolean =>
  paidAtIso ? daysSince(paidAtIso, now) > CANCEL_WINDOW_DAYS : false;

/** Customer side: may the person on this seat be unlinked or swapped? */
export function canUnlinkOrSwapSeat(params: {
  alreadyStartedOrCompleted: boolean;
  linkedAtIso: string | null;
  /** Days until the in-person cohort, when there is one. */
  cohortDaysLeft?: number | null;
  now?: Date;
}): RuleResult {
  const { alreadyStartedOrCompleted, linkedAtIso, cohortDaysLeft, now = new Date() } = params;
  if (alreadyStartedOrCompleted) {
    return {
      allowed: false,
      reason: 'O treinamento desta vaga já foi acessado/cursado — não é possível trocar ou desvincular a pessoa.',
    };
  }
  if (linkedAtIso) {
    const days = daysSince(linkedAtIso, now);
    if (days > LINK_WINDOW_DAYS) {
      return {
        allowed: false,
        reason: `Já passaram mais de ${LINK_WINDOW_DAYS} dias desde a vinculação (${days} dias) — troca ou desvínculo não é mais permitido.`,
      };
    }
  }
  if (cohortDaysLeft !== undefined && cohortDaysLeft !== null && cohortDaysLeft < 7) {
    return {
      allowed: false,
      reason:
        'A turma presencial realiza-se em menos de 7 dias — a lista de inscritos já foi enviada e não é mais possível trocar ou desvincular.',
    };
  }
  return { allowed: true };
}

/**
 * Admin side of the same link rule, counted from the enrollment's last link (`updatedAt`), not from the
 * purchase. Returns the block reason, or null when allowed.
 */
export function adminLinkBlockReason(params: {
  inProgress: boolean;
  completed: boolean;
  linkedAtIso: string;
  now?: Date;
}): string | null {
  const { inProgress, completed, linkedAtIso, now = new Date() } = params;
  if (inProgress) return 'Curso já iniciado — não é possível alterar o vínculo.';
  if (completed) return 'Curso já concluído — não é possível alterar o vínculo.';
  const days = daysSince(linkedAtIso, now);
  if (days > LINK_WINDOW_DAYS) {
    return `Já passaram mais de ${LINK_WINDOW_DAYS} dias desde a vinculação (${days} dias) — troca ou desvínculo não é mais permitido.`;
  }
  return null;
}

/** Customer side: may this order be canceled with an automatic refund? */
export function canCancelOrder(params: {
  isAccountHolder: boolean;
  isCanceled: boolean;
  isPaid: boolean;
  paidAtIso: string | null;
  anyTrainingStarted: boolean;
  now?: Date;
}): RuleResult {
  const { isAccountHolder, isCanceled, isPaid, paidAtIso, anyTrainingStarted, now = new Date() } = params;
  if (isAccountHolder) {
    return {
      allowed: false,
      reason:
        'Pedidos de clientes correntistas/mensalistas são cobrados consolidados no fim do mês e não têm estorno individual por aqui.',
    };
  }
  if (isCanceled) return { allowed: false, reason: 'Este pedido já foi cancelado.' };
  if (!isPaid || !paidAtIso) {
    return {
      allowed: false,
      reason: 'Só é possível cancelar com estorno automático pedidos com pagamento confirmado.',
    };
  }
  if (anyTrainingStarted) {
    return {
      allowed: false,
      reason:
        'Um ou mais treinamentos deste pedido já foram iniciados ou concluídos — cancelamento com estorno automático não está mais disponível.',
    };
  }
  const days = daysSince(paidAtIso, now);
  if (days > CANCEL_WINDOW_DAYS) {
    return {
      allowed: false,
      reason: `O prazo de ${CANCEL_WINDOW_DAYS} dias para cancelamento com estorno automático após a confirmação do pagamento já passou (pago há ${days} dias).`,
    };
  }
  return { allowed: true };
}

/**
 * Admin side of the cancellation rule. Same conditions as the customer's, except the account-holder rule
 * (the admin cancels those too, without an individual refund). Payment date is the only accepted anchor:
 * "paid" without `paidAt` is inconsistent data and blocks.
 */
export function adminCancelBlockReason(params: {
  anyStudentStarted: boolean;
  paidAtIso: string | null;
  isCanceled: boolean;
  isPaid: boolean;
  now?: Date;
}): string | null {
  const { anyStudentStarted, paidAtIso, isCanceled, isPaid, now = new Date() } = params;
  if (anyStudentStarted) {
    return 'Pelo menos um treinamento deste pedido já foi iniciado ou concluído — cancelamento bloqueado.';
  }
  if (isCanceled) return 'Este pedido já está cancelado.';
  if (!isPaid || !paidAtIso) {
    return 'Só é possível cancelar com estorno automático pedidos com pagamento confirmado.';
  }
  const days = daysSince(paidAtIso, now);
  if (days > CANCEL_WINDOW_DAYS) {
    return `Prazo de ${CANCEL_WINDOW_DAYS} dias após o pagamento expirado (${days} dias) — cancelamento bloqueado.`;
  }
  return null;
}
