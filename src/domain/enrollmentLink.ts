import type { Enrollment } from '@/types/enrollments';
import { adminLinkBlockReason } from './enrollmentRules';

/** Why this enrollment's cohort can't change, or null. One rule for the orders and the cohort's people screens. */
export const linkBlockReason = (m: Pick<Enrollment, 'status' | 'updatedAt'>) =>
  adminLinkBlockReason({
    inProgress: m.status === 'in_progress',
    completed: m.status === 'completed',
    linkedAtIso: m.updatedAt,
  });
