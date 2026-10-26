import type { Id } from './common';

export type CouponType = 'percent' | 'fixed';

export interface Coupon {
  id: Id;
  code: string;
  description: string;
  type: CouponType;
  /** Percentage (1–100) or an amount in BRL, depending on `type`. */
  value: number;
  /** Civil date `YYYY-MM-DD`; null = no limit. */
  validUntil: string | null;
  /** Total usage limit; null = unlimited. */
  maxUses: number | null;
  uses: number;
  /** Restricts the coupon to these courses; empty = whole catalog. */
  courseIds: Id[];
  minimumAmount: number;
  active: boolean;
  createdAt: string;
  /** Targeted coupon: valid only for this customer and never advertised publicly. */
  customerId?: Id | null;
}

export type CouponInput = Omit<Coupon, 'id' | 'createdAt' | 'uses'>;
