import { API_TOKEN_COOKIE } from '@/constants/session';
import { cookieJar } from '@/test/cookieJar';
import { fakeCustomersApi, installFakeCustomersApi } from '@/test/fakeCustomersApi';
import { listCustomers } from './customers.service';

beforeEach(() => {
  cookieJar.clear();
  cookieJar.set(API_TOKEN_COOKIE, 'adm-token');
  installFakeCustomersApi();
});
afterEach(() => vi.unstubAllGlobals());

describe('listCustomers', () => {
  it('asks the API with the screen filters (#23)', async () => {
    await listCustomers({ q: 'gol', tag: 'exempt' });
    await listCustomers({ q: '', tag: null });
    const [filtered, all] = fakeCustomersApi.calls.map((c) => new URL(c));
    expect(Object.fromEntries(filtered!.searchParams)).toEqual({ q: 'gol', tag: 'exempt' });
    expect(all!.search).toBe('');
  });
});
