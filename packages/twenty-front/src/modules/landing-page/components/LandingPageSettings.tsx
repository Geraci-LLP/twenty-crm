import { FormTextFieldInput } from '@/object-record/record-field/ui/form-types/components/FormTextFieldInput';
import { InputLabel } from '@/ui/input/components/InputLabel';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { themeCssVariables } from 'twenty-ui/theme-constants';

export type LandingPageSettingsData = {
  slug: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
};

type LandingPageSettingsProps = {
  settings: LandingPageSettingsData;
  onSettingsChange: (settings: Partial<LandingPageSettingsData>) => void;
};

const StyledSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledSectionLabel = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  text-transform: uppercase;
`;

const StyledFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

export const LandingPageSettings = ({
  settings,
  onSettingsChange,
}: LandingPageSettingsProps) => {
  return (
    <StyledSettingsContainer>
      <StyledSectionLabel>{t`URL & SEO`}</StyledSectionLabel>

      <StyledFieldContainer>
        <InputLabel>{t`Slug`}</InputLabel>
        <FormTextFieldInput
          defaultValue={settings.slug ?? ''}
          onChange={(value) => onSettingsChange({ slug: value || null })}
          placeholder={t`my-landing-page`}
        />
      </StyledFieldContainer>

      <StyledFieldContainer>
        <InputLabel>{t`Meta Title`}</InputLabel>
        <FormTextFieldInput
          defaultValue={settings.metaTitle ?? ''}
          onChange={(value) => onSettingsChange({ metaTitle: value || null })}
          placeholder={t`Page title for search engines`}
        />
      </StyledFieldContainer>

      <StyledFieldContainer>
        <InputLabel>{t`Meta Description`}</InputLabel>
        <FormTextFieldInput
          defaultValue={settings.metaDescription ?? ''}
          onChange={(value) =>
            onSettingsChange({ metaDescription: value || null })
          }
          placeholder={t`Page description for search engines`}
        />
      </StyledFieldContainer>
    </StyledSettingsContainer>
  );
};
