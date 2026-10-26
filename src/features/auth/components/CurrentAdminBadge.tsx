import { ADMIN_ROLE_LABEL } from '@/constants/labels';
import { getCurrentAdmin } from '../data/currentAdmin';
import { SignOutButton } from './SignOutButton';

/** Reads the session: render inside <Suspense>. */
export async function CurrentAdminBadge() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;
  return (
    <div className="ml-auto flex min-w-0 items-center gap-4">
      <span className="truncate text-xs text-muted-foreground">
        {admin.name} · <span className="tracking-wide uppercase">{ADMIN_ROLE_LABEL[admin.role]}</span>
      </span>
      <SignOutButton />
    </div>
  );
}
