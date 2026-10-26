import type { Coupon } from '@/types/coupons';

/** The discount never exceeds the subtotal nor goes negative, whatever value is stored. */
export const calculateDiscount = (coupon: Coupon, subtotal: number): number => {
  if (coupon.type === 'percent') {
    const pct = Math.min(100, Math.max(0, coupon.value));
    return Math.round(subtotal * (pct / 100) * 100) / 100;
  }
  return Math.max(0, Math.min(coupon.value, subtotal));
};

/** Active, not past its civil expiry date and with uses left. */
export const isCouponAvailable = (coupon: Coupon, today: string): boolean =>
  coupon.active &&
  !(coupon.validUntil && coupon.validUntil < today) &&
  !(coupon.maxUses !== null && coupon.uses >= coupon.maxUses);

export type CouponState = 'active' | 'inactive' | 'expired' | 'exhausted';

/** What the admin sees: a coupon can be switched on and still unusable (expired or used up). */
export function couponState(coupon: Coupon, today: string): CouponState {
  if (!coupon.active) return 'inactive';
  if (coupon.validUntil && coupon.validUntil < today) return 'expired';
  if (coupon.maxUses !== null && coupon.uses >= coupon.maxUses) return 'exhausted';
  return 'active';
}
