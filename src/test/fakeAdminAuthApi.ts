/** Stand-in for the API's `POST /auth/admin/login` (inframerica-ecommerce-api), installed as `fetch`. */
import { vi } from 'vitest';

const ADMIN = {
  id: 'usr-0',
  name: 'Administrador Inframérica',
  email: 'admin@inframerica.com',
  owner: true,
  sectorId: null,
  profile: null,
  permissions: ['orders.read'],
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export function installFakeAdminAuthApi() {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      if (String(input).endsWith('/auth/admin/me')) {
        const auth = new Headers(init?.headers).get('authorization');
        return auth === 'Bearer adm-token' ? json(200, ADMIN) : json(401, {});
      }
      if (!String(input).endsWith('/auth/admin/login')) return json(404, {});
      const { email, password } = JSON.parse(String(init?.body ?? '{}'));
      return email === ADMIN.email && password === '123456'
        ? json(200, { status: 'ok', accessToken: 'adm-token', user: ADMIN })
        : json(401, { status: 'invalid-credentials' });
    }),
  );
}
