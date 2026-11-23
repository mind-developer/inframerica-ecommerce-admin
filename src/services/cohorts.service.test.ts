import { API_TOKEN_COOKIE } from '@/constants/session';
import { cohortsSeed } from '@/mocks/cohorts';
import { cookieJar } from '@/test/cookieJar';

// setup.ts swaps this module for the mock db; here we test the real API client.
const { cohortsService } = await vi.importActual<typeof import('./cohorts.service')>('./cohorts.service');

const json = (status: number, body?: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), { status });
const apiRow = { ...cohortsSeed[0]!, meetingPoint: '', materials: '', emailTemplate: '' };
const calls: { url: string; method: string; body: unknown }[] = [];
let answers: Response[];

beforeEach(() => {
  cookieJar.clear();
  cookieJar.set(API_TOKEN_COOKIE, 'adm-token');
  calls.length = 0;
  answers = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({
        url: String(input),
        method: init?.method ?? 'GET',
        body: init?.body && JSON.parse(String(init.body)),
      });
      return answers.shift() ?? json(200, apiRow);
    }),
  );
});
afterEach(() => vi.unstubAllGlobals());

describe('cohortsService (API, #62)', () => {
  it('lists every cohort and leaves blank optional texts out', async () => {
    answers = [json(200, [apiRow])];
    const [first] = await cohortsService.list();
    expect(calls[0]!.url).toMatch(/\/admin\/cohorts$/);
    expect(first).toMatchObject({ id: 'tur-1', meetingPoint: undefined, materials: undefined });
  });

  it('opens one cohort, null when the API does not know it', async () => {
    expect((await cohortsService.get('tur-1'))?.courseId).toBe('cur-1');
    answers = [json(404, { status: 'not-found' })];
    expect(await cohortsService.get('nope')).toBeNull();
  });

  it('changes part of a cohort by sending it whole', async () => {
    await cohortsService.update('tur-1', { status: 'canceled' });
    expect(calls.map((c) => c.method)).toEqual(['GET', 'PATCH']);
    expect(calls[1]).toMatchObject({ body: { status: 'canceled', courseId: 'cur-1', meetingPoint: '' } });
  });

  it('turns the API refusals into messages', async () => {
    const { id: _id, ...input } = cohortsSeed[0]!;
    answers = [json(409, { status: 'unknown-course' })];
    await expect(cohortsService.create(input)).rejects.toThrow('O curso escolhido não existe mais');
    answers = [json(404, { status: 'not-found' })];
    await expect(cohortsService.remove('nope')).rejects.toThrow('Turma não encontrada');
  });
});
