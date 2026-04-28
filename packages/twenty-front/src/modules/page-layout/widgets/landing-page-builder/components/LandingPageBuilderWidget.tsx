import { LandingPageBuilder } from '@/landing-page/components/LandingPageBuilder';
import { LandingPageSettings } from '@/landing-page/components/LandingPageSettings';
import { useLandingPageRecord } from '@/landing-page/hooks/useLandingPageRecord';
import { LandingPageRenderer } from '@/landing-page/render/LandingPageRenderer';
import { migrateLandingPageDesign } from '@/landing-page/render/migrateLandingPageDesign';
import { type LandingPageDesign } from '@/landing-page/types/LandingPageDesign';
import { useTargetRecord } from '@/ui/layout/contexts/useTargetRecord';
import { TabList } from '@/ui/layout/tab-list/components/TabList';
import { activeTabIdComponentState } from '@/ui/layout/tab-list/states/activeTabIdComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useMemo } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { IconEye, IconPencil, IconSettings } from 'twenty-ui/display';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const LANDING_PAGE_BUILDER_TAB_LIST_ID = 'landing-page-builder-tabs';

const StyledLandingPageBuilderWidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const StyledTabContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
`;

const StyledPublicUrlBar = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.transparent.lighter};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  font-size: 12px;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]};
`;

const StyledPublicUrl = styled.a`
  color: ${themeCssVariables.color.orange};
  text-decoration: underline;
`;

const StyledPreviewFrame = styled.div`
  background: ${themeCssVariables.background.tertiary};
  border-top: 1px solid ${themeCssVariables.border.color.light};
  min-height: 100%;
`;

export const LandingPageBuilderWidget = () => {
  const { t } = useLingui();
  const targetRecord = useTargetRecord();

  const activeTabId = useAtomComponentStateValue(
    activeTabIdComponentState,
    LANDING_PAGE_BUILDER_TAB_LIST_ID,
  );

  const {
    landingPageRecord,
    loading,
    updateLandingPage,
    updateSectionsConfig,
  } = useLandingPageRecord({
    landingPageId: targetRecord.id,
  });

  const design: LandingPageDesign = useMemo(
    () => migrateLandingPageDesign(landingPageRecord?.sectionsConfig),
    [landingPageRecord?.sectionsConfig],
  );

  if (loading || !isDefined(landingPageRecord)) {
    return null;
  }

  const tabs = [
    {
      id: 'builder',
      title: t`Builder`,
      Icon: IconPencil,
    },
    {
      id: 'preview',
      title: t`Preview`,
      Icon: IconEye,
    },
    {
      id: 'settings',
      title: t`Settings`,
      Icon: IconSettings,
    },
  ];

  const publicUrl = isDefined(landingPageRecord.slug)
    ? `${window.location.origin}/lp/${landingPageRecord.slug}`
    : null;

  const handleDesignChange = (next: LandingPageDesign) => {
    // The backend stores sectionsConfig as a JSON column with no schema
    // constraint — pass the whole design through unchanged.
    updateSectionsConfig(next);
  };

  return (
    <StyledLandingPageBuilderWidgetContainer>
      <TabList
        componentInstanceId={LANDING_PAGE_BUILDER_TAB_LIST_ID}
        tabs={tabs}
        behaveAsLinks={false}
      />
      {landingPageRecord.status === 'PUBLISHED' && isDefined(publicUrl) && (
        <StyledPublicUrlBar>
          <span>Live at:</span>
          <StyledPublicUrl
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {publicUrl}
          </StyledPublicUrl>
        </StyledPublicUrlBar>
      )}

      <StyledTabContent>
        {(activeTabId === 'builder' || !isDefined(activeTabId)) && (
          <LandingPageBuilder design={design} onChange={handleDesignChange} />
        )}

        {activeTabId === 'preview' && (
          <StyledPreviewFrame>
            <LandingPageRenderer design={design} />
          </StyledPreviewFrame>
        )}

        {activeTabId === 'settings' && (
          <LandingPageSettings
            settings={{
              slug: landingPageRecord.slug,
              metaTitle: landingPageRecord.metaTitle,
              metaDescription: landingPageRecord.metaDescription,
            }}
            onSettingsChange={(settings) => updateLandingPage(settings)}
          />
        )}
      </StyledTabContent>
    </StyledLandingPageBuilderWidgetContainer>
  );
};
