import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/constants/session';

/** Optimistic guard: everything but the sign-in page needs a session. Pages re-check it on the server. */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = { matcher: ['/((?!login|_next/|favicon.ico|images/|robots.txt).*)'] };
