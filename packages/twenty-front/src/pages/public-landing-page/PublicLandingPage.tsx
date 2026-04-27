import { styled } from '@linaria/react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { LandingPageRenderer } from '@/landing-page/render/LandingPageRenderer';
import { migrateLandingPageDesign } from '@/landing-page/render/migrateLandingPageDesign';
import { type LandingPageDesign } from '@/landing-page/types/LandingPageDesign';
import { REACT_APP_SERVER_BASE_URL } from '~/config';

type LandingPageData = {
  id: string;
  title: string | null;
  slug: string | null;
  // Either the legacy flat-section array or a v1 LandingPageDesign object.
  // migrateLandingPageDesign normalizes both into a v1 design.
  sectionsConfig: unknown;
  metaTitle: string | null;
  metaDescription: string | null;
  headerConfig: Record<string, unknown> | null;
  footerConfig: Record<string, unknown> | null;
};

type PageState = 'loading' | 'ready' | 'error';

const StyledPageContainer = styled.div`
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

        if (isDefined(data.metaTitle) && data.metaTitle.length > 0) {
          document.title = data.metaTitle;
        } else if (isDefined(data.title) && data.title.length > 0) {
          document.title = data.title;
        }

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

  // Normalize the stored shape into a v1 LandingPageDesign so the same
  // renderer handles legacy + new pages identically.
  const design: LandingPageDesign | null = useMemo(() => {
    if (pageData === null) return null;
    return migrateLandingPageDesign(pageData.sectionsConfig);
  }, [pageData]);

  if (pageState === 'loading') {
    return (
      <StyledLoadingContainer>
        <StyledLoadingText>Loading...</StyledLoadingText>
      </StyledLoadingContainer>
    );
  }

  if (pageState === 'error' || !isDefined(pageData) || design === null) {
    return (
      <StyledErrorContainer>
        <StyledErrorTitle>Page Not Found</StyledErrorTitle>
        <StyledErrorMessage>
          {errorMessage ?? 'This page is not available.'}
        </StyledErrorMessage>
      </StyledErrorContainer>
    );
  }

  if (design.sections.length === 0) {
    return (
      <StyledErrorContainer>
        <StyledErrorTitle>{pageData.title ?? 'Landing Page'}</StyledErrorTitle>
        <StyledErrorMessage>This page is empty.</StyledErrorMessage>
      </StyledErrorContainer>
    );
  }

  return (
    <StyledPageContainer>
      <LandingPageRenderer design={design} />
    </StyledPageContainer>
  );
};
