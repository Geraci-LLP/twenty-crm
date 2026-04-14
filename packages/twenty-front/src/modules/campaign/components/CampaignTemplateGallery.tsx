import { styled } from '@linaria/react';
import { useCallback, useState } from 'react';

import {
  type CampaignTemplateRecord,
  useFindCampaignTemplates,
} from '@/campaign/hooks/useFindCampaignTemplates';
import { useLoadTemplate } from '@/campaign/hooks/useLoadTemplate';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const CATEGORIES = [
  'ALL',
  'NEWSLETTER',
  'FOLLOW_UP',
  'ANNOUNCEMENT',
  'CONFERENCE',
  'CUSTOM',
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  ALL: 'All',
  NEWSLETTER: 'Newsletter',
  FOLLOW_UP: 'Follow-Up',
  ANNOUNCEMENT: 'Announcement',
  CONFERENCE: 'Conference',
  CUSTOM: 'Custom',
};

type CampaignTemplateGalleryProps = {
  campaignId: string;
  onClose: () => void;
  onLoaded: () => void;
};

const StyledOverlay = styled.div`
  background: ${themeCssVariables.background.overlaySecondary};
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
`;

const StyledModal = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  box-shadow: ${themeCssVariables.boxShadow.strong};
  display: flex;
  flex-direction: column;
  left: 50%;
  max-height: 80vh;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(700px, 90vw);
  z-index: 1001;
`;

const StyledModalHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[5]} ${themeCssVariables.spacing[6]};
`;

const StyledModalTitle = styled.h3`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledCloseButton = styled.button`
  background: none;
  border: none;
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.lg};
  line-height: 1;
  padding: ${themeCssVariables.spacing[1]};

  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledCategoryBar = styled.div`
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
  overflow-x: auto;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[6]};
`;

const StyledCategoryTab = styled.button<{ isActive: boolean }>`
  background: ${({ isActive }) =>
    isActive ? themeCssVariables.color.blue : 'none'};
  border: 1px solid
    ${({ isActive }) =>
      isActive
        ? themeCssVariables.color.blue
        : themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.color.inverted
      : themeCssVariables.font.color.secondary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[3]};
  white-space: nowrap;

  &:hover {
    opacity: 0.85;
  }
`;

const StyledGrid = styled.div`
  display: grid;
  flex: 1;
  gap: ${themeCssVariables.spacing[4]};
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  overflow-y: auto;
  padding: ${themeCssVariables.spacing[5]} ${themeCssVariables.spacing[6]};
`;

const StyledCard = styled.button`
  align-items: flex-start;
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]};
  text-align: left;
  transition: border-color 150ms ease;

  &:hover {
    border-color: ${themeCssVariables.color.blue};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledCardName = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

const StyledCardSubject = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

const StyledCategoryChip = styled.span`
  background: ${themeCssVariables.background.tertiary};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  padding: 2px ${themeCssVariables.spacing[1]};
`;

const StyledEmptyState = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[8]};
  text-align: center;
`;

export const CampaignTemplateGallery = ({
  campaignId,
  onClose,
  onLoaded,
}: CampaignTemplateGalleryProps) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(
    null,
  );

  const { templates, loading } = useFindCampaignTemplates();
  const { loadTemplate } = useLoadTemplate();

  const filtered =
    activeCategory === 'ALL'
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  const handleApply = useCallback(
    async (template: CampaignTemplateRecord) => {
      setLoadingTemplateId(template.id);
      const success = await loadTemplate(template.id, campaignId);
      setLoadingTemplateId(null);

      if (success) {
        onLoaded();
        onClose();
      }
    },
    [campaignId, loadTemplate, onClose, onLoaded],
  );

  return (
    <>
      <StyledOverlay onClick={onClose} />
      <StyledModal>
        <StyledModalHeader>
          <StyledModalTitle>Choose a Template</StyledModalTitle>
          <StyledCloseButton onClick={onClose}>✕</StyledCloseButton>
        </StyledModalHeader>

        <StyledCategoryBar>
          {CATEGORIES.map((cat) => (
            <StyledCategoryTab
              key={cat}
              isActive={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {CATEGORY_LABELS[cat]}
            </StyledCategoryTab>
          ))}
        </StyledCategoryBar>

        <StyledGrid>
          {loading && <StyledEmptyState>Loading templates...</StyledEmptyState>}
          {!loading && filtered.length === 0 && (
            <StyledEmptyState>No templates found.</StyledEmptyState>
          )}
          {!loading &&
            filtered.map((template) => (
              <StyledCard
                key={template.id}
                disabled={loadingTemplateId === template.id}
                onClick={() => handleApply(template)}
              >
                <StyledCategoryChip>
                  {CATEGORY_LABELS[template.category as CategoryFilter] ??
                    template.category}
                </StyledCategoryChip>
                <StyledCardName>{template.name ?? 'Untitled'}</StyledCardName>
                {template.subject && (
                  <StyledCardSubject title={template.subject}>
                    {template.subject}
                  </StyledCardSubject>
                )}
              </StyledCard>
            ))}
        </StyledGrid>
      </StyledModal>
    </>
  );
};
