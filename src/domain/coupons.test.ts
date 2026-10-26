import type { Coupon } from '@/types/coupons';
import { calculateDiscount, couponState, isCouponAvailable } from './coupons';

const coupon = (over: Partial<Coupon> = {}): Coupon => ({
  id: 'cup-1',
  code: 'BEMVINDO10',
  description: '',
  type: 'percent',
  value: 10,
  validUntil: null,
  maxUses: null,
  uses: 0,
  courseIds: [],
  minimumAmount: 0,
  active: true,
  createdAt: '2026-01-01',
  ...over,
});

describe('calculateDiscount', () => {
  it('applies percentages with 2-decimal rounding and clamps them to 0–100', () => {
    expect(calculateDiscount(coupon({ value: 33 }), 100.05)).toBe(33.02);
    expect(calculateDiscount(coupon({ value: 150 }), 500)).toBe(500);
    expect(calculateDiscount(coupon({ value: -20 }), 500)).toBe(0);
  });

  it('caps fixed discounts between 0 and the subtotal', () => {
    expect(calculateDiscount(coupon({ type: 'fixed', value: 100 }), 500)).toBe(100);
    expect(calculateDiscount(coupon({ type: 'fixed', value: 800 }), 500)).toBe(500);
    expect(calculateDiscount(coupon({ type: 'fixed', value: -5 }), 500)).toBe(0);
  });
});

describe('isCouponAvailable', () => {
  const today = '2026-06-15';

  it('is available when active, not expired and not exhausted', () => {
    expect(isCouponAvailable(coupon(), today)).toBe(true);
    expect(isCouponAvailable(coupon({ validUntil: today }), today)).toBe(true);
  });

  it('is unavailable when inactive, expired or exhausted', () => {
    expect(isCouponAvailable(coupon({ active: false }), today)).toBe(false);
    expect(isCouponAvailable(coupon({ validUntil: '2026-06-14' }), today)).toBe(false);
    expect(isCouponAvailable(coupon({ maxUses: 3, uses: 3 }), today)).toBe(false);
  });
});

describe('couponState', () => {
  const today = '2026-06-15';

  it('reports inactive first, then expired, then exhausted, else active', () => {
    expect(couponState(coupon({ active: false, validUntil: '2020-01-01' }), today)).toBe('inactive');
    expect(couponState(coupon({ validUntil: '2026-06-14', maxUses: 1, uses: 1 }), today)).toBe('expired');
    expect(couponState(coupon({ maxUses: 1, uses: 1 }), today)).toBe('exhausted');
    expect(couponState(coupon({ validUntil: today }), today)).toBe('active');
  });
});
