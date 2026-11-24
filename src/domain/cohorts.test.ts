import type { Cohort } from '@/types/cohorts';
import { findSubstituteCohort, withOccupancy } from './cohorts';

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

describe('withOccupancy (#63)', () => {
  const people = (cohortIds: (string | null)[]) => cohortIds.map((cohortId) => ({ cohortId }));

  it('counts the enrollments linked to each cohort, ignoring the typed-in number', () => {
    const [a, b] = withOccupancy(
      [cohort({ id: 'a', takenSeats: 32 }), cohort({ id: 'b', takenSeats: 7 })],
      people(['a', 'a', null, 'x']),
    );
    expect(a!.takenSeats).toBe(2);
    expect(b!.takenSeats).toBe(0);
  });

  it('feeds the substitute search with the real free seats', () => {
    const target = cohort({ id: 'target' });
    const nearlyFull = cohort({ id: 'other', totalSeats: 1, takenSeats: 0 });
    const list = withOccupancy([target, nearlyFull], people(['other']));
    expect(findSubstituteCohort(list[0]!, list)).toBeNull();
  });
});
