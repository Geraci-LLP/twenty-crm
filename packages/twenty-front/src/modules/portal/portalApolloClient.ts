import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { REACT_APP_SERVER_BASE_URL } from '~/config';

// Separate Apollo client for the client portal.
// - Uses the same GraphQL endpoint as the main app
// - Relies on the HTTP-only `twenty_portal_token` cookie for auth
//   (the browser attaches it automatically when `credentials: 'include'` is set)
// - Keeps an isolated in-memory cache so portal data does not bleed
//   into the main CRM user's Apollo cache
let portalApolloClientInstance: ApolloClient<NormalizedCacheObject> | null =
  null;

export const getPortalApolloClient =
  (): ApolloClient<NormalizedCacheObject> => {
    if (portalApolloClientInstance !== null) {
      return portalApolloClientInstance;
    }

    const httpLink = new HttpLink({
      uri: `${REACT_APP_SERVER_BASE_URL}/graphql`,
      credentials: 'include',
    });

    portalApolloClientInstance = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
          errorPolicy: 'all',
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      },
    });

    return portalApolloClientInstance;
  };
