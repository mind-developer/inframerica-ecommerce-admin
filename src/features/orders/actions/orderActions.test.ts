import { ordersService } from '@/services/commerce.service';
import { getDb, resetDb } from '@/services/mock/db';
import { cookieJar } from '@/test/cookieJar';
import { signInAs } from '@/test/session';
import { cancelOrder, setStudentCohort } from './orderActions';

const NOW = new Date('2026-04-25T12:00:00Z');

beforeEach(() => {
  resetDb();
  cookieJar.clear();
  signInAs('usr-0');
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});
afterEach(() => vi.useRealTimers());

describe('cancelOrder', () => {
  it('requires a reason', async () => {
    expect(await cancelOrder('pag-7', ' ')).toEqual({
      ok: false,
      error: 'Informe a justificativa antes de confirmar.',
    });
  });

  it('cancels a recently paid order and records reason and date', async () => {
    const r = await cancelOrder('pag-7', 'Pedido em duplicidade');
    expect(r).toEqual({ ok: true, data: { email: 'joao.pereira@gmail.com' } });
    expect(await ordersService.get('pag-7')).toMatchObject({
      status: 'refunded',
      cancellationReason: 'Pedido em duplicidade',
      canceledAt: NOW.toISOString(),
    });
  });

  it('blocks pending orders, already canceled ones and expired windows', async () => {
    expect((await cancelOrder('pag-4', 'x')).ok).toBe(false);
    // pag-9 has no items, so it inherits the customer's students; a started training is reported first.
    expect((await cancelOrder('pag-9', 'x')).ok).toBe(false);
    expect((await cancelOrder('pag-3', 'x')).ok).toBe(false);
  });
});

describe('setStudentCohort', () => {
  it('requires a reason and blocks a student whose training started', async () => {
    expect((await setStudentCohort('mat-2', null, '')).ok).toBe(false);
    expect(await setStudentCohort('mat-1', null, 'troca')).toEqual({
      ok: false,
      error: 'Curso já iniciado — não é possível alterar o vínculo.',
    });
  });

  it('unlinks within the 15-day window', async () => {
    getDb().enrollments.update('mat-2', { updatedAt: '2026-04-20T12:00:00Z' });
    expect((await setStudentCohort('mat-2', null, 'pessoa saiu da empresa')).ok).toBe(true);
    expect(getDb().enrollments.find('mat-2')).toMatchObject({ cohortId: null, status: 'pending' });
  });
});
