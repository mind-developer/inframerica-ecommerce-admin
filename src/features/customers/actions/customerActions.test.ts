import { couponsService, customersService } from '@/services/commerce.service';
import { resetDb } from '@/services/mock/db';
import { cookieJar } from '@/test/cookieJar';
import { signInAs } from '@/test/session';
import type { CustomerFormValues } from '../schemas/customerSchema';
import { createTargetedCoupon, saveCustomer } from './customerActions';

const base: CustomerFormValues = {
  name: 'GOL Linhas Aéreas',
  email: 'rh@voegol.com.br',
  phone: '',
  company: 'GOL',
  document: '07.575.651/0001-59',
  sectorId: '',
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
});

describe('saveCustomer', () => {
  it('updates and maps an empty sector to null', async () => {
    expect((await saveCustomer('cli-2', { ...base, city: 'Brasília' })).ok).toBe(true);
    expect(await customersService.get('cli-2')).toMatchObject({ city: 'Brasília', sectorId: null });
  });

  it('rejects e-mails and CNPJs that belong to another customer', async () => {
    expect(await saveCustomer('cli-2', { ...base, email: 'TREINAMENTO@latam.com' })).toEqual({
      ok: false,
      error: 'Já existe um cliente com este email',
    });
    expect(await saveCustomer('cli-2', { ...base, cnpj: '02012862000160' })).toEqual({
      ok: false,
      error: 'Já existe um cliente com este CNPJ',
    });
  });

  it('requires a CNPJ unless the customer is an individual', async () => {
    expect(await saveCustomer('cli-2', { ...base, cnpj: '' })).toEqual({
      ok: false,
      error: 'CNPJ é obrigatório para esta categoria',
    });
    expect((await saveCustomer('cli-2', { ...base, cnpj: '', category: 'individual' })).ok).toBe(true);
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
      await createTargetedCoupon('cli-2', 'GOL', { code: 'skypass10', type: 'fixed', value: 10, maxUses: null }),
    ).toEqual({ ok: false, error: 'Já existe um cupom com este código' });
  });
});
