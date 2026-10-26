import 'server-only';
import { adminPasswordsSeed, DEFAULT_ORDER_SETTINGS } from '@/mocks/adminCredentials';
import { adminUsersSeed } from '@/mocks/adminUsers';
import { cohortsSeed } from '@/mocks/cohorts';
import { concessionairesSeed } from '@/mocks/concessionaires';
import { couponsSeed } from '@/mocks/coupons';
import { coursesSeed } from '@/mocks/courses';
import { credentialsSeed } from '@/mocks/credentials';
import { customersSeed } from '@/mocks/customers';
import { enrollmentsSeed } from '@/mocks/enrollments';
import { ordersSeed } from '@/mocks/orders';
import { paymentLinksSeed } from '@/mocks/paymentLinks';
import { sectorsSeed } from '@/mocks/sectors';
import { storeSettingsSeed } from '@/mocks/settings';
import { siteContentSeed } from '@/mocks/siteContent';
import { MockTable } from './table';

const createDb = () => ({
  courses: new MockTable(coursesSeed),
  credentials: new MockTable(credentialsSeed),
  customers: new MockTable(customersSeed),
  coupons: new MockTable(couponsSeed),
  sectors: new MockTable(sectorsSeed),
  orders: new MockTable(ordersSeed),
  cohorts: new MockTable(cohortsSeed),
  adminUsers: new MockTable(adminUsersSeed),
  paymentLinks: new MockTable(paymentLinksSeed),
  concessionaires: new MockTable(concessionairesSeed),
  enrollments: new MockTable(enrollmentsSeed),
  siteContent: { value: structuredClone(siteContentSeed) },
  storeSettings: { value: structuredClone(storeSettingsSeed) },
  orderSettings: { value: structuredClone(DEFAULT_ORDER_SETTINGS) },
  adminPasswords: new Map(Object.entries(adminPasswordsSeed)),
});

type MockDb = ReturnType<typeof createDb>;

// Kept on globalThis so dev hot reloads don't wipe the data between edits.
const holder = globalThis as typeof globalThis & { __skypassAdminMockDb?: MockDb };

/** The in-memory "database" behind every service until the API ships. */
export const getDb = (): MockDb => (holder.__skypassAdminMockDb ??= createDb());

/** Test helper: back to the seeds. */
export const resetDb = () => {
  holder.__skypassAdminMockDb = createDb();
};
