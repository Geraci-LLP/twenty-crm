import { styled } from '@linaria/react';
import { useCallback, useState } from 'react';

import { useSaveAsTemplate } from '@/campaign/hooks/useSaveAsTemplate';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const TEMPLATE_CATEGORIES = [
  { value: 'CUSTOM', label: 'Custom' },
  { value: 'NEWSLETTER', label: 'Newsletter' },
  { value: 'FOLLOW_UP', label: 'Follow-Up' },
  { value: 'ANNOUNCEMENT', label: 'Announcement' },
  { value: 'CONFERENCE', label: 'Conference' },
] as const;

type CampaignSaveAsTemplateButtonProps = {
  campaignId: string;
};

const StyledButton = styled.button`
  background: none;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[3]};

  &:hover {
    background: ${themeCssVariables.background.tertiary};
    color: ${themeCssVariables.font.color.primary};
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
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  left: 50%;
  padding: ${themeCssVariables.spacing[6]};
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(400px, 90vw);
  z-index: 1001;
`;

const StyledModalTitle = styled.h3`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
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

const StyledSelect = styled.select`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
`;

const StyledButtonRow = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: flex-end;
`;

const StyledPrimaryButton = styled.button`
  background: ${themeCssVariables.color.blue};
  border: none;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.inverted};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]};

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledSecondaryButton = styled.button`
  background: none;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]};

  &:hover {
    background: ${themeCssVariables.background.tertiary};
  }
`;

export const CampaignSaveAsTemplateButton = ({
  campaignId,
}: CampaignSaveAsTemplateButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [category, setCategory] = useState('CUSTOM');

  const { saveAsTemplate, loading } = useSaveAsTemplate();

  const handleOpen = useCallback(() => {
    setTemplateName('');
    setCategory('CUSTOM');
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSave = useCallback(async () => {
    if (!templateName.trim()) {
      return;
    }

    const success = await saveAsTemplate(
      campaignId,
      templateName.trim(),
      category,
    );

    if (success) {
      setIsOpen(false);
    }
  }, [campaignId, category, saveAsTemplate, templateName]);

  return (
    <>
      <StyledButton onClick={handleOpen}>Save as Template</StyledButton>

      {isOpen && (
        <>
          <StyledOverlay onClick={handleClose} />
          <StyledModal>
            <StyledModalTitle>Save as Template</StyledModalTitle>

            <StyledFieldGroup>
              <StyledLabel>Template Name</StyledLabel>
              <StyledInput
                autoFocus
                placeholder="e.g. Monthly Newsletter"
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSave();
                  }
                }}
              />
            </StyledFieldGroup>

            <StyledFieldGroup>
              <StyledLabel>Category</StyledLabel>
              <StyledSelect
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {TEMPLATE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </StyledSelect>
            </StyledFieldGroup>

            <StyledButtonRow>
              <StyledSecondaryButton onClick={handleClose}>
                Cancel
              </StyledSecondaryButton>
              <StyledPrimaryButton
                disabled={loading || !templateName.trim()}
                onClick={handleSave}
              >
                {loading ? 'Saving...' : 'Save'}
              </StyledPrimaryButton>
            </StyledButtonRow>
          </StyledModal>
        </>
      )}
    </>
  );
};
