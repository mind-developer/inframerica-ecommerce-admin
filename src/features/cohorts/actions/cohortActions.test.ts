import { cohortsService } from '@/services/cohorts.service';
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
    expect(await unlinkEnrollment(theirs!.id, 'motivo')).toEqual(denied);
    getDb().enrollments.update(mine!.id, { status: 'enrolled', linkedAt: new Date().toISOString() });
    expect((await unlinkEnrollment(mine!.id, 'motivo')).ok).toBe(true);
  });
});

describe('occupancy (#63)', () => {
  it('keeps the total of seats from going under the people already in the cohort', async () => {
    const taken = (await listEnrollmentsByCohort('tur-1')).length;
    const { id: _id, takenSeats: _t, ...c } = (await cohortsService.get('tur-1'))!;
    const values = { ...emptyCohort, ...c, meetingPoint: '', materials: '', emailTemplate: '' };
    expect(await saveCohort('tur-1', { ...values, totalSeats: taken - 1 })).toEqual({
      ok: false,
      error: `O total de vagas não pode ficar abaixo das ${taken} já ocupadas`,
    });
    expect((await saveCohort('tur-1', { ...values, totalSeats: taken })).ok).toBe(true);
  });
});

describe('unlinkEnrollment (#65)', () => {
  const linkedNow = () =>
    getDb().enrollments.update('mat-2', { status: 'enrolled', linkedAt: new Date().toISOString() });

  it('requires a justification', async () => {
    linkedNow();
    expect(await unlinkEnrollment('mat-2', '  ')).toEqual({
      ok: false,
      error: 'Informe a justificativa antes de confirmar.',
    });
    expect(getDb().enrollments.find('mat-2')?.cohortId).toBe('tur-1');
  });

  it('follows the same rules as the orders screen: not started, not completed, within 15 days', async () => {
    for (const [patch, message] of [
      [{ status: 'in_progress' }, /já iniciado/],
      [{ status: 'completed' }, /já concluído/],
      [{ status: 'enrolled', linkedAt: '2020-01-01T00:00:00Z' }, /mais de 15 dias/],
    ] as const) {
      getDb().enrollments.update('mat-2', patch);
      const r = await unlinkEnrollment('mat-2', 'motivo');
      expect(!r.ok && r.error).toMatch(message);
    }
  });

  it('counts the 15 days from the link: changing the status does not restart them', async () => {
    getDb().enrollments.update('mat-2', { status: 'enrolled', linkedAt: '2020-01-01T00:00:00Z' });
    expect((await changeEnrollmentStatus('mat-2', 'pending')).ok).toBe(true);
    const r = await unlinkEnrollment('mat-2', 'motivo');
    expect(!r.ok && r.error).toMatch(/mais de 15 dias/);
  });

  it('returns the credit, freeing the seat', async () => {
    linkedNow();
    expect((await unlinkEnrollment('mat-2', 'pessoa saiu da empresa')).ok).toBe(true);
    expect(getDb().enrollments.find('mat-2')).toMatchObject({ cohortId: null, status: 'pending' });
  });

  it('refuses an enrollment that no longer exists', async () => {
    expect(await unlinkEnrollment('nope', 'motivo')).toEqual({ ok: false, error: 'Matrícula não encontrada.' });
  });
});
