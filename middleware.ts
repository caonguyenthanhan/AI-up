import { NextRequest, NextResponse } from 'next/server';

const SESSION_NAME = 'admin_session';

/**
 * Verify admin session from request cookies
 */
async function verifySessionCookie(request: NextRequest): Promise<boolean> {
  const sessionCookie = request.cookies.get(SESSION_NAME);

  if (!sessionCookie) {
    return false;
  }

  // Verify the session hash matches using standard Web Crypto API (Edge Runtime compliant)
  const password = process.env.ADMIN_PASSWORD || '';
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const expectedHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return sessionCookie.value === expectedHash;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require admin session
  const protectedPaths = [
    '/admin',
    '/api/admin',
    '/api/ai',
  ];

  // Check if the request path requires admin authentication
  const isProtectedPath = protectedPaths.some(
    (path) => pathname.startsWith(path) && 
              pathname !== '/admin/login' && 
              pathname !== '/api/admin/login'
  );

  if (isProtectedPath) {
    // Verify admin session
    if (!(await verifySessionCookie(request))) {
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
