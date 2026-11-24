import type { Enrollment } from '@/types/enrollments';
import { adminLinkBlockReason } from './enrollmentRules';

/** Why this enrollment's cohort can't change, or null. One rule for the orders and the cohort's people screens. */
export const linkBlockReason = (m: Pick<Enrollment, 'status' | 'linkedAt' | 'updatedAt'>) =>
  adminLinkBlockReason({
    inProgress: m.status === 'in_progress',
    completed: m.status === 'completed',
    // Without a cohort there is no link date: it keeps counting from the last change.
    linkedAtIso: m.linkedAt ?? m.updatedAt,
  });
