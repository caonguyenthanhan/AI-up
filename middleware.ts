import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SESSION_NAME = 'admin_session';

/**
 * Verify admin session from request cookies
 */
function verifySessionCookie(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get(SESSION_NAME);

  if (!sessionCookie) {
    return false;
  }

  // Verify the session hash matches
  const expectedHash = crypto
    .createHash('sha256')
    .update(process.env.ADMIN_PASSWORD || '' + process.env.ADMIN_PASSWORD)
    .digest('hex');

  return sessionCookie.value === expectedHash;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require admin session
  const protectedPaths = [
    '/admin',
    '/api/admin',
    '/api/ai',
  ];

  // Check if the request path requires admin authentication
  const isProtectedPath = protectedPaths.some(
    (path) => pathname.startsWith(path) && pathname !== '/admin/login'
  );

  if (isProtectedPath) {
    // Verify admin session
    if (!verifySessionCookie(request)) {
      // Redirect to login page
      if (pathname.startsWith('/api/')) {
        // For API routes, return 401
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // For page routes, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/ai/:path*',
  ],
};
