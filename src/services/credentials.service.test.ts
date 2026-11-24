import { API_TOKEN_COOKIE } from '@/constants/session';
import { credentialsSeed } from '@/mocks/credentials';
import { cookieJar } from '@/test/cookieJar';

// setup.ts swaps these modules for the mock db; here we test the real API clients.
const { credentialsService } = await vi.importActual<typeof import('./credentials.service')>('./credentials.service');
const { coursesService } = await vi.importActual<typeof import('./courses.service')>('./courses.service');

const json = (status: number, body?: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), { status });
const { id: _id, createdAt: _c, ...input } = credentialsSeed[0]!;
const calls: { url: string; method: string; body: unknown }[] = [];
let answer: Response;

beforeEach(() => {
  cookieJar.clear();
  cookieJar.set(API_TOKEN_COOKIE, 'adm-token');
  calls.length = 0;
  answer = json(200, credentialsSeed[0]);
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      calls.push({
        url: String(url),
        method: init?.method ?? 'GET',
        body: init?.body && JSON.parse(String(init.body)),
      });
      return answer;
    }),
  );
});
afterEach(() => vi.unstubAllGlobals());

describe('credentialsService (API, #69)', () => {
  it('lists, creates and updates', async () => {
    answer = json(200, credentialsSeed);
    expect(await credentialsService.list()).toHaveLength(credentialsSeed.length);
    answer = json(201, credentialsSeed[0]);
    await credentialsService.create(input);
    answer = json(200, credentialsSeed[0]);
    await credentialsService.update('cred-1', input);
    expect(calls.map((c) => c.method)).toEqual(['GET', 'POST', 'PATCH']);
    expect(calls[2]).toMatchObject({ url: expect.stringMatching(/\/admin\/credentials\/cred-1$/), body: input });
  });

  it('explains why a credential in use stays', async () => {
    answer = json(409, { status: 'credential-in-use' });
    await expect(credentialsService.remove('cred-1')).rejects.toThrow('está vinculada a cursos');
    answer = json(404, { status: 'not-found' });
    await expect(credentialsService.remove('nope')).rejects.toThrow('Credencial não encontrada');
  });
});

it('keeps a course with cohorts, saying why (#62)', async () => {
  answer = json(409, { status: 'course-in-use' });
  await expect(coursesService.remove('cur-1')).rejects.toThrow('Este curso tem turmas');
});
