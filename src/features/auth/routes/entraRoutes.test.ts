import { ENTRA_COOKIE, API_TOKEN_COOKIE } from '@/constants/session';
import { getSessionUserId } from '@/services/session.service';
import { cookieJar } from '@/test/cookieJar';
import { entraCallback, entraStart } from './entraRoutes';

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw new Error(`to ${url}`);
  },
}));

const json = (status: number, body?: unknown) => new Response(JSON.stringify(body ?? {}), { status });
const STARTED = { authorizationUrl: 'https://login.test/a', state: 's1', nonce: 'n1', codeVerifier: 'v1' };
const SESSION = { accessToken: 'adm-token', user: { id: 'usr-0' } };
const calls: { url: string; body: unknown }[] = [];
let answer: () => Response;

beforeEach(() => {
  cookieJar.clear();
  calls.length = 0;
  answer = () => json(200, SESSION);
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ url: String(url), body: init?.body && JSON.parse(String(init.body)) });
      return String(url).endsWith('/start') ? json(200, STARTED) : answer();
    }),
  );
});
afterEach(() => vi.unstubAllGlobals());

const went = async (call: Promise<unknown>) =>
  call.then(
    () => 'nowhere',
    (e: Error) => e.message.replace('to ', ''),
  );
const start = (query = '') => went(entraStart(new Request(`http://0.0.0.0:3001/auth/entra/start${query}`)));
const back = (query: string) => went(entraCallback(new Request(`http://0.0.0.0:3001/auth/entra/callback${query}`)));

describe('Microsoft sign-in routes', () => {
  it('goes to Microsoft, then signs in and returns to the page', async () => {
    expect(await start('?redirect=/clientes?id=7')).toBe('https://login.test/a');
    expect(await back('?code=c1&state=s1')).toBe('/clientes?id=7');
    expect(calls[1]!.body).toEqual({ code: 'c1', state: 's1', nonce: 'n1', codeVerifier: 'v1' });
    expect(await getSessionUserId()).toBe('usr-0');
    expect(cookieJar.get(API_TOKEN_COOKIE)?.value).toBe('adm-token');
    expect(cookieJar.has(ENTRA_COOKIE)).toBe(false);
  });

  it('never goes to another site afterwards', async () => {
    await start('?redirect=//evil.com');
    expect(await back('?code=c&state=s1')).toBe('/');
  });

  it('only finishes what this browser started, once', async () => {
    expect(await back('?code=c&state=s1')).toBe('/login?erro=expirado');
    await start();
    expect(await back('?code=c&state=other')).toBe('/login?erro=expirado');
    expect(await back('?code=c&state=s1')).toBe('/login?erro=expirado');
    expect(calls.filter((c) => c.url.endsWith('/callback'))).toHaveLength(0);
  });

  it('comes back to the sign-in page, keeping the destination, when Microsoft refuses', async () => {
    await start('?redirect=/cursos');
    expect(await back('?error=access_denied&state=s1')).toBe('/login?erro=cancelado&redirect=%2Fcursos');
  });

  it.each([
    [403, 'not-invited', 'sem-acesso'],
    [403, 'inactive', 'inativo'],
    [403, 'outside-tenant', 'externo'],
    [401, 'entra-failed', 'falha'],
    [500, '', 'indisponivel'],
  ])('turns %i %s into a message', async (status, code, error) => {
    await start();
    answer = () => json(status, { status: code });
    expect(await back('?code=c&state=s1')).toBe(`/login?erro=${error}`);
    expect(await getSessionUserId()).toBeNull();
  });

  it('says so when the API is down or Microsoft sign-in is off', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('x')));
    expect(await start()).toBe('/login?erro=indisponivel');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => json(404)),
    );
    expect(await start()).toBe('/login?erro=indisponivel');
  });
});
