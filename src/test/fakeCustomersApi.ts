/** Stand-in for the API's `/admin/customers` (inframerica-ecommerce-api), installed as `fetch`. */
import { vi } from 'vitest';

const json = (status: number, body?: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), { status });

export const fakeCustomersApi = {
  rows: new Map<string, Record<string, unknown>>(),
  calls: [] as string[],
  /** Set to make the next PATCH answer 409 with this status. */
  conflict: null as string | null,
};

export function installFakeCustomersApi() {
  fakeCustomersApi.rows = new Map([['cli-2', { id: 'cli-2', name: 'GOL' }]]);
  fakeCustomersApi.conflict = null;
  fakeCustomersApi.calls = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      fakeCustomersApi.calls.push(String(input));
      const id = String(input).split('/admin/customers/')[1] ?? '';
      if (id.endsWith('/password-email')) return json(204);
      if (id.endsWith('/password-link')) return json(201, { url: 'http://loja/redefinir-senha?token=t' });
      if (!init?.method || init.method === 'GET') {
        if (!id)
          return json(200, {
            items: [...fakeCustomersApi.rows.values()],
            total: fakeCustomersApi.rows.size,
            page: 1,
            pageSize: 20,
          });
        const found = fakeCustomersApi.rows.get(id);
        return found ? json(200, found) : json(404, { status: 'not-found' });
      }
      if (init?.method === 'DELETE') return json(fakeCustomersApi.rows.delete(id) ? 204 : 404);
      if (fakeCustomersApi.conflict) return json(409, { status: fakeCustomersApi.conflict });
      const row = { ...fakeCustomersApi.rows.get(id), ...JSON.parse(String(init?.body ?? '{}')) };
      fakeCustomersApi.rows.set(id, row);
      return json(200, row);
    }),
  );
}
