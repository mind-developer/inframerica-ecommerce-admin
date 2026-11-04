import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { findCurrentAdmin } from '@/services/adminAuth.service';
import { resetDb } from '@/services/mock/db';
import * as storefront from '@/services/storefront.service';
import { cookieJar } from '@/test/cookieJar';
import { ownerSession, signInAs } from '@/test/session';
import { adminMutation } from './adminMutation';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

beforeEach(() => {
  resetDb();
  cookieJar.clear();
  vi.mocked(updateTag).mockClear();
});

describe('adminMutation', () => {
  it('sends anonymous callers to sign in without running anything', async () => {
    const run = vi.fn();
    await expect(adminMutation('sectors', ['sectors'], run)).rejects.toThrow('NEXT_REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/login');
    expect(run).not.toHaveBeenCalled();
  });

  it('runs, expires the tags and notifies the storefront', async () => {
    signInAs('usr-0');
    const notify = vi.spyOn(storefront, 'notifyStorefront').mockResolvedValue(true);
    expect(await adminMutation('courses', ['courses'], async () => 42, ['courses'])).toEqual({ ok: true, data: 42 });
    expect(updateTag).toHaveBeenCalledWith('courses');
    expect(notify).toHaveBeenCalledWith(['courses']);
  });

  it('refuses without the manage permission, running nothing', async () => {
    signInAs('usr-0');
    vi.mocked(findCurrentAdmin).mockResolvedValueOnce({ ...ownerSession, permissions: ['sectors.read'] });
    const run = vi.fn();
    expect(await adminMutation('sectors', ['sectors'], run)).toEqual({
      ok: false,
      error: 'Você não tem permissão para esta ação.',
    });
    expect(run).not.toHaveBeenCalled();
  });

  it('turns service errors into a message and expires nothing', async () => {
    signInAs('usr-0');
    expect(
      await adminMutation('sectors', ['sectors'], async () => {
        throw new Error('Registro x não encontrado');
      }),
    ).toEqual({ ok: false, error: 'Registro x não encontrado' });
    expect(updateTag).not.toHaveBeenCalled();
  });
});
