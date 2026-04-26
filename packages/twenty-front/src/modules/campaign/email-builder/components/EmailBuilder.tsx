import { styled } from '@linaria/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  buildDefaultModule,
  buildDefaultSection,
  buildEmptyColumn,
  EMPTY_EMAIL_DESIGN,
  generateEmailBuilderId,
  MODULE_LIBRARY,
  SECTION_LAYOUT_LIBRARY,
} from '@/campaign/email-builder/constants/EmailBuilderDefaults';
import { PreviewModal } from '@/campaign/email-builder/components/preview/PreviewModal';
import { ButtonModuleEditor } from '@/campaign/email-builder/components/modules/ButtonModuleEditor';
import { ColorWithSwatches } from '@/campaign/email-builder/components/modules/ColorWithSwatches';
import { DividerModuleEditor } from '@/campaign/email-builder/components/modules/DividerModuleEditor';
import { FooterModuleEditor } from '@/campaign/email-builder/components/modules/FooterModuleEditor';
import { HeadingModuleEditor } from '@/campaign/email-builder/components/modules/HeadingModuleEditor';
import { HtmlModuleEditor } from '@/campaign/email-builder/components/modules/HtmlModuleEditor';
import { ImageModuleEditor } from '@/campaign/email-builder/components/modules/ImageModuleEditor';
import { SocialModuleEditor } from '@/campaign/email-builder/components/modules/SocialModuleEditor';
import { SpacerModuleEditor } from '@/campaign/email-builder/components/modules/SpacerModuleEditor';
import { TextModuleEditor } from '@/campaign/email-builder/components/modules/TextModuleEditor';
import { migrateDesign } from '@/campaign/email-builder/render/migrateDesign';
import {
  readModuleFromClipboard,
  writeModuleToClipboard,
} from '@/campaign/email-builder/utils/moduleClipboard';
import { DraggableItem } from '@/ui/layout/draggable-list/components/DraggableItem';
import { DraggableList } from '@/ui/layout/draggable-list/components/DraggableList';
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from '@hello-pangea/dnd';
import {
  type RenderMeta,
  renderDesignToHtml,
} from '@/campaign/email-builder/render/renderDesignToHtml';
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

const StyledPreviewBar = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: flex-end;
`;

const StyledDesignSettingsRow = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[3]};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
`;

const StyledDesignSettingLabel = styled.label`
  align-items: center;
  color: ${themeCssVariables.font.color.secondary};
  display: flex;
  font-size: ${themeCssVariables.font.size.xs};
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledFontSelect = styled.select`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
`;

// Email-safe font stacks. Gmail / Apple Mail / Outlook all reliably render
// these without falling back to a default. Web fonts (Google Fonts etc.)
// are intentionally excluded — they require <link> tags many clients strip.
const EMAIL_SAFE_FONTS: ReadonlyArray<{ label: string; value: string }> = [
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
];

const StyledPreviewToggle = styled.button<{ active: boolean }>`
  background: ${(p) =>
    p.active
      ? themeCssVariables.background.tertiary
      : themeCssVariables.background.primary};
  border: 1px solid
    ${(p) =>
      p.active
        ? themeCssVariables.color.blue
        : themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${(p) =>
    p.active
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.secondary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.xs};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
`;

const StyledPreviewWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledPreviewFrame = styled.iframe`
  background: ${themeCssVariables.background.tertiary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  height: 480px;
  width: 100%;
`;

const StyledPreviewFrameMobile = styled.iframe`
  background: ${themeCssVariables.background.tertiary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: 24px;
  height: 600px;
  width: 375px;
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

const StyledPaddingRow = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  margin-bottom: ${themeCssVariables.spacing[2]};
`;

const StyledPaddingLabel = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xs};
`;

const StyledPaddingField = styled.label`
  align-items: center;
  color: ${themeCssVariables.font.color.secondary};
  display: flex;
  font-size: ${themeCssVariables.font.size.xs};
  gap: 2px;
`;

const StyledPaddingInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.xs};
  padding: 2px 4px;
  text-align: right;
  width: 44px;
`;

const StyledIconButton = styled.button`
  background: transparent;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  &:hover {
    background: ${themeCssVariables.background.tertiary};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

const StyledSelect = styled.select`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
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
  &:hover {
    background: ${themeCssVariables.background.primary};
    color: ${themeCssVariables.font.color.primary};
  }
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
  &:hover {
    background: ${themeCssVariables.background.tertiary};
  }
`;

type EmailBuilderProps = {
  design: EmailDesign;
  onChange: (next: EmailDesign, renderedHtml: string) => void;
  readOnly?: boolean;
  // Optional preview-only inbox-meta header (From/To/Subject/Preview) shown
  // above the rendered design in the iframe. NOT included in the saved/sent
  // body — server calls renderDesignToHtml without meta when sending.
  meta?: RenderMeta;
};

const moduleSummary = (m: EmailModule): string => {
  switch (m.type) {
    case 'text':
      return m.html.replace(/<[^>]+>/g, '').slice(0, 40) || '(empty text)';
    case 'heading':
      return (
        `${m.level.toUpperCase()}: ${m.text.slice(0, 40)}` ||
        `(empty ${m.level})`
      );
    case 'button':
      return m.label;
    case 'image':
      return m.alt || m.src.slice(-30);
    case 'divider':
      return `${m.style} ${m.thickness}px ${m.color}`;
    case 'spacer':
      return `${m.height}px tall`;
    case 'html':
      return m.rawHtml.replace(/<[^>]+>/g, '').slice(0, 40) || '(custom HTML)';
    case 'social':
      return `${m.links.length} link${m.links.length === 1 ? '' : 's'}`;
    case 'footer':
      return m.address.slice(0, 40) || 'Footer';
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
    const extras = Array.from({ length: newCount - oldCols.length }, () =>
      buildEmptyColumn(),
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
      modules: [...kept[lastIdx].modules, ...dropped.flatMap((c) => c.modules)],
    };
  }
  return kept;
};

const COLUMN_COUNT_BY_LAYOUT: Record<ColumnLayout, number> = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '1-2': 2,
  '2-1': 2,
};

export const EmailBuilder = ({
  design: rawDesign,
  onChange,
  readOnly = false,
  meta,
}: EmailBuilderProps) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>(
    'desktop',
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [clipboardModuleType, setClipboardModuleType] = useState<string | null>(
    () => readModuleFromClipboard()?.type ?? null,
  );

  // Re-read the clipboard whenever the tab regains focus or another tab
  // updates localStorage, so the Paste button reflects the current state
  // even after copying in a different campaign.
  useEffect(() => {
    const refresh = () => {
      setClipboardModuleType(readModuleFromClipboard()?.type ?? null);
    };
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // Migrate on every read so older designs (v1) work seamlessly. The next
  // user edit writes the migrated v2 shape back to the record.
  const design = useMemo(() => migrateDesign(rawDesign), [rawDesign]);
  // Preview HTML includes the inbox-meta header. Saved HTML (passed to onChange)
  // does NOT — server stores only what gets sent.
  const previewHtml = useMemo(
    () => renderDesignToHtml(design, meta),
    [design, meta],
  );

  const updateSections = useCallback(
    (next: EmailSection[]) => {
      const nextDesign: EmailDesign = { ...design, sections: next };
      onChange(nextDesign, renderDesignToHtml(nextDesign));
    },
    [design, onChange],
  );

  const handleSettingsChange = useCallback(
    (updater: (s: EmailDesign['settings']) => EmailDesign['settings']) => {
      const nextDesign: EmailDesign = {
        ...design,
        settings: updater(design.settings),
      };
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

  const handleSectionPaddingChange = useCallback(
    (
      sectionId: string,
      side: 'Top' | 'Bottom' | 'Left' | 'Right',
      value: number,
    ) => {
      const key = `padding${side}` as
        | 'paddingTop'
        | 'paddingBottom'
        | 'paddingLeft'
        | 'paddingRight';
      updateSection(sectionId, (s) => ({ ...s, [key]: value }));
    },
    [updateSection],
  );

  const handleSectionsDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const from = result.source.index;
      const to = result.destination.index;
      if (from === to) return;
      const next = design.sections.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
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

  const handleSectionDuplicate = useCallback(
    (sectionId: string) => {
      const idx = design.sections.findIndex((s) => s.id === sectionId);
      if (idx < 0) return;
      const original = design.sections[idx];
      // Deep clone via JSON, then regenerate every id (section, columns,
      // modules) so the duplicate is fully independent — no id collisions
      // when the user edits one and not the other.
      const cloned = JSON.parse(JSON.stringify(original)) as EmailSection;
      cloned.id = generateEmailBuilderId('sec');
      cloned.columns = cloned.columns.map((c) => ({
        ...c,
        id: generateEmailBuilderId('col'),
        modules: c.modules.map((m) => ({
          ...m,
          id: generateEmailBuilderId('mod'),
        })),
      }));
      const next = [
        ...design.sections.slice(0, idx + 1),
        cloned,
        ...design.sections.slice(idx + 1),
      ];
      updateSections(next);
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
    (
      sectionId: string,
      columnId: string,
      moduleId: string,
      next: EmailModule,
    ) => {
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

  const handleModuleCopy = useCallback((module: EmailModule) => {
    writeModuleToClipboard(module);
    setClipboardModuleType(module.type);
  }, []);

  const handleModulePaste = useCallback(
    (sectionId: string, columnId: string) => {
      const fromClipboard = readModuleFromClipboard();
      if (!fromClipboard) return;
      const pasted = {
        ...fromClipboard,
        id: generateEmailBuilderId('mod'),
      } as EmailModule;
      updateSection(sectionId, (s) => ({
        ...s,
        columns: s.columns.map((c) =>
          c.id === columnId ? { ...c, modules: [...c.modules, pasted] } : c,
        ),
      }));
      setSelectedModuleId(pasted.id);
    },
    [updateSection],
  );

  const handleModuleDuplicate = useCallback(
    (sectionId: string, columnId: string, moduleId: string) => {
      const cloneId = generateEmailBuilderId('mod');
      updateSection(sectionId, (s) => ({
        ...s,
        columns: s.columns.map((c) => {
          if (c.id !== columnId) return c;
          const idx = c.modules.findIndex((m) => m.id === moduleId);
          if (idx < 0) return c;
          // Deep-clone via JSON round-trip — every module in the union is plain
          // JSON-serializable data, and only inner arrays (e.g. SocialModule.links)
          // need cloning. Cast preserves the discriminated union shape.
          const original = c.modules[idx];
          const clone = {
            ...(JSON.parse(JSON.stringify(original)) as EmailModule),
            id: cloneId,
          } as EmailModule;
          const next = [
            ...c.modules.slice(0, idx + 1),
            clone,
            ...c.modules.slice(idx + 1),
          ];
          return { ...c, modules: next };
        }),
      }));
      setSelectedModuleId(cloneId);
    },
    [updateSection],
  );

  // Cross-column DnD within a single section. droppableId of each column is
  // the column id. Source/destination indices are positions inside that
  // column's modules array. Cross-section drag is not supported here — we
  // wire one DnD context per section, so dragging out of a section cancels.
  const handleSectionModulesDragEnd = useCallback(
    (sectionId: string, result: DropResult) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }
      updateSection(sectionId, (s) => {
        const fromCol = s.columns.find((c) => c.id === source.droppableId);
        const toCol = s.columns.find((c) => c.id === destination.droppableId);
        if (!fromCol || !toCol) return s;
        const moved = fromCol.modules.find((m) => m.id === draggableId);
        if (!moved) return s;
        return {
          ...s,
          columns: s.columns.map((c) => {
            if (
              c.id === source.droppableId &&
              c.id === destination.droppableId
            ) {
              const next = c.modules.filter((m) => m.id !== draggableId);
              next.splice(destination.index, 0, moved);
              return { ...c, modules: next };
            }
            if (c.id === source.droppableId) {
              return {
                ...c,
                modules: c.modules.filter((m) => m.id !== draggableId),
              };
            }
            if (c.id === destination.droppableId) {
              const next = c.modules.slice();
              next.splice(destination.index, 0, moved);
              return { ...c, modules: next };
            }
            return c;
          }),
        };
      });
    },
    [updateSection],
  );

  const handleModuleMove = useCallback(
    (
      sectionId: string,
      columnId: string,
      moduleId: string,
      direction: -1 | 1,
    ) => {
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
      {!readOnly && (
        <StyledDesignSettingsRow>
          <StyledDesignSettingLabel>
            Font
            <StyledFontSelect
              value={design.settings.fontFamily}
              onChange={(e) =>
                handleSettingsChange((s) => ({
                  ...s,
                  fontFamily: e.target.value,
                }))
              }
              title="Email-safe font stack"
            >
              {EMAIL_SAFE_FONTS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
              {!EMAIL_SAFE_FONTS.some(
                (f) => f.value === design.settings.fontFamily,
              ) && (
                <option value={design.settings.fontFamily}>
                  Custom: {design.settings.fontFamily}
                </option>
              )}
            </StyledFontSelect>
          </StyledDesignSettingLabel>
        </StyledDesignSettingsRow>
      )}
      <StyledPreviewBar>
        <StyledPreviewToggle
          active={previewMode === 'desktop'}
          onClick={() => setPreviewMode('desktop')}
          type="button"
        >
          Desktop
        </StyledPreviewToggle>
        <StyledPreviewToggle
          active={previewMode === 'mobile'}
          onClick={() => setPreviewMode('mobile')}
          type="button"
        >
          Mobile
        </StyledPreviewToggle>
        <StyledPreviewToggle
          active={false}
          onClick={() => setIsPreviewOpen(true)}
          type="button"
          title="Open full preview"
        >
          Open preview ↗
        </StyledPreviewToggle>
      </StyledPreviewBar>

      {isPreviewOpen && (
        <PreviewModal
          html={previewHtml}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

      <StyledPreviewWrap>
        {previewMode === 'desktop' ? (
          <StyledPreviewFrame
            title="Email preview (desktop)"
            srcDoc={previewHtml}
            sandbox="allow-same-origin"
          />
        ) : (
          <StyledPreviewFrameMobile
            title="Email preview (mobile)"
            srcDoc={previewHtml}
            sandbox="allow-same-origin"
          />
        )}
      </StyledPreviewWrap>

      <DraggableList
        onDragEnd={handleSectionsDragEnd}
        draggableItems={
          <StyledSectionList>
            {design.sections.map((section, sectionIdx) => {
              const widths = COLUMN_WIDTHS[section.layout];
              return (
                <DraggableItem
                  key={section.id}
                  draggableId={section.id}
                  index={sectionIdx}
                  isDragDisabled={readOnly}
                  draggableComponentStyles={{ marginBottom: 8 }}
                  itemComponent={() => (
                    <StyledSectionCard>
                      <StyledSectionHeader>
                        <StyledSectionLabel>
                          ≡ Section {sectionIdx + 1}
                        </StyledSectionLabel>
                        {!readOnly && (
                          <>
                            <StyledSelect
                              value={section.layout}
                              onChange={(e) =>
                                handleSectionLayoutChange(
                                  section.id,
                                  e.target.value as ColumnLayout,
                                )
                              }
                              title="Column layout"
                            >
                              {SECTION_LAYOUT_LIBRARY.map((opt) => (
                                <option key={opt.layout} value={opt.layout}>
                                  {opt.label}
                                </option>
                              ))}
                            </StyledSelect>
                            <ColorWithSwatches
                              value={section.bgColor}
                              onChange={(next) =>
                                handleSectionColorChange(section.id, next)
                              }
                              title="Section background"
                            />
                            <StyledIconButton
                              onClick={() => handleSectionDuplicate(section.id)}
                              title="Duplicate section"
                            >
                              ⎘
                            </StyledIconButton>
                            <StyledIconButton
                              onClick={() => handleSectionDelete(section.id)}
                              disabled={design.sections.length <= 1}
                              title="Delete section (keeps at least one)"
                            >
                              ✕
                            </StyledIconButton>
                          </>
                        )}
                      </StyledSectionHeader>
                      {!readOnly && (
                        <StyledPaddingRow>
                          <StyledPaddingLabel>Padding (px)</StyledPaddingLabel>
                          {(['Top', 'Bottom', 'Left', 'Right'] as const).map(
                            (side) => {
                              const key = `padding${side}` as
                                | 'paddingTop'
                                | 'paddingBottom'
                                | 'paddingLeft'
                                | 'paddingRight';
                              return (
                                <StyledPaddingField key={side}>
                                  {side[0]}
                                  <StyledPaddingInput
                                    type="number"
                                    min={0}
                                    max={200}
                                    value={section[key]}
                                    onChange={(e) =>
                                      handleSectionPaddingChange(
                                        section.id,
                                        side,
                                        Number(e.target.value),
                                      )
                                    }
                                  />
                                </StyledPaddingField>
                              );
                            },
                          )}
                        </StyledPaddingRow>
                      )}

                      <DragDropContext
                        onDragEnd={(result) =>
                          handleSectionModulesDragEnd(section.id, result)
                        }
                      >
                        <StyledColumnsRow
                          style={{
                            gridTemplateColumns: widths
                              .map((w) => `${w}fr`)
                              .join(' '),
                          }}
                        >
                          {section.columns.map((col, colIdx) => (
                            <Droppable
                              key={col.id}
                              droppableId={col.id}
                              type="module"
                              isDropDisabled={readOnly}
                            >
                              {(droppableProvided) => (
                                <StyledColumn
                                  ref={droppableProvided.innerRef}
                                  // oxlint-disable-next-line react/jsx-props-no-spreading
                                  {...droppableProvided.droppableProps}
                                >
                                  <StyledColumnHeader>
                                    Col {colIdx + 1}
                                  </StyledColumnHeader>
                                  {col.modules.map((m, moduleIdx) => {
                                    const isSelected =
                                      selectedModuleId === m.id;
                                    return (
                                      <Draggable
                                        key={m.id}
                                        draggableId={m.id}
                                        index={moduleIdx}
                                        isDragDisabled={readOnly}
                                      >
                                        {(draggableProvided) => (
                                          <StyledModuleRow
                                            ref={draggableProvided.innerRef}
                                            // oxlint-disable-next-line react/jsx-props-no-spreading
                                            {...draggableProvided.draggableProps}
                                            // oxlint-disable-next-line react/jsx-props-no-spreading
                                            {...draggableProvided.dragHandleProps}
                                            selected={isSelected}
                                          >
                                            <StyledModuleHeader>
                                              <StyledModuleHeaderLeft
                                                onClick={() =>
                                                  setSelectedModuleId(
                                                    isSelected ? null : m.id,
                                                  )
                                                }
                                              >
                                                <span
                                                  style={{ fontWeight: 600 }}
                                                >
                                                  {m.type[0].toUpperCase()}
                                                </span>
                                                <StyledModuleSummary>
                                                  {moduleSummary(m)}
                                                </StyledModuleSummary>
                                              </StyledModuleHeaderLeft>
                                              {!readOnly && (
                                                <>
                                                  <StyledIconButton
                                                    onClick={() =>
                                                      handleModuleMove(
                                                        section.id,
                                                        col.id,
                                                        m.id,
                                                        -1,
                                                      )
                                                    }
                                                    disabled={moduleIdx === 0}
                                                    title="Up"
                                                  >
                                                    ↑
                                                  </StyledIconButton>
                                                  <StyledIconButton
                                                    onClick={() =>
                                                      handleModuleMove(
                                                        section.id,
                                                        col.id,
                                                        m.id,
                                                        +1,
                                                      )
                                                    }
                                                    disabled={
                                                      moduleIdx ===
                                                      col.modules.length - 1
                                                    }
                                                    title="Down"
                                                  >
                                                    ↓
                                                  </StyledIconButton>
                                                  <StyledIconButton
                                                    onClick={() =>
                                                      handleModuleCopy(m)
                                                    }
                                                    title="Copy (paste in any campaign)"
                                                  >
                                                    ⧉
                                                  </StyledIconButton>
                                                  <StyledIconButton
                                                    onClick={() =>
                                                      handleModuleDuplicate(
                                                        section.id,
                                                        col.id,
                                                        m.id,
                                                      )
                                                    }
                                                    title="Duplicate"
                                                  >
                                                    ⎘
                                                  </StyledIconButton>
                                                  <StyledIconButton
                                                    onClick={() =>
                                                      handleModuleDelete(
                                                        section.id,
                                                        col.id,
                                                        m.id,
                                                      )
                                                    }
                                                    title="Delete"
                                                  >
                                                    ✕
                                                  </StyledIconButton>
                                                </>
                                              )}
                                            </StyledModuleHeader>
                                            {isSelected && !readOnly && (
                                              <StyledEditorPanel>
                                                {m.type === 'text' && (
                                                  <TextModuleEditor
                                                    module={m}
                                                    onChange={(next) =>
                                                      handleModuleChange(
                                                        section.id,
                                                        col.id,
                                                        m.id,
                                                        next,
                                                      )
                                                    }
                                                  />
                                                )}
                                                {m.type === 'heading' && (
                                                  <HeadingModuleEditor
                                                    module={m}
                                                    onChange={(next) =>
                                                      handleModuleChange(
                                                        section.id,
                                                        col.id,
                                                        m.id,
                                                        next,
                                                      )
                                                    }
                                                  />
                                                )}
                                                {m.type === 'button' && (
                                                  <ButtonModuleEditor
                                                    module={m}
                                                    onChange={(next) =>
                                                      handleModuleChange(
                                                        section.id,
                                                        col.id,
                                                        m.id,
                                                        next,
                                                      )
                                                    }
                                                  />
                                                )}
                                                {m.type === 'image' && (
                                                  <ImageModuleEditor
                                                    module={m}
                                                    onChange={(next) =>
                                                      handleModuleChange(
                                                        section.id,
                                                        col.id,
                                                        m.id,
                                                        next,
                                                      )
                                                    }
                                                  />
                                                )}
                                                {m.type === 'divider' && (
                                                  <DividerModuleEditor
                                                    module={m}
                                                    onChange={(next) =>
                                                      handleModuleChange(
                                                        section.id,
                                                        col.id,
                                                        m.id,
                                                        next,
                                                      )
                                                    }
                                                  />
                                                )}
                                                {m.type === 'spacer' && (
                                                  <SpacerModuleEditor
                                                    module={m}
                                                    onChange={(next) =>
                                                      handleModuleChange(
                                                        section.id,
                                                        col.id,
                                                        m.id,
                                                        next,
                                                      )
                                                    }
                                                  />
                                                )}
                                                {m.type === 'html' && (
                                                  <HtmlModuleEditor
                                                    module={m}
                                                    onChange={(next) =>
                                                      handleModuleChange(
                                                        section.id,
                                                        col.id,
                                                        m.id,
                                                        next,
                                                      )
                                                    }
                                                  />
                                                )}
                                                {m.type === 'social' && (
                                                  <SocialModuleEditor
                                                    module={m}
                                                    onChange={(next) =>
                                                      handleModuleChange(
                                                        section.id,
                                                        col.id,
                                                        m.id,
                                                        next,
                                                      )
                                                    }
                                                  />
                                                )}
                                                {m.type === 'footer' && (
                                                  <FooterModuleEditor
                                                    module={m}
                                                    onChange={(next) =>
                                                      handleModuleChange(
                                                        section.id,
                                                        col.id,
                                                        m.id,
                                                        next,
                                                      )
                                                    }
                                                  />
                                                )}
                                              </StyledEditorPanel>
                                            )}
                                          </StyledModuleRow>
                                        )}
                                      </Draggable>
                                    );
                                  })}
                                  {droppableProvided.placeholder}
                                  {!readOnly && (
                                    <StyledAddModuleRow>
                                      {MODULE_LIBRARY.map((entry) => (
                                        <StyledAddModuleButton
                                          key={entry.type}
                                          onClick={() =>
                                            handleModuleAdd(
                                              section.id,
                                              col.id,
                                              entry.type,
                                            )
                                          }
                                        >
                                          + {entry.label}
                                        </StyledAddModuleButton>
                                      ))}
                                      {clipboardModuleType !== null && (
                                        <StyledAddModuleButton
                                          onClick={() =>
                                            handleModulePaste(
                                              section.id,
                                              col.id,
                                            )
                                          }
                                          title={`Paste ${clipboardModuleType} from clipboard`}
                                        >
                                          📋 Paste
                                        </StyledAddModuleButton>
                                      )}
                                    </StyledAddModuleRow>
                                  )}
                                </StyledColumn>
                              )}
                            </Droppable>
                          ))}
                        </StyledColumnsRow>
                      </DragDropContext>
                    </StyledSectionCard>
                  )}
                />
              );
            })}
          </StyledSectionList>
        }
      />

      {!readOnly && (
        <StyledAddSectionRow>
          <span
            style={{ marginRight: 'auto', color: 'var(--font-color-tertiary)' }}
          >
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
