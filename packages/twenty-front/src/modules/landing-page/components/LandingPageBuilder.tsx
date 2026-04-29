import { styled } from '@linaria/react';
import { useCallback, useState } from 'react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import {
  buildDefaultLandingPageModule,
  buildDefaultLandingPageSection,
  buildEmptyLandingPageColumn,
  EMPTY_LANDING_PAGE_DESIGN,
  generateLandingPageId,
  LANDING_PAGE_LAYOUT_LIBRARY,
  LANDING_PAGE_MODULE_LIBRARY,
  type ModuleLibraryEntry,
} from '@/landing-page/constants/LandingPageBuilderDefaults';
import { LandingPageRenderer } from '@/landing-page/render/LandingPageRenderer';
import {
  type LandingPageColumnLayout,
  type LandingPageDesign,
  type LandingPageModule,
  type LandingPageModuleType,
  type LandingPageSection,
} from '@/landing-page/types/LandingPageDesign';
import { LandingPageModuleEditor } from '@/landing-page/components/LandingPageModuleEditor';

// Visual landing page builder. Modeled on the email builder's
// section/column/module structure but with web-page UX:
//   - left rail: module library (drag-or-click to add)
//   - center: live canvas via LandingPageRenderer with editor chrome
//     overlay (click a module to select; selection opens inline editor)
//   - top toolbar: add section, change layout, save
//
// The design is fully driven by props (design) and parent saves on
// onChange — same pattern as the email builder. No internal persistence.

type LandingPageBuilderProps = {
  design: LandingPageDesign;
  onChange: (next: LandingPageDesign) => void;
};

// Same pattern as the form builder: builder lives inside Twenty's
// record-show widget area which is often <800px wide. Use an icon
// rail (48px) + full-width canvas, with the module library as a
// click-to-open overlay panel that slides over the canvas. The
// canvas is always visible at full width — panels float above.
const StyledLayout = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  min-height: 600px;
  overflow: hidden;
  position: relative;
  width: 100%;
`;

// Slim icon rail — always visible. Click "+" to toggle the module
// library overlay.
const StyledIconRail = styled.div`
  background: ${themeCssVariables.background.primary};
  border-right: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 2px;
  padding: 12px 8px;
  width: 48px;
  z-index: 2;
`;

const StyledRailIconButton = styled.button<{ active?: boolean }>`
  align-items: center;
  background: ${(p) =>
    p.active === true
      ? themeCssVariables.background.transparent.medium
      : 'transparent'};
  border: 0;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${(p) =>
    p.active === true
      ? themeCssVariables.color.orange
      : themeCssVariables.font.color.secondary};
  cursor: pointer;
  display: flex;
  font-size: 18px;
  height: 32px;
  justify-content: center;
  width: 32px;
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
    color: ${themeCssVariables.font.color.primary};
  }
`;

// Module library — overlays the canvas instead of taking column space.
/* oxlint-disable twenty/no-hardcoded-colors -- panel drop shadows
   use a low-opacity black, no theme equivalent. */
const StyledLeftRail = styled.div`
  background: ${themeCssVariables.background.primary};
  border-right: 1px solid ${themeCssVariables.border.color.light};
  bottom: 0;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  left: 48px;
  overflow-y: auto;
  padding: ${themeCssVariables.spacing[3]};
  position: absolute;
  top: 0;
  width: 280px;
  z-index: 3;
`;
/* oxlint-enable twenty/no-hardcoded-colors */

const StyledRailGroupLabel = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 10.5px;
  font-weight: ${themeCssVariables.font.weight.semiBold};
  letter-spacing: 0.06em;
  margin-top: ${themeCssVariables.spacing[2]};
  padding: 0 ${themeCssVariables.spacing[1]};
  text-transform: uppercase;
`;

// Single-column layout so cards have room for their full label.
// HubSpot's screenshot uses 2-column at ~250px-per-card; we don't
// have that width budget inside Twenty's widget, so collapse to
// one wider card per row.
const StyledRailGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledRailItem = styled.button`
  align-items: center;
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  font-family: ${themeCssVariables.font.family};
  font-size: 12.5px;
  gap: 10px;
  padding: 10px 12px;
  text-align: left;
  &:hover {
    background: ${themeCssVariables.background.transparent.medium};
    border-color: ${themeCssVariables.color.orange};
  }
`;

const StyledRailGlyph = styled.span`
  color: ${themeCssVariables.color.orange};
  font-size: 16px;
  line-height: 1;
`;

const StyledCanvasWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
`;

const StyledTopBar = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  position: sticky;
  top: 0;
  z-index: 1;
`;

const StyledLayoutPicker = styled.div`
  display: flex;
  gap: 4px;
`;

/* oxlint-disable twenty/no-hardcoded-colors */
const StyledLayoutButton = styled.button<{ active?: boolean }>`
  background: ${(p) =>
    p.active === true
      ? themeCssVariables.color.orange
      : themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${(p) =>
    p.active === true ? '#ffffff' : themeCssVariables.font.color.primary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: 12px;
  padding: 6px 10px;
  &:hover {
    filter: brightness(0.95);
  }
`;

const StyledAddSectionButton = styled.button`
  background: ${themeCssVariables.color.orange};
  border: 0;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: #ffffff;
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: 12px;
  font-weight: 500;
  padding: 6px 14px;
  &:hover {
    filter: brightness(0.95);
  }
`;
/* oxlint-enable twenty/no-hardcoded-colors */

const StyledCanvas = styled.div`
  background: ${themeCssVariables.background.tertiary};
  flex: 1;
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledSectionFrame = styled.div<{ selected: boolean }>`
  border: 2px ${(p) => (p.selected ? 'solid' : 'dashed')}
    ${(p) =>
      p.selected
        ? themeCssVariables.color.orange
        : themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  margin-bottom: ${themeCssVariables.spacing[3]};
  position: relative;
`;

const StyledSectionHeader = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  padding: 6px 10px;
`;

const StyledSectionLabel = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const StyledIconButton = styled.button`
  background: transparent;
  border: 0;
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  font-size: 13px;
  padding: 2px 6px;
  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledSectionContent = styled.div`
  position: relative;
`;

const StyledSectionAddDrop = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.transparent.lighter};
  border-top: 1px solid ${themeCssVariables.border.color.light};
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  font-size: 11px;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: center;
  padding: 8px;
`;

const StyledModulePicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const StyledModuleChip = styled.button`
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: 11px;
  padding: 3px 8px;
  &:hover {
    background: ${themeCssVariables.background.transparent.medium};
  }
`;

const StyledModuleSelectionOverlay = styled.div`
  inset: 0;
  pointer-events: none;
  position: absolute;
`;

const StyledEmptyCanvas = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border: 1px dashed ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  flex-direction: column;
  font-size: 13px;
  gap: 12px;
  justify-content: center;
  min-height: 240px;
  text-align: center;
`;

const groupLibrary = (lib: ModuleLibraryEntry[]) => {
  const groups: Record<string, ModuleLibraryEntry[]> = {};
  for (const entry of lib) {
    if (!(entry.category in groups)) {
      groups[entry.category] = [];
    }
    groups[entry.category].push(entry);
  }
  return groups;
};

export const LandingPageBuilder = ({
  design,
  onChange,
}: LandingPageBuilderProps) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  // Module library overlay open/closed. Default closed so canvas is
  // visible by default; user opens it via the icon rail.
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    design.sections[0]?.id ?? null,
  );

  // Helper: produce a new design with a section/module/etc. updated.
  const updateSection = useCallback(
    (
      sectionId: string,
      mutate: (s: LandingPageSection) => LandingPageSection,
    ) => {
      onChange({
        ...design,
        sections: design.sections.map((s) =>
          s.id === sectionId ? mutate(s) : s,
        ),
      });
    },
    [design, onChange],
  );

  const updateModule = useCallback(
    (
      sectionId: string,
      moduleId: string,
      mutate: (m: LandingPageModule) => LandingPageModule,
    ) => {
      updateSection(sectionId, (sec) => ({
        ...sec,
        columns: sec.columns.map((col) => ({
          ...col,
          modules: col.modules.map((mod) =>
            mod.id === moduleId ? mutate(mod) : mod,
          ),
        })),
      }));
    },
    [updateSection],
  );

  const removeModule = useCallback(
    (sectionId: string, moduleId: string) => {
      updateSection(sectionId, (sec) => ({
        ...sec,
        columns: sec.columns.map((col) => ({
          ...col,
          modules: col.modules.filter((mod) => mod.id !== moduleId),
        })),
      }));
      if (selectedModuleId === moduleId) setSelectedModuleId(null);
    },
    [updateSection, selectedModuleId],
  );

  const addModuleToSection = useCallback(
    (sectionId: string, type: LandingPageModuleType) => {
      const newModule = buildDefaultLandingPageModule(type);
      updateSection(sectionId, (sec) => ({
        ...sec,
        columns: sec.columns.map((col, idx) =>
          idx === 0 ? { ...col, modules: [...col.modules, newModule] } : col,
        ),
      }));
      setSelectedModuleId(newModule.id);
    },
    [updateSection],
  );

  const addSection = useCallback(
    (layout: LandingPageColumnLayout = '1') => {
      const next = buildDefaultLandingPageSection(layout);
      onChange({
        ...design,
        sections: [...design.sections, next],
      });
      setSelectedSectionId(next.id);
    },
    [design, onChange],
  );

  const removeSection = useCallback(
    (sectionId: string) => {
      onChange({
        ...design,
        sections: design.sections.filter((s) => s.id !== sectionId),
      });
      if (selectedSectionId === sectionId) setSelectedSectionId(null);
    },
    [design, onChange, selectedSectionId],
  );

  const moveSection = useCallback(
    (sectionId: string, direction: -1 | 1) => {
      const idx = design.sections.findIndex((s) => s.id === sectionId);
      if (idx === -1) return;
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= design.sections.length) return;
      const next = [...design.sections];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      onChange({ ...design, sections: next });
    },
    [design, onChange],
  );

  const setSectionLayout = useCallback(
    (sectionId: string, layout: LandingPageColumnLayout) => {
      const COLUMN_COUNT: Record<LandingPageColumnLayout, number> = {
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '1-2': 2,
        '2-1': 2,
      };
      updateSection(sectionId, (sec) => {
        const targetCount = COLUMN_COUNT[layout];
        const existing = sec.columns;
        const nextColumns =
          existing.length >= targetCount
            ? existing.slice(0, targetCount)
            : [
                ...existing,
                ...Array.from({ length: targetCount - existing.length }, () =>
                  buildEmptyLandingPageColumn(),
                ),
              ];
        return { ...sec, layout, columns: nextColumns };
      });
    },
    [updateSection],
  );

  const groups = groupLibrary(LANDING_PAGE_MODULE_LIBRARY);
  const groupOrder: string[] = [
    'layout',
    'content',
    'media',
    'forms',
    'spacers',
  ];

  const findModule = (
    moduleId: string,
  ): { module: LandingPageModule; sectionId: string } | null => {
    for (const sec of design.sections) {
      for (const col of sec.columns) {
        const found = col.modules.find((m) => m.id === moduleId);
        if (found !== undefined) return { module: found, sectionId: sec.id };
      }
    }
    return null;
  };

  const selectedModuleInfo =
    selectedModuleId !== null ? findModule(selectedModuleId) : null;
  const selectedSection =
    selectedSectionId !== null
      ? design.sections.find((s) => s.id === selectedSectionId)
      : null;

  return (
    <StyledLayout>
      <StyledIconRail>
        <StyledRailIconButton
          active={isLibraryOpen}
          onClick={() => setIsLibraryOpen((v) => !v)}
          title="Add layout / module"
        >
          +
        </StyledRailIconButton>
      </StyledIconRail>
      {isLibraryOpen && (
      <StyledLeftRail>
        <StyledRailGroupLabel>Layouts</StyledRailGroupLabel>
        <StyledRailGrid>
          {LANDING_PAGE_LAYOUT_LIBRARY.map((entry) => (
            <StyledRailItem
              key={entry.layout}
              type="button"
              onClick={() => addSection(entry.layout)}
              title={`Add ${entry.label} section`}
            >
              <StyledRailGlyph>{entry.glyph}</StyledRailGlyph>
              {entry.label}
            </StyledRailItem>
          ))}
        </StyledRailGrid>

        {groupOrder.map((groupKey) => {
          const list = groups[groupKey];
          if (list === undefined || list.length === 0) return null;
          return (
            <div key={groupKey}>
              <StyledRailGroupLabel>{groupKey}</StyledRailGroupLabel>
              <StyledRailGrid>
                {list.map((entry) => (
                  <StyledRailItem
                    key={entry.type}
                    type="button"
                    onClick={() => {
                      const targetSectionId =
                        selectedSectionId ?? design.sections[0]?.id ?? null;
                      if (targetSectionId === null) {
                        // No sections yet — auto-create a 1-column section
                        // and add the module there in one shot.
                        const next = buildDefaultLandingPageSection('1');
                        const newModule = buildDefaultLandingPageModule(
                          entry.type,
                        );
                        next.columns[0].modules.push(newModule);
                        onChange({
                          ...design,
                          sections: [...design.sections, next],
                        });
                        setSelectedSectionId(next.id);
                        setSelectedModuleId(newModule.id);
                      } else {
                        addModuleToSection(targetSectionId, entry.type);
                      }
                    }}
                    title={`Add ${entry.label}`}
                  >
                    <StyledRailGlyph>{entry.glyph}</StyledRailGlyph>
                    {entry.label}
                  </StyledRailItem>
                ))}
              </StyledRailGrid>
            </div>
          );
        })}
      </StyledLeftRail>
      )}

      <StyledCanvasWrapper>
        <StyledTopBar>
          {selectedSection !== null && selectedSection !== undefined && (
            <>
              <StyledSectionLabel>Section layout:</StyledSectionLabel>
              <StyledLayoutPicker>
                {LANDING_PAGE_LAYOUT_LIBRARY.map((entry) => (
                  <StyledLayoutButton
                    key={entry.layout}
                    active={selectedSection.layout === entry.layout}
                    onClick={() =>
                      setSectionLayout(selectedSection.id, entry.layout)
                    }
                    title={entry.label}
                  >
                    {entry.glyph}
                  </StyledLayoutButton>
                ))}
              </StyledLayoutPicker>
              <div style={{ flex: 1 }} />
            </>
          )}
          {selectedSection === null || selectedSection === undefined ? (
            <div style={{ flex: 1 }} />
          ) : null}
          <StyledAddSectionButton type="button" onClick={() => addSection('1')}>
            + Add section
          </StyledAddSectionButton>
        </StyledTopBar>

        <StyledCanvas>
          {design.sections.length === 0 ? (
            <StyledEmptyCanvas>
              <div>This page is empty.</div>
              <div>
                Click a module on the left to add your first section, or use +
                Add section above.
              </div>
            </StyledEmptyCanvas>
          ) : (
            design.sections.map((section, idx) => (
              <StyledSectionFrame
                key={section.id}
                selected={selectedSectionId === section.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSectionId(section.id);
                }}
              >
                <StyledSectionHeader>
                  <StyledSectionLabel>
                    Section {idx + 1} · {section.layout}
                  </StyledSectionLabel>
                  <div style={{ flex: 1 }} />
                  <StyledIconButton
                    type="button"
                    onClick={() => moveSection(section.id, -1)}
                    title="Move up"
                  >
                    ↑
                  </StyledIconButton>
                  <StyledIconButton
                    type="button"
                    onClick={() => moveSection(section.id, 1)}
                    title="Move down"
                  >
                    ↓
                  </StyledIconButton>
                  <StyledIconButton
                    type="button"
                    onClick={() => removeSection(section.id)}
                    title="Delete section"
                  >
                    ×
                  </StyledIconButton>
                </StyledSectionHeader>
                <StyledSectionContent>
                  <LandingPageRenderer
                    design={{
                      ...design,
                      sections: [section],
                    }}
                  />
                  <StyledModuleSelectionOverlay />
                  {section.columns.every((c) => c.modules.length === 0) && (
                    <StyledSectionAddDrop>
                      <span>Empty section. Add a module:</span>
                      <StyledModulePicker>
                        {LANDING_PAGE_MODULE_LIBRARY.slice(0, 8).map(
                          (entry) => (
                            <StyledModuleChip
                              key={entry.type}
                              type="button"
                              onClick={() =>
                                addModuleToSection(section.id, entry.type)
                              }
                            >
                              {entry.glyph} {entry.label}
                            </StyledModuleChip>
                          ),
                        )}
                      </StyledModulePicker>
                    </StyledSectionAddDrop>
                  )}
                </StyledSectionContent>
                {section.columns.some((c) => c.modules.length > 0) && (
                  <StyledSectionAddDrop>
                    <span>Add to this section:</span>
                    <StyledModulePicker>
                      {LANDING_PAGE_MODULE_LIBRARY.map((entry) => (
                        <StyledModuleChip
                          key={entry.type}
                          type="button"
                          onClick={() =>
                            addModuleToSection(section.id, entry.type)
                          }
                          title={entry.label}
                        >
                          {entry.glyph}
                        </StyledModuleChip>
                      ))}
                    </StyledModulePicker>
                  </StyledSectionAddDrop>
                )}
                {/* Module list with edit affordances rendered below the
                    visual preview so users can edit module contents. The
                    visual preview is read-only; this strip is the editor
                    surface. */}
                <ModuleEditorStrip
                  section={section}
                  selectedModuleId={selectedModuleId}
                  onSelectModule={setSelectedModuleId}
                  onUpdateModule={(mid, mutate) =>
                    updateModule(section.id, mid, mutate)
                  }
                  onRemoveModule={(mid) => removeModule(section.id, mid)}
                />
              </StyledSectionFrame>
            ))
          )}
        </StyledCanvas>
      </StyledCanvasWrapper>

      {/* Floating module editor: renders for the selected module if any. */}
      {selectedModuleInfo !== null && (
        <LandingPageModuleEditor
          module={selectedModuleInfo.module}
          onChange={(next) =>
            updateModule(selectedModuleInfo.sectionId, next.id, () => next)
          }
          onClose={() => setSelectedModuleId(null)}
        />
      )}
    </StyledLayout>
  );
};

const StyledModuleStrip = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: ${themeCssVariables.spacing[2]};
`;

const StyledModuleStripRow = styled.div<{ selected: boolean }>`
  align-items: center;
  background: ${(p) =>
    p.selected
      ? themeCssVariables.background.transparent.medium
      : themeCssVariables.background.transparent.lighter};
  border: 1px solid
    ${(p) =>
      p.selected
        ? themeCssVariables.color.orange
        : themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  cursor: pointer;
  display: flex;
  font-size: 12px;
  gap: 6px;
  padding: 4px 8px;
  &:hover {
    background: ${themeCssVariables.background.transparent.medium};
  }
`;

const ModuleEditorStrip = ({
  section,
  selectedModuleId,
  onSelectModule,
  onUpdateModule,
  onRemoveModule,
}: {
  section: LandingPageSection;
  selectedModuleId: string | null;
  onSelectModule: (id: string) => void;
  onUpdateModule: (
    moduleId: string,
    mutate: (m: LandingPageModule) => LandingPageModule,
  ) => void;
  onRemoveModule: (moduleId: string) => void;
}) => {
  const allModules = section.columns.flatMap((c) =>
    c.modules.map((m) => ({ module: m, columnId: c.id })),
  );
  if (allModules.length === 0) return null;
  return (
    <StyledModuleStrip>
      {allModules.map(({ module: m }) => (
        <StyledModuleStripRow
          key={m.id}
          selected={selectedModuleId === m.id}
          onClick={() => onSelectModule(m.id)}
        >
          <span style={{ flex: 1 }}>{labelForModule(m)}</span>
          <StyledIconButton
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUpdateModule(m.id, (cur) => ({
                ...cur,
                id: generateLandingPageId('mod'),
              }));
            }}
            title="Duplicate"
          >
            ⎘
          </StyledIconButton>
          <StyledIconButton
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveModule(m.id);
            }}
            title="Remove"
          >
            ×
          </StyledIconButton>
        </StyledModuleStripRow>
      ))}
    </StyledModuleStrip>
  );
};

const labelForModule = (m: LandingPageModule): string => {
  const entry = LANDING_PAGE_MODULE_LIBRARY.find((e) => e.type === m.type);
  const label = entry?.label ?? m.type;
  switch (m.type) {
    case 'heading':
      return `${label}: ${m.text.slice(0, 40)}`;
    case 'text':
      return `${label}: ${m.html.replace(/<[^>]+>/g, '').slice(0, 40)}`;
    case 'button':
      return `${label}: ${m.label}`;
    case 'hero':
      return `${label}: ${m.heading.slice(0, 40)}`;
    case 'image':
      return `${label}${m.alt !== '' ? `: ${m.alt}` : ''}`;
    case 'formEmbed':
      return `${label}: ${m.formId === '' ? '(unset)' : m.formId}`;
    default:
      return label;
  }
};

export const LANDING_PAGE_EMPTY = EMPTY_LANDING_PAGE_DESIGN;
