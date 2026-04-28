import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { type FormBlock } from '@/form/components/v2/types';

// Renders a single FormBlock the way visitors will see it on the
// public form, plus an editor-only hover toolbar (type chip, status
// dot, edit pencil, trash) that appears when the block is selected
// or hovered. Mirrors HubSpot's screenshot 2 toolbar.

type FormBlockOnCanvasProps = {
  block: FormBlock;
  selected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
};

const StyledWrapper = styled.div<{ selected?: boolean }>`
  border: 1px solid
    ${(p) =>
      p.selected === true
        ? themeCssVariables.color.orange
        : 'transparent'};
  border-radius: ${themeCssVariables.border.radius.sm};
  cursor: pointer;
  padding: 6px 8px;
  position: relative;
  &:hover {
    border-color: ${(p) =>
      p.selected === true
        ? themeCssVariables.color.orange
        : themeCssVariables.border.color.medium};
  }
  &:hover .form-block-toolbar {
    opacity: 1;
  }
`;

/* oxlint-disable twenty/no-hardcoded-colors */
const StyledToolbar = styled.div<{ visible?: boolean }>`
  align-items: center;
  background: #1b2733;
  border-radius: 4px;
  color: #ffffff;
  display: flex;
  font-size: 11px;
  gap: 0;
  opacity: ${(p) => (p.visible === true ? 1 : 0)};
  padding: 0;
  position: absolute;
  right: 8px;
  top: -16px;
  transition: opacity 0.15s;
  z-index: 5;
`;
/* oxlint-enable twenty/no-hardcoded-colors */

/* oxlint-disable twenty/no-hardcoded-colors */
const StyledToolbarChip = styled.span`
  align-items: center;
  border-right: 1px solid rgba(255, 255, 255, 0.15);
  display: inline-flex;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 4px 8px;
`;
/* oxlint-enable twenty/no-hardcoded-colors */

const StyledToolbarDot = styled.span`
  background: ${themeCssVariables.color.green};
  border-radius: 50%;
  display: inline-block;
  height: 8px;
  margin: 0 8px;
  width: 8px;
`;

/* oxlint-disable twenty/no-hardcoded-colors */
const StyledToolbarButton = styled.button`
  align-items: center;
  background: transparent;
  border: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font-size: 12px;
  height: 24px;
  justify-content: center;
  width: 24px;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;
/* oxlint-enable twenty/no-hardcoded-colors */

// ─── Block-type renderers ────────────────────────────────────────

const StyledLabel = styled.label`
  color: ${themeCssVariables.font.color.primary};
  display: block;
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const StyledRequiredMark = styled.span`
  color: ${themeCssVariables.color.red};
  margin-left: 2px;
`;

const StyledInput = styled.input`
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  padding: 8px 10px;
  pointer-events: none;
  width: 100%;
`;

const StyledTextarea = styled.textarea`
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  min-height: 80px;
  padding: 8px 10px;
  pointer-events: none;
  resize: vertical;
  width: 100%;
`;

const StyledHeading = styled.div<{ level: 'h1' | 'h2' | 'h3'; align: string }>`
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${(p) =>
    p.level === 'h1' ? '24px' : p.level === 'h2' ? '18px' : '15px'};
  font-weight: 600;
  margin: 0;
  text-align: ${(p) => p.align};
`;

const StyledParagraph = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  line-height: 1.55;
`;

/* oxlint-disable twenty/no-hardcoded-colors */
const StyledSubmitButton = styled.button`
  background: #1b2733;
  border: 0;
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: 14px;
  font-weight: 600;
  padding: 10px 24px;
  pointer-events: none;
`;
/* oxlint-enable twenty/no-hardcoded-colors */

const StyledSubmitRow = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const StyledImagePlaceholder = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px dashed ${themeCssVariables.border.color.medium};
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  font-size: 12px;
  height: 100px;
  justify-content: center;
  width: 100%;
`;

const StyledImage = styled.img<{ widthPercent: number; align: string }>`
  display: block;
  height: auto;
  margin-left: ${(p) => (p.align === 'right' ? 'auto' : p.align === 'center' ? 'auto' : '0')};
  margin-right: ${(p) => (p.align === 'left' ? 'auto' : p.align === 'center' ? 'auto' : '0')};
  max-width: ${(p) => p.widthPercent}%;
`;

const StyledNotice = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px dashed ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  font-size: 12px;
  gap: 8px;
  padding: 12px 14px;
`;

const StyledOptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StyledOptionRow = styled.label`
  align-items: center;
  color: ${themeCssVariables.font.color.primary};
  display: flex;
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  gap: 8px;
`;

const renderBlock = (block: FormBlock): JSX.Element => {
  switch (block.kind) {
    case 'paragraph':
      return (
        <StyledParagraph dangerouslySetInnerHTML={{ __html: block.html }} />
      );
    case 'heading':
      return (
        <StyledHeading level={block.level} align={block.alignment}>
          {block.text}
        </StyledHeading>
      );
    case 'submit':
      return (
        <StyledSubmitRow>
          <StyledSubmitButton type="button">{block.label}</StyledSubmitButton>
        </StyledSubmitRow>
      );
    case 'image':
      return block.src === '' ? (
        <StyledImagePlaceholder>Image (no src set)</StyledImagePlaceholder>
      ) : (
        <StyledImage
          src={block.src}
          alt={block.alt}
          widthPercent={block.widthPercent}
          align={block.alignment}
        />
      );
    case 'recaptcha':
      return (
        <StyledNotice>
          🛡 reCAPTCHA / Turnstile — runs server-side at submit. Configure in
          form Settings tab.
        </StyledNotice>
      );
    case 'dataPrivacy':
      return (
        <div>
          <StyledParagraph>{block.consentText}</StyledParagraph>
          <StyledOptionRow>
            <input type="checkbox" disabled />
            {block.consentLabel}
            {block.required && <StyledRequiredMark>*</StyledRequiredMark>}
          </StyledOptionRow>
        </div>
      );
    case 'field': {
      const label = (
        <StyledLabel>
          {block.label}
          {block.required && <StyledRequiredMark>*</StyledRequiredMark>}
        </StyledLabel>
      );
      switch (block.fieldType) {
        case 'MULTI_LINE_TEXT':
          return (
            <div>
              {label}
              <StyledTextarea placeholder={block.placeholder ?? ''} disabled />
            </div>
          );
        case 'SINGLE_CHECKBOX':
          return (
            <StyledOptionRow>
              <input type="checkbox" disabled />
              {block.label}
              {block.required && <StyledRequiredMark>*</StyledRequiredMark>}
            </StyledOptionRow>
          );
        case 'MULTIPLE_CHECKBOXES':
          return (
            <div>
              {label}
              <StyledOptionList>
                {(block.options ?? []).map((opt) => (
                  <StyledOptionRow key={opt.id}>
                    <input type="checkbox" disabled />
                    {opt.label}
                  </StyledOptionRow>
                ))}
              </StyledOptionList>
            </div>
          );
        case 'RADIO':
          return (
            <div>
              {label}
              <StyledOptionList>
                {(block.options ?? []).map((opt) => (
                  <StyledOptionRow key={opt.id}>
                    <input type="radio" name={block.name} disabled />
                    {opt.label}
                  </StyledOptionRow>
                ))}
              </StyledOptionList>
            </div>
          );
        case 'DROPDOWN':
          return (
            <div>
              {label}
              <StyledInput as="select" disabled>
                <option>{block.placeholder ?? 'Choose…'}</option>
                {(block.options ?? []).map((opt) => (
                  <option key={opt.id}>{opt.label}</option>
                ))}
              </StyledInput>
            </div>
          );
        case 'FILE':
          return (
            <div>
              {label}
              <StyledNotice>⎙ File upload — drag &amp; drop or click</StyledNotice>
            </div>
          );
        default:
          return (
            <div>
              {label}
              <StyledInput
                type={
                  block.fieldType === 'EMAIL'
                    ? 'email'
                    : block.fieldType === 'NUMBER'
                      ? 'number'
                      : block.fieldType === 'PHONE'
                        ? 'tel'
                        : block.fieldType === 'DATE'
                          ? 'date'
                          : 'text'
                }
                placeholder={block.placeholder ?? ''}
                disabled
              />
            </div>
          );
      }
    }
  }
};

const blockTypeLabel = (block: FormBlock): string => {
  if (block.kind === 'field') {
    const map: Record<string, string> = {
      EMAIL: 'Email',
      SINGLE_LINE_TEXT: 'Abc',
      NUMBER: '123',
      SINGLE_CHECKBOX: '☑',
      MULTIPLE_CHECKBOXES: '☑☑',
      MULTI_LINE_TEXT: '¶',
      RADIO: '◉',
      FILE: 'File',
      DROPDOWN: '▾',
      DATE: '📅',
      PHONE: 'Tel',
      RECORD: 'Rec',
    };
    return map[block.fieldType] ?? 'Field';
  }
  return block.kind.charAt(0).toUpperCase() + block.kind.slice(1);
};

export const FormBlockOnCanvas = ({
  block,
  selected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove,
}: FormBlockOnCanvasProps) => {
  return (
    <StyledWrapper
      selected={selected}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <StyledToolbar
        className="form-block-toolbar"
        visible={selected}
        onClick={(e) => e.stopPropagation()}
      >
        <StyledToolbarChip>{blockTypeLabel(block)}</StyledToolbarChip>
        <StyledToolbarDot />
        <StyledToolbarButton
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          title="Move up"
        >
          ↑
        </StyledToolbarButton>
        <StyledToolbarButton
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          title="Move down"
        >
          ↓
        </StyledToolbarButton>
        <StyledToolbarButton
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          title="Duplicate"
        >
          ⎘
        </StyledToolbarButton>
        <StyledToolbarButton
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          title="Delete"
        >
          🗑
        </StyledToolbarButton>
      </StyledToolbar>
      {renderBlock(block)}
    </StyledWrapper>
  );
};
