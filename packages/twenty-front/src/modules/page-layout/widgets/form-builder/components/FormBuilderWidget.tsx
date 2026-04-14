import { FormBuilder } from '@/form/components/FormBuilder';
import { FormEmbedSnippet } from '@/form/components/FormEmbedSnippet';
import { FormPreview } from '@/form/components/FormPreview';
import { FormPublicUrlDisplay } from '@/form/components/FormPublicUrlDisplay';
import { FormSettings } from '@/form/components/FormSettings';
import { useFormRecord } from '@/form/hooks/useFormRecord';
import { TabList } from '@/ui/layout/tab-list/components/TabList';
import { useTargetRecord } from '@/ui/layout/contexts/useTargetRecord';
import { activeTabIdComponentState } from '@/ui/layout/tab-list/states/activeTabIdComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { isDefined } from 'twenty-shared/utils';
import { IconEye, IconPencil, IconSettings } from 'twenty-ui/display';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const FORM_BUILDER_TAB_LIST_ID = 'form-builder-tabs';

const StyledFormBuilderWidgetContainer = styled.div`
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

  if (loading || !isDefined(formRecord)) {
    return null;
  }

  const fields = Array.isArray(formRecord.fieldsConfig)
    ? formRecord.fieldsConfig
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
          <FormBuilder fields={fields} onFieldsChange={updateFieldsConfig} />
        )}

        {activeTabId === 'preview' && (
          <FormPreview
            fields={fields}
            formName={formRecord.name}
            formDescription={formRecord.description ?? undefined}
          />
        )}

        {activeTabId === 'settings' && (
          <FormSettings
            settings={{
              thankYouMessage: formRecord.thankYouMessage,
              notifyOnSubmission: formRecord.notifyOnSubmission,
              notificationEmail: formRecord.notificationEmail,
            }}
            onSettingsChange={(settings) => updateForm(settings)}
          />
        )}
      </StyledTabContent>
    </StyledFormBuilderWidgetContainer>
  );
};
