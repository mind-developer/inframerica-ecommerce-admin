import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/constants/session';
import { loginRedirect } from '@/utils/loginRedirect';

/** Optimistic guard: everything but the sign-in page needs a session. Pages re-check it on the server. */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();
  return NextResponse.redirect(loginRedirect(request.nextUrl));
}

export const config = { matcher: ['/((?!login|_next/|favicon.ico|icon.svg|apple-icon.png|images/|robots.txt).*)'] };
