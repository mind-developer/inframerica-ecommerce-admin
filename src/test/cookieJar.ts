/** In-memory stand-in for `cookies()` from next/headers, shared by every test in a file. */
const jar = new Map<string, string>();

export const cookieJar = {
  get: (name: string) => (jar.has(name) ? { name, value: jar.get(name)! } : undefined),
  set: (name: string, value: string) => void jar.set(name, value),
  delete: (name: string) => void jar.delete(name),
  has: (name: string) => jar.has(name),
  clear: () => jar.clear(),
};
