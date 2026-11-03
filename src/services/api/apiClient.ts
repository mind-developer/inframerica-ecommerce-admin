/**
 * HTTP client of inframerica-ecommerce-api. Server-side only by use (the proxy imports it too, so it
 * can't carry `server-only`): the browser never talks to the API, the Next server does (BFF).
 */
const baseUrl = () => process.env.API_URL || 'http://localhost:3333/api/v1';

/** The API could not be reached (down, network error): different from a 4xx answer. */
export class ApiUnavailableError extends Error {
  constructor(cause: unknown) {
    super('API unavailable', { cause });
  }
}

export interface ApiResponse<T> {
  status: number;
  body: T | null;
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, token }: { method?: 'GET' | 'POST'; body?: unknown; token?: string } = {},
): Promise<ApiResponse<T>> {
  let res: Response;
  try {
    res = await fetch(`${baseUrl()}${path}`, {
      method,
      cache: 'no-store',
      headers: {
        ...(body === undefined ? {} : { 'content-type': 'application/json' }),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    throw new ApiUnavailableError(error);
  }
  if (res.status >= 500) throw new ApiUnavailableError(`HTTP ${res.status}`);
  const text = await res.text();
  return { status: res.status, body: text ? (JSON.parse(text) as T) : null };
}
