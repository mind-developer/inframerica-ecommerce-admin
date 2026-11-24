import type { Course } from '@/types/catalog';

/** Same rule as the store's (`catalogFilters.ts`): no discount unless the original price is above the price (#68). */
export const discountPercent = ({ price, originalPrice }: Pick<Course, 'price' | 'originalPrice'>) =>
  originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;
