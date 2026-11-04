import 'server-only';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { SCREENS, type AccessAction, type Resource } from '@/constants/access';
import { findCurrentAdmin } from '@/services/adminAuth.service';
import { getSessionUserId } from '@/services/session.service';
import type { AdminSessionUser } from '@/types/auth';

export const getCurrentAdmin = cache(async (): Promise<AdminSessionUser | null> => {
  const id = await getSessionUserId();
  return id ? findCurrentAdmin() : null;
});

/** Every admin page and action calls this first: no session (or a deactivated admin) means sign in again. */
export async function requireAdmin(): Promise<AdminSessionUser> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/login');
  return admin;
}

export const can = (admin: AdminSessionUser, resource: Resource, action: AccessAction) =>
  admin.permissions.includes(`${resource}.${action}`);

/** A page's guard: without the tab, the admin lands on the first one they may see. */
export async function requireScreen(resource: Resource): Promise<AdminSessionUser> {
  const admin = await requireAdmin();
  if (can(admin, resource, 'read')) return admin;
  const first = SCREENS.find((s) => can(admin, s.resource, 'read'));
  redirect(first ? first.href : '/sem-acesso');
}
