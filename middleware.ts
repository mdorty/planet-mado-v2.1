import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log(`[Middleware] ${request.method} ${request.url}`);
  console.log(`[Middleware] Host: ${request.headers.get('host')}`);
  console.log(`[Middleware] Origin: ${request.headers.get('origin')}`);
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};