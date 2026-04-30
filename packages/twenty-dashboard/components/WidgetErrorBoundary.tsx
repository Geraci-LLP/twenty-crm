'use client';

import { AlertOctagon } from 'lucide-react';
import { Component, type ReactNode } from 'react';
import { theme } from '../lib/theme';

// Error boundary scoped to a single widget. Any synchronous render error
// thrown inside (bad chart data shape, undefined access, etc.) is contained
// here so the rest of the dashboard keeps rendering instead of going blank
// or crashing the whole tab.
//
// NOTE: this does NOT catch renderer-process crashes (Chrome's
// "Aw, Snap! STATUS_BREAKPOINT") — those happen below the JS layer when
// V8 hits stack overflow / OOM. For those we rely on the data-shape guards
// in each chart widget. But this boundary still helps for normal exceptions
// (Apollo network errors, Nivo throwing on degenerate input, etc.).

type Props = {
  widgetTitle: string;
  children: ReactNode;
};

type State = {
  hasError: boolean;
  message: string | null;
};

export class WidgetErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: null };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // oxlint-disable-next-line no-console
    console.error(
      `Widget "${this.props.widgetTitle}" crashed:`,
      error,
      info,
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.sm,
            padding: theme.spacing.lg,
            minHeight: 160,
            background: theme.state.dangerBg,
            border: `1px solid ${theme.state.danger}`,
            borderRadius: theme.radius.sm,
            color: theme.state.danger,
            fontSize: theme.font.sizeSm,
            textAlign: 'center',
          }}
        >
          <AlertOctagon size={20} />
          <div style={{ fontWeight: theme.font.weightSemibold }}>
            Widget failed to render
          </div>
          {this.state.message ? (
            <div
              style={{
                fontSize: theme.font.sizeXs,
                opacity: 0.85,
                maxWidth: 280,
                wordBreak: 'break-word',
              }}
            >
              {this.state.message}
            </div>
          ) : null}
        </div>
      );
    }
    return this.props.children;
  }
}

export default WidgetErrorBoundary;
