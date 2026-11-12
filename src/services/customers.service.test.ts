import { API_TOKEN_COOKIE } from '@/constants/session';
import { cookieJar } from '@/test/cookieJar';
import { fakeCustomersApi, installFakeCustomersApi } from '@/test/fakeCustomersApi';
import { getCustomer, listCustomers } from './customers.service';

beforeEach(() => {
  cookieJar.clear();
  cookieJar.set(API_TOKEN_COOKIE, 'adm-token');
  installFakeCustomersApi();
});
afterEach(() => vi.unstubAllGlobals());

describe('listCustomers', () => {
  it('asks the API with the screen filters (#23)', async () => {
    await listCustomers({ q: 'gol', tag: 'exempt', page: 2 });
    await listCustomers({ q: '', tag: null, page: 1 });
    const [filtered, first] = fakeCustomersApi.calls.map((c) => new URL(c));
    expect(Object.fromEntries(filtered!.searchParams)).toEqual({ q: 'gol', tag: 'exempt', page: '2' });
    expect(first!.search).toBe('');
  });

  it('opens one customer by id, null when the API does not know it', async () => {
    expect(await getCustomer('cli-2')).toMatchObject({ id: 'cli-2', name: 'GOL' });
    expect(await getCustomer('nope')).toBeNull();
  });
});
