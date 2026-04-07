import { styled } from '@linaria/react';
import { useCallback, useState } from 'react';

import { type CampaignRecipientSelectionMode } from '@/campaign/types/CampaignTypes';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[4]};
  width: 100%;
`;

const StyledHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const StyledTitle = styled.h3`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledEstimatedCount = styled.span`
  background: ${themeCssVariables.background.tertiary};
  border-radius: ${themeCssVariables.border.radius.pill};
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[3]};
`;

const StyledModeSelector = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledModeButton = styled.button<{ isActive: boolean }>`
  background: ${({ isActive }) =>
    isActive
      ? themeCssVariables.color.blue
      : themeCssVariables.background.tertiary};
  border: 1px solid
    ${({ isActive }) =>
      isActive
        ? themeCssVariables.color.blue
        : themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${({ isActive }) =>
    isActive ? '#ffffff' : themeCssVariables.font.color.primary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  transition: background 0.15s ease;

  &:hover {
    background: ${({ isActive }) =>
      isActive
        ? themeCssVariables.color.blue
        : themeCssVariables.background.quaternary};
  }
`;

const StyledFilterArea = styled.div`
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  min-height: 120px;
  padding: ${themeCssVariables.spacing[3]};
`;

const StyledFilterLabel = styled.label`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledSelect = styled.select`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  margin-top: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  width: 100%;
`;

const StyledPlaceholderText = styled.p`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  margin: 0;
`;

const SELECTION_MODES: {
  key: CampaignRecipientSelectionMode;
  label: string;
}[] = [
  { key: 'savedView', label: 'Saved View' },
  { key: 'tag', label: 'Tag' },
  { key: 'lifecycleStage', label: 'Lifecycle Stage' },
  { key: 'manual', label: 'Manual' },
];

type CampaignRecipientSelectorProps = {
  estimatedRecipientCount: number;
  onSelectionChange: (
    mode: CampaignRecipientSelectionMode,
    selectionValue: string,
  ) => void;
  savedViews?: { id: string; name: string }[];
  tags?: { id: string; name: string }[];
  lifecycleStages?: { id: string; name: string }[];
};

export const CampaignRecipientSelector = ({
  estimatedRecipientCount,
  onSelectionChange,
  savedViews = [],
  tags = [],
  lifecycleStages = [],
}: CampaignRecipientSelectorProps) => {
  const [activeMode, setActiveMode] =
    useState<CampaignRecipientSelectionMode>('savedView');

  const handleModeChange = useCallback(
    (mode: CampaignRecipientSelectionMode) => {
      setActiveMode(mode);
    },
    [],
  );

  const handleSelectionChange = useCallback(
    (selectionValue: string) => {
      onSelectionChange(activeMode, selectionValue);
    },
    [activeMode, onSelectionChange],
  );

  const renderFilterContent = () => {
    switch (activeMode) {
      case 'savedView':
        return (
          <div>
            <StyledFilterLabel>Select a Saved View</StyledFilterLabel>
            <StyledSelect
              onChange={(event) => handleSelectionChange(event.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Choose a view...
              </option>
              {savedViews.map((view) => (
                <option key={view.id} value={view.id}>
                  {view.name}
                </option>
              ))}
            </StyledSelect>
          </div>
        );
      case 'tag':
        return (
          <div>
            <StyledFilterLabel>Select a Tag</StyledFilterLabel>
            <StyledSelect
              onChange={(event) => handleSelectionChange(event.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Choose a tag...
              </option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </StyledSelect>
          </div>
        );
      case 'lifecycleStage':
        return (
          <div>
            <StyledFilterLabel>Select a Lifecycle Stage</StyledFilterLabel>
            <StyledSelect
              onChange={(event) => handleSelectionChange(event.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Choose a stage...
              </option>
              {lifecycleStages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </StyledSelect>
          </div>
        );
      case 'manual':
        return (
          <StyledPlaceholderText>
            Manual selection will be available through the record table. Use the
            checkbox column to select individual recipients.
          </StyledPlaceholderText>
        );
      default:
        return null;
    }
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledTitle>Recipients</StyledTitle>
        <StyledEstimatedCount>
          {estimatedRecipientCount.toLocaleString()} estimated recipients
        </StyledEstimatedCount>
      </StyledHeader>

      <StyledModeSelector>
        {SELECTION_MODES.map((mode) => (
          <StyledModeButton
            key={mode.key}
            isActive={activeMode === mode.key}
            onClick={() => handleModeChange(mode.key)}
          >
            {mode.label}
          </StyledModeButton>
        ))}
      </StyledModeSelector>

      <StyledFilterArea>{renderFilterContent()}</StyledFilterArea>
    </StyledContainer>
  );
};
