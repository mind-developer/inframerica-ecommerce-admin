import type { Cohort } from '@/types/cohorts';
import { cohortStatus, findSubstituteCohort, isFull, withOccupancy } from './cohorts';

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

describe('cohortStatus (#64)', () => {
  it('closes an open cohort with no seat left, and opens it again when one is freed', () => {
    expect(cohortStatus(cohort({ totalSeats: 10, takenSeats: 10 }))).toBe('closed');
    expect(cohortStatus(cohort({ totalSeats: 10, takenSeats: 11 }))).toBe('closed');
    expect(cohortStatus(cohort({ totalSeats: 10, takenSeats: 9 }))).toBe('open');
  });

  it('keeps what the team set by hand', () => {
    for (const status of ['closed', 'completed', 'canceled'] as const) {
      expect(cohortStatus(cohort({ status, takenSeats: 0 }))).toBe(status);
      expect(cohortStatus(cohort({ status, takenSeats: 10 }))).toBe(status);
    }
  });

  it('tells a full cohort whatever its status', () => {
    expect(isFull(cohort({ status: 'closed', takenSeats: 10 }))).toBe(true);
    expect(isFull(cohort({ takenSeats: 9 }))).toBe(false);
  });
});

describe('findSubstituteCohort with people to move (#64)', () => {
  it('needs seats for everyone, skipping a cohort where they do not fit', () => {
    const target = cohort({ id: 'target', takenSeats: 3 });
    const tight = cohort({ id: 'tight', takenSeats: 8 });
    const roomy = cohort({ id: 'roomy', takenSeats: 7 });
    expect(findSubstituteCohort(target, [target, tight])).toBeNull();
    expect(findSubstituteCohort(target, [target, tight, roomy])?.id).toBe('roomy');
  });
});
