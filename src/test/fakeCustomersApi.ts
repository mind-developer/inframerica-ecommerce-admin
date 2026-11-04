/** Stand-in for the API's `/admin/customers` (inframerica-ecommerce-api), installed as `fetch`. */
import { vi } from 'vitest';

const json = (status: number, body?: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), { status });

export const fakeCustomersApi = {
  rows: new Map<string, Record<string, unknown>>(),
  /** Set to make the next PATCH answer 409 with this status. */
  conflict: null as string | null,
};

export function installFakeCustomersApi() {
  fakeCustomersApi.rows = new Map([['cli-2', { id: 'cli-2', name: 'GOL' }]]);
  fakeCustomersApi.conflict = null;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const id = String(input).split('/admin/customers/')[1] ?? '';
      if (init?.method === 'DELETE') return json(fakeCustomersApi.rows.delete(id) ? 204 : 404);
      if (fakeCustomersApi.conflict) return json(409, { status: fakeCustomersApi.conflict });
      const row = { ...fakeCustomersApi.rows.get(id), ...JSON.parse(String(init?.body ?? '{}')) };
      fakeCustomersApi.rows.set(id, row);
      return json(200, row);
    }),
  );
}
