import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_NAME = 'admin_session';
const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

/**
 * Generate session hash from password
 */
function generateSessionHash(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + process.env.ADMIN_PASSWORD)
    .digest('hex');
}

/**
 * Verify admin password
 */
export function verifyAdminPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}

/**
 * Create admin session cookie
 */
export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionHash = generateSessionHash(process.env.ADMIN_PASSWORD || '');
  
  cookieStore.set(SESSION_NAME, sessionHash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  });
}

/**
 * Verify admin session from cookies
 */
export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_NAME);
  
  if (!sessionCookie) {
    return false;
  }
  
  const expectedHash = generateSessionHash(process.env.ADMIN_PASSWORD || '');
  return sessionCookie.value === expectedHash;
}

/**
 * Clear admin session
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_NAME);
}
