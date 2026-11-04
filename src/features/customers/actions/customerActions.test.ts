import { API_TOKEN_COOKIE } from '@/constants/session';
import { couponsService } from '@/services/commerce.service';
import { resetDb } from '@/services/mock/db';
import { cookieJar } from '@/test/cookieJar';
import { fakeCustomersApi, installFakeCustomersApi } from '@/test/fakeCustomersApi';
import { signInAs } from '@/test/session';
import type { CustomerFormValues } from '../schemas/customerSchema';
import { createTargetedCoupon, deleteCustomer, saveCustomer } from './customerActions';

const base: CustomerFormValues = {
  name: 'GOL Linhas Aéreas',
  email: 'rh@voegol.com.br',
  phone: '',
  company: 'GOL',
  document: '',
  cnpj: '07.575.651/0001-59',
  category: 'company',
  billingTag: 'paying',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  stateRegistration: '',
};

beforeEach(() => {
  resetDb();
  cookieJar.clear();
  signInAs('usr-0');
  cookieJar.set(API_TOKEN_COOKIE, 'adm-token');
  installFakeCustomersApi();
});
afterEach(() => vi.unstubAllGlobals());

describe('saveCustomer', () => {
  it('sends the edit, billing tag included, to the API', async () => {
    const r = await saveCustomer('cli-2', { ...base, city: 'Brasília', billingTag: 'exempt' });
    expect(r.ok).toBe(true);
    expect(fakeCustomersApi.rows.get('cli-2')).toMatchObject({ city: 'Brasília', billingTag: 'exempt' });
  });

  it("shows the API's refusal of another customer's e-mail or CNPJ", async () => {
    fakeCustomersApi.conflict = 'email-taken';
    expect(await saveCustomer('cli-2', base)).toEqual({ ok: false, error: 'Já existe um cliente com este email' });
    fakeCustomersApi.conflict = 'cnpj-taken';
    expect(await saveCustomer('cli-2', base)).toEqual({ ok: false, error: 'Já existe um cliente com este CNPJ' });
  });

  it('requires a CNPJ unless the customer is an individual', async () => {
    expect(await saveCustomer('cli-2', { ...base, cnpj: '' })).toEqual({
      ok: false,
      error: 'CNPJ é obrigatório para esta categoria',
    });
    expect((await saveCustomer('cli-2', { ...base, cnpj: '', category: 'individual' })).ok).toBe(true);
  });

  it('asks to sign in again when there is no API token', async () => {
    cookieJar.delete(API_TOKEN_COOKIE);
    expect(await saveCustomer('cli-2', base)).toEqual({ ok: false, error: 'Sessão expirada. Entre novamente.' });
  });
});

describe('deleteCustomer', () => {
  it('removes the customer on the API', async () => {
    expect((await deleteCustomer('cli-2')).ok).toBe(true);
    expect(fakeCustomersApi.rows.has('cli-2')).toBe(false);
  });
});

describe('createTargetedCoupon', () => {
  it('creates an active coupon bound to the customer', async () => {
    const r = await createTargetedCoupon('cli-2', 'GOL', { code: 'gol15', type: 'percent', value: 15, maxUses: 1 });
    expect(r).toMatchObject({
      ok: true,
      data: { code: 'GOL15', customerId: 'cli-2', description: 'Cupom direcionado para GOL', active: true },
    });
    expect((await couponsService.list()).some((c) => c.code === 'GOL15')).toBe(true);
  });

  it('rejects percentages above 100 and duplicated codes', async () => {
    expect(
      (await createTargetedCoupon('cli-2', 'GOL', { code: 'x', type: 'percent', value: 120, maxUses: null })).ok,
    ).toBe(false);
    expect(
      await createTargetedCoupon('cli-2', 'GOL', { code: 'infra10', type: 'fixed', value: 10, maxUses: null }),
    ).toEqual({ ok: false, error: 'Já existe um cupom com este código' });
  });
});
