import { notifyStorefront } from './storefront.service';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('notifyStorefront', () => {
  it('posts the tags with the shared secret', async () => {
    vi.stubEnv('STOREFRONT_URL', 'http://store.test');
    vi.stubEnv('REVALIDATE_SECRET', 's3cret');
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    expect(await notifyStorefront(['courses'])).toBe(true);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toBe('http://store.test/api/revalidate');
    expect(init.headers['x-revalidate-secret']).toBe('s3cret');
    expect(JSON.parse(init.body)).toEqual({ tags: ['courses'] });
  });

  it('does nothing without configuration and never throws', async () => {
    vi.stubEnv('STOREFRONT_URL', '');
    expect(await notifyStorefront(['courses'])).toBe(false);
    vi.stubEnv('STOREFRONT_URL', 'http://store.test');
    vi.stubEnv('REVALIDATE_SECRET', 's');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')));
    expect(await notifyStorefront(['courses'])).toBe(false);
  });
});
