'use client';

import DOMPurify from 'isomorphic-dompurify';

export type RichTextWidgetProps = {
  configuration: Record<string, unknown>;
  data?: unknown;
};

export const RichTextWidget = ({ configuration }: RichTextWidgetProps) => {
  // `body` can be { blocknote, markdown } per the server fragment, or HTML
  const body = configuration?.body as { markdown?: string } | undefined;
  const html =
    (configuration?.html as string | undefined) ?? body?.markdown ?? '';

  if (!html.trim()) {
    return (
      <div
        style={{
          padding: 16,
          color: '#94a3b8',
          fontSize: 13,
          fontStyle: 'italic',
        }}
      >
        Empty rich text widget. Edit content in the CRM page-builder.
      </div>
    );
  }

  // Rich-text widget content is author-controlled inside the CRM, but we
  // still run it through DOMPurify to strip scripts / dangerous attrs
  // before injecting into the DOM — an admin account compromise should not
  // escalate into arbitrary JS execution on every portal user's browser.
  const sanitized = DOMPurify.sanitize(html);

  return (
    <div
      style={{ padding: 16, height: '100%', overflow: 'auto' }}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

export default RichTextWidget;
