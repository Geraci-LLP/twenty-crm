import { styled } from '@linaria/react';
import { useCallback, useState } from 'react';

import { type CampaignStatus } from '@/campaign/types/CampaignTypes';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
`;

const StyledActionButton = styled.button<{
  variant: 'primary' | 'secondary' | 'danger';
}>`
  background: ${({ variant }) =>
    variant === 'primary'
      ? themeCssVariables.color.blue
      : variant === 'danger'
        ? themeCssVariables.color.red
        : themeCssVariables.background.tertiary};
  border: 1px solid
    ${({ variant }) =>
      variant === 'primary'
        ? themeCssVariables.color.blue
        : variant === 'danger'
          ? themeCssVariables.color.red
          : themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${({ variant }) =>
    variant === 'primary' || variant === 'danger'
      ? themeCssVariables.font.color.inverted
      : themeCssVariables.font.color.primary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]};
  transition:
    background 0.15s ease,
    opacity 0.15s ease;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledOverlay = styled.div`
  background: ${themeCssVariables.background.overlaySecondary};
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
`;

const StyledModal = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  box-shadow: ${themeCssVariables.boxShadow.strong};
  left: 50%;
  max-width: 400px;
  padding: ${themeCssVariables.spacing[6]};
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  z-index: 1001;
`;

const StyledModalTitle = styled.h3`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0 0 ${themeCssVariables.spacing[2]} 0;
`;

const StyledModalDescription = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  margin: 0 0 ${themeCssVariables.spacing[4]} 0;
`;

const StyledModalActions = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: flex-end;
`;

const StyledScheduleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledDateTimeInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  width: 100%;

  &:focus {
    border-color: ${themeCssVariables.color.blue};
    outline: none;
  }
`;

type CampaignActionsProps = {
  campaignStatus: CampaignStatus;
  onSaveDraft: () => void;
  onSendTest: () => void;
  onSchedule: (scheduledAt: Date) => void;
  onSendNow: () => void;
  isSaving?: boolean;
  isSending?: boolean;
};

export const CampaignActions = ({
  campaignStatus,
  onSaveDraft,
  onSendTest,
  onSchedule,
  onSendNow,
  isSaving = false,
  isSending = false,
}: CampaignActionsProps) => {
  const [showSendConfirmation, setShowSendConfirmation] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState('');

  const isDraftOrScheduled =
    campaignStatus === 'DRAFT' || campaignStatus === 'SCHEDULED';

  const handleSendNowClick = useCallback(() => {
    setShowSendConfirmation(true);
  }, []);

  const handleConfirmSend = useCallback(() => {
    setShowSendConfirmation(false);
    onSendNow();
  }, [onSendNow]);

  const handleCancelSend = useCallback(() => {
    setShowSendConfirmation(false);
  }, []);

  const handleScheduleClick = useCallback(() => {
    setShowScheduleModal(true);
  }, []);

  const handleConfirmSchedule = useCallback(() => {
    if (!scheduledDateTime) {
      return;
    }

    setShowScheduleModal(false);
    onSchedule(new Date(scheduledDateTime));
  }, [onSchedule, scheduledDateTime]);

  const handleCancelSchedule = useCallback(() => {
    setShowScheduleModal(false);
    setScheduledDateTime('');
  }, []);

  return (
    <>
      <StyledContainer>
        <StyledActionButton
          variant="secondary"
          onClick={onSaveDraft}
          disabled={!isDraftOrScheduled || isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </StyledActionButton>

        <StyledActionButton
          variant="secondary"
          onClick={onSendTest}
          disabled={!isDraftOrScheduled}
        >
          Send Test
        </StyledActionButton>

        <StyledActionButton
          variant="secondary"
          onClick={handleScheduleClick}
          disabled={!isDraftOrScheduled || isSending}
        >
          Schedule
        </StyledActionButton>

        <StyledActionButton
          variant="primary"
          onClick={handleSendNowClick}
          disabled={!isDraftOrScheduled || isSending}
        >
          {isSending ? 'Sending...' : 'Send Now'}
        </StyledActionButton>
      </StyledContainer>

      {showSendConfirmation && (
        <StyledOverlay onClick={handleCancelSend}>
          <StyledModal onClick={(event) => event.stopPropagation()}>
            <StyledModalTitle>Send Campaign Now</StyledModalTitle>
            <StyledModalDescription>
              Are you sure you want to send this campaign immediately? This
              action cannot be undone.
            </StyledModalDescription>
            <StyledModalActions>
              <StyledActionButton
                variant="secondary"
                onClick={handleCancelSend}
              >
                Cancel
              </StyledActionButton>
              <StyledActionButton variant="danger" onClick={handleConfirmSend}>
                Confirm Send
              </StyledActionButton>
            </StyledModalActions>
          </StyledModal>
        </StyledOverlay>
      )}

      {showScheduleModal && (
        <StyledOverlay onClick={handleCancelSchedule}>
          <StyledModal onClick={(event) => event.stopPropagation()}>
            <StyledScheduleContainer>
              <StyledModalTitle>Schedule Campaign</StyledModalTitle>
              <StyledModalDescription>
                Choose a date and time to send this campaign.
              </StyledModalDescription>
              <StyledDateTimeInput
                type="datetime-local"
                value={scheduledDateTime}
                onChange={(event) => setScheduledDateTime(event.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
              <StyledModalActions>
                <StyledActionButton
                  variant="secondary"
                  onClick={handleCancelSchedule}
                >
                  Cancel
                </StyledActionButton>
                <StyledActionButton
                  variant="primary"
                  onClick={handleConfirmSchedule}
                  disabled={!scheduledDateTime}
                >
                  Schedule
                </StyledActionButton>
              </StyledModalActions>
            </StyledScheduleContainer>
          </StyledModal>
        </StyledOverlay>
      )}
    </>
  );
};
