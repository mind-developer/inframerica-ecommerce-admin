import { adminUsersService } from './commerce.service';
import { findActiveAdmin, verifyAdminCredentials } from './adminAuth.service';
import { resetDb } from './mock/db';
import { installFakeAdminAuthApi } from '@/test/fakeAdminAuthApi';

beforeEach(() => {
  resetDb();
  installFakeAdminAuthApi();
});
afterEach(() => vi.unstubAllGlobals());

describe('admin auth', () => {
  it('accepts the demo admin, case-insensitively, without leaking extra fields', async () => {
    expect(await verifyAdminCredentials('ADMIN@inframerica.com', '123456')).toEqual({
      id: 'usr-0',
      name: 'Administrador Inframérica',
      email: 'admin@inframerica.com',
      role: 'super_admin',
    });
  });

  it('rejects wrong passwords and admins without a password', async () => {
    expect(await verifyAdminCredentials('admin@inframerica.com', 'x')).toBeNull();
    expect(await verifyAdminCredentials('mariana.souza@infraamerica.com', '123456')).toBeNull();
  });

  it('stops recognising a deactivated admin', async () => {
    await adminUsersService.update('usr-0', { active: false });
    expect(await findActiveAdmin('usr-0')).toBeNull();
  });
});
