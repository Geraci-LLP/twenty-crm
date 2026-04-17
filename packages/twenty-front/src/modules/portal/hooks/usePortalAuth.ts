import { gql, useQuery } from '@apollo/client';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';
import { REACT_APP_SERVER_BASE_URL } from '~/config';

// Portal user shape returned by `myProfile`.
// Keep in sync with the backend GraphQL schema.
export type PortalUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  companyId: string | null;
};

const MY_PROFILE_QUERY = gql`
  query PortalMyProfile {
    myProfile {
      id
      email
      firstName
      lastName
      companyId
    }
  }
`;

// Hook for portal auth state.
// Because the JWT cookie is HTTP-only, we cannot read it from JS.
// Instead we probe the server via `myProfile`:
//   - success -> authenticated, return user
//   - 401 / null -> unauthenticated
export const usePortalAuth = () => {
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery<{
    myProfile: PortalUser | null;
  }>(MY_PROFILE_QUERY, {
    fetchPolicy: 'cache-and-network',
    // Do not throw — we treat errors as "not authenticated"
    errorPolicy: 'all',
  });

  const user = data?.myProfile ?? null;
  const isAuthenticated = user !== null && !error;

  const logout = useCallback(async () => {
    try {
      await fetch(`${REACT_APP_SERVER_BASE_URL}/portal-auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Logout failures are non-fatal — we still navigate away
    }

    navigate(AppPath.PortalLogin);
  }, [navigate]);

  return {
    user,
    isAuthenticated,
    isLoading: loading,
    logout,
    refetch,
  };
};
