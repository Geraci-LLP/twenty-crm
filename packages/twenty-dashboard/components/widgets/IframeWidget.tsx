'use client';

export type IframeWidgetProps = {
  configuration: Record<string, unknown>;
};

// Renders the configured URL in an iframe. URL comes from the IframeConfiguration
// subtype on the widget — keyed as `url` on the GraphQL union member.
export const IframeWidget = ({ configuration }: IframeWidgetProps) => {
  const url = (configuration.url as string | null | undefined) ?? null;

  if (!url || url.trim() === '') {
    return (
      <div
        style={{
          padding: 16,
          color: '#6b7280',
          fontSize: 13,
          fontStyle: 'italic',
        }}
      >
        No URL configured. Set one in the widget settings.
      </div>
    );
  }

  return (
    <iframe
      src={url}
      title={url}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 240,
        border: 'none',
        borderRadius: 6,
      }}
      // sandbox without allow-same-origin to keep cross-origin pages from
      // reaching back into our app via window.parent. allow-scripts so most
      // dashboard embeds (Stripe, Looker, etc.) actually work.
      sandbox="allow-scripts allow-forms allow-popups allow-presentation"
      referrerPolicy="no-referrer"
    />
  );
};

export default IframeWidget;
