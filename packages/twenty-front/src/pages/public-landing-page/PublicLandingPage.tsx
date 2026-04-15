import { styled } from '@linaria/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { REACT_APP_SERVER_BASE_URL } from '~/config';

type LandingPageSection = {
  id: string;
  type: 'HERO' | 'TEXT' | 'FORM_EMBED' | 'CTA' | 'IMAGE';
  config: Record<string, unknown>;
};

type LandingPageData = {
  id: string;
  title: string | null;
  slug: string | null;
  sectionsConfig: LandingPageSection[] | null;
  metaTitle: string | null;
  metaDescription: string | null;
  headerConfig: Record<string, unknown> | null;
  footerConfig: Record<string, unknown> | null;
};

type PageState = 'loading' | 'ready' | 'error';

const StyledPageContainer = styled.div`
  background: ${themeCssVariables.background.primary};
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`;

const StyledLoadingContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 100dvh;
`;

const StyledLoadingText = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
`;

const StyledErrorContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  justify-content: center;
  min-height: 100dvh;
  text-align: center;
`;

const StyledErrorTitle = styled.h1`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xl};
  margin: 0;
`;

const StyledErrorMessage = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  margin: 0;
`;

// Section renderers
const StyledHeroSection = styled.section`
  align-items: center;
  background: ${themeCssVariables.background.transparent.strong};
  color: ${themeCssVariables.font.color.inverted};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  justify-content: center;
  min-height: 400px;
  padding: ${themeCssVariables.spacing[8]};
  text-align: center;
`;

const StyledHeroHeading = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  max-width: 800px;
`;

const StyledHeroSubheading = styled.p`
  font-size: 1.25rem;
  line-height: 1.5;
  margin: 0;
  max-width: 600px;
  opacity: 0.9;
`;

const StyledHeroButton = styled.a`
  background: ${themeCssVariables.color.blue};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.inverted};
  display: inline-block;
  font-size: 1rem;
  font-weight: 600;
  padding: 12px 32px;
  text-decoration: none;
  transition: background 150ms ease;

  &:hover {
    opacity: 0.9;
  }
`;

const StyledTextSection = styled.section`
  margin: 0 auto;
  max-width: 800px;
  padding: ${themeCssVariables.spacing[8]};
`;

const StyledTextContent = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: 1.1rem;
  line-height: 1.8;
  white-space: pre-wrap;
`;

const StyledFormEmbedSection = styled.section`
  display: flex;
  justify-content: center;
  padding: ${themeCssVariables.spacing[8]};
`;

const StyledFormIframe = styled.iframe`
  border: none;
  height: 600px;
  max-width: 600px;
  width: 100%;
`;

const StyledCtaSection = styled.section`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[8]};
  text-align: center;
`;

const StyledCtaHeading = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: 2rem;
  margin: 0;
`;

const StyledCtaButton = styled.a`
  background: ${themeCssVariables.color.blue};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.inverted};
  display: inline-block;
  font-size: 1rem;
  font-weight: 600;
  padding: 12px 32px;
  text-decoration: none;
  transition: background 150ms ease;

  &:hover {
    opacity: 0.9;
  }
`;

const StyledImageSection = styled.section`
  display: flex;
  justify-content: center;
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledImage = styled.img`
  height: auto;
  max-width: 100%;
`;

const SectionRenderer = ({ section }: { section: LandingPageSection }) => {
  const config = section.config;

  switch (section.type) {
    case 'HERO': {
      const heading = (config.heading as string) ?? '';
      const subheading = (config.subheading as string) ?? '';
      const buttonText = (config.buttonText as string) ?? '';
      const buttonUrl = (config.buttonUrl as string) ?? '';

      return (
        <StyledHeroSection>
          {heading.length > 0 && (
            <StyledHeroHeading>{heading}</StyledHeroHeading>
          )}
          {subheading.length > 0 && (
            <StyledHeroSubheading>{subheading}</StyledHeroSubheading>
          )}
          {buttonText.length > 0 && buttonUrl.length > 0 && (
            <StyledHeroButton href={buttonUrl}>{buttonText}</StyledHeroButton>
          )}
        </StyledHeroSection>
      );
    }

    case 'TEXT': {
      const content = (config.content as string) ?? '';

      return (
        <StyledTextSection>
          <StyledTextContent>{content}</StyledTextContent>
        </StyledTextSection>
      );
    }

    case 'FORM_EMBED': {
      const formId = (config.formId as string) ?? '';

      if (formId.length === 0) {
        return null;
      }

      return (
        <StyledFormEmbedSection>
          <StyledFormIframe
            src={`${window.location.origin}/forms/${formId}`}
            title="Embedded form"
          />
        </StyledFormEmbedSection>
      );
    }

    case 'CTA': {
      const heading = (config.heading as string) ?? '';
      const buttonText = (config.buttonText as string) ?? '';
      const buttonUrl = (config.buttonUrl as string) ?? '';

      return (
        <StyledCtaSection>
          {heading.length > 0 && <StyledCtaHeading>{heading}</StyledCtaHeading>}
          {buttonText.length > 0 && buttonUrl.length > 0 && (
            <StyledCtaButton href={buttonUrl}>{buttonText}</StyledCtaButton>
          )}
        </StyledCtaSection>
      );
    }

    case 'IMAGE': {
      const src = (config.src as string) ?? '';
      const alt = (config.alt as string) ?? '';

      if (src.length === 0) {
        return null;
      }

      return (
        <StyledImageSection>
          <StyledImage src={src} alt={alt} />
        </StyledImageSection>
      );
    }

    default:
      return null;
  }
};

export const PublicLandingPage = () => {
  const { workspaceId, slug } = useParams<{
    workspaceId: string;
    slug: string;
  }>();

  const [pageData, setPageData] = useState<LandingPageData | null>(null);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        const response = await fetch(
          `${REACT_APP_SERVER_BASE_URL}/landing-pages/${workspaceId}/${slug}`,
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);

          throw new Error(
            errorData?.message ?? `Page not found (${response.status})`,
          );
        }

        const data: LandingPageData = await response.json();

        setPageData(data);
        setPageState('ready');

        // Update document title if metaTitle is set
        if (isDefined(data.metaTitle) && data.metaTitle.length > 0) {
          document.title = data.metaTitle;
        } else if (isDefined(data.title) && data.title.length > 0) {
          document.title = data.title;
        }

        // Update meta description if set
        if (
          isDefined(data.metaDescription) &&
          data.metaDescription.length > 0
        ) {
          let metaTag = document.querySelector('meta[name="description"]');

          if (!isDefined(metaTag)) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute('name', 'description');
            document.head.appendChild(metaTag);
          }
          metaTag.setAttribute('content', data.metaDescription);
        }
      } catch (fetchError) {
        setErrorMessage(
          fetchError instanceof Error
            ? fetchError.message
            : 'Failed to load page',
        );
        setPageState('error');
      }
    };

    if (isDefined(workspaceId) && isDefined(slug)) {
      fetchLandingPage();
    }
  }, [workspaceId, slug]);

  if (pageState === 'loading') {
    return (
      <StyledLoadingContainer>
        <StyledLoadingText>Loading...</StyledLoadingText>
      </StyledLoadingContainer>
    );
  }

  if (pageState === 'error' || !isDefined(pageData)) {
    return (
      <StyledErrorContainer>
        <StyledErrorTitle>Page Not Found</StyledErrorTitle>
        <StyledErrorMessage>
          {errorMessage ?? 'This page is not available.'}
        </StyledErrorMessage>
      </StyledErrorContainer>
    );
  }

  const sections = Array.isArray(pageData.sectionsConfig)
    ? pageData.sectionsConfig
    : [];

  return (
    <StyledPageContainer>
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}

      {sections.length === 0 && (
        <StyledErrorContainer>
          <StyledErrorTitle>
            {pageData.title ?? 'Landing Page'}
          </StyledErrorTitle>
          <StyledErrorMessage>This page is empty.</StyledErrorMessage>
        </StyledErrorContainer>
      )}
    </StyledPageContainer>
  );
};
