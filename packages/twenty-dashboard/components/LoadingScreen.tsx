'use client';

import { theme } from '../lib/theme';

export type LoadingScreenProps = {
  // Top-line text — defaults to "Loading"; pass a verb-phrase for context
  // (e.g. "Loading dashboard", "Saving widgets", "Opening builder").
  label?: string;
  // Optional sub-text — shown smaller/dimmer below the label.
  hint?: string;
  // When `inline` is true the screen takes the parent's height instead of
  // 100vh — useful when the spinner is shown inside a card or tab content.
  inline?: boolean;
};

export const LoadingScreen = ({
  label = 'Loading',
  hint,
  inline = false,
}: LoadingScreenProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.md,
        minHeight: inline ? 240 : '60vh',
        padding: theme.spacing.xl,
        color: theme.text.secondary,
      }}
    >
      <Spinner size={40} />
      <div
        style={{
          fontSize: theme.font.sizeMd,
          fontWeight: theme.font.weightMedium,
          color: theme.text.primary,
        }}
      >
        {label}
      </div>
      {hint ? (
        <div
          style={{
            fontSize: theme.font.sizeSm,
            color: theme.text.muted,
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          {hint}
        </div>
      ) : null}
    </div>
  );
};

// Branded spinner — same animation as the CRM dashboard-redirect page so
// the auth handoff and the dashboard loading feel like one continuous flow.
export const Spinner = ({ size = 24 }: { size?: number }) => {
  const border = Math.max(2, Math.round(size / 14));
  return (
    <>
      <style>{`@keyframes twentyDashSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }`}</style>
      <div
        style={{
          width: size,
          height: size,
          border: `${border}px solid ${theme.border.default}`,
          borderTopColor: theme.brand.primary,
          borderRadius: '50%',
          animation: 'twentyDashSpin 0.8s linear infinite',
        }}
      />
    </>
  );
};

export default LoadingScreen;
