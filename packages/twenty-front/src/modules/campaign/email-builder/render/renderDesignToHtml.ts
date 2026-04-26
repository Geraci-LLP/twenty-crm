import { migrateDesign } from '@/campaign/email-builder/render/migrateDesign';
import {
  type ButtonModule,
  COLUMN_WIDTHS,
  type EmailColumn,
  type EmailDesign,
  type EmailModule,
  type EmailSection,
  type EmailSettings,
  type ImageModule,
  type TextModule,
} from '@/campaign/email-builder/types/CampaignDesign';

// Renders an EmailDesign into table-based, MSO-compatible HTML for SendGrid.
// Output goes into Campaign.bodyHtml; the executor sends it as-is. Token
// substitution happens server-side via literal string replacement on
// {{contact.X}} etc. — we pass tokens through unchanged.

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const escapeAttr = (s: string): string => escapeHtml(s);

const renderTextModule = (m: TextModule, settings: EmailSettings): string => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td style="padding:${m.paddingTop}px 0 ${m.paddingBottom}px 0;text-align:${m.alignment};color:${m.textColor};font-family:${settings.fontFamily};font-size:${m.fontSize}px;line-height:1.5;">
        ${m.html || ''}
      </td>
    </tr>
  </table>`;

const renderButtonModule = (m: ButtonModule, settings: EmailSettings): string => {
  const label = escapeHtml(m.label || 'Button');
  const href = escapeAttr(m.href || '#');
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="${m.alignment}" style="padding:${m.paddingTop}px 0 ${m.paddingBottom}px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;">
            <tr>
              <td style="background:${m.bgColor};border-radius:${m.borderRadius}px;">
                <a href="${href}" style="display:inline-block;padding:${m.paddingY}px ${m.paddingX}px;color:${m.textColor};font-family:${settings.fontFamily};font-size:16px;font-weight:600;text-decoration:none;border-radius:${m.borderRadius}px;">${label}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
};

const renderImageModule = (m: ImageModule): string => {
  const src = escapeAttr(m.src || '');
  const alt = escapeAttr(m.alt || '');
  const img = `<img src="${src}" alt="${alt}" width="${m.width}" style="display:block;width:${m.width}px;max-width:100%;height:auto;border:0;" />`;
  const wrapped = m.href
    ? `<a href="${escapeAttr(m.href)}" style="text-decoration:none;">${img}</a>`
    : img;
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="${m.alignment}" style="padding:${m.paddingTop}px 0 ${m.paddingBottom}px 0;">
          ${wrapped}
        </td>
      </tr>
    </table>`;
};

const renderModule = (m: EmailModule, settings: EmailSettings): string => {
  switch (m.type) {
    case 'text':   return renderTextModule(m, settings);
    case 'button': return renderButtonModule(m, settings);
    case 'image':  return renderImageModule(m);
  }
};

const renderColumn = (col: EmailColumn, settings: EmailSettings): string =>
  col.modules.map((m) => renderModule(m, settings)).join('\n');

const verticalAlignAttr = (a: EmailSection['alignment']): string => {
  switch (a) {
    case 'top':    return 'top';
    case 'center': return 'middle';
    case 'bottom': return 'bottom';
  }
};

const renderSection = (s: EmailSection, settings: EmailSettings): string => {
  const widths = COLUMN_WIDTHS[s.layout];
  const valign = verticalAlignAttr(s.alignment);
  const cols = s.columns
    .map((col, idx) => {
      const w = widths[idx] ?? 100 / s.columns.length;
      return `
        <td valign="${valign}" width="${w}%" style="width:${w}%;padding:0 4px;">
          ${renderColumn(col, settings)}
        </td>`;
    })
    .join('');

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${s.bgColor};">
      <tr>
        <td style="padding:${s.paddingTop}px ${s.paddingRight}px ${s.paddingBottom}px ${s.paddingLeft}px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              ${cols}
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
};

export const renderDesignToHtml = (designIn: EmailDesign): string => {
  const design = migrateDesign(designIn);
  const sections = design.sections
    .map((s) => renderSection(s, design.settings))
    .join('\n');

  // Mobile stacking: a media query that forces multi-column tables to stack.
  // Targets cells inside our content table; max-width 600 covers most phones.
  const mobileCss = `
    <style>
      @media only screen and (max-width: 600px) {
        table[role="presentation"] td[width] { width: 100% !important; display: block !important; padding: 8px 0 !important; }
      }
    </style>`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title></title>
  ${mobileCss}
  <!--[if mso]>
  <style>table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; } a { text-underline-color:inherit; }</style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background:${design.settings.bodyBgColor};font-family:${design.settings.fontFamily};color:${design.settings.defaultTextColor};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${design.settings.bodyBgColor};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="${design.settings.contentWidth}" style="width:${design.settings.contentWidth}px;max-width:100%;background:${design.settings.contentBgColor};">
          <tr>
            <td>
              ${sections}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
