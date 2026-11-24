import { create } from 'zustand';

export type ToastKind = 'info' | 'success' | 'warning' | 'error';

export interface ToastItem {
  id: number;
  title: string;
  message?: string;
  kind: ToastKind;
}

interface ToastState {
  toasts: ToastItem[];
  /** Open modals, last on top: a modal makes the rest of the page inert, so notices show inside it. */
  hosts: HTMLElement[];
  dismiss: (id: number) => void;
}

/** At most three on screen: the oldest leaves when a new one arrives. */
const MAX_VISIBLE = 3;
const DURATION_MS = 4_500;

let seq = 0;

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  hosts: [],
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** Shows a short notice. Callable from anywhere: components, hooks, action callbacks. */
export function toast(title: string, message?: string, kind: ToastKind = 'info'): void {
  const id = ++seq;
  useToastStore.setState((s) => ({ toasts: [...s.toasts.slice(-(MAX_VISIBLE - 1)), { id, title, message, kind }] }));
  setTimeout(() => useToastStore.getState().dismiss(id), DURATION_MS);
}

/** An open modal takes the notices until the returned function runs. */
export function hostToasts(host: HTMLElement): () => void {
  useToastStore.setState((s) => ({ hosts: [...s.hosts, host] }));
  return () => useToastStore.setState((s) => ({ hosts: s.hosts.filter((h) => h !== host) }));
}
