import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { resetDb } from '@/services/mock/db';
import * as storefront from '@/services/storefront.service';
import { cookieJar } from '@/test/cookieJar';
import { signInAs } from '@/test/session';
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
    await expect(adminMutation(['sectors'], run)).rejects.toThrow('NEXT_REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/login');
    expect(run).not.toHaveBeenCalled();
  });

  it('runs, expires the tags and notifies the storefront', async () => {
    signInAs('usr-0');
    const notify = vi.spyOn(storefront, 'notifyStorefront').mockResolvedValue(true);
    expect(await adminMutation(['courses'], async () => 42, ['courses'])).toEqual({ ok: true, data: 42 });
    expect(updateTag).toHaveBeenCalledWith('courses');
    expect(notify).toHaveBeenCalledWith(['courses']);
  });

  it('turns service errors into a message and expires nothing', async () => {
    signInAs('usr-0');
    expect(
      await adminMutation(['sectors'], async () => {
        throw new Error('Registro x não encontrado');
      }),
    ).toEqual({ ok: false, error: 'Registro x não encontrado' });
    expect(updateTag).not.toHaveBeenCalled();
  });
});
