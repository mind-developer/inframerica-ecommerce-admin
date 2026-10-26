import { adminUsersService } from '@/services/commerce.service';
import { resetDb } from '@/services/mock/db';
import { cookieJar } from '@/test/cookieJar';
import { signInAs } from '@/test/session';
import { saveAdminUser } from './adminUserActions';

beforeEach(() => {
  resetDb();
  cookieJar.clear();
  signInAs('usr-0');
});

describe('saveAdminUser', () => {
  it('maps an empty sector to "all sectors" (null)', async () => {
    await saveAdminUser(null, { name: 'Nova', email: 'nova@x.com', role: 'finance', sectorId: '', active: true });
    expect((await adminUsersService.list()).find((u) => u.email === 'nova@x.com')).toMatchObject({
      sectorId: null,
      role: 'finance',
    });
  });

  it('requires name and a valid e-mail', async () => {
    expect((await saveAdminUser(null, { name: '', email: 'x', role: 'admin', sectorId: '', active: true })).ok).toBe(
      false,
    );
  });
});
