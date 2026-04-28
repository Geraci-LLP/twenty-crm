import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

// GET /auth-callback?token=...
//
// Server Route Handler that finalises the dashboard handshake:
//  1. Reads the short-lived dashboard JWT from the query string.
//  2. Writes it to an HttpOnly, Secure cookie via Set-Cookie — this is the
//     core reason we prefer a Route Handler over a client page: browsers
//     refuse `HttpOnly` when set via `document.cookie`, so doing this on the
//     server is the only way to get the XSS-protection benefit.
//  3. Redirects to `/` so the middleware can pick up the cookie and serve
//     the app shell.

const DASHBOARD_TOKEN_COOKIE = 'twenty_dashboard_token';
const ONE_HOUR_SECONDS = 60 * 60;

const getCrmBaseUrl = () =>
  process.env.NEXT_PUBLIC_CRM_BASE_URL ?? 'https://crm.geracillp.com';

// Best-effort sanity check: we want to reject things that obviously aren't
// JWTs before planting them in a cookie. Real signature/audience/expiry
// validation happens on the CRM side when the token is actually used.
//
// TODO: once we trust a public key or can hit a small /verify endpoint on
// the CRM, verify `audience === 'dashboard'` and `exp > now` here too.
const looksLikeJwt = (token: string): boolean => {
  if (token.length > 4096) {
    return false;
  }
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }
  return parts.every((part) => /^[A-Za-z0-9_-]+$/.test(part));
};

export const GET = async (request: NextRequest) => {
  const token = request.nextUrl.searchParams.get('token');

  if (!token || !looksLikeJwt(token)) {
    // No/invalid token — bounce back to CRM to restart the handshake.
    const returnTo = encodeURIComponent(request.nextUrl.origin);
    return NextResponse.redirect(
      `${getCrmBaseUrl()}/dashboard-redirect?returnTo=${returnTo}`,
    );
  }

  const cookieStore = await cookies();

  // `Domain=.geracillp.com` lets the cookie be shared across `crm.` and
  // `dash.`; leave it unset in local dev (where we're on localhost or a
  // single host) so the browser scopes it to the current origin.
  const cookieDomain = process.env.DASHBOARD_COOKIE_DOMAIN;
  const isSecure = request.nextUrl.protocol === 'https:';

  cookieStore.set({
    name: DASHBOARD_TOKEN_COOKIE,
    value: token,
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: ONE_HOUR_SECONDS,
    ...(cookieDomain ? { domain: cookieDomain } : {}),
  });

  const redirectUrl = new URL('/', request.nextUrl.origin);
  return NextResponse.redirect(redirectUrl);
};
