import { enrollmentsSeed } from '@/mocks/enrollments';
import { getDb, resetDb } from './mock/db';
import {
  createEnrollment,
  listEnrollments,
  listEnrollmentsByCohort,
  setEnrollmentCohort,
  updateEnrollmentStatus,
} from './enrollments.service';

beforeEach(() => {
  resetDb();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-19T12:00:00Z'));
});
afterEach(() => vi.useRealTimers());

const first = () => getDb().enrollments.all()[0]!;

describe('setEnrollmentCohort', () => {
  it('sets the cohort and stamps updatedAt (the anchor of the 15-day rule)', async () => {
    const r = await setEnrollmentCohort(first().id, 'tur-2');
    expect(r).toMatchObject({ cohortId: 'tur-2', updatedAt: '2026-10-19T12:00:00.000Z' });
  });

  it('promotes pending to enrolled, and never demotes advanced statuses', async () => {
    const pending = getDb().enrollments.insert({ ...first(), id: 'mat-x', status: 'pending', cohortId: null });
    expect((await setEnrollmentCohort(pending.id, 'tur-1')).status).toBe('enrolled');
    getDb().enrollments.update('mat-x', { status: 'in_progress' });
    expect((await setEnrollmentCohort('mat-x', 'tur-2')).status).toBe('in_progress');
  });

  it('unlinking (null) goes back to pending', async () => {
    expect(await setEnrollmentCohort(first().id, null)).toMatchObject({ cohortId: null, status: 'pending' });
  });

  it('leaves the other rows and their order alone, and throws for unknown ids', async () => {
    const before = getDb()
      .enrollments.all()
      .map((e) => e.id);
    await setEnrollmentCohort(first().id, 'tur-3');
    expect(
      getDb()
        .enrollments.all()
        .map((e) => e.id),
    ).toEqual(before);
    await expect(setEnrollmentCohort('nope', null)).rejects.toThrow();
  });
});

describe('updateEnrollmentStatus', () => {
  it('"completed" stamps completedAt once, and keeps the first stamp', async () => {
    const id = first().id;
    expect((await updateEnrollmentStatus(id, 'completed')).completedAt).toBe('2026-10-19T12:00:00.000Z');
    vi.setSystemTime(new Date('2026-10-20T12:00:00Z'));
    expect((await updateEnrollmentStatus(id, 'completed')).completedAt).toBe('2026-10-19T12:00:00.000Z');
  });

  it('any other status clears completedAt; completing again stamps anew', async () => {
    const id = first().id;
    await updateEnrollmentStatus(id, 'completed');
    expect((await updateEnrollmentStatus(id, 'in_progress')).completedAt).toBeNull();
    vi.setSystemTime(new Date('2026-11-01T12:00:00Z'));
    expect((await updateEnrollmentStatus(id, 'completed')).completedAt).toBe('2026-11-01T12:00:00.000Z');
  });

  it('throws for unknown ids', async () => {
    await expect(updateEnrollmentStatus('nope', 'enrolled')).rejects.toThrow();
  });
});

describe('createEnrollment / lists', () => {
  it('creates with completedAt null and both stamps', async () => {
    const { id: _id, createdAt: _c, updatedAt: _u, completedAt: _d, ...input } = first();
    const created = await createEnrollment(input);
    expect(created).toMatchObject({
      completedAt: null,
      createdAt: '2026-10-19T12:00:00.000Z',
      updatedAt: '2026-10-19T12:00:00.000Z',
    });
  });

  it('lists a cohort sorted by name (pt-BR)', async () => {
    const names = (await listEnrollmentsByCohort('tur-1')).map((e) => e.personName);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'pt-BR')));
    expect(names.length).toBeGreaterThan(0);
  });

  it('seed invariant: only completed enrollments carry completedAt', async () => {
    expect(enrollmentsSeed.filter((e) => e.status !== 'completed').every((e) => e.completedAt === null)).toBe(true);
    expect(await listEnrollments()).toHaveLength(enrollmentsSeed.length);
  });
});
