import { API_TOKEN_COOKIE } from '@/constants/session';
import { coursesSeed } from '@/mocks/courses';
import { cookieJar } from '@/test/cookieJar';

// setup.ts swaps this module for the mock db; here we test the real API client.
const { coursesService } = await vi.importActual<typeof import('./courses.service')>('./courses.service');

const json = (status: number, body?: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), { status });
const course = { ...coursesSeed[0]!, defaultLocation: '', sapCode: '' };
const calls: { url: string; method: string; body: unknown }[] = [];
let answer: Response;

beforeEach(() => {
  cookieJar.clear();
  cookieJar.set(API_TOKEN_COOKIE, 'adm-token');
  calls.length = 0;
  answer = json(200, course);
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({
        url: String(input),
        method: init?.method ?? 'GET',
        body: init?.body && JSON.parse(String(init.body)),
      });
      return answer;
    }),
  );
});
afterEach(() => vi.unstubAllGlobals());

describe('coursesService (API)', () => {
  it('lists every course and leaves blank optional texts out', async () => {
    answer = json(200, [course]);
    const [first] = await coursesService.list();
    expect(calls[0]!.url).toMatch(/\/admin\/courses$/);
    expect(first).toMatchObject({ id: 'cur-1', defaultLocation: undefined, sapCode: undefined });
  });

  it('opens one course, null when the API does not know it', async () => {
    expect((await coursesService.get('cur-1'))?.slug).toBe(course.slug);
    answer = json(404, { status: 'not-found' });
    expect(await coursesService.get('nope')).toBeNull();
  });

  it('sends every text to the API, even the optional ones', async () => {
    const { id: _id, updatedAt: _u, ...input } = coursesSeed[0]!;
    await coursesService.update('cur-1', { ...input, defaultLocation: undefined, sapCode: undefined });
    expect(calls[0]).toMatchObject({ method: 'PATCH', body: { defaultLocation: '', sapCode: '' } });
    expect(calls[0]!.url).toMatch(/\/admin\/courses\/cur-1$/);
  });

  it('turns the API refusals into messages', async () => {
    const { id: _id, updatedAt: _u, ...input } = coursesSeed[0]!;
    answer = json(409, { status: 'slug-taken' });
    await expect(coursesService.create(input)).rejects.toThrow('Já existe um curso com este endereço (slug)');
    answer = json(404, { status: 'not-found' });
    await expect(coursesService.remove('nope')).rejects.toThrow('Curso não encontrado');
  });
});
