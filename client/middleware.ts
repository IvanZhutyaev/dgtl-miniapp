import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Paths that don't require authentication
const publicPaths = [
  '/_next',
  '/api/auth',
  '/static',
  '/fonts',
  '/images',
  '/auth/error',
  '/auth/signout'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths and files
  if (publicPaths.some(path => pathname.startsWith(path)) || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Check if we're in Telegram Mini App environment
  const userAgent = request.headers.get('user-agent') || '';
  const isTelegramWebApp = userAgent.includes('TelegramWebApp');

  // Get the token
  const token = await getToken({ req: request });

  // If on auth page, always allow access
  if (pathname === '/authpage') {
    return NextResponse.next();
  }

  // If not authenticated, redirect to auth
  if (!token) {
    return NextResponse.redirect(new URL('/authpage', request.url));
  }

  return NextResponse.next();
} 