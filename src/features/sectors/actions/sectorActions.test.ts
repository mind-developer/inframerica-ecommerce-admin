import { sectorsService } from '@/services/catalog.service';
import { resetDb } from '@/services/mock/db';
import { cookieJar } from '@/test/cookieJar';
import { signInAs } from '@/test/session';
import { deleteSector, saveSector } from './sectorActions';

beforeEach(() => {
  resetDb();
  cookieJar.clear();
  signInAs('usr-0');
});

describe('sector actions', () => {
  it('creates, updates and deletes', async () => {
    const created = await saveSector(null, { name: 'Novo', description: '', manager: '', active: true });
    expect(created.ok).toBe(true);
    const id = (await sectorsService.list()).find((s) => s.name === 'Novo')!.id;
    await saveSector(id, { name: 'Renomeado', description: 'd', manager: 'm', active: false });
    expect(await sectorsService.get(id)).toMatchObject({ name: 'Renomeado', active: false });
    await deleteSector(id);
    expect(await sectorsService.get(id)).toBeNull();
  });

  it('validates on the server', async () => {
    expect(await saveSector(null, { name: ' ', description: '', manager: '', active: true })).toEqual({
      ok: false,
      error: 'Informe o nome do setor',
    });
  });
});
