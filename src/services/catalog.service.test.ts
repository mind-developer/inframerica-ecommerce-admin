import { coursesSeed } from '@/mocks/courses';
import { coursesService } from './catalog.service';
import { resetDb } from './mock/db';

beforeEach(() => resetDb());

describe('coursesService', () => {
  it('lists the seed and finds by slug or id', async () => {
    expect(await coursesService.list()).toHaveLength(coursesSeed.length);
    expect((await coursesService.getBySlug('conscientizacao-avsec'))?.id).toBe('cur-1');
    expect(await coursesService.getBySlug('nope')).toBeNull();
    expect((await coursesService.get('cur-2'))?.slug).toBe('seguranca-operacional-basico');
  });

  it('updates and restamps updatedAt, ignoring a forged stamp', async () => {
    const r = await coursesService.update('cur-1', { title: 'Novo', updatedAt: '1999-01-01' } as never);
    expect(r.title).toBe('Novo');
    expect(r.updatedAt).not.toBe('1999-01-01');
    expect(r.updatedAt > coursesSeed[0]!.updatedAt).toBe(true);
  });

  it('throws on unknown ids and removes courses', async () => {
    await expect(coursesService.update('nope', { title: 'x' })).rejects.toThrow();
    await coursesService.remove('cur-1');
    expect(await coursesService.get('cur-1')).toBeNull();
  });
});
