import { styled } from '@linaria/react';
import { useCallback, useMemo, useState } from 'react';

import {
  buildDefaultModule,
  buildDefaultSection,
  buildEmptyColumn,
  EMPTY_EMAIL_DESIGN,
  MODULE_LIBRARY,
  SECTION_LAYOUT_LIBRARY,
} from '@/campaign/email-builder/constants/EmailBuilderDefaults';
import { ButtonModuleEditor } from '@/campaign/email-builder/components/modules/ButtonModuleEditor';
import { DividerModuleEditor } from '@/campaign/email-builder/components/modules/DividerModuleEditor';
import { ImageModuleEditor } from '@/campaign/email-builder/components/modules/ImageModuleEditor';
import { SpacerModuleEditor } from '@/campaign/email-builder/components/modules/SpacerModuleEditor';
import { TextModuleEditor } from '@/campaign/email-builder/components/modules/TextModuleEditor';
import { migrateDesign } from '@/campaign/email-builder/render/migrateDesign';
import { renderDesignToHtml } from '@/campaign/email-builder/render/renderDesignToHtml';
import {
  type ColumnLayout,
  COLUMN_WIDTHS,
  type EmailColumn,
  type EmailDesign,
  type EmailModule,
  type EmailModuleType,
  type EmailSection,
} from '@/campaign/email-builder/types/CampaignDesign';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
`;

const StyledPreviewFrame = styled.iframe`
  background: ${themeCssVariables.background.tertiary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  height: 480px;
  width: 100%;
`;

const StyledSectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledSectionCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  padding: ${themeCssVariables.spacing[2]};
`;

const StyledSectionHeader = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
  margin-bottom: ${themeCssVariables.spacing[2]};
`;

const StyledSectionLabel = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  letter-spacing: 0.5px;
  margin-right: auto;
  text-transform: uppercase;
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

const StyledSelect = styled.select`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
`;

const StyledColorInput = styled.input`
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  cursor: pointer;
  height: 28px;
  padding: 2px;
  width: 36px;
`;

const StyledColumnsRow = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledColumn = styled.div`
  background: ${themeCssVariables.background.tertiary};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  min-height: 80px;
  padding: ${themeCssVariables.spacing[2]};
`;

const StyledColumnHeader = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
  text-transform: uppercase;
`;

const StyledModuleRow = styled.div<{ selected: boolean }>`
  background: ${themeCssVariables.background.primary};
  border: 1px solid
    ${(p) =>
      p.selected
        ? themeCssVariables.color.blue
        : themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
`;

const StyledModuleHeader = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
  justify-content: space-between;
`;

const StyledModuleHeaderLeft = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex: 1;
  font-size: ${themeCssVariables.font.size.xs};
  gap: ${themeCssVariables.spacing[1]};
  min-width: 0;
`;

const StyledModuleSummary = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledEditorPanel = styled.div`
  background: ${themeCssVariables.background.transparent.lighter};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  margin-top: ${themeCssVariables.spacing[1]};
  padding: ${themeCssVariables.spacing[2]};
`;

const StyledAddModuleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[1]};
  margin-top: auto;
`;

const StyledAddModuleButton = styled.button`
  background: transparent;
  border: 1px dashed ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.xs};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  &:hover { background: ${themeCssVariables.background.primary}; color: ${themeCssVariables.font.color.primary}; }
`;

const StyledAddSectionRow = styled.div`
  align-items: center;
  border: 1px dashed ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: center;
  padding: ${themeCssVariables.spacing[3]};
`;

const StyledAddSectionButton = styled.button`
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
      return m.html.replace(/<[^>]+>/g, '').slice(0, 40) || '(empty text)';
    case 'button':
      return m.label;
    case 'image':
      return m.alt || m.src.slice(-30);
    case 'divider':
      return `${m.style} ${m.thickness}px ${m.color}`;
    case 'spacer':
      return `${m.height}px tall`;
  }
};

// Re-shapes a section's columns when the layout changes — preserves modules
// where possible, concatenates dropped columns' modules into the last kept one.
const reshapeColumns = (
  oldCols: EmailColumn[],
  newCount: number,
): EmailColumn[] => {
  if (oldCols.length === newCount) return oldCols;
  if (newCount > oldCols.length) {
    const extras = Array.from(
      { length: newCount - oldCols.length },
      () => buildEmptyColumn(),
    );
    return [...oldCols, ...extras];
  }
  // newCount < oldCols.length — fold dropped columns into the last kept one.
  const kept = oldCols.slice(0, newCount);
  const dropped = oldCols.slice(newCount);
  const lastIdx = kept.length - 1;
  if (lastIdx >= 0) {
    kept[lastIdx] = {
      ...kept[lastIdx],
      modules: [
        ...kept[lastIdx].modules,
        ...dropped.flatMap((c) => c.modules),
      ],
    };
  }
  return kept;
};

const COLUMN_COUNT_BY_LAYOUT: Record<ColumnLayout, number> = {
  '1': 1, '2': 2, '3': 3, '4': 4, '1-2': 2, '2-1': 2,
};

export const EmailBuilder = ({ design: rawDesign, onChange, readOnly = false }: EmailBuilderProps) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  // Migrate on every read so older designs (v1) work seamlessly. The next
  // user edit writes the migrated v2 shape back to the record.
  const design = useMemo(() => migrateDesign(rawDesign), [rawDesign]);
  const renderedHtml = useMemo(() => renderDesignToHtml(design), [design]);

  const updateSections = useCallback(
    (next: EmailSection[]) => {
      const nextDesign: EmailDesign = { ...design, sections: next };
      onChange(nextDesign, renderDesignToHtml(nextDesign));
    },
    [design, onChange],
  );

  const updateSection = useCallback(
    (sectionId: string, updater: (s: EmailSection) => EmailSection) => {
      updateSections(
        design.sections.map((s) => (s.id === sectionId ? updater(s) : s)),
      );
    },
    [design.sections, updateSections],
  );

  const handleSectionLayoutChange = useCallback(
    (sectionId: string, layout: ColumnLayout) => {
      updateSection(sectionId, (s) => ({
        ...s,
        layout,
        columns: reshapeColumns(s.columns, COLUMN_COUNT_BY_LAYOUT[layout]),
      }));
    },
    [updateSection],
  );

  const handleSectionColorChange = useCallback(
    (sectionId: string, color: string) => {
      updateSection(sectionId, (s) => ({ ...s, bgColor: color }));
    },
    [updateSection],
  );

  const handleSectionMove = useCallback(
    (sectionId: string, direction: -1 | 1) => {
      const idx = design.sections.findIndex((s) => s.id === sectionId);
      const target = idx + direction;
      if (idx < 0 || target < 0 || target >= design.sections.length) return;
      const next = design.sections.slice();
      [next[idx], next[target]] = [next[target], next[idx]];
      updateSections(next);
    },
    [design.sections, updateSections],
  );

  const handleSectionDelete = useCallback(
    (sectionId: string) => {
      if (design.sections.length <= 1) return; // always keep at least one
      updateSections(design.sections.filter((s) => s.id !== sectionId));
    },
    [design.sections, updateSections],
  );

  const handleSectionAdd = useCallback(
    (layout: ColumnLayout) => {
      updateSections([...design.sections, buildDefaultSection(layout)]);
    },
    [design.sections, updateSections],
  );

  const handleModuleAdd = useCallback(
    (sectionId: string, columnId: string, type: EmailModuleType) => {
      const newModule = buildDefaultModule(type);
      updateSection(sectionId, (s) => ({
        ...s,
        columns: s.columns.map((c) =>
          c.id === columnId ? { ...c, modules: [...c.modules, newModule] } : c,
        ),
      }));
      setSelectedModuleId(newModule.id);
    },
    [updateSection],
  );

  const handleModuleChange = useCallback(
    (sectionId: string, columnId: string, moduleId: string, next: EmailModule) => {
      updateSection(sectionId, (s) => ({
        ...s,
        columns: s.columns.map((c) =>
          c.id === columnId
            ? {
                ...c,
                modules: c.modules.map((m) => (m.id === moduleId ? next : m)),
              }
            : c,
        ),
      }));
    },
    [updateSection],
  );

  const handleModuleDelete = useCallback(
    (sectionId: string, columnId: string, moduleId: string) => {
      if (selectedModuleId === moduleId) setSelectedModuleId(null);
      updateSection(sectionId, (s) => ({
        ...s,
        columns: s.columns.map((c) =>
          c.id === columnId
            ? { ...c, modules: c.modules.filter((m) => m.id !== moduleId) }
            : c,
        ),
      }));
    },
    [selectedModuleId, updateSection],
  );

  const handleModuleMove = useCallback(
    (sectionId: string, columnId: string, moduleId: string, direction: -1 | 1) => {
      updateSection(sectionId, (s) => ({
        ...s,
        columns: s.columns.map((c) => {
          if (c.id !== columnId) return c;
          const idx = c.modules.findIndex((m) => m.id === moduleId);
          const target = idx + direction;
          if (idx < 0 || target < 0 || target >= c.modules.length) return c;
          const next = c.modules.slice();
          [next[idx], next[target]] = [next[target], next[idx]];
          return { ...c, modules: next };
        }),
      }));
    },
    [updateSection],
  );

  return (
    <StyledLayout>
      <StyledPreviewFrame
        title="Email preview"
        srcDoc={renderedHtml}
        sandbox="allow-same-origin"
      />

      <StyledSectionList>
        {design.sections.map((section, sectionIdx) => {
          const widths = COLUMN_WIDTHS[section.layout];
          return (
            <StyledSectionCard key={section.id}>
              <StyledSectionHeader>
                <StyledSectionLabel>Section {sectionIdx + 1}</StyledSectionLabel>
                {!readOnly && (
                  <>
                    <StyledSelect
                      value={section.layout}
                      onChange={(e) =>
                        handleSectionLayoutChange(section.id, e.target.value as ColumnLayout)
                      }
                      title="Column layout"
                    >
                      {SECTION_LAYOUT_LIBRARY.map((opt) => (
                        <option key={opt.layout} value={opt.layout}>
                          {opt.label}
                        </option>
                      ))}
                    </StyledSelect>
                    <StyledColorInput
                      type="color"
                      value={section.bgColor}
                      onChange={(e) => handleSectionColorChange(section.id, e.target.value)}
                      title="Section background"
                    />
                    <StyledIconButton
                      onClick={() => handleSectionMove(section.id, -1)}
                      disabled={sectionIdx === 0}
                      title="Move section up"
                    >↑</StyledIconButton>
                    <StyledIconButton
                      onClick={() => handleSectionMove(section.id, +1)}
                      disabled={sectionIdx === design.sections.length - 1}
                      title="Move section down"
                    >↓</StyledIconButton>
                    <StyledIconButton
                      onClick={() => handleSectionDelete(section.id)}
                      disabled={design.sections.length <= 1}
                      title="Delete section (keeps at least one)"
                    >✕</StyledIconButton>
                  </>
                )}
              </StyledSectionHeader>

              <StyledColumnsRow
                style={{
                  gridTemplateColumns: widths.map((w) => `${w}fr`).join(' '),
                }}
              >
                {section.columns.map((col, colIdx) => (
                  <StyledColumn key={col.id}>
                    <StyledColumnHeader>Col {colIdx + 1}</StyledColumnHeader>
                    {col.modules.map((m, moduleIdx) => {
                      const isSelected = selectedModuleId === m.id;
                      return (
                        <StyledModuleRow key={m.id} selected={isSelected}>
                          <StyledModuleHeader>
                            <StyledModuleHeaderLeft
                              onClick={() => setSelectedModuleId(isSelected ? null : m.id)}
                            >
                              <span style={{ fontWeight: 600 }}>{m.type[0].toUpperCase()}</span>
                              <StyledModuleSummary>{moduleSummary(m)}</StyledModuleSummary>
                            </StyledModuleHeaderLeft>
                            {!readOnly && (
                              <>
                                <StyledIconButton
                                  onClick={() => handleModuleMove(section.id, col.id, m.id, -1)}
                                  disabled={moduleIdx === 0}
                                  title="Up"
                                >↑</StyledIconButton>
                                <StyledIconButton
                                  onClick={() => handleModuleMove(section.id, col.id, m.id, +1)}
                                  disabled={moduleIdx === col.modules.length - 1}
                                  title="Down"
                                >↓</StyledIconButton>
                                <StyledIconButton
                                  onClick={() => handleModuleDelete(section.id, col.id, m.id)}
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
                                  onChange={(next) => handleModuleChange(section.id, col.id, m.id, next)}
                                />
                              )}
                              {m.type === 'button' && (
                                <ButtonModuleEditor
                                  module={m}
                                  onChange={(next) => handleModuleChange(section.id, col.id, m.id, next)}
                                />
                              )}
                              {m.type === 'image' && (
                                <ImageModuleEditor
                                  module={m}
                                  onChange={(next) => handleModuleChange(section.id, col.id, m.id, next)}
                                />
                              )}
                              {m.type === 'divider' && (
                                <DividerModuleEditor
                                  module={m}
                                  onChange={(next) => handleModuleChange(section.id, col.id, m.id, next)}
                                />
                              )}
                              {m.type === 'spacer' && (
                                <SpacerModuleEditor
                                  module={m}
                                  onChange={(next) => handleModuleChange(section.id, col.id, m.id, next)}
                                />
                              )}
                            </StyledEditorPanel>
                          )}
                        </StyledModuleRow>
                      );
                    })}
                    {!readOnly && (
                      <StyledAddModuleRow>
                        {MODULE_LIBRARY.map((entry) => (
                          <StyledAddModuleButton
                            key={entry.type}
                            onClick={() => handleModuleAdd(section.id, col.id, entry.type)}
                          >
                            + {entry.label}
                          </StyledAddModuleButton>
                        ))}
                      </StyledAddModuleRow>
                    )}
                  </StyledColumn>
                ))}
              </StyledColumnsRow>
            </StyledSectionCard>
          );
        })}
      </StyledSectionList>

      {!readOnly && (
        <StyledAddSectionRow>
          <span style={{ marginRight: 'auto', color: 'var(--font-color-tertiary)' }}>
            Add section:
          </span>
          {SECTION_LAYOUT_LIBRARY.map((opt) => (
            <StyledAddSectionButton
              key={opt.layout}
              onClick={() => handleSectionAdd(opt.layout)}
              title={opt.label}
            >
              {opt.label}
            </StyledAddSectionButton>
          ))}
        </StyledAddSectionRow>
      )}
    </StyledLayout>
  );
};

export const buildEmptyDesign = (): EmailDesign => EMPTY_EMAIL_DESIGN;

export const renderEmailDesign = renderDesignToHtml;

// Wraps an existing bodyHtml into a single-text-module design — used when
// upgrading legacy (no-design) emails on first switch to Design mode.
export const wrapHtmlAsDesign = (html: string): EmailDesign => {
  const seed = buildDefaultSection('1');
  seed.paddingTop = 0;
  seed.paddingBottom = 0;
  seed.columns = [
    {
      id: seed.columns[0].id,
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
  ];
  return { ...EMPTY_EMAIL_DESIGN, sections: [seed] };
};
