/* oxlint-disable twenty/no-hardcoded-colors */
// Backdrop overlay uses fixed dark/translucent values intentionally —
// these are visual chrome, not theme-driven semantic colors. Same
// rationale as the email-builder PreviewModal.
import { styled } from '@linaria/react';
import { useEffect, useState } from 'react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledOverlay = styled.div`
  align-items: center;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 1000;
`;

const StyledDialog = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  max-width: 460px;
  padding: ${themeCssVariables.spacing[5]};
  width: 100%;
`;

const StyledTitle = styled.h3`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledHint = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0;
`;

const StyledLabel = styled.label`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  &:focus {
    border-color: ${themeCssVariables.color.blue};
    outline: none;
  }
`;

const StyledField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledActions = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: flex-end;
  margin-top: ${themeCssVariables.spacing[2]};
`;

const StyledButton = styled.button<{ primary?: boolean }>`
  background: ${(p) =>
    p.primary
      ? themeCssVariables.color.blue
      : themeCssVariables.background.tertiary};
  border: 1px solid
    ${(p) =>
      p.primary
        ? themeCssVariables.color.blue
        : themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${(p) =>
    p.primary
      ? themeCssVariables.background.primary
      : themeCssVariables.font.color.primary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]};
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

type SendTestEmailModalProps = {
  defaultEmail?: string;
  loading?: boolean;
  onSubmit: (email: string) => void;
  onClose: () => void;
};

export const SendTestEmailModal = ({
  defaultEmail,
  loading = false,
  onSubmit,
  onClose,
}: SendTestEmailModalProps) => {
  const [email, setEmail] = useState(defaultEmail ?? '');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = () => {
    const trimmed = email.trim();
    if (trimmed === '') return;
    onSubmit(trimmed);
  };

  return (
    <StyledOverlay
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <StyledDialog>
        <StyledTitle>Send test email</StyledTitle>
        <StyledHint>
          A copy of this campaign will be sent to the address below. The subject
          will be prefixed with [TEST] and personalization tokens will be filled
          with sample data.
        </StyledHint>
        <StyledField>
          <StyledLabel htmlFor="send-test-email-input">To</StyledLabel>
          <StyledInput
            id="send-test-email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
          />
        </StyledField>
        <StyledActions>
          <StyledButton type="button" onClick={onClose} disabled={loading}>
            Cancel
          </StyledButton>
          <StyledButton
            type="button"
            primary
            onClick={handleSubmit}
            disabled={loading || email.trim() === ''}
          >
            {loading ? 'Sending…' : 'Send'}
          </StyledButton>
        </StyledActions>
      </StyledDialog>
    </StyledOverlay>
  );
};
