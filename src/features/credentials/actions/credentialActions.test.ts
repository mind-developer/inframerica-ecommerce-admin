import { credentialsService } from '@/services/catalog.service';
import { resetDb } from '@/services/mock/db';
import { cookieJar } from '@/test/cookieJar';
import { signInAs } from '@/test/session';
import { saveCredential } from './credentialActions';

beforeEach(() => {
  resetDb();
  cookieJar.clear();
  signInAs('usr-0');
});

describe('saveCredential', () => {
  it('requires at least one sector', async () => {
    expect(
      await saveCredential(null, {
        name: 'X',
        acronym: 'x',
        description: '',
        validityMonths: 12,
        sectorIds: [],
        active: true,
      }),
    ).toEqual({
      ok: false,
      error: 'Vincule a credencial a pelo menos um setor',
    });
  });

  it('stores the acronym upper-case', async () => {
    await saveCredential(null, {
      name: 'Nova',
      acronym: 'nv',
      description: '',
      validityMonths: 0,
      sectorIds: ['set-avsec'],
      active: true,
    });
    expect((await credentialsService.list()).find((c) => c.name === 'Nova')?.acronym).toBe('NV');
  });
});
