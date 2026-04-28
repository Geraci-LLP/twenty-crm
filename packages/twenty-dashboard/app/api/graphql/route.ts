import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

// BFF proxy for CRM GraphQL requests.
//
// The dashboard cookie is HttpOnly (set by /auth-callback), so browser JS
// can't read it to put into an `Authorization: Bearer ...` header. This
// route runs server-side, pulls the token out of the cookie, and forwards
// the request to the CRM GraphQL endpoint with the right header.
//
// Twenty exposes TWO GraphQL endpoints:
//   /graphql  — workspace-scoped data (standard objects, including
//               `dashboards`, `pageLayoutWidgets` as nested relations)
//   /metadata — metadata + config operations (`getPageLayoutTabs`,
//               `createPageLayoutWidget`, `createPageLayoutTab`, etc.)
// We sniff the request's operation name and route accordingly.

const DASHBOARD_TOKEN_COOKIE = 'twenty_dashboard_token';

// These operations live on /metadata, not /graphql. Conservative match by
// substring on the request body so we don't have to fully parse GraphQL.
const METADATA_OP_PATTERNS = [
  'getPageLayoutTabs',
  'getPageLayoutTab',
  'getPageLayouts',
  'getPageLayout',
  'getPageLayoutWidgets',
  'getPageLayoutWidget',
  'createPageLayoutWidget',
  'updatePageLayoutWidget',
  'deletePageLayoutWidget',
  'createPageLayoutTab',
  'updatePageLayoutTab',
  'deletePageLayoutTab',
];

const getCrmBaseUrl = () => {
  // Trim a trailing /graphql or /metadata so we can append our own.
  const raw =
    process.env.TWENTY_API_URL ??
    process.env.NEXT_PUBLIC_TWENTY_API_URL ??
    'https://crm.geracillp.com/graphql';

  return raw.replace(/\/(graphql|metadata)\/?$/, '');
};

const pickEndpoint = (body: string): 'graphql' | 'metadata' => {
  return METADATA_OP_PATTERNS.some((op) => body.includes(op))
    ? 'metadata'
    : 'graphql';
};

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

  const body =
    request.method === 'GET' || request.method === 'HEAD'
      ? ''
      : await request.text();

  const endpoint = pickEndpoint(body);
  const upstreamUrl = `${getCrmBaseUrl()}/${endpoint}`;

  const upstream = await fetch(upstreamUrl, {
    method: request.method,
    headers: {
      'content-type': request.headers.get('content-type') ?? 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: body || undefined,
  });

  const bodyText = await upstream.text();

  // Dev-only: log upstream errors so we can diagnose 401/403 loops and
  // GraphQL error bodies without digging into browser devtools.
  if (process.env.NODE_ENV !== 'production') {
    try {
      const parsed = JSON.parse(bodyText);
      if (parsed.errors) {
        console.log(
          '[dashboard-proxy] →',
          endpoint,
          'status',
          upstream.status,
          'errors:',
          JSON.stringify(parsed.errors),
        );
      }
    } catch {
      /* non-JSON body, ignore */
    }
  }

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
