'use client';

import { useTransition } from 'react';
import { toast } from './toast';
import type { ActionResult } from '@/types/common';

/** Runs a server action in a transition, toasting success or the returned error. */
export function useServerAction() {
  const [pending, startTransition] = useTransition();
  const run = <T>(action: () => Promise<ActionResult<T>>, success?: string, onSuccess?: (data: T) => void) =>
    startTransition(async () => {
      const r = await action();
      if (!r.ok) return toast(r.error, undefined, 'error');
      if (success) toast(success, undefined, 'success');
      onSuccess?.(r.data);
    });
  return { pending, run };
}
