import { NextRequest, NextResponse } from 'next/server';

const DASHBOARD_TOKEN_COOKIE = 'twenty_dashboard_token';
const AUTH_CALLBACK_PATH = '/auth-callback';

export const middleware = (request: NextRequest) => {
  const { pathname, search } = request.nextUrl;

  // Skip for the auth callback route (it sets the cookie)
  if (pathname.startsWith(AUTH_CALLBACK_PATH)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(DASHBOARD_TOKEN_COOKIE)?.value;

  if (token) {
    return NextResponse.next();
  }

  // Behind Railway's edge proxy, request.nextUrl.origin is the internal
  // http://localhost:<port> — useless for the returnTo. Reconstruct the
  // public origin from the forwarded headers Railway sets.
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https';
  const forwardedHost =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  const publicOrigin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : request.nextUrl.origin;

  const crmBaseUrl =
    process.env.NEXT_PUBLIC_CRM_BASE_URL ?? 'https://crm.geracillp.com';
  const returnTo = encodeURIComponent(`${publicOrigin}${pathname}${search}`);
  const redirectUrl = `${crmBaseUrl}/dashboard-redirect?returnTo=${returnTo}`;

  return NextResponse.redirect(redirectUrl);
};

export const config = {
  // Exclude Next.js internals, favicon, and API routes. API routes handle
  // their own auth (the /api/graphql proxy reads the HttpOnly cookie
  // directly and returns 401 if missing — we don't want the middleware
  // turning that into a redirect response).
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
