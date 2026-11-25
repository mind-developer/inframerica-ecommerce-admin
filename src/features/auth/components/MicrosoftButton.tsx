import { buttonStyles } from '@/components/ui/buttonStyles';

/** A plain link, not `<Link>`: it must not be prefetched, since it starts a sign-in. */
export function MicrosoftButton({ redirectTo }: { redirectTo: string | null }) {
  const query = redirectTo ? `?${new URLSearchParams({ redirect: redirectTo })}` : '';
  return (
    <a
      href={`/auth/entra/start${query}`}
      className={buttonStyles({ variant: 'outline', className: 'h-11 w-full rounded-xl' })}
    >
      <svg aria-hidden viewBox="0 0 21 21" className="size-4">
        <path fill="#f25022" d="M1 1h9v9H1z" />
        <path fill="#7fba00" d="M11 1h9v9h-9z" />
        <path fill="#00a4ef" d="M1 11h9v9H1z" />
        <path fill="#ffb900" d="M11 11h9v9h-9z" />
      </svg>
      Entrar com Microsoft
    </a>
  );
}
