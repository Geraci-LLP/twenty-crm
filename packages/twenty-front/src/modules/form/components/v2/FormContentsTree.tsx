import { styled } from '@linaria/react';
import { useState } from 'react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import {
  type FormBlock,
  type FormContents,
} from '@/form/components/v2/types';

// Left-rail tree view of the form structure. Mirrors HubSpot
// screenshot 3 — collapsible Step 1 / On submit nodes with each
// block listed underneath. Click a leaf to select it on the canvas.

type FormContentsTreeProps = {
  contents: FormContents;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onAddStep: () => void;
  onClose: () => void;
};

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

const StyledSearchRow = styled.div`
  padding: 10px 16px 4px;
`;

const StyledSearchInput = styled.input`
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: 12.5px;
  padding: 6px 10px;
  width: 100%;
`;

const StyledSectionHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 12px 16px 4px;
`;

const StyledSectionLabel = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: 13px;
  font-weight: 600;
`;

const StyledCollapseAll = styled.button`
  background: transparent;
  border: 0;
  color: ${themeCssVariables.color.orange};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: 11px;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`;

const StyledStepRow = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledStepHeader = styled.button`
  align-items: center;
  background: transparent;
  border: 0;
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  display: flex;
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  gap: 6px;
  padding: 6px 16px;
  text-align: left;
  width: 100%;
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
  }
`;

const StyledChevron = styled.span<{ expanded: boolean }>`
  color: ${themeCssVariables.font.color.tertiary};
  display: inline-block;
  font-size: 10px;
  transform: rotate(${(p) => (p.expanded ? '0deg' : '-90deg')});
  transition: transform 0.15s;
  width: 12px;
`;

const StyledStepLabel = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-size: 13px;
  font-weight: 500;
`;

const StyledLeafRow = styled.button<{ selected?: boolean }>`
  align-items: center;
  background: ${(p) =>
    p.selected === true
      ? themeCssVariables.background.transparent.lighter
      : 'transparent'};
  border: 0;
  border-left: 2px solid
    ${(p) =>
      p.selected === true ? themeCssVariables.color.orange : 'transparent'};
  color: ${(p) =>
    p.selected === true
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.secondary};
  cursor: pointer;
  display: flex;
  font-family: ${themeCssVariables.font.family};
  font-size: 12.5px;
  gap: 8px;
  padding: 5px 16px 5px 36px;
  text-align: left;
  width: 100%;
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledLeafGlyph = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  flex-shrink: 0;
  font-size: 11px;
  width: 16px;
`;

const StyledAddStep = styled.button`
  background: transparent;
  border: 0;
  color: ${themeCssVariables.color.orange};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: 12.5px;
  font-weight: 500;
  margin: 12px 16px;
  padding: 6px 0;
  text-align: left;
  &:hover {
    text-decoration: underline;
  }
`;

const labelForBlock = (block: FormBlock): { glyph: string; label: string } => {
  switch (block.kind) {
    case 'field':
      return {
        glyph: glyphForFieldKind(block.fieldType),
        label: block.label,
      };
    case 'submit':
      return { glyph: '↵', label: block.label };
    case 'heading':
      return { glyph: 'H', label: block.text };
    case 'paragraph':
      return {
        glyph: '¶',
        label: stripHtml(block.html).slice(0, 40) || 'Paragraph (Rich Text)',
      };
    case 'image':
      return { glyph: '🖼', label: block.alt || 'Image' };
    case 'recaptcha':
      return { glyph: '🛡', label: 'reCAPTCHA' };
    case 'dataPrivacy':
      return { glyph: '🔒', label: 'Data Privacy' };
  }
};

const glyphForFieldKind = (kind: string): string => {
  switch (kind) {
    case 'EMAIL':
      return '✉';
    case 'NUMBER':
      return '#';
    case 'PHONE':
      return '☎';
    case 'DATE':
      return '📅';
    case 'FILE':
      return '⎙';
    case 'DROPDOWN':
      return '▾';
    case 'RADIO':
      return '◉';
    case 'SINGLE_CHECKBOX':
    case 'MULTIPLE_CHECKBOXES':
      return '☑';
    case 'MULTI_LINE_TEXT':
      return '¶';
    default:
      return 'Abc';
  }
};

const stripHtml = (html: string): string =>
  html.replace(/<[^>]+>/g, '').trim();

export const FormContentsTree = ({
  contents,
  selectedBlockId,
  onSelectBlock,
  onAddStep,
  onClose,
}: FormContentsTreeProps) => {
  const [filter, setFilter] = useState('');
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const next = new Set(collapsedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCollapsedIds(next);
  };

  const matchesFilter = (label: string): boolean => {
    if (filter === '') return true;
    return label.toLowerCase().includes(filter.toLowerCase());
  };

  const collapseAll = () => {
    setCollapsedIds(
      new Set([...contents.steps.map((s) => s.id), contents.onSubmit.id]),
    );
  };

  return (
    <>
      <StyledHeader>
        <StyledTitle>Form contents</StyledTitle>
        <StyledClose onClick={onClose} aria-label="Close contents tree">
          ×
        </StyledClose>
      </StyledHeader>
      <StyledSearchRow>
        <StyledSearchInput
          type="search"
          placeholder="Search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </StyledSearchRow>
      <StyledSectionHeader>
        <StyledSectionLabel>All content</StyledSectionLabel>
        <StyledCollapseAll onClick={collapseAll}>Collapse all</StyledCollapseAll>
      </StyledSectionHeader>

      {contents.steps.map((step) => {
        const expanded = !collapsedIds.has(step.id);
        return (
          <StyledStepRow key={step.id}>
            <StyledStepHeader onClick={() => toggle(step.id)}>
              <StyledChevron expanded={expanded}>▼</StyledChevron>
              <StyledStepLabel>{step.label}</StyledStepLabel>
            </StyledStepHeader>
            {expanded &&
              step.blocks
                .map((b) => ({ block: b, ...labelForBlock(b) }))
                .filter((x) => matchesFilter(x.label))
                .map(({ block, glyph, label }) => (
                  <StyledLeafRow
                    key={block.id}
                    selected={selectedBlockId === block.id}
                    onClick={() => onSelectBlock(block.id)}
                  >
                    <StyledLeafGlyph>{glyph}</StyledLeafGlyph>
                    <span>{label}</span>
                  </StyledLeafRow>
                ))}
          </StyledStepRow>
        );
      })}

      {(() => {
        const expanded = !collapsedIds.has(contents.onSubmit.id);
        return (
          <StyledStepRow>
            <StyledStepHeader onClick={() => toggle(contents.onSubmit.id)}>
              <StyledChevron expanded={expanded}>▼</StyledChevron>
              <StyledStepLabel>{contents.onSubmit.label}</StyledStepLabel>
            </StyledStepHeader>
            {expanded &&
              contents.onSubmit.blocks
                .map((b) => ({ block: b, ...labelForBlock(b) }))
                .filter((x) => matchesFilter(x.label))
                .map(({ block, glyph, label }) => (
                  <StyledLeafRow
                    key={block.id}
                    selected={selectedBlockId === block.id}
                    onClick={() => onSelectBlock(block.id)}
                  >
                    <StyledLeafGlyph>{glyph}</StyledLeafGlyph>
                    <span>{label}</span>
                  </StyledLeafRow>
                ))}
          </StyledStepRow>
        );
      })()}

      <StyledAddStep onClick={onAddStep}>+ Add another step</StyledAddStep>
    </>
  );
};
