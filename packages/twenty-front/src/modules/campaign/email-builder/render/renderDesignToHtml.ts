/* oxlint-disable twenty/no-hardcoded-colors */
// Renders HTML strings shipped to external email clients, which require
// literal hex colors instead of theme CSS variables.

import { migrateDesign } from '@/campaign/email-builder/render/migrateDesign';
import {
  type ButtonModule,
  COLUMN_WIDTHS,
  type DividerModule,
  type EmailColumn,
  type EmailDesign,
  type EmailModule,
  type EmailSection,
  type EmailSettings,
  type FooterModule,
  type HeadingModule,
  type HtmlModule,
  type ImageModule,
  type SocialModule,
  type SpacerModule,
  type TextModule,
} from '@/campaign/email-builder/types/CampaignDesign';

// Renders an EmailDesign into table-based, MSO-compatible HTML for SendGrid.
// Output goes into Campaign.bodyHtml; the executor sends it as-is. Token
// substitution happens server-side via literal string replacement on
// {{contact.X}} etc. — we pass tokens through unchanged.

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const escapeAttr = (s: string): string => escapeHtml(s);

const renderTextModule = (m: TextModule, settings: EmailSettings): string => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td style="padding:${m.paddingTop}px 0 ${m.paddingBottom}px 0;text-align:${m.alignment};color:${m.textColor};font-family:${settings.fontFamily};font-size:${m.fontSize}px;line-height:1.5;">
        ${m.html || ''}
      </td>
    </tr>
  </table>`;

const HEADING_FONT_SIZE: Record<HeadingModule['level'], number> = {
  h1: 28,
  h2: 22,
  h3: 18,
};

const renderHeadingModule = (
  m: HeadingModule,
  settings: EmailSettings,
): string => {
  const fs = HEADING_FONT_SIZE[m.level];
  const text = escapeHtml(m.text || '');
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding:${m.paddingTop}px 0 ${m.paddingBottom}px 0;text-align:${m.alignment};color:${m.textColor};font-family:${settings.fontFamily};font-size:${fs}px;line-height:1.25;font-weight:${m.fontWeight};">
          ${text}
        </td>
      </tr>
    </table>`;
};

const renderButtonModule = (
  m: ButtonModule,
  settings: EmailSettings,
): string => {
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

const renderDividerModule = (m: DividerModule): string => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td style="padding:${m.paddingTop}px 0 ${m.paddingBottom}px 0;">
        <div style="margin:0 auto;width:${m.widthPercent}%;border-top:${m.thickness}px ${m.style} ${m.color};font-size:0;line-height:0;">&nbsp;</div>
      </td>
    </tr>
  </table>`;

const renderSpacerModule = (m: SpacerModule): string => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td height="${m.height}" style="height:${m.height}px;font-size:0;line-height:0;">&nbsp;</td>
    </tr>
  </table>`;

const renderHtmlModule = (m: HtmlModule): string => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td style="padding:${m.paddingTop}px 0 ${m.paddingBottom}px 0;">
        ${m.rawHtml || ''}
      </td>
    </tr>
  </table>`;

// Inline-styled SVG icons embedded as data URIs would be more reliable across
// clients, but most email clients (Gmail/Yahoo/Apple) handle plain remote
// images fine — and Outlook ignores SVG entirely. Use simple text-styled
// circles with the platform initial; clients always render text + bg color.
const SOCIAL_LABELS: Record<SocialModule['links'][number]['platform'], string> =
  {
    twitter: 'X',
    linkedin: 'in',
    facebook: 'f',
    instagram: 'IG',
    youtube: 'YT',
  };

const renderSocialModule = (
  m: SocialModule,
  settings: EmailSettings,
): string => {
  if (m.links.length === 0) return '';
  const cells = m.links
    .map((link) => {
      const label =
        SOCIAL_LABELS[link.platform] ?? link.platform.slice(0, 2).toUpperCase();
      return `
        <td style="padding:0 ${m.spacing / 2}px;">
          <a href="${escapeAttr(link.href)}" style="display:inline-block;width:${m.iconSize}px;height:${m.iconSize}px;line-height:${m.iconSize}px;text-align:center;background:#1a1a18;color:#ffffff;border-radius:50%;font-family:${settings.fontFamily};font-size:${Math.round(m.iconSize / 2)}px;font-weight:600;text-decoration:none;">${label}</a>
        </td>`;
    })
    .join('');
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="${m.alignment}" style="padding:${m.paddingTop}px 0 ${m.paddingBottom}px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr>${cells}</tr>
          </table>
        </td>
      </tr>
    </table>`;
};

const renderFooterModule = (
  m: FooterModule,
  settings: EmailSettings,
): string => {
  const address = escapeHtml(m.address || '');
  const unsub = escapeHtml(m.unsubscribeLabel || 'Unsubscribe');
  const prefs = escapeHtml(m.preferencesLabel || 'Manage preferences');
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="${m.alignment}" style="padding:${m.paddingTop}px 0 ${m.paddingBottom}px 0;color:${m.textColor};font-family:${settings.fontFamily};font-size:${m.fontSize}px;line-height:1.5;">
          ${address}<br/>
          <a href="{{unsubscribe_link}}" style="color:${m.textColor};text-decoration:underline;">${unsub}</a> · <a href="{{unsubscribe_link}}" style="color:${m.textColor};text-decoration:underline;">${prefs}</a>
        </td>
      </tr>
    </table>`;
};

const renderModule = (m: EmailModule, settings: EmailSettings): string => {
  switch (m.type) {
    case 'text':
      return renderTextModule(m, settings);
    case 'heading':
      return renderHeadingModule(m, settings);
    case 'button':
      return renderButtonModule(m, settings);
    case 'image':
      return renderImageModule(m);
    case 'divider':
      return renderDividerModule(m);
    case 'spacer':
      return renderSpacerModule(m);
    case 'html':
      return renderHtmlModule(m);
    case 'social':
      return renderSocialModule(m, settings);
    case 'footer':
      return renderFooterModule(m, settings);
  }
};

const renderColumn = (col: EmailColumn, settings: EmailSettings): string =>
  col.modules.map((m) => renderModule(m, settings)).join('\n');

const verticalAlignAttr = (a: EmailSection['alignment']): string => {
  switch (a) {
    case 'top':
      return 'top';
    case 'center':
      return 'middle';
    case 'bottom':
      return 'bottom';
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

export type RenderMeta = {
  fromName?: string;
  fromEmail?: string;
  subject?: string;
  previewText?: string;
};

// Optional in-canvas email-meta header (From / To / Subject / Preview). Rendered
// only when meta is provided AND showMeta is true — used for the editor preview.
// Real send output (server) calls renderDesignToHtml WITHOUT meta so the
// outgoing email doesn't have the simulated inbox chrome at the top.
const renderMetaHeader = (
  meta: RenderMeta,
  settings: EmailSettings,
): string => {
  const rows: string[] = [];
  if (meta.fromName || meta.fromEmail) {
    const left = meta.fromName ? escapeHtml(meta.fromName) : '';
    const right = meta.fromEmail
      ? `<span style="color:#8a8a85;">${escapeHtml(meta.fromEmail)}</span>`
      : '';
    rows.push(`<div style="margin:2px 0;"><b>From:</b> ${left} ${right}</div>`);
  }
  rows.push(
    `<div style="margin:2px 0;"><b>To:</b> <span style="color:#8a8a85;">{{contact.email}}</span></div>`,
  );
  if (meta.subject) {
    rows.push(
      `<div style="margin:2px 0;"><b>Subject:</b> ${escapeHtml(meta.subject)}</div>`,
    );
  }
  if (meta.previewText) {
    rows.push(
      `<div style="margin:2px 0;"><b>Preview:</b> <span style="color:#8a8a85;">${escapeHtml(meta.previewText)}</span></div>`,
    );
  }
  return `
    <div style="background:#fafaf9;border-bottom:1px solid #e8e6e1;padding:12px 16px;font-family:${settings.fontFamily};font-size:12px;color:#1a1a18;">
      ${rows.join('')}
    </div>`;
};

export const renderDesignToHtml = (
  designIn: EmailDesign,
  meta?: RenderMeta,
): string => {
  const design = migrateDesign(designIn);
  const sections = design.sections
    .map((s) => renderSection(s, design.settings))
    .join('\n');
  const metaHeader = meta ? renderMetaHeader(meta, design.settings) : '';

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
          ${metaHeader ? `<tr><td>${metaHeader}</td></tr>` : ''}
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
