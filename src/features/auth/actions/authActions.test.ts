import { redirect } from 'next/navigation';
import { resetDb } from '@/services/mock/db';
import { getSessionUserId } from '@/services/session.service';
import { cookieJar } from '@/test/cookieJar';
import { installFakeAdminAuthApi } from '@/test/fakeAdminAuthApi';
import { signIn, signOut } from './authActions';

vi.mock('next/navigation', () => ({ redirect: vi.fn() }));

beforeEach(() => {
  installFakeAdminAuthApi();
  resetDb();
  cookieJar.clear();
  vi.mocked(redirect).mockClear();
});

afterEach(() => vi.unstubAllGlobals());

describe('admin sign-in (checked by the API)', () => {
  it('starts a session and goes to the dashboard', async () => {
    expect(await signIn({ email: 'admin@inframerica.com', password: '123456' })).toBeUndefined();
    expect(await getSessionUserId()).toBe('usr-0');
    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('refuses wrong credentials with one generic message', async () => {
    const r = await signIn({ email: 'admin@inframerica.com', password: 'errada' });
    expect(r?.error).toMatch(/E-mail ou senha inválidos/);
    expect(await getSessionUserId()).toBeNull();
  });

  it('says so when the API cannot be reached', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));
    const r = await signIn({ email: 'admin@inframerica.com', password: '123456' });
    expect(r?.error).toBe('Não foi possível entrar agora. Tente novamente em instantes.');
  });

  it('signs out', async () => {
    await signIn({ email: 'admin@inframerica.com', password: '123456' });
    await signOut();
    expect(await getSessionUserId()).toBeNull();
    expect(redirect).toHaveBeenLastCalledWith('/login');
  });
});
