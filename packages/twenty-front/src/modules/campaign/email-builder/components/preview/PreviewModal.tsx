/* oxlint-disable twenty/no-hardcoded-colors */
// Modal chrome (backdrop overlay, phone-frame bezel, drop shadows) uses
// fixed dark/translucent values intentionally. These are visual chrome
// elements rather than semantic theme colors — the phone mockup should
// look like a phone in both light and dark mode.
import { styled } from '@linaria/react';
import { useEffect, useMemo, useState } from 'react';
import { isDefined } from 'twenty-shared/utils';

import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import {
  type PreviewContactValues,
  substituteCampaignTokens,
} from '@/campaign/utils/substituteCampaignTokens';

const PREVIEW_PERSON_LIMIT = 50;

type PersonForPreview = ObjectRecord & {
  name: { firstName: string | null; lastName: string | null } | null;
  emails: { primaryEmail: string | null } | null;
  jobTitle: string | null;
  city: string | null;
  company: { name: string | null } | null;
};

const StyledOverlay = styled.div`
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
  height: 100vh;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 1000;
`;

const StyledTopBar = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border-bottom: 1px solid ${themeCssVariables.border.color.medium};
  display: flex;
  height: 48px;
  justify-content: space-between;
  padding: 0 ${themeCssVariables.spacing[4]};
`;

const StyledTabBar = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledTab = styled.button<{ active?: boolean }>`
  background: transparent;
  border: none;
  border-bottom: 2px solid
    ${(p) => (p.active ? themeCssVariables.color.blue : 'transparent')};
  color: ${(p) =>
    p.active
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.secondary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${(p) =>
    p.active
      ? themeCssVariables.font.weight.medium
      : themeCssVariables.font.weight.regular};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
`;

const StyledControls = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledPersonLabel = styled.span`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledPersonSelect = styled.select`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  height: 32px;
  max-width: 260px;
  padding: 0 ${themeCssVariables.spacing[2]};
`;

const StyledCloseButton = styled.button`
  background: transparent;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[3]};
  &:hover {
    background: ${themeCssVariables.background.tertiary};
  }
`;

const StyledStage = styled.div`
  align-items: flex-start;
  background: ${themeCssVariables.background.tertiary};
  display: flex;
  flex: 1;
  gap: ${themeCssVariables.spacing[6]};
  justify-content: center;
  overflow: auto;
  padding: ${themeCssVariables.spacing[6]};
`;

const StyledDesktopWrap = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  width: 720px;
`;

const StyledDesktopChrome = styled.div`
  background: ${themeCssVariables.background.tertiary};
  border-bottom: 1px solid ${themeCssVariables.border.color.medium};
  border-top-left-radius: ${themeCssVariables.border.radius.sm};
  border-top-right-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  text-align: center;
`;

const StyledDesktopFrame = styled.iframe`
  background: ${themeCssVariables.background.primary};
  border: none;
  height: 740px;
  width: 100%;
`;

const StyledMobileWrap = styled.div`
  background: #1a1a18;
  border-radius: 36px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
  flex-shrink: 0;
  padding: 12px;
  width: 400px;
`;

const StyledMobileNotch = styled.div`
  background: #1a1a18;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  height: 18px;
  margin: 0 auto 6px auto;
  width: 110px;
`;

const StyledMobileFrame = styled.iframe`
  background: ${themeCssVariables.background.primary};
  border: none;
  border-radius: 24px;
  height: 720px;
  width: 100%;
`;

const personLabel = (p: PersonForPreview): string => {
  const first = p.name?.firstName ?? '';
  const last = p.name?.lastName ?? '';
  const name = `${first} ${last}`.trim();
  const email = p.emails?.primaryEmail ?? '';
  if (name && email) return `${name} · ${email}`;
  return name || email || 'Unnamed';
};

const personToContactValues = (p: PersonForPreview): PreviewContactValues => ({
  firstName: p.name?.firstName ?? '',
  lastName: p.name?.lastName ?? '',
  email: p.emails?.primaryEmail ?? '',
  jobTitle: p.jobTitle ?? '',
  city: p.city ?? '',
  companyName: p.company?.name ?? '',
});

type PreviewModalProps = {
  html: string;
  onClose: () => void;
};

export const PreviewModal = ({ html, onClose }: PreviewModalProps) => {
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');

  const { records, loading } = useFindManyRecords<PersonForPreview>({
    objectNameSingular: CoreObjectNameSingular.Person,
    limit: PREVIEW_PERSON_LIMIT,
    recordGqlFields: {
      id: true,
      name: true,
      emails: true,
      jobTitle: true,
      city: true,
      company: { name: true },
    },
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const previewHtml = useMemo(() => {
    if (selectedPersonId === '') return html;
    const person = records.find((r) => r.id === selectedPersonId);
    if (!isDefined(person)) return html;
    return substituteCampaignTokens(html, personToContactValues(person));
  }, [html, records, selectedPersonId]);

  return (
    <StyledOverlay
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        // Close on backdrop click; ignore if click is inside the stage.
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <StyledTopBar>
        <StyledTabBar>
          <StyledTab active>Preview</StyledTab>
        </StyledTabBar>
        <StyledControls>
          <StyledPersonLabel>Preview as</StyledPersonLabel>
          <StyledPersonSelect
            value={selectedPersonId}
            onChange={(e) => setSelectedPersonId(e.target.value)}
            disabled={loading}
          >
            <option value="">Tokens unsubstituted</option>
            {records.map((p) => (
              <option key={p.id} value={p.id}>
                {personLabel(p)}
              </option>
            ))}
          </StyledPersonSelect>
          <StyledCloseButton onClick={onClose}>
            Back to editing
          </StyledCloseButton>
        </StyledControls>
      </StyledTopBar>
      <StyledStage>
        <StyledDesktopWrap>
          <StyledDesktopChrome>Desktop · 720px</StyledDesktopChrome>
          <StyledDesktopFrame
            title="Preview (desktop)"
            srcDoc={previewHtml}
            sandbox="allow-same-origin"
          />
        </StyledDesktopWrap>
        <StyledMobileWrap>
          <StyledMobileNotch />
          <StyledMobileFrame
            title="Preview (mobile)"
            srcDoc={previewHtml}
            sandbox="allow-same-origin"
          />
        </StyledMobileWrap>
      </StyledStage>
    </StyledOverlay>
  );
};
