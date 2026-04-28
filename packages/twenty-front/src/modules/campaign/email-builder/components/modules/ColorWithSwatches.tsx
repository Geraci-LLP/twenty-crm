import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

// Reusable color input with a row of preset swatches above. Swatches are a
// small palette of common email-friendly colors so users can pick a brand
// hue without fiddling with the OS color picker. Click a swatch to apply,
// or use the native picker for anything custom.

/* oxlint-disable twenty/no-hardcoded-colors */
// Preset palette is intentionally hardcoded — these are content-design swatches
// that users pick from for the email body, not chrome that should follow the
// app theme. Same rationale applies elsewhere in the email-builder defaults.
const DEFAULT_SWATCHES: ReadonlyArray<string> = [
  '#000000',
  '#1a1a18',
  '#1f2937',
  '#ffffff',
  '#f4f5f7',
  '#e5e7eb',
  '#2563eb',
  '#16a34a',
  '#dc2626',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
];
/* oxlint-enable twenty/no-hardcoded-colors */

const StyledWrap = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledColorInput = styled.input`
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  cursor: pointer;
  height: 28px;
  padding: 2px;
  width: 36px;
`;

const StyledSwatchRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
`;

const StyledSwatch = styled.button<{ swatchColor: string; selected: boolean }>`
  background: ${(p) => p.swatchColor};
  border: ${(p) =>
    p.selected
      ? `2px solid ${themeCssVariables.color.blue}`
      : `1px solid ${themeCssVariables.border.color.medium}`};
  border-radius: ${themeCssVariables.border.radius.sm};
  cursor: pointer;
  height: 18px;
  padding: 0;
  width: 18px;
  &:hover {
    border-color: ${themeCssVariables.color.blue};
  }
`;

type ColorWithSwatchesProps = {
  value: string;
  onChange: (next: string) => void;
  title?: string;
  swatches?: ReadonlyArray<string>;
};

export const ColorWithSwatches = ({
  value,
  onChange,
  title,
  swatches = DEFAULT_SWATCHES,
}: ColorWithSwatchesProps) => (
  <StyledWrap>
    <StyledColorInput
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      title={title}
    />
    <StyledSwatchRow>
      {swatches.map((c) => (
        <StyledSwatch
          key={c}
          type="button"
          swatchColor={c}
          selected={value.toLowerCase() === c.toLowerCase()}
          onClick={() => onChange(c)}
          title={c}
        />
      ))}
    </StyledSwatchRow>
  </StyledWrap>
);
