import { clampQuantity, purchaseLimitHint, purchaseRange } from './purchaseLimits';

describe('purchaseRange (#67)', () => {
  it('goes from the minimum to the maximum, capped by the seats left', () => {
    expect(purchaseRange({ minPerPurchase: 2, maxPerPurchase: 10, spotsLeft: 5 })).toEqual({ min: 2, max: 5 });
    expect(purchaseRange({ minPerPurchase: 1, maxPerPurchase: 3, spotsLeft: 30 })).toEqual({ min: 1, max: 3 });
    expect(purchaseRange({ minPerPurchase: 1, maxPerPurchase: null, spotsLeft: 30 })).toEqual({ min: 1, max: 30 });
  });

  it('leaves max under min when the seats left are fewer than the minimum', () => {
    const range = purchaseRange({ minPerPurchase: 3, maxPerPurchase: null, spotsLeft: 2 });
    expect(range.max < range.min).toBe(true);
  });
});

describe('clampQuantity', () => {
  it('keeps the quantity inside the range', () => {
    expect(clampQuantity(1, { min: 2, max: 5 })).toBe(2);
    expect(clampQuantity(9, { min: 2, max: 5 })).toBe(5);
    expect(clampQuantity(3, { min: 2, max: 5 })).toBe(3);
  });
});

describe('purchaseLimitHint', () => {
  it('says the rule in words, or nothing without one', () => {
    expect(purchaseLimitHint({ minPerPurchase: 2, maxPerPurchase: 3 })).toBe(
      'Mínimo de 2 e máximo de 3 vagas por compra',
    );
    expect(purchaseLimitHint({ minPerPurchase: 5, maxPerPurchase: null })).toBe('Mínimo de 5 vagas por compra');
    expect(purchaseLimitHint({ minPerPurchase: 1, maxPerPurchase: 1 })).toBe('Máximo de 1 vaga por compra');
    expect(purchaseLimitHint({ minPerPurchase: 1, maxPerPurchase: null })).toBeNull();
  });
});
