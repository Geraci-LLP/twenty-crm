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
