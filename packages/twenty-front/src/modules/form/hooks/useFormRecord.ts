import { useFindOneRecord } from '@/object-record/hooks/useFindOneRecord';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { type WorkflowFormActionField } from '@/workflow/workflow-steps/workflow-actions/form-action/types/WorkflowFormActionField';
import { useCallback } from 'react';
import { CoreObjectNameSingular } from 'twenty-shared/types';

type FormRecord = ObjectRecord & {
  name: string;
  description: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  fieldsConfig: WorkflowFormActionField[] | null;
  submissionCount: number;
  thankYouMessage: string | null;
  notifyOnSubmission: boolean;
  notificationEmail: string | null;
  redirectUrl: string | null;
  sendConfirmationEmail: boolean;
  confirmationEmailSubject: string | null;
  confirmationEmailBody: string | null;
  autoCreatePerson: boolean;
  // Person-tagging policy: tag strings merged into the auto-created
  // Person's `tags` array on submission.
  tagsToApplyOnSubmission: string[] | null;
  // Bot-protection settings — six layers, all optional, configured per
  // form. See section 8.3.1 of the marketing manual for the full
  // breakdown.
  botProtectionEnabled: boolean;
  botProtectionSiteKey: string | null;
  honeypotFieldName: string | null;
  requireFormLoadToken: boolean;
  minSubmitTimeSeconds: number | null;
  rateLimitPerMinute: number | null;
  allowedOrigins: string[] | null;
  rejectDisposableEmails: boolean;
  submitButtonLabel: string | null;
};

export const useFormRecord = ({ formId }: { formId: string }) => {
  const { record, loading } = useFindOneRecord<FormRecord>({
    objectNameSingular: CoreObjectNameSingular.Form,
    objectRecordId: formId,
    recordGqlFields: {
      id: true,
      name: true,
      description: true,
      status: true,
      fieldsConfig: true,
      submissionCount: true,
      thankYouMessage: true,
      notifyOnSubmission: true,
      notificationEmail: true,
      redirectUrl: true,
      sendConfirmationEmail: true,
      confirmationEmailSubject: true,
      confirmationEmailBody: true,
      autoCreatePerson: true,
      tagsToApplyOnSubmission: true,
      botProtectionEnabled: true,
      botProtectionSiteKey: true,
      honeypotFieldName: true,
      requireFormLoadToken: true,
      minSubmitTimeSeconds: true,
      rateLimitPerMinute: true,
      allowedOrigins: true,
      rejectDisposableEmails: true,
    },
  });

  const { updateOneRecord } = useUpdateOneRecord();

  const updateForm = useCallback(
    async (input: Partial<Omit<FormRecord, 'id'>>) => {
      await updateOneRecord({
        objectNameSingular: CoreObjectNameSingular.Form,
        idToUpdate: formId,
        updateOneRecordInput: input,
      });
    },
    [formId, updateOneRecord],
  );

  const updateFieldsConfig = useCallback(
    async (fields: WorkflowFormActionField[]) => {
      await updateForm({ fieldsConfig: fields });
    },
    [updateForm],
  );

  return {
    formRecord: record as FormRecord | undefined,
    loading,
    updateForm,
    updateFieldsConfig,
  };
};
