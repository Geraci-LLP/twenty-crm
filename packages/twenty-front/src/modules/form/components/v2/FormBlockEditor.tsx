import { styled } from '@linaria/react';
import { v4 } from 'uuid';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { type FormBlock } from '@/form/components/v2/types';

// Right-rail editor for whichever block is currently selected.
// Branches on block.kind; each branch shows the relevant fields.
// Pinned to the right edge of the screen so the canvas keeps
// rendering live updates as the user types.

type FormBlockEditorProps = {
  block: FormBlock;
  onChange: (next: FormBlock) => void;
  onClose: () => void;
};

// The parent (FormBuilderCanvas's StyledRightPanel) owns positioning
// and width; this is just a flex container for the editor body.
const StyledPanel = styled.div`
  background: ${themeCssVariables.background.primary};
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

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

const StyledFieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px 4px;
`;

const StyledLabel = styled.label`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const StyledInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  padding: 6px 10px;
`;

const StyledTextarea = styled.textarea`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  min-height: 100px;
  padding: 6px 10px;
  resize: vertical;
`;

const StyledSelect = styled.select`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  padding: 6px 10px;
`;

const StyledToggleRow = styled.label`
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: 8px;
  padding: 8px 16px;
`;

const StyledOptionsBlock = styled.div`
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  margin: 8px 16px;
  padding: 8px;
`;

const StyledSmallButton = styled.button`
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: 12px;
  padding: 4px 10px;
  &:hover {
    background: ${themeCssVariables.background.transparent.medium};
  }
`;

const StyledRow = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr 1fr;
  padding: 0 16px;
`;

const titleForBlock = (block: FormBlock): string => {
  switch (block.kind) {
    case 'field':
      return `Field — ${block.label}`;
    case 'submit':
      return 'Submit button';
    case 'heading':
      return 'Heading';
    case 'paragraph':
      return 'Paragraph (Rich Text)';
    case 'image':
      return 'Image';
    case 'recaptcha':
      return 'reCAPTCHA';
    case 'dataPrivacy':
      return 'Data Privacy';
  }
};

export const FormBlockEditor = ({
  block,
  onChange,
  onClose,
}: FormBlockEditorProps) => {
  return (
    <StyledPanel>
      <StyledHeader>
        <StyledTitle>{titleForBlock(block)}</StyledTitle>
        <StyledClose onClick={onClose} aria-label="Close editor">
          ×
        </StyledClose>
      </StyledHeader>

      {block.kind === 'field' && (
        <>
          <StyledFieldRow>
            <StyledLabel>Label</StyledLabel>
            <StyledInput
              value={block.label}
              onChange={(e) => onChange({ ...block, label: e.target.value })}
            />
          </StyledFieldRow>
          <StyledFieldRow>
            <StyledLabel>Field name (JSON key)</StyledLabel>
            <StyledInput
              value={block.name}
              onChange={(e) => onChange({ ...block, name: e.target.value })}
            />
          </StyledFieldRow>
          <StyledFieldRow>
            <StyledLabel>Placeholder</StyledLabel>
            <StyledInput
              value={block.placeholder ?? ''}
              onChange={(e) =>
                onChange({ ...block, placeholder: e.target.value })
              }
            />
          </StyledFieldRow>
          <StyledToggleRow>
            <input
              type="checkbox"
              checked={block.required ?? false}
              onChange={(e) =>
                onChange({ ...block, required: e.target.checked })
              }
            />
            Required
          </StyledToggleRow>
          {(block.fieldType === 'DROPDOWN' ||
            block.fieldType === 'RADIO' ||
            block.fieldType === 'MULTIPLE_CHECKBOXES') && (
            <>
              <StyledFieldRow>
                <StyledLabel>Options</StyledLabel>
              </StyledFieldRow>
              {(block.options ?? []).map((opt, idx) => (
                <StyledOptionsBlock key={opt.id}>
                  <StyledRow>
                    <StyledInput
                      value={opt.label}
                      placeholder="Label"
                      onChange={(e) =>
                        onChange({
                          ...block,
                          options: (block.options ?? []).map((o, i) =>
                            i === idx ? { ...o, label: e.target.value } : o,
                          ),
                        })
                      }
                    />
                    <StyledInput
                      value={opt.value}
                      placeholder="Value"
                      onChange={(e) =>
                        onChange({
                          ...block,
                          options: (block.options ?? []).map((o, i) =>
                            i === idx ? { ...o, value: e.target.value } : o,
                          ),
                        })
                      }
                    />
                  </StyledRow>
                  <div style={{ marginTop: 6 }}>
                    <StyledSmallButton
                      onClick={() =>
                        onChange({
                          ...block,
                          options: (block.options ?? []).filter(
                            (_, i) => i !== idx,
                          ),
                        })
                      }
                    >
                      Remove
                    </StyledSmallButton>
                  </div>
                </StyledOptionsBlock>
              ))}
              <StyledFieldRow>
                <StyledSmallButton
                  onClick={() =>
                    onChange({
                      ...block,
                      options: [
                        ...(block.options ?? []),
                        { id: v4(), label: 'New option', value: 'new_option' },
                      ],
                    })
                  }
                >
                  + Add option
                </StyledSmallButton>
              </StyledFieldRow>
            </>
          )}
        </>
      )}

      {block.kind === 'submit' && (
        <StyledFieldRow>
          <StyledLabel>Button label</StyledLabel>
          <StyledInput
            value={block.label}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
          />
        </StyledFieldRow>
      )}

      {block.kind === 'heading' && (
        <>
          <StyledFieldRow>
            <StyledLabel>Text</StyledLabel>
            <StyledInput
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
            />
          </StyledFieldRow>
          <StyledRow>
            <div>
              <StyledLabel>Level</StyledLabel>
              <StyledSelect
                value={block.level}
                onChange={(e) =>
                  onChange({
                    ...block,
                    level: e.target.value as 'h1' | 'h2' | 'h3',
                  })
                }
              >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
              </StyledSelect>
            </div>
            <div>
              <StyledLabel>Alignment</StyledLabel>
              <StyledSelect
                value={block.alignment}
                onChange={(e) =>
                  onChange({
                    ...block,
                    alignment: e.target.value as 'left' | 'center' | 'right',
                  })
                }
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </StyledSelect>
            </div>
          </StyledRow>
        </>
      )}

      {block.kind === 'paragraph' && (
        <StyledFieldRow>
          <StyledLabel>Content (HTML allowed)</StyledLabel>
          <StyledTextarea
            value={block.html}
            onChange={(e) => onChange({ ...block, html: e.target.value })}
          />
        </StyledFieldRow>
      )}

      {block.kind === 'image' && (
        <>
          <StyledFieldRow>
            <StyledLabel>Image URL</StyledLabel>
            <StyledInput
              value={block.src}
              onChange={(e) => onChange({ ...block, src: e.target.value })}
              placeholder="https://"
            />
          </StyledFieldRow>
          <StyledFieldRow>
            <StyledLabel>Alt text</StyledLabel>
            <StyledInput
              value={block.alt}
              onChange={(e) => onChange({ ...block, alt: e.target.value })}
            />
          </StyledFieldRow>
        </>
      )}

      {block.kind === 'recaptcha' && (
        <StyledFieldRow>
          <StyledLabel>Where to configure</StyledLabel>
          <div
            style={{
              fontSize: 12,
              color: 'inherit',
              opacity: 0.7,
            }}
          >
            reCAPTCHA / Turnstile validation runs server-side. Configure the
            secret key + per-form site key in the Settings tab.
          </div>
        </StyledFieldRow>
      )}

      {block.kind === 'dataPrivacy' && (
        <>
          <StyledFieldRow>
            <StyledLabel>Consent text (above checkbox)</StyledLabel>
            <StyledTextarea
              value={block.consentText}
              onChange={(e) =>
                onChange({ ...block, consentText: e.target.value })
              }
            />
          </StyledFieldRow>
          <StyledFieldRow>
            <StyledLabel>Checkbox label</StyledLabel>
            <StyledInput
              value={block.consentLabel}
              onChange={(e) =>
                onChange({ ...block, consentLabel: e.target.value })
              }
            />
          </StyledFieldRow>
          <StyledToggleRow>
            <input
              type="checkbox"
              checked={block.required}
              onChange={(e) =>
                onChange({ ...block, required: e.target.checked })
              }
            />
            Required
          </StyledToggleRow>
        </>
      )}
    </StyledPanel>
  );
};
