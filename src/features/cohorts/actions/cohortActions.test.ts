import { cohortsService } from '@/services/commerce.service';
import { listEnrollmentsByCohort } from '@/services/enrollments.service';
import { getDb, resetDb } from '@/services/mock/db';
import { cookieJar } from '@/test/cookieJar';
import { findCurrentAdmin } from '@/services/adminAuth.service';
import { ownerSession, signInAs } from '@/test/session';
import { emptyCohort } from '../schemas/cohortSchema';
import { cancelCohort, changeEnrollmentStatus, deleteCohort, saveCohort, unlinkEnrollment } from './cohortActions';

beforeEach(() => {
  resetDb();
  cookieJar.clear();
  signInAs('usr-0');
});

describe('cancelCohort', () => {
  it('moves everyone to the substitute cohort when there is one', async () => {
    getDb().cohorts.insert({
      ...emptyCohort,
      id: 'tur-sub',
      courseId: 'cur-1',
      startDate: '2026-12-01',
      status: 'open',
      totalSeats: 50,
      takenSeats: 0,
    });
    const before = (await listEnrollmentsByCohort('tur-1')).length;
    const r = await cancelCohort('tur-1');
    expect(r).toEqual({ ok: true, data: { movedTo: 'tur-sub', people: before } });
    expect(await listEnrollmentsByCohort('tur-sub')).toHaveLength(before);
    expect((await cohortsService.get('tur-1'))?.status).toBe('canceled');
  });

  it('returns credits (no cohort, pending) when there is no substitute', async () => {
    const r = await cancelCohort('tur-3');
    expect(r.ok && r.data.movedTo).toBeNull();
    expect(await listEnrollmentsByCohort('tur-3')).toEqual([]);
  });
});

describe('saveCohort', () => {
  it('validates course, start date and seats', async () => {
    expect(await saveCohort(null, emptyCohort)).toEqual({ ok: false, error: 'Preencha curso e data de início' });
    expect(
      (await saveCohort(null, { ...emptyCohort, courseId: 'cur-1', startDate: '2026-12-01', takenSeats: 40 })).ok,
    ).toBe(false);
    expect((await saveCohort(null, { ...emptyCohort, courseId: 'cur-1', startDate: '2026-12-01' })).ok).toBe(true);
  });
});

describe('an admin limited to one sector (#49)', () => {
  // tur-1 is a cohort of an AVSEC course; tur-2 belongs to Operacional.
  const denied = { ok: false, error: 'Esta turma é de outro setor.' };
  const cohortValues = async (id: string) => {
    const { id: _id, ...c } = (await cohortsService.get(id))!;
    return { ...emptyCohort, ...c };
  };

  beforeEach(() => {
    vi.mocked(findCurrentAdmin).mockResolvedValue({ ...ownerSession, owner: false, sectorId: 'set-avsec' });
  });
  afterEach(() => vi.mocked(findCurrentAdmin).mockResolvedValue(ownerSession));

  it('edits, cancels and removes cohorts of their sector only', async () => {
    expect((await saveCohort('tur-1', await cohortValues('tur-1'))).ok).toBe(true);
    expect(await saveCohort('tur-2', await cohortValues('tur-2'))).toEqual(denied);
    expect(await saveCohort('tur-1', { ...(await cohortValues('tur-1')), courseId: 'cur-2' })).toEqual(denied);
    expect(await saveCohort(null, { ...(await cohortValues('tur-2')) })).toEqual(denied);
    expect(await cancelCohort('tur-2')).toEqual(denied);
    expect(await deleteCohort('tur-2')).toEqual(denied);
    expect(await cohortsService.get('tur-2')).not.toBeNull();
  });

  it("changes only the people of their sector's cohorts", async () => {
    const [mine] = await listEnrollmentsByCohort('tur-1');
    const [theirs] = await listEnrollmentsByCohort('tur-2');
    expect(await changeEnrollmentStatus(theirs!.id, mine!.status)).toEqual(denied);
    expect(await unlinkEnrollment(theirs!.id)).toEqual(denied);
    expect((await unlinkEnrollment(mine!.id)).ok).toBe(true);
  });
});
