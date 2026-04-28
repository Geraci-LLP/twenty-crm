import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

/* oxlint-disable twenty/no-hardcoded-colors -- the editor surfaces
   page-content colors via input fields with hex defaults, plus a
   subtle drop shadow on the right-rail panel. Both are intentional
   literal hex values, not theme tokens. */

import {
  generateLandingPageId,
  type ModuleLibraryEntry,
  LANDING_PAGE_MODULE_LIBRARY,
} from '@/landing-page/constants/LandingPageBuilderDefaults';
import {
  type ButtonModule,
  type DividerModule,
  type FeatureListItem,
  type FeatureListModule,
  type FormEmbedModule,
  type HeadingModule,
  type HeroModule,
  type HtmlModule,
  type ImageModule,
  type LandingPageModule,
  type NavLink,
  type NavModule,
  type SocialModule,
  type SpacerModule,
  type TextModule,
} from '@/landing-page/types/LandingPageDesign';

// Floating right-rail editor for the currently-selected module. Each
// branch renders the right input set for that module type. The editor
// is intentionally compact (one panel, plain form rows) — rich pickers
// (color swatches, image upload) can come later.

type LandingPageModuleEditorProps = {
  module: LandingPageModule;
  onChange: (next: LandingPageModule) => void;
  onClose: () => void;
};

const StyledPanel = styled.div`
  background: ${themeCssVariables.background.primary};
  border-left: 1px solid ${themeCssVariables.border.color.light};
  bottom: 0;
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  font-family: ${themeCssVariables.font.family};
  overflow-y: auto;
  padding: 14px 16px;
  position: fixed;
  right: 0;
  top: 0;
  width: 320px;
  z-index: 50;
`;

const StyledHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  gap: 8px;
  margin: 0 -16px 12px;
  padding: 0 16px 10px;
`;

const StyledTitle = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
`;

const StyledClose = styled.button`
  background: transparent;
  border: 0;
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  font-size: 18px;
  margin-left: auto;
  padding: 2px 6px;
  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledFieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
`;

const StyledFieldLabel = styled.label`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 11px;
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
  width: 100%;
`;

const StyledTextarea = styled.textarea`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  min-height: 80px;
  padding: 6px 10px;
  resize: vertical;
  width: 100%;
`;

const StyledSelect = styled.select`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  padding: 6px 10px;
  width: 100%;
`;

const StyledRow = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr 1fr;
`;

const StyledColorRow = styled.div`
  align-items: center;
  display: flex;
  gap: 6px;
`;

const StyledColorSwatch = styled.input`
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  height: 28px;
  width: 36px;
`;

const StyledItemBlock = styled.div`
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  margin-bottom: 8px;
  padding: 8px;
`;

const StyledSmallButton = styled.button`
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: 11px;
  padding: 4px 8px;
  &:hover {
    background: ${themeCssVariables.background.transparent.medium};
  }
`;

type FieldProps<T extends LandingPageModule> = {
  module: T;
  onChange: (next: T) => void;
};

const TextField = <T extends LandingPageModule>({
  module,
  onChange,
  field,
  label,
  placeholder,
}: FieldProps<T> & {
  field: keyof T;
  label: string;
  placeholder?: string;
}) => (
  <StyledFieldRow>
    <StyledFieldLabel>{label}</StyledFieldLabel>
    <StyledInput
      value={(module[field] as unknown as string) ?? ''}
      onChange={(e) => onChange({ ...module, [field]: e.target.value } as T)}
      placeholder={placeholder}
    />
  </StyledFieldRow>
);

const NumberField = <T extends LandingPageModule>({
  module,
  onChange,
  field,
  label,
  min,
  max,
}: FieldProps<T> & {
  field: keyof T;
  label: string;
  min?: number;
  max?: number;
}) => (
  <StyledFieldRow>
    <StyledFieldLabel>{label}</StyledFieldLabel>
    <StyledInput
      type="number"
      min={min}
      max={max}
      value={(module[field] as unknown as number) ?? 0}
      onChange={(e) =>
        onChange({
          ...module,
          [field]: parseInt(e.target.value, 10) || 0,
        } as T)
      }
    />
  </StyledFieldRow>
);

const ColorField = <T extends LandingPageModule>({
  module,
  onChange,
  field,
  label,
}: FieldProps<T> & { field: keyof T; label: string }) => (
  <StyledFieldRow>
    <StyledFieldLabel>{label}</StyledFieldLabel>
    <StyledColorRow>
      <StyledColorSwatch
        type="color"
        // oxlint-disable-next-line twenty/no-hardcoded-colors -- fallback
        // for missing color values; the picker needs a literal hex.
        value={(module[field] as unknown as string) ?? '#000000'}
        onChange={(e) => onChange({ ...module, [field]: e.target.value } as T)}
      />
      <StyledInput
        value={(module[field] as unknown as string) ?? ''}
        onChange={(e) => onChange({ ...module, [field]: e.target.value } as T)}
      />
    </StyledColorRow>
  </StyledFieldRow>
);

const SelectField = <T extends LandingPageModule>({
  module,
  onChange,
  field,
  label,
  options,
}: FieldProps<T> & {
  field: keyof T;
  label: string;
  options: { value: string; label: string }[];
}) => (
  <StyledFieldRow>
    <StyledFieldLabel>{label}</StyledFieldLabel>
    <StyledSelect
      value={(module[field] as unknown as string) ?? ''}
      onChange={(e) => onChange({ ...module, [field]: e.target.value } as T)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </StyledSelect>
  </StyledFieldRow>
);

const ALIGNMENT_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const renderEditor = (
  module: LandingPageModule,
  onChange: (next: LandingPageModule) => void,
): JSX.Element => {
  switch (module.type) {
    case 'heading': {
      const h = module as HeadingModule;
      return (
        <>
          <TextField module={h} onChange={onChange} field="text" label="Text" />
          <StyledRow>
            <SelectField
              module={h}
              onChange={onChange}
              field="level"
              label="Level"
              options={[
                { value: 'h1', label: 'H1' },
                { value: 'h2', label: 'H2' },
                { value: 'h3', label: 'H3' },
                { value: 'h4', label: 'H4' },
              ]}
            />
            <SelectField
              module={h}
              onChange={onChange}
              field="alignment"
              label="Align"
              options={ALIGNMENT_OPTIONS}
            />
          </StyledRow>
          <ColorField
            module={h}
            onChange={onChange}
            field="textColor"
            label="Text color"
          />
          <NumberField
            module={h}
            onChange={onChange}
            field="fontWeight"
            label="Weight"
            min={100}
            max={900}
          />
        </>
      );
    }
    case 'text': {
      const t = module as TextModule;
      return (
        <>
          <StyledFieldRow>
            <StyledFieldLabel>HTML</StyledFieldLabel>
            <StyledTextarea
              value={t.html}
              onChange={(e) => onChange({ ...t, html: e.target.value })}
            />
          </StyledFieldRow>
          <StyledRow>
            <SelectField
              module={t}
              onChange={onChange}
              field="alignment"
              label="Align"
              options={ALIGNMENT_OPTIONS}
            />
            <NumberField
              module={t}
              onChange={onChange}
              field="fontSize"
              label="Size"
              min={8}
              max={72}
            />
          </StyledRow>
          <ColorField
            module={t}
            onChange={onChange}
            field="textColor"
            label="Text color"
          />
        </>
      );
    }
    case 'button': {
      const b = module as ButtonModule;
      return (
        <>
          <TextField
            module={b}
            onChange={onChange}
            field="label"
            label="Label"
          />
          <TextField module={b} onChange={onChange} field="href" label="Link" />
          <StyledRow>
            <SelectField
              module={b}
              onChange={onChange}
              field="alignment"
              label="Align"
              options={ALIGNMENT_OPTIONS}
            />
            <SelectField
              module={b}
              onChange={onChange}
              field="variant"
              label="Style"
              options={[
                { value: 'primary', label: 'Primary' },
                { value: 'secondary', label: 'Secondary' },
                { value: 'ghost', label: 'Ghost' },
              ]}
            />
          </StyledRow>
          <StyledRow>
            <ColorField
              module={b}
              onChange={onChange}
              field="bgColor"
              label="Background"
            />
            <ColorField
              module={b}
              onChange={onChange}
              field="textColor"
              label="Text"
            />
          </StyledRow>
          <StyledRow>
            <NumberField
              module={b}
              onChange={onChange}
              field="paddingX"
              label="Pad X"
            />
            <NumberField
              module={b}
              onChange={onChange}
              field="paddingY"
              label="Pad Y"
            />
          </StyledRow>
          <NumberField
            module={b}
            onChange={onChange}
            field="borderRadius"
            label="Radius"
            min={0}
            max={999}
          />
        </>
      );
    }
    case 'image': {
      const i = module as ImageModule;
      return (
        <>
          <TextField
            module={i}
            onChange={onChange}
            field="src"
            label="Image URL"
            placeholder="https://"
          />
          <TextField
            module={i}
            onChange={onChange}
            field="alt"
            label="Alt text"
          />
          <TextField
            module={i}
            onChange={onChange}
            field="href"
            label="Link (optional)"
            placeholder="https://"
          />
          <StyledRow>
            <NumberField
              module={i}
              onChange={onChange}
              field="widthPercent"
              label="Width %"
              min={1}
              max={100}
            />
            <SelectField
              module={i}
              onChange={onChange}
              field="alignment"
              label="Align"
              options={ALIGNMENT_OPTIONS}
            />
          </StyledRow>
        </>
      );
    }
    case 'divider': {
      const d = module as DividerModule;
      return (
        <>
          <ColorField
            module={d}
            onChange={onChange}
            field="color"
            label="Color"
          />
          <StyledRow>
            <NumberField
              module={d}
              onChange={onChange}
              field="thickness"
              label="Thickness"
              min={1}
              max={20}
            />
            <NumberField
              module={d}
              onChange={onChange}
              field="widthPercent"
              label="Width %"
              min={1}
              max={100}
            />
          </StyledRow>
          <SelectField
            module={d}
            onChange={onChange}
            field="style"
            label="Style"
            options={[
              { value: 'solid', label: 'Solid' },
              { value: 'dashed', label: 'Dashed' },
              { value: 'dotted', label: 'Dotted' },
            ]}
          />
        </>
      );
    }
    case 'spacer': {
      const s = module as SpacerModule;
      return (
        <NumberField
          module={s}
          onChange={onChange}
          field="height"
          label="Height (px)"
          min={1}
          max={500}
        />
      );
    }
    case 'html': {
      const h = module as HtmlModule;
      return (
        <StyledFieldRow>
          <StyledFieldLabel>Raw HTML</StyledFieldLabel>
          <StyledTextarea
            value={h.rawHtml}
            onChange={(e) => onChange({ ...h, rawHtml: e.target.value })}
          />
        </StyledFieldRow>
      );
    }
    case 'hero': {
      const h = module as HeroModule;
      return (
        <>
          <TextField
            module={h}
            onChange={onChange}
            field="heading"
            label="Heading"
          />
          <StyledFieldRow>
            <StyledFieldLabel>Subheading</StyledFieldLabel>
            <StyledTextarea
              value={h.subheading}
              onChange={(e) => onChange({ ...h, subheading: e.target.value })}
            />
          </StyledFieldRow>
          <TextField
            module={h}
            onChange={onChange}
            field="ctaLabel"
            label="CTA label"
          />
          <TextField
            module={h}
            onChange={onChange}
            field="ctaHref"
            label="CTA link"
          />
          <TextField
            module={h}
            onChange={onChange}
            field="bgImageUrl"
            label="Background image URL"
            placeholder="https://"
          />
          <StyledRow>
            <ColorField
              module={h}
              onChange={onChange}
              field="bgColor"
              label="Background"
            />
            <ColorField
              module={h}
              onChange={onChange}
              field="textColor"
              label="Text"
            />
          </StyledRow>
          <StyledRow>
            <SelectField
              module={h}
              onChange={onChange}
              field="alignment"
              label="Align"
              options={ALIGNMENT_OPTIONS}
            />
            <NumberField
              module={h}
              onChange={onChange}
              field="minHeight"
              label="Min height"
              min={120}
              max={1200}
            />
          </StyledRow>
        </>
      );
    }
    case 'featureList': {
      const f = module as FeatureListModule;
      return (
        <>
          <SelectField
            module={f}
            onChange={onChange}
            field="layout"
            label="Layout"
            options={[
              { value: 'grid-2', label: '2 columns' },
              { value: 'grid-3', label: '3 columns' },
              { value: 'list', label: 'List' },
            ]}
          />
          <StyledRow>
            <ColorField
              module={f}
              onChange={onChange}
              field="itemBgColor"
              label="Card BG"
            />
            <ColorField
              module={f}
              onChange={onChange}
              field="iconColor"
              label="Icon"
            />
          </StyledRow>
          {f.items.map((item, idx) => (
            <StyledItemBlock key={item.id}>
              <StyledFieldLabel>Item {idx + 1}</StyledFieldLabel>
              <StyledRow>
                <StyledInput
                  value={item.icon}
                  placeholder="Icon"
                  onChange={(e) =>
                    onChange({
                      ...f,
                      items: f.items.map((it, i) =>
                        i === idx ? { ...it, icon: e.target.value } : it,
                      ),
                    })
                  }
                />
                <StyledInput
                  value={item.title}
                  placeholder="Title"
                  onChange={(e) =>
                    onChange({
                      ...f,
                      items: f.items.map((it, i) =>
                        i === idx ? { ...it, title: e.target.value } : it,
                      ),
                    })
                  }
                />
              </StyledRow>
              <StyledTextarea
                value={item.body}
                placeholder="Description"
                onChange={(e) =>
                  onChange({
                    ...f,
                    items: f.items.map((it, i) =>
                      i === idx ? { ...it, body: e.target.value } : it,
                    ),
                  })
                }
              />
              <StyledSmallButton
                type="button"
                onClick={() =>
                  onChange({
                    ...f,
                    items: f.items.filter((_, i) => i !== idx),
                  })
                }
              >
                Remove
              </StyledSmallButton>
            </StyledItemBlock>
          ))}
          <StyledSmallButton
            type="button"
            onClick={() => {
              const newItem: FeatureListItem = {
                id: generateLandingPageId('fl'),
                icon: '★',
                title: 'New feature',
                body: 'Describe this feature.',
              };
              onChange({ ...f, items: [...f.items, newItem] });
            }}
          >
            + Add item
          </StyledSmallButton>
        </>
      );
    }
    case 'formEmbed': {
      const f = module as FormEmbedModule;
      return (
        <>
          <TextField
            module={f}
            onChange={onChange}
            field="formId"
            label="Form ID"
            placeholder="UUID of a Form record"
          />
          <TextField
            module={f}
            onChange={onChange}
            field="headingOverride"
            label="Heading override"
          />
          <TextField
            module={f}
            onChange={onChange}
            field="ctaLabelOverride"
            label="CTA label override"
          />
        </>
      );
    }
    case 'nav': {
      const n = module as NavModule;
      return (
        <>
          <TextField
            module={n}
            onChange={onChange}
            field="brandText"
            label="Brand text"
          />
          <TextField
            module={n}
            onChange={onChange}
            field="brandLogoUrl"
            label="Brand logo URL"
          />
          <StyledRow>
            <ColorField
              module={n}
              onChange={onChange}
              field="bgColor"
              label="Background"
            />
            <ColorField
              module={n}
              onChange={onChange}
              field="textColor"
              label="Text"
            />
          </StyledRow>
          <TextField
            module={n}
            onChange={onChange}
            field="ctaLabel"
            label="CTA label"
          />
          <TextField
            module={n}
            onChange={onChange}
            field="ctaHref"
            label="CTA link"
          />
          <StyledFieldLabel>Links</StyledFieldLabel>
          {n.links.map((link, idx) => (
            <StyledItemBlock key={link.id}>
              <StyledRow>
                <StyledInput
                  value={link.label}
                  placeholder="Label"
                  onChange={(e) =>
                    onChange({
                      ...n,
                      links: n.links.map((l, i) =>
                        i === idx ? { ...l, label: e.target.value } : l,
                      ),
                    })
                  }
                />
                <StyledInput
                  value={link.href}
                  placeholder="Href"
                  onChange={(e) =>
                    onChange({
                      ...n,
                      links: n.links.map((l, i) =>
                        i === idx ? { ...l, href: e.target.value } : l,
                      ),
                    })
                  }
                />
              </StyledRow>
              <StyledSmallButton
                type="button"
                onClick={() =>
                  onChange({
                    ...n,
                    links: n.links.filter((_, i) => i !== idx),
                  })
                }
              >
                Remove
              </StyledSmallButton>
            </StyledItemBlock>
          ))}
          <StyledSmallButton
            type="button"
            onClick={() => {
              const newLink: NavLink = {
                id: generateLandingPageId('nl'),
                label: 'New link',
                href: '#',
              };
              onChange({ ...n, links: [...n.links, newLink] });
            }}
          >
            + Add link
          </StyledSmallButton>
        </>
      );
    }
    case 'social': {
      const s = module as SocialModule;
      return (
        <>
          <StyledRow>
            <NumberField
              module={s}
              onChange={onChange}
              field="iconSize"
              label="Size"
              min={12}
              max={64}
            />
            <NumberField
              module={s}
              onChange={onChange}
              field="spacing"
              label="Spacing"
              min={0}
              max={48}
            />
          </StyledRow>
          <SelectField
            module={s}
            onChange={onChange}
            field="alignment"
            label="Align"
            options={ALIGNMENT_OPTIONS}
          />
          <StyledFieldLabel>Links</StyledFieldLabel>
          {s.links.map((link, idx) => (
            <StyledItemBlock key={idx}>
              <StyledRow>
                <StyledSelect
                  value={link.platform}
                  onChange={(e) =>
                    onChange({
                      ...s,
                      links: s.links.map((l, i) =>
                        i === idx
                          ? {
                              ...l,
                              platform: e.target
                                .value as SocialModule['links'][number]['platform'],
                            }
                          : l,
                      ),
                    })
                  }
                >
                  <option value="twitter">Twitter / X</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                </StyledSelect>
                <StyledInput
                  value={link.href}
                  placeholder="https://"
                  onChange={(e) =>
                    onChange({
                      ...s,
                      links: s.links.map((l, i) =>
                        i === idx ? { ...l, href: e.target.value } : l,
                      ),
                    })
                  }
                />
              </StyledRow>
              <StyledSmallButton
                type="button"
                onClick={() =>
                  onChange({
                    ...s,
                    links: s.links.filter((_, i) => i !== idx),
                  })
                }
              >
                Remove
              </StyledSmallButton>
            </StyledItemBlock>
          ))}
          <StyledSmallButton
            type="button"
            onClick={() =>
              onChange({
                ...s,
                links: [...s.links, { platform: 'linkedin', href: 'https://' }],
              })
            }
          >
            + Add link
          </StyledSmallButton>
        </>
      );
    }
  }
};

export const LandingPageModuleEditor = ({
  module,
  onChange,
  onClose,
}: LandingPageModuleEditorProps) => {
  const entry: ModuleLibraryEntry | undefined =
    LANDING_PAGE_MODULE_LIBRARY.find((e) => e.type === module.type);
  const title = entry?.label ?? module.type;
  return (
    <StyledPanel>
      <StyledHeader>
        <StyledTitle>{title}</StyledTitle>
        <StyledClose
          type="button"
          onClick={onClose}
          aria-label="Close module editor"
        >
          ×
        </StyledClose>
      </StyledHeader>
      {renderEditor(module, onChange)}
    </StyledPanel>
  );
};
