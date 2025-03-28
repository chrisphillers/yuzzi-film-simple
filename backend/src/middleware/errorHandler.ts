// @ts-ignore
import { NextResponse } from 'next/server';
// @ts-ignore
import type { NextRequest } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function middleware(request: NextRequest) {
  // @ts-ignore
  const transaction = Sentry.startTransaction({
    op: 'middleware',
    name: request.nextUrl.pathname,
  });

  try {
    const response = await NextResponse.next();
    transaction.finish();
    return response;
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setExtra('url', request.url);
      scope.setExtra('method', request.method);
      scope.setExtra('headers', Object.fromEntries(request.headers));
      Sentry.captureException(error);
    });

    console.error('Middleware Error:', error);
    transaction.finish();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
