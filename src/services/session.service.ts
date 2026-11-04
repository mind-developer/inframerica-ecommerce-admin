/**
 * Admin session cookie (mock auth). An HMAC-signed `userId.expiresAt.signature`, httpOnly and SameSite=Lax:
 * the browser never sees credentials and can't forge a user id. Replaced by the API's token once auth
 * exists in the contract.
 */
import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { connection } from 'next/server';
import { API_TOKEN_COOKIE, SESSION_COOKIE } from '@/constants/session';

export { SESSION_COOKIE };

const MAX_AGE_SECONDS = 60 * 60 * 8;

const secret = () => process.env.SESSION_SECRET || 'dev-only-insecure-session-secret';
const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url');

export function signSession(userId: string, expiresAt: number): string {
  const payload = `${userId}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

/** The user id of a valid, unexpired token; null otherwise. */
export function verifySession(token: string | undefined, now: number = Date.now()): string | null {
  if (!token) return null;
  const lastDot = token.lastIndexOf('.');
  const payload = token.slice(0, lastDot);
  const signature = Buffer.from(token.slice(lastDot + 1));
  const expected = Buffer.from(sign(payload));
  if (signature.length !== expected.length || !timingSafeEqual(signature, expected)) return null;
  const [userId, expiresAt] = [payload.slice(0, payload.lastIndexOf('.')), Number(payload.split('.').pop())];
  if (!userId || !Number.isFinite(expiresAt) || expiresAt < now) return null;
  return userId;
}

export async function getSessionUserId(): Promise<string | null> {
  // Expiry is checked against the clock: always a request-time read, never prerendered.
  await connection();
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function getApiToken(): Promise<string | undefined> {
  return (await cookies()).get(API_TOKEN_COOKIE)?.value;
}

export async function startSession(userId: string, apiToken: string): Promise<void> {
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  const jar = await cookies();
  const options = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  } as const;
  jar.set(SESSION_COOKIE, signSession(userId, expiresAt), options);
  jar.set(API_TOKEN_COOKIE, apiToken, options);
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete(API_TOKEN_COOKIE);
}
