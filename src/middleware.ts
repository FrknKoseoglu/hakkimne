import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host');

  // Check if the hostname is a vercel.app subdomain (and not localhost)
  // This ensures we don't break local development or preview deployments if not desired, 
  // but the requirement is to force traffic to the main domain.
  if (hostname && hostname.includes('vercel.app')) {
    const url = new URL(request.url);
    url.hostname = 'hakkimne.com';
    url.protocol = 'https';
    
    // Redirect to the new URL with 301 Permanent Redirect
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
