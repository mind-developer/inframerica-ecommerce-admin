import { getCurrentAdmin } from '../data/currentAdmin';
import { SignOutButton } from './SignOutButton';

/** Reads the session: render inside <Suspense>. */
export async function CurrentAdminBadge() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;
  return (
    <div className="ml-auto flex min-w-0 items-center gap-4">
      <span className="truncate text-xs text-muted-foreground">
        {admin.name} · <span className="tracking-wide uppercase">{admin.profile?.name ?? 'Acesso total'}</span>
      </span>
      <SignOutButton />
    </div>
  );
}
