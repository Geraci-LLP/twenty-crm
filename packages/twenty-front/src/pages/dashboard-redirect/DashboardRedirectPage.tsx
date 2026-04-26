import { useMutation } from '@apollo/client/react';
import { useEffect, useRef, useState } from 'react';
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>(
    'Resolving dashboard handoff...',
  );

  useEffect(() => {
    const rawReturnTo = searchParams.get('returnTo');

    // Resolve returnTo: either from the query string (fresh redirect) or
    // from session storage (post-login continuation).
    const returnTo = rawReturnTo ?? sessionStorage.getItem(SESSION_KEY) ?? null;

    if (!returnTo) {
      setErrorMsg(
        'Missing returnTo parameter. Expected ?returnTo=<dashboard-url>.',
      );
      return;
    }

    if (!isAllowedReturnTo(returnTo)) {
      setErrorMsg(`returnTo URL not allowed by whitelist: ${returnTo}`);
      return;
    }

    if (!currentUser || !tokenPair) {
      // Not logged in — stash returnTo and send the user to login
      sessionStorage.setItem(SESSION_KEY, returnTo);
      setStatusMsg('Not signed in, redirecting to login...');
      window.location.href = AppPath.SignInUp;
      return;
    }

    if (hasDispatchedRef.current) {
      return;
    }
    hasDispatchedRef.current = true;
    setStatusMsg('Minting dashboard token...');

    const handoff = async () => {
      try {
        const result = await generateDashboardToken();
        const dashboardToken = result.data?.generateDashboardToken.token;

        if (!dashboardToken) {
          setErrorMsg(
            'generateDashboardToken mutation returned no token. Response: ' +
              JSON.stringify(result),
          );
          return;
        }

        sessionStorage.removeItem(SESSION_KEY);

        const separator = returnTo.includes('?') ? '&' : '?';
        const callbackUrl = returnTo.endsWith('/')
          ? `${returnTo}auth-callback`
          : `${returnTo}/auth-callback`;

        const target = `${callbackUrl}${separator}token=${encodeURIComponent(dashboardToken)}`;
        setStatusMsg(`Redirecting to ${callbackUrl}...`);
        window.location.href = target;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setErrorMsg(`generateDashboardToken failed: ${message}`);
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
        flexDirection: 'column',
        gap: 16,
        padding: 24,
      }}
    >
      {errorMsg ? (
        <>
          <p style={{ color: '#d00', fontWeight: 600 }}>
            Dashboard redirect failed
          </p>
          <pre
            style={{
              maxWidth: 600,
              whiteSpace: 'pre-wrap',
              background: '#fff1f0',
              padding: 12,
              borderRadius: 4,
              border: '1px solid #ffa39e',
            }}
          >
            {errorMsg}
          </pre>
          <a href="/">Back to CRM</a>
        </>
      ) : (
        <p>{statusMsg}</p>
      )}
    </div>
  );
};
