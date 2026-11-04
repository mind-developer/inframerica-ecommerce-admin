import { API_TOKEN_COOKIE } from '@/constants/session';
import { resetDb } from '@/services/mock/db';
import { cookieJar } from '@/test/cookieJar';
import { fakeSectorsApi, installFakeSectorsApi } from '@/test/fakeSectorsApi';
import { signInAs } from '@/test/session';
import { deleteSector, saveSector } from './sectorActions';

const base = { name: 'Novo', description: '', manager: '', active: true };

beforeEach(() => {
  resetDb();
  cookieJar.clear();
  signInAs('usr-0');
  cookieJar.set(API_TOKEN_COOKIE, 'adm-token');
  installFakeSectorsApi();
});
afterEach(() => vi.unstubAllGlobals());

describe('sector actions', () => {
  it('creates without a manager, updates and deletes', async () => {
    expect((await saveSector(null, base)).ok).toBe(true);
    await saveSector('s1', { ...base, name: 'Renomeado', manager: 'm', active: false });
    expect(fakeSectorsApi.rows.get('s1')).toMatchObject({ name: 'Renomeado', active: false });
    expect((await deleteSector('s1')).ok).toBe(true);
    expect(fakeSectorsApi.rows.size).toBe(0);
  });

  it("shows the API's refusal of a repeated name", async () => {
    await saveSector(null, base);
    expect(await saveSector(null, base)).toEqual({ ok: false, error: 'Já existe um setor com este nome' });
  });

  it('keeps a sector that courses or credentials still use', async () => {
    expect(await deleteSector('set-avsec')).toEqual({
      ok: false,
      error: 'Este setor tem cursos ou credenciais vinculados.',
    });
  });

  it('validates on the server', async () => {
    expect(await saveSector(null, { ...base, name: ' ' })).toEqual({ ok: false, error: 'Informe o nome do setor' });
  });
});
