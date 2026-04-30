/* oxlint-disable twenty/no-hardcoded-colors */
/* oxlint-disable twenty/no-state-useref */
// This page renders before the Twenty theme provider is available (it runs
// during the auth handoff). Inline styles use literal colors and a useRef
// flag is needed to dedupe StrictMode effect re-runs without triggering a
// re-render — both are intentional deviations from the lint rules.
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
        minHeight: '100vh',
        padding: 24,
        background: '#f8fafc',
        fontFamily:
          '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Inline spinner keyframes — this page renders before the Twenty
          theme/css providers so we can't rely on a class. */}
      <style>{`@keyframes dashboardRedirectSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }`}</style>

      <div
        style={{
          width: '100%',
          maxWidth: 480,
          padding: 32,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
          textAlign: 'center',
        }}
      >
        {errorMsg ? (
          <>
            <div
              style={{
                width: 48,
                height: 48,
                margin: '0 auto 16px',
                borderRadius: '50%',
                background: '#fef2f2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              !
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
                color: '#0f172a',
              }}
            >
              Dashboard redirect failed
            </h1>
            <p
              style={{
                margin: '8px 0 16px',
                fontSize: 13,
                color: '#475569',
              }}
            >
              We couldn&apos;t hand you off to the dashboard. Details below.
            </p>
            <pre
              style={{
                margin: '0 0 16px',
                padding: 12,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
                borderRadius: 6,
                fontSize: 12,
                textAlign: 'left',
                maxHeight: 200,
                overflow: 'auto',
              }}
            >
              {errorMsg}
            </pre>
            <a
              href="/"
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: '#1d4ed8',
                color: '#ffffff',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Back to CRM
            </a>
          </>
        ) : (
          <>
            <div
              style={{
                width: 40,
                height: 40,
                margin: '0 auto 20px',
                border: '3px solid #e2e8f0',
                borderTopColor: '#1d4ed8',
                borderRadius: '50%',
                animation: 'dashboardRedirectSpin 0.8s linear infinite',
              }}
            />
            <h1
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
                color: '#0f172a',
              }}
            >
              Opening your dashboard
            </h1>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: 13,
                color: '#475569',
                minHeight: 20,
              }}
            >
              {statusMsg}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
