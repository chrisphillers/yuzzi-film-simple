// @ts-ignore
import { NextResponse } from 'next/server';
// @ts-ignore
import type { NextRequest } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function middleware(request: NextRequest) {
  try {
    const response = await NextResponse.next();
    return response;
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setExtra('url', request.url);
      scope.setExtra('method', request.method);
      scope.setExtra('headers', Object.fromEntries(request.headers));
      scope.setExtra('pathname', request.nextUrl.pathname);
      Sentry.captureException(error);
    });

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Apply to all GET routes and admin pages
export const config = {
  matcher: ['/admin/:path*', '/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
