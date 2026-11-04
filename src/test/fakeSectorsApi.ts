/** Stand-in for the API's `/admin/sectors` writes (inframerica-ecommerce-api), installed as `fetch`. */
import { vi } from 'vitest';

const json = (status: number, body?: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), { status });

export const fakeSectorsApi = { rows: new Map<string, Record<string, unknown>>() };

export function installFakeSectorsApi() {
  fakeSectorsApi.rows = new Map();
  let seq = 0;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const id = String(input).split('/admin/sectors/')[1];
      if (init?.method === 'DELETE') return json(fakeSectorsApi.rows.delete(id ?? '') ? 204 : 404);
      const body = JSON.parse(String(init?.body ?? '{}'));
      const taken = [...fakeSectorsApi.rows].some(([key, row]) => key !== id && row.name === body.name);
      if (taken) return json(409, { status: 'name-taken' });
      const key = id ?? `s${++seq}`;
      fakeSectorsApi.rows.set(key, { id: key, ...body });
      return json(id ? 200 : 201, fakeSectorsApi.rows.get(key));
    }),
  );
}
