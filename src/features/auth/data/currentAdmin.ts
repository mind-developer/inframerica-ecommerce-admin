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

/** First tab the admin may open, or null when the profile has none. */
export const firstScreen = (admin: AdminSessionUser) => SCREENS.find((s) => can(admin, s.resource, 'read')) ?? null;

/**
 * A page's guard. A tab outside the profile shows "acesso restrito"; the dashboard (where sign-in lands)
 * opens the first allowed tab instead.
 */
export async function requireScreen(resource: Resource): Promise<AdminSessionUser> {
  const admin = await requireAdmin();
  if (can(admin, resource, 'read')) return admin;
  const first = resource === 'dashboard' ? firstScreen(admin) : null;
  redirect(first ? first.href : '/sem-acesso');
}
