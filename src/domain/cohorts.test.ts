import type { Cohort } from '@/types/cohorts';
import { findSubstituteCohort } from './cohorts';

const cohort = (over: Partial<Cohort>): Cohort => ({
  id: 'a',
  courseId: 'cur-1',
  startDate: '',
  endDate: '',
  schedule: '',
  location: '',
  totalSeats: 10,
  takenSeats: 0,
  status: 'open',
  ...over,
});

describe('findSubstituteCohort', () => {
  const target = cohort({ id: 'target' });

  it('picks an open cohort of the same course with a free seat', () => {
    expect(findSubstituteCohort(target, [target, cohort({ id: 'other' })])?.id).toBe('other');
  });

  it('ignores itself, other courses, full and non-open cohorts', () => {
    const list = [
      target,
      cohort({ id: 'x', courseId: 'cur-2' }),
      cohort({ id: 'full', takenSeats: 10 }),
      cohort({ id: 'closed', status: 'closed' }),
    ];
    expect(findSubstituteCohort(target, list)).toBeNull();
  });
});
