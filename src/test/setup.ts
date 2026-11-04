import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => cleanup());

vi.mock('next/server', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/server')>()),
  connection: async () => {},
}));

vi.mock('next/headers', async () => {
  const { cookieJar } = await import('./cookieJar');
  return { cookies: async () => cookieJar };
});

// `next/cache` APIs need a Next request scope; in unit tests they are spies.
vi.mock('next/cache', () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
  updateTag: vi.fn(),
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
  refresh: vi.fn(),
}));

// The admin behind a session comes from the API; tests run as the owner by default.
vi.mock('@/services/adminAuth.service', async (importOriginal) => {
  const { ownerSession } = await import('./session');
  return {
    ...(await importOriginal<typeof import('@/services/adminAuth.service')>()),
    findCurrentAdmin: vi.fn(async () => ownerSession),
  };
});

// jsdom has <dialog> but not its modal API.
const dialogProto = window.HTMLDialogElement.prototype;
if (!dialogProto.showModal) {
  dialogProto.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  dialogProto.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}

// jsdom has no ResizeObserver (Recharts' ResponsiveContainer needs one) nor matchMedia.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;
window.scrollTo = () => {};
Element.prototype.scrollIntoView ??= () => {};
