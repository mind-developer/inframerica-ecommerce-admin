'use client';

import { LogOut } from 'lucide-react';
import { useTransition } from 'react';
import { signOut } from '../actions/authActions';

export function SignOutButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => signOut())}
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"
    >
      <LogOut aria-hidden className="size-3.5" /> Sair
    </button>
  );
}
