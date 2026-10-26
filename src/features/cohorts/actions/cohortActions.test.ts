import { cohortsService } from '@/services/commerce.service';
import { listEnrollmentsByCohort } from '@/services/enrollments.service';
import { getDb, resetDb } from '@/services/mock/db';
import { cookieJar } from '@/test/cookieJar';
import { signInAs } from '@/test/session';
import { emptyCohort } from '../schemas/cohortSchema';
import { cancelCohort, saveCohort } from './cohortActions';

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
