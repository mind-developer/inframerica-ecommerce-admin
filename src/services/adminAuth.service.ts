/**
 * Mock admin authentication (PROTOTYPE ONLY): an active AdminUser plus a demo password kept in server
 * memory. Replaced by the API's auth (OAuth2 with a role claim, per the prototype's plan).
 */
import 'server-only';
import type { AdminSessionUser } from '@/types/auth';
import { getDb } from './mock/db';
import { latency } from './mock/table';

const toSession = ({ id, name, email, role }: AdminSessionUser): AdminSessionUser => ({ id, name, email, role });

export async function verifyAdminCredentials(email: string, password: string): Promise<AdminSessionUser | null> {
  await latency();
  const db = getDb();
  const normalized = email.trim().toLowerCase();
  const user = db.adminUsers.findBy((u) => u.active && u.email.toLowerCase() === normalized);
  if (!user || db.adminPasswords.get(normalized) !== password) return null;
  return toSession(user);
}

/** The admin behind a session, only while still active. */
export async function findActiveAdmin(id: string): Promise<AdminSessionUser | null> {
  const user = getDb().adminUsers.find(id);
  return user?.active ? toSession(user) : null;
}
