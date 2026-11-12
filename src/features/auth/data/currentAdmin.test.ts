import { redirect } from 'next/navigation';
import { API_TOKEN_COOKIE } from '@/constants/session';
import { cookieJar } from '@/test/cookieJar';
import { findCurrentAdmin } from '@/services/adminAuth.service';
import { installFakeAdminAuthApi } from '@/test/fakeAdminAuthApi';
import { ownerSession } from '@/test/session';
import { signInAs } from '@/test/session';
import { requireScreen } from './currentAdmin';

vi.mock('next/navigation', () => ({
  redirect: vi.fn((to: string) => {
    throw new Error(`redirect:${to}`);
  }),
}));

beforeEach(() => {
  installFakeAdminAuthApi();
  cookieJar.clear();
  signInAs('usr-0');
  cookieJar.set(API_TOKEN_COOKIE, 'adm-token');
  // This admin's profile only opens the orders tab.
  vi.mocked(findCurrentAdmin).mockResolvedValue({ ...ownerSession, owner: false, permissions: ['orders.read'] });
});
afterEach(() => vi.unstubAllGlobals());

describe('requireScreen', () => {
  it('lets the admin into a tab of their profile', async () => {
    expect((await requireScreen('orders')).id).toBe('usr-0');
  });

  it('shows "acesso restrito" for a tab outside the profile', async () => {
    await expect(requireScreen('customers')).rejects.toThrow('redirect:/sem-acesso');
  });

  it('opens the first allowed tab instead of a dashboard the admin cannot see', async () => {
    await expect(requireScreen('dashboard')).rejects.toThrow('redirect:/pedidos');
    expect(redirect).toHaveBeenLastCalledWith('/pedidos');
  });
});
