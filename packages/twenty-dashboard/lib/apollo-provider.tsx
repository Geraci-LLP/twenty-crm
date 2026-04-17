'use client';

import { ApolloProvider } from '@apollo/client';
import { getApolloClient } from './apollo';

type ApolloProviderWrapperProps = {
  children: React.ReactNode;
};

export const ApolloProviderWrapper = ({
  children,
}: ApolloProviderWrapperProps) => {
  return <ApolloProvider client={getApolloClient()}>{children}</ApolloProvider>;
};
