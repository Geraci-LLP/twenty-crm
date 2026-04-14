import { LandingPageSectionEditor } from '@/landing-page/components/LandingPageSectionEditor';
import { LandingPageSettings } from '@/landing-page/components/LandingPageSettings';
import { useLandingPageRecord } from '@/landing-page/hooks/useLandingPageRecord';
import { useTargetRecord } from '@/ui/layout/contexts/useTargetRecord';
import { TabList } from '@/ui/layout/tab-list/components/TabList';
import { activeTabIdComponentState } from '@/ui/layout/tab-list/states/activeTabIdComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { isDefined } from 'twenty-shared/utils';
import { IconEye, IconPencil, IconSettings } from 'twenty-ui/display';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const LANDING_PAGE_BUILDER_TAB_LIST_ID = 'landing-page-builder-tabs';

const StyledLandingPageBuilderWidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
`;

const StyledTabContent = styled.div`
  flex: 1;
  overflow: auto;
`;

const StyledPublicUrlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[4]};
  padding-bottom: 0;
`;

const StyledPublicUrl = styled.a`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  text-decoration: underline;
`;

const StyledPreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledPreviewSection = styled.div`
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledPreviewLabel = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  margin-bottom: ${themeCssVariables.spacing[2]};
  text-transform: uppercase;
`;

const StyledPreviewContent = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
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

  if (loading || !isDefined(landingPageRecord)) {
    return null;
  }

  const sections = Array.isArray(landingPageRecord.sectionsConfig)
    ? landingPageRecord.sectionsConfig
    : [];

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

  return (
    <StyledLandingPageBuilderWidgetContainer>
      <TabList
        componentInstanceId={LANDING_PAGE_BUILDER_TAB_LIST_ID}
        tabs={tabs}
        behaveAsLinks={false}
      />

      <StyledTabContent>
        {landingPageRecord.status === 'PUBLISHED' && isDefined(publicUrl) && (
          <StyledPublicUrlContainer>
            <StyledPublicUrl
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {publicUrl}
            </StyledPublicUrl>
          </StyledPublicUrlContainer>
        )}

        {(activeTabId === 'builder' || !isDefined(activeTabId)) && (
          <LandingPageSectionEditor
            sections={sections}
            onSectionsChange={updateSectionsConfig}
          />
        )}

        {activeTabId === 'preview' && (
          <StyledPreviewContainer>
            {sections.length === 0 ? (
              <StyledPreviewSection>
                <StyledPreviewContent>
                  {t`No sections to preview. Add sections in the Builder tab.`}
                </StyledPreviewContent>
              </StyledPreviewSection>
            ) : (
              sections.map((section) => (
                <StyledPreviewSection key={section.id}>
                  <StyledPreviewLabel>{section.type}</StyledPreviewLabel>
                  <StyledPreviewContent>
                    {JSON.stringify(section.config, null, 2)}
                  </StyledPreviewContent>
                </StyledPreviewSection>
              ))
            )}
          </StyledPreviewContainer>
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
