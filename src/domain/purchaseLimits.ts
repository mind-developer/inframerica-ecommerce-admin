import type { Course } from '@/types/catalog';

export interface QuantityRange {
  min: number;
  max: number;
}

/**
 * Seats one purchase may take (#67): from the course's minimum to its maximum, capped by the seats
 * left (#68). `max < min` means it can't be bought now: fewer seats left than the minimum.
 */
export const purchaseRange = (
  course: Pick<Course, 'minPerPurchase' | 'maxPerPurchase' | 'spotsLeft'>,
): QuantityRange => ({
  min: course.minPerPurchase,
  max: Math.min(course.maxPerPurchase ?? Number.POSITIVE_INFINITY, course.spotsLeft),
});

export const clampQuantity = (quantity: number, { min, max }: QuantityRange) => Math.min(max, Math.max(min, quantity));

const seats = (n: number) => `${n} ${n === 1 ? 'vaga' : 'vagas'}`;

/** The rule in words for the buyer (#67), or null when the course sets none. */
export function purchaseLimitHint({
  minPerPurchase: min,
  maxPerPurchase: max,
}: Pick<Course, 'minPerPurchase' | 'maxPerPurchase'>) {
  if (min > 1 && max !== null) return `Mínimo de ${min} e máximo de ${seats(max)} por compra`;
  if (min > 1) return `Mínimo de ${seats(min)} por compra`;
  if (max !== null) return `Máximo de ${seats(max)} por compra`;
  return null;
}
