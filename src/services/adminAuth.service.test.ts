import { API_TOKEN_COOKIE } from '@/constants/session';
import { cookieJar } from '@/test/cookieJar';
import { verifyAdminCredentials } from './adminAuth.service';
import { installFakeAdminAuthApi } from '@/test/fakeAdminAuthApi';

beforeEach(() => {
  cookieJar.clear();
  installFakeAdminAuthApi();
});
afterEach(() => vi.unstubAllGlobals());

describe('admin auth', () => {
  it('accepts the demo admin, case-insensitively', async () => {
    expect(await verifyAdminCredentials('ADMIN@inframerica.com', '123456')).toMatchObject({
      id: 'usr-0',
      name: 'Administrador Inframérica',
      email: 'admin@inframerica.com',
      owner: true,
      accessToken: 'adm-token',
    });
  });

  it('rejects wrong passwords and admins without a password', async () => {
    expect(await verifyAdminCredentials('admin@inframerica.com', 'x')).toBeNull();
    expect(await verifyAdminCredentials('mariana.souza@infraamerica.com', '123456')).toBeNull();
  });

  it('reads the current admin from the API, and none without a token', async () => {
    const { findCurrentAdmin } = await vi.importActual<typeof import('./adminAuth.service')>('./adminAuth.service');
    expect(await findCurrentAdmin()).toBeNull();
    cookieJar.set(API_TOKEN_COOKIE, 'adm-token');
    expect(await findCurrentAdmin()).toMatchObject({ id: 'usr-0', permissions: ['orders.read'] });
    cookieJar.set(API_TOKEN_COOKIE, 'expired');
    expect(await findCurrentAdmin()).toBeNull();
  });
});
