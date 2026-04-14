import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { v4 } from 'uuid';

type LandingPageSection = {
  id: string;
  type: 'HERO' | 'TEXT' | 'FORM_EMBED' | 'CTA' | 'IMAGE';
  config: Record<string, unknown>;
};

type LandingPageSectionEditorProps = {
  sections: LandingPageSection[];
  onSectionsChange: (sections: LandingPageSection[]) => void;
};

const SECTION_TYPES = [
  { value: 'HERO' as const, label: 'Hero' },
  { value: 'TEXT' as const, label: 'Text Block' },
  { value: 'FORM_EMBED' as const, label: 'Form Embed' },
  { value: 'CTA' as const, label: 'Call to Action' },
  { value: 'IMAGE' as const, label: 'Image' },
];

const StyledEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledSectionCard = styled.div`
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]};
`;

const StyledSectionHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const StyledSectionType = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledRemoveButton = styled.button`
  background: none;
  border: none;
  color: ${themeCssVariables.font.color.danger};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.xs};
  padding: ${themeCssVariables.spacing[1]};
`;

const StyledConfigInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[2]};
  width: 100%;
`;

const StyledConfigTextarea = styled.textarea`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: inherit;
  font-size: ${themeCssVariables.font.size.sm};
  min-height: 80px;
  padding: ${themeCssVariables.spacing[2]};
  resize: vertical;
  width: 100%;
`;

const StyledAddMenu = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[1]};
  padding: ${themeCssVariables.spacing[2]};
`;

const StyledAddMenuItem = styled.button`
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.xs};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.xs};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};

  &:hover {
    background: ${themeCssVariables.background.tertiary};
  }
`;

const StyledEmptyState = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[8]};
  text-align: center;
`;

const StyledLabel = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
`;

const getDefaultConfig = (
  type: LandingPageSection['type'],
): Record<string, unknown> => {
  switch (type) {
    case 'HERO':
      return { heading: '', subheading: '', buttonText: '', buttonUrl: '' };
    case 'TEXT':
      return { content: '' };
    case 'FORM_EMBED':
      return { formId: '' };
    case 'CTA':
      return { heading: '', buttonText: '', buttonUrl: '' };
    case 'IMAGE':
      return { src: '', alt: '' };
  }
};

export const LandingPageSectionEditor = ({
  sections,
  onSectionsChange,
}: LandingPageSectionEditorProps) => {
  const addSection = (type: LandingPageSection['type']) => {
    onSectionsChange([
      ...sections,
      { id: v4(), type, config: getDefaultConfig(type) },
    ]);
  };

  const removeSection = (id: string) => {
    onSectionsChange(sections.filter((s) => s.id !== id));
  };

  const updateSectionConfig = (id: string, key: string, value: unknown) => {
    onSectionsChange(
      sections.map((s) =>
        s.id === id ? { ...s, config: { ...s.config, [key]: value } } : s,
      ),
    );
  };

  const renderSectionConfigEditor = (section: LandingPageSection) => {
    switch (section.type) {
      case 'HERO':
        return (
          <>
            <StyledLabel>{t`Heading`}</StyledLabel>
            <StyledConfigInput
              value={(section.config.heading as string) ?? ''}
              onChange={(e) =>
                updateSectionConfig(section.id, 'heading', e.target.value)
              }
              placeholder={t`Enter heading`}
            />
            <StyledLabel>{t`Subheading`}</StyledLabel>
            <StyledConfigInput
              value={(section.config.subheading as string) ?? ''}
              onChange={(e) =>
                updateSectionConfig(section.id, 'subheading', e.target.value)
              }
              placeholder={t`Enter subheading`}
            />
            <StyledLabel>{t`Button Text`}</StyledLabel>
            <StyledConfigInput
              value={(section.config.buttonText as string) ?? ''}
              onChange={(e) =>
                updateSectionConfig(section.id, 'buttonText', e.target.value)
              }
              placeholder={t`Get Started`}
            />
            <StyledLabel>{t`Button URL`}</StyledLabel>
            <StyledConfigInput
              value={(section.config.buttonUrl as string) ?? ''}
              onChange={(e) =>
                updateSectionConfig(section.id, 'buttonUrl', e.target.value)
              }
              placeholder="https://"
            />
          </>
        );
      case 'TEXT':
        return (
          <>
            <StyledLabel>{t`Content`}</StyledLabel>
            <StyledConfigTextarea
              value={(section.config.content as string) ?? ''}
              onChange={(e) =>
                updateSectionConfig(section.id, 'content', e.target.value)
              }
              placeholder={t`Enter text content`}
            />
          </>
        );
      case 'FORM_EMBED':
        return (
          <>
            <StyledLabel>{t`Form ID`}</StyledLabel>
            <StyledConfigInput
              value={(section.config.formId as string) ?? ''}
              onChange={(e) =>
                updateSectionConfig(section.id, 'formId', e.target.value)
              }
              placeholder={t`Enter the form ID to embed`}
            />
          </>
        );
      case 'CTA':
        return (
          <>
            <StyledLabel>{t`Heading`}</StyledLabel>
            <StyledConfigInput
              value={(section.config.heading as string) ?? ''}
              onChange={(e) =>
                updateSectionConfig(section.id, 'heading', e.target.value)
              }
              placeholder={t`Enter CTA heading`}
            />
            <StyledLabel>{t`Button Text`}</StyledLabel>
            <StyledConfigInput
              value={(section.config.buttonText as string) ?? ''}
              onChange={(e) =>
                updateSectionConfig(section.id, 'buttonText', e.target.value)
              }
              placeholder={t`Click Here`}
            />
            <StyledLabel>{t`Button URL`}</StyledLabel>
            <StyledConfigInput
              value={(section.config.buttonUrl as string) ?? ''}
              onChange={(e) =>
                updateSectionConfig(section.id, 'buttonUrl', e.target.value)
              }
              placeholder="https://"
            />
          </>
        );
      case 'IMAGE':
        return (
          <>
            <StyledLabel>{t`Image URL`}</StyledLabel>
            <StyledConfigInput
              value={(section.config.src as string) ?? ''}
              onChange={(e) =>
                updateSectionConfig(section.id, 'src', e.target.value)
              }
              placeholder="https://example.com/image.jpg"
            />
            <StyledLabel>{t`Alt Text`}</StyledLabel>
            <StyledConfigInput
              value={(section.config.alt as string) ?? ''}
              onChange={(e) =>
                updateSectionConfig(section.id, 'alt', e.target.value)
              }
              placeholder={t`Image description`}
            />
          </>
        );
    }
  };

  const getSectionLabel = (type: LandingPageSection['type']) =>
    SECTION_TYPES.find((s) => s.value === type)?.label ?? type;

  return (
    <StyledEditorContainer>
      {sections.length === 0 && (
        <StyledEmptyState>
          {t`No sections yet. Add a section to get started.`}
        </StyledEmptyState>
      )}

      {sections.map((section) => (
        <StyledSectionCard key={section.id}>
          <StyledSectionHeader>
            <StyledSectionType>
              {getSectionLabel(section.type)}
            </StyledSectionType>
            <StyledRemoveButton onClick={() => removeSection(section.id)}>
              {t`Remove`}
            </StyledRemoveButton>
          </StyledSectionHeader>
          {renderSectionConfigEditor(section)}
        </StyledSectionCard>
      ))}

      <StyledAddMenu>
        {SECTION_TYPES.map((sectionType) => (
          <StyledAddMenuItem
            key={sectionType.value}
            onClick={() => addSection(sectionType.value)}
          >
            {sectionType.label}
          </StyledAddMenuItem>
        ))}
      </StyledAddMenu>
    </StyledEditorContainer>
  );
};
