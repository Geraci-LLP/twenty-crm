import { ApolloProvider } from '@apollo/client/react';
import { type ReactNode, useMemo } from 'react';
import { getPortalApolloClient } from '@/portal/portalApolloClient';

type PortalApolloProviderProps = {
  children: ReactNode;
};

// Wraps portal routes so queries use the portal-scoped Apollo client
// (separate cache + cookie-based auth).
export const PortalApolloProvider = ({
  children,
}: PortalApolloProviderProps) => {
  const portalClient = useMemo(() => getPortalApolloClient(), []);

  return <ApolloProvider client={portalClient}>{children}</ApolloProvider>;
};
