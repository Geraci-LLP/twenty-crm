'use client';

import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  from,
  Observable,
} from '@apollo/client';
import { CombinedGraphQLErrors, ServerError } from '@apollo/client/errors';
import { ErrorLink } from '@apollo/client/link/error';

// Routes GraphQL traffic through our own Next.js Route Handler at
// `/api/graphql`, which reads the HttpOnly `twenty_dashboard_token` cookie
// on the server and forwards the request to the CRM with
// `Authorization: Bearer <token>`.
//
// We do it this way because the cookie is HttpOnly (set by /auth-callback)
// and therefore unreadable from browser JS — so we can't set the header
// client-side the way we used to.
const GRAPHQL_PROXY_PATH = '/api/graphql';

const redirectToCrmAuth = () => {
  if (typeof window === 'undefined') {
    return;
  }
  const crmBaseUrl =
    process.env.NEXT_PUBLIC_CRM_BASE_URL ?? 'https://crm.geracillp.com';
  const returnTo = encodeURIComponent(window.location.origin);
  window.location.href = `${crmBaseUrl}/dashboard-redirect?returnTo=${returnTo}`;
};

let client: ApolloClient | null = null;

export const getApolloClient = (): ApolloClient => {
  if (client !== null) {
    return client;
  }

  const httpLink = createHttpLink({
    uri: GRAPHQL_PROXY_PATH,
    // Same-origin — include cookies so the Route Handler can read the
    // HttpOnly dashboard token.
    credentials: 'same-origin',
  });

  // Detect 401/403 responses from the proxy (which mirrors the CRM's
  // auth status) and bounce the user back through the dashboard-redirect
  // handshake to mint a fresh token.
  //
  // TODO (server-side): twenty-server must enforce `audience === 'dashboard'`
  // when validating any JWT minted by `generateDashboardToken`. Today the
  // shared JWT verifier doesn't check `aud`, which means this scoped token
  // would still be accepted on CRM-only endpoints. Until the server adds
  // that check, the "audience binding" is informational only.
  const errorLink = new ErrorLink(({ error }) => {
    const isAuthNetworkError =
      ServerError.is(error) &&
      (error.statusCode === 401 || error.statusCode === 403);

    const isAuthGraphqlError =
      CombinedGraphQLErrors.is(error) &&
      error.errors.some((err) => {
        const code = err.extensions?.code as string | number | undefined;
        return (
          code === 'UNAUTHENTICATED' ||
          code === 'FORBIDDEN' ||
          code === 401 ||
          code === 403
        );
      });

    if (isAuthNetworkError || isAuthGraphqlError) {
      redirectToCrmAuth();
      // Swallow the operation by returning an empty observable — the user
      // is about to be redirected anyway.
      return new Observable<ApolloLink.Result>((observer) => {
        observer.complete();
      });
    }

    return undefined;
  });

  client = new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
  });

  return client;
};
