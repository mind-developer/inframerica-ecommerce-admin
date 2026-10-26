import 'server-only';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { findActiveAdmin } from '@/services/adminAuth.service';
import { getSessionUserId } from '@/services/session.service';
import type { AdminSessionUser } from '@/types/auth';

/** The signed-in admin (still active), or null. Deduplicated per request; reads the cookie. */
export const getCurrentAdmin = cache(async (): Promise<AdminSessionUser | null> => {
  const id = await getSessionUserId();
  return id ? findActiveAdmin(id) : null;
});

/** Every admin page and action calls this first: no session (or a deactivated admin) means sign in again. */
export async function requireAdmin(): Promise<AdminSessionUser> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/login');
  return admin;
}
