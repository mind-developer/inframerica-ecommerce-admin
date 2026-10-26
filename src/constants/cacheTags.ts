/**
 * Cache tags for the admin's `'use cache'` readers. Mutations call `updateTag` (read-your-own-writes) and,
 * for data the store shows, notify the storefront (`services/storefront.service.ts`).
 */
export const CACHE_TAGS = {
  courses: 'courses',
  credentials: 'credentials',
  sectors: 'sectors',
  customers: 'customers',
  orders: 'orders',
  cohorts: 'cohorts',
  enrollments: 'enrollments',
  concessionaires: 'concessionaires',
  coupons: 'coupons',
  paymentLinks: 'payment-links',
  adminUsers: 'admin-users',
  siteContent: 'site-content',
  storeSettings: 'store-settings',
  orderSettings: 'order-settings',
} as const;
