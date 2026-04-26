import { styled } from '@linaria/react';
import { useCallback, useMemo, useState } from 'react';

import {
  buildDefaultModule,
  EMPTY_EMAIL_DESIGN,
  MODULE_LIBRARY,
} from '@/campaign/email-builder/constants/EmailBuilderDefaults';
import { ButtonModuleEditor } from '@/campaign/email-builder/components/modules/ButtonModuleEditor';
import { ImageModuleEditor } from '@/campaign/email-builder/components/modules/ImageModuleEditor';
import { TextModuleEditor } from '@/campaign/email-builder/components/modules/TextModuleEditor';
import { renderDesignToHtml } from '@/campaign/email-builder/render/renderDesignToHtml';
import {
  type EmailDesign,
  type EmailModule,
  type EmailModuleType,
} from '@/campaign/email-builder/types/CampaignDesign';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledLayout = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[4]};
  grid-template-columns: 1fr;
`;

const StyledPreviewFrame = styled.iframe`
  background: ${themeCssVariables.background.tertiary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  height: 480px;
  width: 100%;
`;

const StyledModuleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledModuleRow = styled.div<{ selected: boolean }>`
  background: ${(p) =>
    p.selected
      ? themeCssVariables.background.tertiary
      : themeCssVariables.background.primary};
  border: 1px solid
    ${(p) =>
      p.selected
        ? themeCssVariables.color.blue
        : themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  padding: ${themeCssVariables.spacing[2]};
`;

const StyledModuleHeader = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: space-between;
`;

const StyledModuleHeaderLeft = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex: 1;
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledIconButton = styled.button`
  background: transparent;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  &:hover { background: ${themeCssVariables.background.tertiary}; }
  &:disabled { cursor: not-allowed; opacity: 0.4; }
`;

const StyledEditorPanel = styled.div`
  background: ${themeCssVariables.background.tertiary};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  margin-top: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]};
`;

const StyledAddRow = styled.div`
  border: 1px dashed ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: center;
  padding: ${themeCssVariables.spacing[3]};
`;

const StyledAddButton = styled.button`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  &:hover { background: ${themeCssVariables.background.tertiary}; }
`;

type EmailBuilderProps = {
  design: EmailDesign;
  onChange: (next: EmailDesign, renderedHtml: string) => void;
  readOnly?: boolean;
};

const moduleSummary = (m: EmailModule): string => {
  switch (m.type) {
    case 'text':
      return m.html.replace(/<[^>]+>/g, '').slice(0, 60) || '(empty text)';
    case 'button':
      return `Button: ${m.label}`;
    case 'image':
      return `Image: ${m.alt || m.src.slice(0, 60)}`;
  }
};

// PR 1: single-section, single-column. Modules are added/removed/reordered
// within sections[0].modules. Multi-section + columns come in PR 2a.
export const EmailBuilder = ({ design, onChange, readOnly = false }: EmailBuilderProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const section = design.sections[0];
  const modules = section?.modules ?? [];

  const renderedHtml = useMemo(() => renderDesignToHtml(design), [design]);

  const updateModules = useCallback(
    (next: EmailModule[]) => {
      if (!section) return;
      const nextDesign: EmailDesign = {
        ...design,
        sections: [{ ...section, modules: next }, ...design.sections.slice(1)],
      };
      onChange(nextDesign, renderDesignToHtml(nextDesign));
    },
    [design, onChange, section],
  );

  const handleModuleChange = useCallback(
    (id: string, next: EmailModule) => {
      updateModules(modules.map((m) => (m.id === id ? next : m)));
    },
    [modules, updateModules],
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (selectedId === id) setSelectedId(null);
      updateModules(modules.filter((m) => m.id !== id));
    },
    [modules, selectedId, updateModules],
  );

  const handleMove = useCallback(
    (id: string, direction: -1 | 1) => {
      const idx = modules.findIndex((m) => m.id === id);
      const target = idx + direction;
      if (idx < 0 || target < 0 || target >= modules.length) return;
      const next = modules.slice();
      [next[idx], next[target]] = [next[target], next[idx]];
      updateModules(next);
    },
    [modules, updateModules],
  );

  const handleAdd = useCallback(
    (type: EmailModuleType) => {
      const next = [...modules, buildDefaultModule(type)];
      updateModules(next);
      setSelectedId(next[next.length - 1].id);
    },
    [modules, updateModules],
  );

  return (
    <StyledLayout>
      <StyledPreviewFrame
        title="Email preview"
        srcDoc={renderedHtml}
        sandbox="allow-same-origin"
      />

      <StyledModuleList>
        {modules.map((m, idx) => {
          const isSelected = selectedId === m.id;
          return (
            <StyledModuleRow key={m.id} selected={isSelected}>
              <StyledModuleHeader>
                <StyledModuleHeaderLeft
                  onClick={() => setSelectedId(isSelected ? null : m.id)}
                >
                  <span>{m.type.toUpperCase()}</span>
                  <span style={{ color: 'var(--font-color-tertiary)' }}>
                    {moduleSummary(m)}
                  </span>
                </StyledModuleHeaderLeft>
                {!readOnly && (
                  <>
                    <StyledIconButton
                      onClick={() => handleMove(m.id, -1)}
                      disabled={idx === 0}
                      title="Move up"
                    >↑</StyledIconButton>
                    <StyledIconButton
                      onClick={() => handleMove(m.id, +1)}
                      disabled={idx === modules.length - 1}
                      title="Move down"
                    >↓</StyledIconButton>
                    <StyledIconButton
                      onClick={() => handleDelete(m.id)}
                      title="Delete"
                    >✕</StyledIconButton>
                  </>
                )}
              </StyledModuleHeader>
              {isSelected && !readOnly && (
                <StyledEditorPanel>
                  {m.type === 'text' && (
                    <TextModuleEditor
                      module={m}
                      onChange={(next) => handleModuleChange(m.id, next)}
                    />
                  )}
                  {m.type === 'button' && (
                    <ButtonModuleEditor
                      module={m}
                      onChange={(next) => handleModuleChange(m.id, next)}
                    />
                  )}
                  {m.type === 'image' && (
                    <ImageModuleEditor
                      module={m}
                      onChange={(next) => handleModuleChange(m.id, next)}
                    />
                  )}
                </StyledEditorPanel>
              )}
            </StyledModuleRow>
          );
        })}
      </StyledModuleList>

      {!readOnly && (
        <StyledAddRow>
          {MODULE_LIBRARY.map((m) => (
            <StyledAddButton key={m.type} onClick={() => handleAdd(m.type)}>
              + {m.label}
            </StyledAddButton>
          ))}
        </StyledAddRow>
      )}
    </StyledLayout>
  );
};

export const buildEmptyDesign = (): EmailDesign => EMPTY_EMAIL_DESIGN;

export const renderEmailDesign = renderDesignToHtml;

// Renders an existing bodyHtml into a single-text-module design for upgrades from
// legacy emails that have only HTML and no design tree.
export const wrapHtmlAsDesign = (html: string): EmailDesign => ({
  ...EMPTY_EMAIL_DESIGN,
  sections: [
    {
      id: `section_legacy_${Date.now().toString(36)}`,
      bgColor: '#ffffff',
      paddingTop: 0,
      paddingBottom: 0,
      modules: [
        {
          id: `mod_legacy_${Date.now().toString(36)}`,
          type: 'text',
          html,
          alignment: 'left',
          fontSize: 16,
          textColor: '#1f2937',
          paddingTop: 0,
          paddingBottom: 0,
        },
      ],
    },
  ],
});
