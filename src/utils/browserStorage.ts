import type { StateStorage } from 'zustand/middleware';

const noop: StateStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

/** localStorage in the browser; a no-op on the server, where persisted stores never hydrate. */
export const browserStorage = (): StateStorage => (typeof window === 'undefined' ? noop : window.localStorage);
