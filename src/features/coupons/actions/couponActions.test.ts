import { couponsService } from '@/services/commerce.service';
import { resetDb } from '@/services/mock/db';
import { cookieJar } from '@/test/cookieJar';
import { signInAs } from '@/test/session';
import { emptyCoupon } from '../schemas/couponSchema';
import { saveCoupon } from './couponActions';

beforeEach(() => {
  resetDb();
  cookieJar.clear();
  signInAs('usr-0');
});

describe('saveCoupon', () => {
  it('creates with an upper-case code, null expiry and a public audience', async () => {
    expect((await saveCoupon(null, { ...emptyCoupon, code: 'novo5' })).ok).toBe(true);
    expect((await couponsService.list()).find((c) => c.code === 'NOVO5')).toMatchObject({
      validUntil: null,
      customerId: null,
      uses: 0,
    });
  });

  it('rejects duplicated codes, zero values and percentages above 100', async () => {
    expect(await saveCoupon(null, { ...emptyCoupon, code: 'infra10' })).toEqual({
      ok: false,
      error: 'Já existe um cupom com este código',
    });
    expect((await saveCoupon(null, { ...emptyCoupon, code: 'A', value: 0 })).ok).toBe(false);
    expect(await saveCoupon(null, { ...emptyCoupon, code: 'B', value: 150 })).toEqual({
      ok: false,
      error: 'Desconto percentual não pode passar de 100%',
    });
  });

  it('lets a coupon keep its own code when edited', async () => {
    const own = (await couponsService.list()).find((c) => c.code === 'INFRA10')!;
    expect((await saveCoupon(own.id, { ...emptyCoupon, code: 'INFRA10', description: 'editado' })).ok).toBe(true);
  });
});
