import { useMutation } from '@apollo/client/react';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { currentUserState } from '@/auth/states/currentUserState';
import { tokenPairState } from '@/auth/states/tokenPairState';
import { GENERATE_DASHBOARD_TOKEN } from '@/auth/graphql/mutations/generateDashboardToken';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { AppPath } from 'twenty-shared/types';

// Whitelist of return-to origins to prevent open-redirect attacks.
// Add more entries here when additional dashboard hostnames are deployed.
const ALLOWED_RETURN_ORIGIN_PATTERNS: RegExp[] = [
  /^https:\/\/dash\.geracillp\.com(\/.*)?$/,
  /^http:\/\/localhost:\d+(\/.*)?$/,
  /^http:\/\/127\.0\.0\.1:\d+(\/.*)?$/,
];

const isAllowedReturnTo = (returnTo: string): boolean => {
  return ALLOWED_RETURN_ORIGIN_PATTERNS.some((pattern) =>
    pattern.test(returnTo),
  );
};

const SESSION_KEY = 'twenty_dashboard_return_to';

type GenerateDashboardTokenResult = {
  generateDashboardToken: {
    token: string;
    expiresAt: string;
  };
};

export const DashboardRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const currentUser = useAtomStateValue(currentUserState);
  const tokenPair = useAtomStateValue(tokenPairState);
  const [generateDashboardToken] = useMutation<GenerateDashboardTokenResult>(
    GENERATE_DASHBOARD_TOKEN,
  );
  // Guard against StrictMode / effect re-runs firing the mutation twice.
  const hasDispatchedRef = useRef(false);

  useEffect(() => {
    const rawReturnTo = searchParams.get('returnTo');

    // Resolve returnTo: either from the query string (fresh redirect) or
    // from session storage (post-login continuation).
    const returnTo = rawReturnTo ?? sessionStorage.getItem(SESSION_KEY) ?? null;

    if (!returnTo || !isAllowedReturnTo(returnTo)) {
      window.location.href = '/';
      return;
    }

    if (!currentUser || !tokenPair) {
      // Not logged in — stash returnTo and send the user to login
      sessionStorage.setItem(SESSION_KEY, returnTo);
      window.location.href = AppPath.SignInUp;
      return;
    }

    if (hasDispatchedRef.current) {
      return;
    }
    hasDispatchedRef.current = true;

    // Mint a short-lived, audience-scoped JWT for the dashboard app.
    // This replaces the old behaviour of forwarding the full CRM access
    // token, which gave dash.geracillp.com implicit full CRM permissions.
    const handoff = async () => {
      try {
        const result = await generateDashboardToken();
        const dashboardToken = result.data?.generateDashboardToken.token;

        if (!dashboardToken) {
          // Fail closed — send the user home rather than forwarding the
          // session-level access token.
          window.location.href = '/';
          return;
        }

        // Clear the stash once we've consumed it
        sessionStorage.removeItem(SESSION_KEY);

        const separator = returnTo.includes('?') ? '&' : '?';
        const callbackUrl = returnTo.endsWith('/')
          ? `${returnTo}auth-callback`
          : `${returnTo}/auth-callback`;

        window.location.href = `${callbackUrl}${separator}token=${encodeURIComponent(dashboardToken)}`;
      } catch {
        window.location.href = '/';
      }
    };

    void handoff();
  }, [currentUser, searchParams, tokenPair, generateDashboardToken]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <p>Redirecting to dashboard...</p>
    </div>
  );
};
