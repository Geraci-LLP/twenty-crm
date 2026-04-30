import { FormEmbedSnippet } from '@/form/components/FormEmbedSnippet';
import { FormPublicUrlDisplay } from '@/form/components/FormPublicUrlDisplay';
import { FormSettings } from '@/form/components/FormSettings';
import { FormBuilderCanvas } from '@/form/components/v2/FormBuilderCanvas';
import { migrateToFormContents } from '@/form/components/v2/defaults';
import { type FormContents } from '@/form/components/v2/types';
import { useFormRecord } from '@/form/hooks/useFormRecord';
import { TabList } from '@/ui/layout/tab-list/components/TabList';
import { useTargetRecord } from '@/ui/layout/contexts/useTargetRecord';
import { activeTabIdComponentState } from '@/ui/layout/tab-list/states/activeTabIdComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useMemo } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { IconPencil, IconSettings } from 'twenty-ui/display';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const FORM_BUILDER_TAB_LIST_ID = 'form-builder-tabs';

const StyledFormBuilderWidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 700px;
  overflow: hidden;
`;

const StyledTabContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

const StyledPublicUrlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[4]};
  padding-bottom: 0;
`;

export const FormBuilderWidget = () => {
  const { t } = useLingui();
  const targetRecord = useTargetRecord();

  const activeTabId = useAtomComponentStateValue(
    activeTabIdComponentState,
    FORM_BUILDER_TAB_LIST_ID,
  );

  const { formRecord, loading, updateForm, updateFieldsConfig } = useFormRecord(
    {
      formId: targetRecord.id,
    },
  );

  // Normalize legacy {id, name, type, ...}[] to FormContents on read.
  // Persisting the new shape happens on the next save via
  // updateFieldsConfig — until then, the canvas works against the
  // migrated copy in memory.
  const contents: FormContents = useMemo(
    () => migrateToFormContents(formRecord?.fieldsConfig),
    [formRecord?.fieldsConfig],
  );

  if (loading || !isDefined(formRecord)) {
    return null;
  }

  const tabs = [
    {
      id: 'builder',
      title: t`Builder`,
      Icon: IconPencil,
    },
    {
      id: 'settings',
      title: t`Settings`,
      Icon: IconSettings,
    },
  ];

  return (
    <StyledFormBuilderWidgetContainer>
      <TabList
        componentInstanceId={FORM_BUILDER_TAB_LIST_ID}
        tabs={tabs}
        behaveAsLinks={false}
      />

      <StyledTabContent>
        {formRecord.status === 'PUBLISHED' && (
          <StyledPublicUrlContainer>
            <FormPublicUrlDisplay formId={formRecord.id} />
            <FormEmbedSnippet formId={formRecord.id} />
          </StyledPublicUrlContainer>
        )}

        {(activeTabId === 'builder' || !isDefined(activeTabId)) && (
          <FormBuilderCanvas
            contents={contents}
            onChange={(next) =>
              updateFieldsConfig(
                next as unknown as Parameters<typeof updateFieldsConfig>[0],
              )
            }
          />
        )}

        {activeTabId === 'settings' && (
          <FormSettings
            settings={{
              thankYouMessage: formRecord.thankYouMessage,
              notifyOnSubmission: formRecord.notifyOnSubmission,
              notificationEmail: formRecord.notificationEmail,
              redirectUrl: formRecord.redirectUrl,
              sendConfirmationEmail: formRecord.sendConfirmationEmail,
              confirmationEmailSubject: formRecord.confirmationEmailSubject,
              confirmationEmailBody: formRecord.confirmationEmailBody,
              autoCreatePerson: formRecord.autoCreatePerson ?? true,
              tagsToApplyOnSubmission:
                formRecord.tagsToApplyOnSubmission ?? null,
              botProtectionEnabled: formRecord.botProtectionEnabled ?? false,
              botProtectionSiteKey: formRecord.botProtectionSiteKey ?? null,
              honeypotFieldName: formRecord.honeypotFieldName ?? null,
              requireFormLoadToken: formRecord.requireFormLoadToken ?? false,
              minSubmitTimeSeconds: formRecord.minSubmitTimeSeconds ?? null,
              rateLimitPerMinute: formRecord.rateLimitPerMinute ?? null,
              allowedOrigins: formRecord.allowedOrigins ?? null,
              rejectDisposableEmails:
                formRecord.rejectDisposableEmails ?? false,
            }}
            onSettingsChange={(settings) => updateForm(settings)}
          />
        )}
      </StyledTabContent>
    </StyledFormBuilderWidgetContainer>
  );
};
