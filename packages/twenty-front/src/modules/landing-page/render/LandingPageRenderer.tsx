import { styled } from '@linaria/react';

import {
  type ButtonModule,
  type DividerModule,
  type FeatureListModule,
  type FormEmbedModule,
  type HeadingModule,
  type HeroModule,
  type HtmlModule,
  type ImageModule,
  type LandingPageColumn,
  type LandingPageDesign,
  type LandingPageModule,
  type LandingPageSection,
  LANDING_PAGE_COLUMN_WIDTHS,
  type NavModule,
  type SocialModule,
  type SpacerModule,
  type TextModule,
} from '@/landing-page/types/LandingPageDesign';

// React-side renderer used both inside the builder canvas and on the
// public /lp/:slug route. Pure: takes a LandingPageDesign and renders
// HTML. No external state, no editor chrome.
//
// Color tokens here are page-content colors, not Twenty UI chrome —
// they end up in real visitor-facing HTML, so theme variables don't
// apply. The whole file disables no-hardcoded-colors for that reason.

/* oxlint-disable twenty/no-hardcoded-colors -- public landing page
   render output uses real CSS colors stored in the design JSON. */

type LandingPageRendererProps = {
  design: LandingPageDesign;
};

/* oxlint-disable twenty/no-hardcoded-colors */
const StyledPage = styled.div<{ bgColor: string; textColor: string }>`
  background: ${(p) => p.bgColor};
  color: ${(p) => p.textColor};
  min-height: 100%;
  width: 100%;
`;

const StyledSection = styled.div<{
  bgColor: string;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  alignment: 'top' | 'center' | 'bottom';
  fullWidth: boolean;
}>`
  align-items: ${(p) =>
    p.alignment === 'center'
      ? 'center'
      : p.alignment === 'bottom'
        ? 'flex-end'
        : 'flex-start'};
  background: ${(p) => p.bgColor};
  display: flex;
  padding: ${(p) =>
    `${p.paddingTop}px ${p.paddingRight}px ${p.paddingBottom}px ${p.paddingLeft}px`};
  width: 100%;
`;

const StyledSectionInner = styled.div<{
  contentWidth: number;
  fullWidth: boolean;
}>`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin: 0 auto;
  max-width: ${(p) => (p.fullWidth ? '100%' : `${p.contentWidth}px`)};
  width: 100%;
`;

const StyledColumn = styled.div<{ widthPercent: number }>`
  box-sizing: border-box;
  display: flex;
  flex-basis: ${(p) => p.widthPercent}%;
  flex-direction: column;
  flex-grow: 0;
  flex-shrink: 1;
  max-width: ${(p) => p.widthPercent}%;
  min-width: 0;
`;

const StyledModule = styled.div<{ paddingTop: number; paddingBottom: number }>`
  padding-bottom: ${(p) => p.paddingBottom}px;
  padding-top: ${(p) => p.paddingTop}px;
`;

const StyledNav = styled.div<{ bgColor: string; textColor: string }>`
  align-items: center;
  background: ${(p) => p.bgColor};
  color: ${(p) => p.textColor};
  display: flex;
  gap: 32px;
  justify-content: space-between;
  padding: 18px 24px;
`;

const StyledNavBrand = styled.div`
  align-items: center;
  display: flex;
  font-size: 18px;
  font-weight: 700;
  gap: 10px;
`;

const StyledNavLinks = styled.div`
  align-items: center;
  display: flex;
  gap: 28px;
`;

const StyledNavLink = styled.a`
  color: inherit;
  font-size: 14px;
  text-decoration: none;
  &:hover {
    opacity: 0.7;
  }
`;

const StyledNavCta = styled.a<{ bg: string; fg: string }>`
  background: ${(p) => p.bg};
  border-radius: 999px;
  color: ${(p) => p.fg};
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 18px;
  text-decoration: none;
  &:hover {
    filter: brightness(0.95);
  }
`;

const StyledHero = styled.div<{
  bgImage: string;
  bgColor: string;
  textColor: string;
  alignment: 'left' | 'center' | 'right';
  minHeight: number;
}>`
  align-items: center;
  background: ${(p) =>
    p.bgImage !== ''
      ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${p.bgImage}') center / cover`
      : p.bgColor};
  color: ${(p) => p.textColor};
  display: flex;
  justify-content: ${(p) =>
    p.alignment === 'left'
      ? 'flex-start'
      : p.alignment === 'right'
        ? 'flex-end'
        : 'center'};
  min-height: ${(p) => p.minHeight}px;
  padding: 48px 32px;
  text-align: ${(p) => p.alignment};
  width: 100%;
`;

const StyledHeroInner = styled.div`
  max-width: 720px;
`;

const StyledHeroHeading = styled.h1`
  font-size: 48px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0 0 16px;
`;

const StyledHeroSubheading = styled.p`
  font-size: 18px;
  line-height: 1.5;
  margin: 0 0 28px;
  opacity: 0.92;
`;

const StyledCta = styled.a<{
  bg: string;
  fg: string;
  variant: 'primary' | 'secondary' | 'ghost';
}>`
  background: ${(p) => (p.variant === 'ghost' ? 'transparent' : p.bg)};
  border: ${(p) => (p.variant === 'ghost' ? `2px solid ${p.fg}` : '0')};
  border-radius: 999px;
  color: ${(p) => (p.variant === 'ghost' ? p.fg : p.fg)};
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  padding: 14px 32px;
  text-decoration: none;
  transition: filter 0.15s;
  &:hover {
    filter: brightness(0.95);
  }
`;

const StyledFeatureList = styled.div<{ layout: 'grid-2' | 'grid-3' | 'list' }>`
  display: grid;
  gap: 24px;
  grid-template-columns: ${(p) =>
    p.layout === 'grid-2'
      ? 'repeat(2, 1fr)'
      : p.layout === 'grid-3'
        ? 'repeat(3, 1fr)'
        : '1fr'};
  width: 100%;
`;

const StyledFeatureCard = styled.div<{ bg: string }>`
  background: ${(p) => p.bg};
  border-radius: 12px;
  padding: 24px;
`;

const StyledFeatureIcon = styled.div<{ color: string }>`
  color: ${(p) => p.color};
  font-size: 28px;
  margin-bottom: 12px;
`;

const StyledFeatureTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
`;

const StyledFeatureBody = styled.div`
  font-size: 14px;
  line-height: 1.5;
  opacity: 0.85;
`;

const StyledHeading = styled.div<{
  alignment: 'left' | 'center' | 'right';
  textColor: string;
  fontWeight: number;
}>`
  color: ${(p) => p.textColor};
  font-weight: ${(p) => p.fontWeight};
  text-align: ${(p) => p.alignment};
`;

const StyledText = styled.div<{
  alignment: 'left' | 'center' | 'right';
  fontSize: number;
  textColor: string;
}>`
  color: ${(p) => p.textColor};
  font-size: ${(p) => p.fontSize}px;
  line-height: 1.6;
  text-align: ${(p) => p.alignment};
`;

const StyledButtonRow = styled.div<{ alignment: 'left' | 'center' | 'right' }>`
  display: flex;
  justify-content: ${(p) =>
    p.alignment === 'left'
      ? 'flex-start'
      : p.alignment === 'right'
        ? 'flex-end'
        : 'center'};
  width: 100%;
`;

const StyledImageRow = styled.div<{ alignment: 'left' | 'center' | 'right' }>`
  display: flex;
  justify-content: ${(p) =>
    p.alignment === 'left'
      ? 'flex-start'
      : p.alignment === 'right'
        ? 'flex-end'
        : 'center'};
  width: 100%;
`;

const StyledImage = styled.img`
  display: block;
  height: auto;
  max-width: 100%;
`;

const StyledDivider = styled.hr<{
  color: string;
  thickness: number;
  styleVar: 'solid' | 'dashed' | 'dotted';
  widthPercent: number;
}>`
  border: 0;
  border-top: ${(p) => `${p.thickness}px ${p.styleVar} ${p.color}`};
  margin: 0 auto;
  width: ${(p) => p.widthPercent}%;
`;

const StyledSocialRow = styled.div<{
  alignment: 'left' | 'center' | 'right';
  spacing: number;
}>`
  display: flex;
  gap: ${(p) => p.spacing}px;
  justify-content: ${(p) =>
    p.alignment === 'left'
      ? 'flex-start'
      : p.alignment === 'right'
        ? 'flex-end'
        : 'center'};
`;

const StyledSocialIcon = styled.a<{ size: number }>`
  align-items: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  color: inherit;
  display: inline-flex;
  font-size: ${(p) => Math.round(p.size * 0.5)}px;
  height: ${(p) => p.size}px;
  justify-content: center;
  text-decoration: none;
  width: ${(p) => p.size}px;
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const StyledFormPlaceholder = styled.div`
  background: rgba(0, 0, 0, 0.04);
  border: 1px dashed rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 13px;
  padding: 24px;
  text-align: center;
`;

const SOCIAL_GLYPHS: Record<string, string> = {
  twitter: '𝕏',
  linkedin: 'in',
  facebook: 'f',
  instagram: 'IG',
  youtube: '▶',
  tiktok: '♪',
};

const renderModule = (m: LandingPageModule): JSX.Element => {
  switch (m.type) {
    case 'nav': {
      const nav = m as NavModule;
      return (
        <StyledNav bgColor={nav.bgColor} textColor={nav.textColor}>
          <StyledNavBrand>
            {nav.brandLogoUrl !== '' && (
              <img src={nav.brandLogoUrl} alt="" height={28} />
            )}
            <span>{nav.brandText}</span>
          </StyledNavBrand>
          <StyledNavLinks>
            {nav.links.map((l) => (
              <StyledNavLink key={l.id} href={l.href}>
                {l.label}
              </StyledNavLink>
            ))}
            {nav.ctaLabel !== '' && (
              <StyledNavCta href={nav.ctaHref} bg="#ff7a59" fg="#ffffff">
                {nav.ctaLabel}
              </StyledNavCta>
            )}
          </StyledNavLinks>
        </StyledNav>
      );
    }
    case 'hero': {
      const h = m as HeroModule;
      return (
        <StyledHero
          bgImage={h.bgImageUrl}
          bgColor={h.bgColor}
          textColor={h.textColor}
          alignment={h.alignment}
          minHeight={h.minHeight}
        >
          <StyledHeroInner>
            <StyledHeroHeading>{h.heading}</StyledHeroHeading>
            <StyledHeroSubheading>{h.subheading}</StyledHeroSubheading>
            {h.ctaLabel !== '' && (
              <StyledCta
                href={h.ctaHref}
                bg="#ff7a59"
                fg="#ffffff"
                variant={h.ctaVariant}
              >
                {h.ctaLabel}
              </StyledCta>
            )}
          </StyledHeroInner>
        </StyledHero>
      );
    }
    case 'heading': {
      const h = m as HeadingModule;
      const Tag = h.level;
      return (
        <StyledHeading
          alignment={h.alignment}
          textColor={h.textColor}
          fontWeight={h.fontWeight}
        >
          <Tag style={{ margin: 0 }}>{h.text}</Tag>
        </StyledHeading>
      );
    }
    case 'text': {
      const t = m as TextModule;
      return (
        <StyledText
          alignment={t.alignment}
          fontSize={t.fontSize}
          textColor={t.textColor}
          dangerouslySetInnerHTML={{ __html: t.html }}
        />
      );
    }
    case 'button': {
      const b = m as ButtonModule;
      return (
        <StyledButtonRow alignment={b.alignment}>
          <StyledCta
            href={b.href}
            bg={b.bgColor}
            fg={b.textColor}
            variant={b.variant}
            style={{
              borderRadius: b.borderRadius,
              padding: `${b.paddingY}px ${b.paddingX}px`,
            }}
          >
            {b.label}
          </StyledCta>
        </StyledButtonRow>
      );
    }
    case 'image': {
      const i = m as ImageModule;
      const img = (
        <StyledImage
          src={i.src}
          alt={i.alt}
          style={{ width: `${i.widthPercent}%` }}
        />
      );
      return (
        <StyledImageRow alignment={i.alignment}>
          {i.href !== undefined && i.href !== '' ? (
            <a href={i.href}>{img}</a>
          ) : (
            img
          )}
        </StyledImageRow>
      );
    }
    case 'divider': {
      const d = m as DividerModule;
      return (
        <StyledDivider
          color={d.color}
          thickness={d.thickness}
          styleVar={d.style}
          widthPercent={d.widthPercent}
        />
      );
    }
    case 'spacer': {
      const s = m as SpacerModule;
      return <div style={{ height: `${s.height}px` }} />;
    }
    case 'html': {
      const h = m as HtmlModule;
      return <div dangerouslySetInnerHTML={{ __html: h.rawHtml }} />;
    }
    case 'featureList': {
      const f = m as FeatureListModule;
      return (
        <StyledFeatureList layout={f.layout}>
          {f.items.map((it) => (
            <StyledFeatureCard key={it.id} bg={f.itemBgColor}>
              <StyledFeatureIcon color={f.iconColor}>
                {it.icon}
              </StyledFeatureIcon>
              <StyledFeatureTitle>{it.title}</StyledFeatureTitle>
              <StyledFeatureBody>{it.body}</StyledFeatureBody>
            </StyledFeatureCard>
          ))}
        </StyledFeatureList>
      );
    }
    case 'formEmbed': {
      const f = m as FormEmbedModule;
      return (
        <StyledFormPlaceholder>
          {f.formId === ''
            ? '⊟ Form embed (set Form ID in editor)'
            : `⊟ Form embed: ${f.formId}`}
        </StyledFormPlaceholder>
      );
    }
    case 'social': {
      const s = m as SocialModule;
      return (
        <StyledSocialRow alignment={s.alignment} spacing={s.spacing}>
          {s.links.map((l, idx) => (
            <StyledSocialIcon key={idx} href={l.href} size={s.iconSize}>
              {SOCIAL_GLYPHS[l.platform] ?? l.platform[0]}
            </StyledSocialIcon>
          ))}
        </StyledSocialRow>
      );
    }
  }
};

const renderColumn = (col: LandingPageColumn, widthPercent: number) => (
  <StyledColumn key={col.id} widthPercent={widthPercent}>
    {col.modules.map((mod) => (
      <StyledModule
        key={mod.id}
        paddingTop={mod.paddingTop}
        paddingBottom={mod.paddingBottom}
      >
        {renderModule(mod)}
      </StyledModule>
    ))}
  </StyledColumn>
);

const renderSection = (
  sec: LandingPageSection,
  contentWidth: number,
): JSX.Element => {
  const widths = LANDING_PAGE_COLUMN_WIDTHS[sec.layout];
  return (
    <StyledSection
      key={sec.id}
      bgColor={sec.bgColor}
      paddingTop={sec.paddingTop}
      paddingBottom={sec.paddingBottom}
      paddingLeft={sec.paddingLeft}
      paddingRight={sec.paddingRight}
      alignment={sec.alignment}
      fullWidth={sec.fullWidth}
    >
      <StyledSectionInner contentWidth={contentWidth} fullWidth={sec.fullWidth}>
        {sec.columns.map((col, i) => renderColumn(col, widths[i] ?? widths[0]))}
      </StyledSectionInner>
    </StyledSection>
  );
};

export const LandingPageRenderer = ({ design }: LandingPageRendererProps) => {
  return (
    <StyledPage
      bgColor={design.settings.bodyBgColor}
      textColor={design.settings.defaultTextColor}
      style={{ fontFamily: design.settings.fontFamily }}
    >
      {design.sections.map((s) =>
        renderSection(s, design.settings.contentWidth),
      )}
    </StyledPage>
  );
};
