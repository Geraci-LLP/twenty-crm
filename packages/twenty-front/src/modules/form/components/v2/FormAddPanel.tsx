import { styled } from '@linaria/react';
import { useState } from 'react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import {
  type FormBlock,
  type FormFieldKind,
  FORM_LIBRARY,
} from '@/form/components/v2/types';

// Sliding "Add to form" panel — mirrors HubSpot screenshot 1 + 2.
// Three top tabs: Fields, Properties, Other. Properties is a stub
// for the v2 push (CRM property mapping). Fields + Other render a
// card grid grouped by category.

type FormAddPanelProps = {
  onAdd: (kind: FormBlock['kind'] | FormFieldKind) => void;
  onClose: () => void;
};

type Tab = 'fields' | 'properties' | 'other';

const StyledHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  justify-content: space-between;
  padding: 14px 16px;
`;

const StyledTitle = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: 14px;
  font-weight: 600;
`;

const StyledClose = styled.button`
  background: transparent;
  border: 0;
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 2px 6px;
  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledTabs = styled.div`
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  padding: 0 16px;
`;

const StyledTab = styled.button<{ active?: boolean }>`
  background: transparent;
  border: 0;
  border-bottom: 2px solid
    ${(p) =>
      p.active === true ? themeCssVariables.color.orange : 'transparent'};
  color: ${(p) =>
    p.active === true
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.tertiary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  font-weight: ${(p) => (p.active === true ? 600 : 500)};
  padding: 10px 12px;
  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`;

const StyledSubheading = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: 14px;
  font-weight: 600;
`;

const StyledHint = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: 12px;
`;

const StyledCardGrid = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr 1fr;
`;

const StyledCard = styled.button`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-family: ${themeCssVariables.font.family};
  font-size: 11.5px;
  gap: 6px;
  justify-content: center;
  padding: 14px 8px 10px;
  text-align: center;
  transition:
    border-color 0.15s,
    background 0.15s;
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
    border-color: ${themeCssVariables.color.orange};
  }
`;

const StyledCardGlyph = styled.div`
  align-items: center;
  border-bottom: 1px dotted ${themeCssVariables.border.color.medium};
  color: ${themeCssVariables.font.color.primary};
  display: flex;
  font-size: 16px;
  height: 36px;
  justify-content: center;
  margin-bottom: 4px;
  width: 100%;
`;

const StyledSectionLabel = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 11px;
  font-weight: ${themeCssVariables.font.weight.semiBold};
  letter-spacing: 0.04em;
  margin-bottom: 4px;
`;

export const FormAddPanel = ({ onAdd, onClose }: FormAddPanelProps) => {
  const [tab, setTab] = useState<Tab>('fields');

  const fieldEntries = FORM_LIBRARY.filter((e) => e.category === 'fields');
  const otherTextEntries = FORM_LIBRARY.filter(
    (e) => e.category === 'other-text',
  );
  const otherSecurityEntries = FORM_LIBRARY.filter(
    (e) => e.category === 'other-security',
  );

  return (
    <>
      <StyledHeader>
        <StyledTitle>Add to form</StyledTitle>
        <StyledClose onClick={onClose} aria-label="Close add panel">
          ×
        </StyledClose>
      </StyledHeader>
      <StyledTabs>
        <StyledTab active={tab === 'fields'} onClick={() => setTab('fields')}>
          Fields
        </StyledTab>
        <StyledTab
          active={tab === 'properties'}
          onClick={() => setTab('properties')}
        >
          Properties
        </StyledTab>
        <StyledTab active={tab === 'other'} onClick={() => setTab('other')}>
          Other
        </StyledTab>
      </StyledTabs>

      {tab === 'fields' && (
        <StyledContent>
          <StyledSubheading>Fields</StyledSubheading>
          <StyledHint>
            Choose which type of field to add to your form. You'll connect it to
            a property later.
          </StyledHint>
          <StyledCardGrid>
            {fieldEntries.map((entry) => (
              <StyledCard
                key={entry.kind}
                onClick={() => onAdd(entry.kind as FormFieldKind)}
                title={`Add ${entry.label}`}
              >
                <StyledCardGlyph>{entry.glyph}</StyledCardGlyph>
                {entry.label}
              </StyledCard>
            ))}
          </StyledCardGrid>
        </StyledContent>
      )}

      {tab === 'properties' && (
        <StyledContent>
          <StyledSubheading>Properties</StyledSubheading>
          <StyledHint>
            Connect form fields to CRM properties on Person and Company so
            submissions update existing records. Coming in the next iteration.
          </StyledHint>
        </StyledContent>
      )}

      {tab === 'other' && (
        <StyledContent>
          <StyledSectionLabel>Text &amp; Media</StyledSectionLabel>
          <StyledCardGrid>
            {otherTextEntries.map((entry) => (
              <StyledCard
                key={entry.kind}
                onClick={() => onAdd(entry.kind as FormBlock['kind'])}
                title={`Add ${entry.label}`}
              >
                <StyledCardGlyph>{entry.glyph}</StyledCardGlyph>
                {entry.label}
              </StyledCard>
            ))}
          </StyledCardGrid>

          <StyledSectionLabel>Security &amp; Privacy</StyledSectionLabel>
          <StyledCardGrid>
            {otherSecurityEntries.map((entry) => (
              <StyledCard
                key={entry.kind}
                onClick={() => onAdd(entry.kind as FormBlock['kind'])}
                title={`Add ${entry.label}`}
              >
                <StyledCardGlyph>{entry.glyph}</StyledCardGlyph>
                {entry.label}
              </StyledCard>
            ))}
          </StyledCardGrid>
        </StyledContent>
      )}
    </>
  );
};
