import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

// BFF proxy for CRM GraphQL requests.
//
// The dashboard cookie is HttpOnly (set by /auth-callback), so browser JS
// can't read it to put into an `Authorization: Bearer ...` header. This
// route runs server-side, pulls the token out of the cookie, and forwards
// the request to the CRM GraphQL endpoint with the right header.
//
// Keeping it this small means we don't cache, don't transform, and don't
// parse the body — we just pipe bytes through.

const DASHBOARD_TOKEN_COOKIE = 'twenty_dashboard_token';

const getCrmGraphqlUrl = () =>
  process.env.TWENTY_API_URL ??
  process.env.NEXT_PUBLIC_TWENTY_API_URL ??
  'https://crm.geracillp.com/graphql';

const proxy = async (request: NextRequest) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(DASHBOARD_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json(
      {
        errors: [
          { message: 'Missing dashboard token', extensions: { code: 401 } },
        ],
      },
      { status: 401 },
    );
  }

  const upstream = await fetch(getCrmGraphqlUrl(), {
    method: request.method,
    headers: {
      'content-type': request.headers.get('content-type') ?? 'application/json',
      authorization: `Bearer ${token}`,
    },
    body:
      request.method === 'GET' || request.method === 'HEAD'
        ? undefined
        : await request.text(),
  });

  const bodyText = await upstream.text();
  return new NextResponse(bodyText, {
    status: upstream.status,
    headers: {
      'content-type':
        upstream.headers.get('content-type') ?? 'application/json',
    },
  });
};

export const POST = proxy;
export const GET = proxy;
