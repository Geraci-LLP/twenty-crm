import { styled } from '@linaria/react';
import { useCallback, useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { CAMPAIGN_PERSONALIZATION_TOKENS } from '@/campaign/constants/CampaignPersonalizationTokens';
import { EmailRichTextEditor } from '@/campaign/email-builder/components/modules/EmailRichTextEditor';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useDeleteOneRecord } from '@/object-record/hooks/useDeleteOneRecord';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';

// Custom inline editor for sequence steps. Surfaces all SequenceStep
// records belonging to a sequence as an ordered cadence: type +
// delayDays + (for EMAIL) subject and bodyHtml. Inline editing,
// add-step, ↑↓ reorder, delete. Pure additive frontend — uses the
// existing record CRUD hooks; no schema or server changes here
// (the SequenceStep object was added in earlier marketing work).

type SequenceStepRecord = ObjectRecord & {
  stepOrder: number;
  type: string;
  delayDays: number;
  subject: string | null;
  bodyHtml: string | null;
  sequenceId: string;
};

const STEP_TYPES: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'EMAIL', label: 'Send email' },
  { value: 'WAIT', label: 'Wait' },
  { value: 'LINKEDIN_TASK', label: 'LinkedIn task (manual)' },
  { value: 'CALL_TASK', label: 'Call task (manual)' },
];

const SEQUENCE_STEP_OBJECT = 'sequenceStep';

const STEP_GQL_FIELDS = {
  id: true,
  stepOrder: true,
  type: true,
  delayDays: true,
  subject: true,
  bodyHtml: true,
  sequenceId: true,
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[4]};
  width: 100%;
`;

const StyledHeader = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: space-between;
`;

const StyledTitle = styled.h3`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledHint = styled.p`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0;
`;

const StyledStepCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]};
`;

const StyledStepHeader = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledStepBadge = styled.span`
  background: ${themeCssVariables.background.tertiary};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
`;

const StyledFieldRow = styled.div`
  align-items: flex-end;
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  min-width: 140px;
`;

const StyledLabel = styled.label`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  width: 100%;
`;

const StyledNumberInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  width: 90px;
`;

const StyledSelect = styled.select`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
`;

const StyledStepActions = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
  margin-left: auto;
`;

const StyledIconButton = styled.button`
  background: transparent;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  &:hover {
    background: ${themeCssVariables.background.tertiary};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

const StyledAddButton = styled.button`
  background: transparent;
  border: 1px dashed ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

type SequenceCadenceEditorProps = {
  sequenceId: string;
  readOnly?: boolean;
};

export const SequenceCadenceEditor = ({
  sequenceId,
  readOnly = false,
}: SequenceCadenceEditorProps) => {
  const [pendingMutation, setPendingMutation] = useState(false);

  const { records, loading, refetch } = useFindManyRecords<SequenceStepRecord>({
    objectNameSingular: SEQUENCE_STEP_OBJECT,
    filter: { sequenceId: { eq: sequenceId } },
    orderBy: [{ stepOrder: 'AscNullsFirst' }],
    recordGqlFields: STEP_GQL_FIELDS,
  });

  const { createOneRecord } = useCreateOneRecord<SequenceStepRecord>({
    objectNameSingular: SEQUENCE_STEP_OBJECT,
    shouldMatchRootQueryFilter: true,
  });
  const { updateOneRecord } = useUpdateOneRecord();
  const { deleteOneRecord } = useDeleteOneRecord({
    objectNameSingular: SEQUENCE_STEP_OBJECT,
  });

  const sortedSteps = [...records].sort((a, b) => a.stepOrder - b.stepOrder);

  const updateStep = useCallback(
    async (id: string, patch: Partial<SequenceStepRecord>) => {
      setPendingMutation(true);
      try {
        await updateOneRecord({
          objectNameSingular: SEQUENCE_STEP_OBJECT,
          idToUpdate: id,
          updateOneRecordInput: patch,
        });
      } finally {
        setPendingMutation(false);
      }
    },
    [updateOneRecord],
  );

  const handleAddStep = useCallback(async () => {
    const nextOrder = sortedSteps.length;
    setPendingMutation(true);
    try {
      await createOneRecord({
        sequenceId,
        stepOrder: nextOrder,
        type: 'EMAIL',
        delayDays: nextOrder === 0 ? 0 : 2,
        subject: '',
        bodyHtml: '',
      } as Partial<SequenceStepRecord>);
      await refetch?.();
    } finally {
      setPendingMutation(false);
    }
  }, [createOneRecord, refetch, sequenceId, sortedSteps.length]);

  const handleDeleteStep = useCallback(
    async (id: string) => {
      if (!window.confirm('Delete this step? This cannot be undone.')) return;
      setPendingMutation(true);
      try {
        await deleteOneRecord(id);
        // Re-pack stepOrder so there are no gaps. Keeps the index-based
        // executor logic happy.
        const remaining = sortedSteps.filter((s) => s.id !== id);
        await Promise.all(
          remaining.map((s, idx) =>
            s.stepOrder === idx
              ? Promise.resolve()
              : updateOneRecord({
                  objectNameSingular: SEQUENCE_STEP_OBJECT,
                  idToUpdate: s.id,
                  updateOneRecordInput: { stepOrder: idx },
                }),
          ),
        );
        await refetch?.();
      } finally {
        setPendingMutation(false);
      }
    },
    [deleteOneRecord, refetch, sortedSteps, updateOneRecord],
  );

  const handleMoveStep = useCallback(
    async (id: string, direction: -1 | 1) => {
      const idx = sortedSteps.findIndex((s) => s.id === id);
      const target = idx + direction;
      if (idx < 0 || target < 0 || target >= sortedSteps.length) return;
      const a = sortedSteps[idx];
      const b = sortedSteps[target];
      setPendingMutation(true);
      try {
        await Promise.all([
          updateOneRecord({
            objectNameSingular: SEQUENCE_STEP_OBJECT,
            idToUpdate: a.id,
            updateOneRecordInput: { stepOrder: b.stepOrder },
          }),
          updateOneRecord({
            objectNameSingular: SEQUENCE_STEP_OBJECT,
            idToUpdate: b.id,
            updateOneRecordInput: { stepOrder: a.stepOrder },
          }),
        ]);
        await refetch?.();
      } finally {
        setPendingMutation(false);
      }
    },
    [refetch, sortedSteps, updateOneRecord],
  );

  if (loading && records.length === 0) {
    return (
      <StyledContainer>
        <StyledTitle>Sequence cadence</StyledTitle>
        <StyledHint>Loading…</StyledHint>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledTitle>Sequence cadence</StyledTitle>
        <StyledHint>
          {sortedSteps.length === 0
            ? 'No steps yet — add one to start.'
            : `${sortedSteps.length} step${sortedSteps.length === 1 ? '' : 's'}`}
        </StyledHint>
      </StyledHeader>

      {sortedSteps.map((step, idx) => (
        <StyledStepCard key={step.id}>
          <StyledStepHeader>
            <StyledStepBadge>Step {idx + 1}</StyledStepBadge>
            {!readOnly && (
              <StyledStepActions>
                <StyledIconButton
                  type="button"
                  onClick={() => handleMoveStep(step.id, -1)}
                  disabled={idx === 0 || pendingMutation}
                  title="Move up"
                >
                  ↑
                </StyledIconButton>
                <StyledIconButton
                  type="button"
                  onClick={() => handleMoveStep(step.id, +1)}
                  disabled={idx === sortedSteps.length - 1 || pendingMutation}
                  title="Move down"
                >
                  ↓
                </StyledIconButton>
                <StyledIconButton
                  type="button"
                  onClick={() => handleDeleteStep(step.id)}
                  disabled={pendingMutation}
                  title="Delete step"
                >
                  ✕
                </StyledIconButton>
              </StyledStepActions>
            )}
          </StyledStepHeader>

          <StyledFieldRow>
            <StyledField>
              <StyledLabel>Type</StyledLabel>
              <StyledSelect
                value={step.type}
                onChange={(e) => updateStep(step.id, { type: e.target.value })}
                disabled={readOnly || pendingMutation}
              >
                {STEP_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </StyledSelect>
            </StyledField>
            <StyledField>
              <StyledLabel>Wait days before this step</StyledLabel>
              <StyledNumberInput
                type="number"
                min={0}
                max={365}
                value={step.delayDays}
                onChange={(e) =>
                  updateStep(step.id, { delayDays: Number(e.target.value) })
                }
                disabled={readOnly || pendingMutation}
              />
            </StyledField>
          </StyledFieldRow>

          {step.type === 'EMAIL' && (
            <>
              <StyledField>
                <StyledLabel>Subject</StyledLabel>
                <StyledInput
                  type="text"
                  value={step.subject ?? ''}
                  onChange={(e) =>
                    updateStep(step.id, { subject: e.target.value })
                  }
                  placeholder="Email subject (supports {{contact.firstName}})"
                  readOnly={readOnly}
                  disabled={pendingMutation}
                />
              </StyledField>
              <StyledField style={{ minWidth: '100%' }}>
                <StyledLabel>Body</StyledLabel>
                <EmailRichTextEditor
                  value={step.bodyHtml ?? ''}
                  onChange={(html) => updateStep(step.id, { bodyHtml: html })}
                  tokens={CAMPAIGN_PERSONALIZATION_TOKENS}
                />
              </StyledField>
            </>
          )}
        </StyledStepCard>
      ))}

      {!readOnly && (
        <StyledAddButton
          type="button"
          onClick={handleAddStep}
          disabled={pendingMutation}
        >
          + Add step
        </StyledAddButton>
      )}

      {!isDefined(sortedSteps) && <StyledHint>Loading…</StyledHint>}
    </StyledContainer>
  );
};
