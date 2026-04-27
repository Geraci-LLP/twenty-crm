import { styled } from '@linaria/react';
import { useEffect, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import {
  logVisit,
  readVisits,
  type Visit,
} from '@/navigation/utils/recentlyVisitedStore';
import { useAtomFamilySelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue';
import { viewsByObjectMetadataIdFamilySelector } from '@/views/states/selectors/viewsByObjectMetadataIdFamilySelector';

// Contextual second-column sidebar for marketing routes. Layout:
//   - Title + subtitle
//   - "+ New" button → section's index page (Twenty's existing create
//     UI is on the index page; we don't try to spawn the side panel
//     directly because that integration is heavier than it should be
//     for this PR)
//   - Views: saved views for the section's object, navigates with
//     ?viewId=<uuid> which Twenty's RecordIndexPage already reads
//   - Pinned: localStorage-backed favorites, persists across sessions
//   - Recent: top 5 most-recent records, click to open, star to pin
//
// Self-detects the current route via useLocation. Returns null for
// non-marketing routes — DefaultLayout renders it unconditionally
// but pays nothing on routes that don't need it.

type RecentRecord = ObjectRecord & {
  name?: string | null;
};

type SectionConfig = {
  title: string;
  subtitle: string;
  objectNameSingular: string;
  objectNamePlural: string;
  showPath: string;
};

// All sections that get the contextual sidebar. Marketing was where
// this started; people + companies join because the same nav UX is
// useful for any record-list section the user lives in.
const SECTION_CONFIGS: SectionConfig[] = [
  {
    title: 'Email Campaigns',
    subtitle: 'One-off and scheduled marketing emails',
    objectNameSingular: 'campaign',
    objectNamePlural: 'campaigns',
    showPath: '/object/campaign',
  },
  {
    title: 'Marketing Campaigns',
    subtitle: 'Campaign-level groupings',
    objectNameSingular: 'marketingCampaign',
    objectNamePlural: 'marketingCampaigns',
    showPath: '/object/marketingCampaign',
  },
  {
    title: 'Sequences',
    subtitle: 'Multi-step automated cadences',
    objectNameSingular: 'sequence',
    objectNamePlural: 'sequences',
    showPath: '/object/sequence',
  },
  {
    title: 'Forms',
    subtitle: 'Lead-capture forms and embeds',
    objectNameSingular: 'form',
    objectNamePlural: 'forms',
    showPath: '/object/form',
  },
  {
    title: 'People',
    subtitle: 'Contacts and audience members',
    objectNameSingular: 'person',
    objectNamePlural: 'people',
    showPath: '/object/person',
  },
  {
    title: 'Companies',
    subtitle: 'Organizations and accounts',
    objectNameSingular: 'company',
    objectNamePlural: 'companies',
    showPath: '/object/company',
  },
];

const getConfigForPath = (pathname: string): SectionConfig | null => {
  // Record-list routes: /objects/<plural>
  for (const cfg of SECTION_CONFIGS) {
    if (pathname.startsWith(`/objects/${cfg.objectNamePlural}`)) return cfg;
  }
  // Record-show routes: /object/<singular>/<id>
  for (const cfg of SECTION_CONFIGS) {
    if (pathname.startsWith(`${cfg.showPath}/`)) return cfg;
  }
  // Marketing analytics page — uses Email Campaigns as the context so
  // pinned/recent emails are still one click away.
  if (pathname.startsWith('/marketing/analytics')) {
    return {
      title: 'Analytics',
      subtitle: 'Marketing performance',
      objectNameSingular: 'campaign',
      objectNamePlural: 'campaigns',
      showPath: '/object/campaign',
    };
  }
  return null;
};

// Extract the record id from a /object/<singular>/<id>[/<rest>] URL.
// Returns null if the current path isn't a show-page route for the
// given section.
const getCurrentRecordId = (
  pathname: string,
  showPath: string,
): string | null => {
  if (!pathname.startsWith(`${showPath}/`)) return null;
  const after = pathname.slice(showPath.length + 1);
  const id = after.split('/')[0];
  return id !== '' ? id : null;
};

// Pinned records are localStorage-only — no server roundtrip. Keyed by
// objectNameSingular so a user's pinned campaigns don't bleed into their
// pinned sequences.
const PINNED_STORAGE_KEY = 'twenty.marketingSidebar.pinned';

type PinnedMap = Record<string, string[]>;

const readPinned = (): PinnedMap => {
  try {
    const raw = window.localStorage.getItem(PINNED_STORAGE_KEY);
    if (raw === null || raw === '') return {};
    const parsed = JSON.parse(raw) as PinnedMap;
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed;
  } catch {
    return {};
  }
};

const writePinned = (next: PinnedMap): void => {
  try {
    window.localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota / disabled storage
  }
};

const StyledSidebar = styled.aside<{ collapsed: boolean }>`
  background: ${themeCssVariables.background.primary};
  border-right: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  min-width: 0;
  overflow-y: auto;
  position: relative;
  transition: width 0.18s;
  width: ${(p) => (p.collapsed ? '24px' : '240px')};
`;

const StyledCollapseToggle = styled.button<{ collapsed: boolean }>`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: 50%;
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  display: flex;
  font-size: 11px;
  height: 18px;
  justify-content: center;
  padding: 0;
  position: absolute;
  right: -9px;
  top: 14px;
  width: 18px;
  z-index: 1;
  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledCollapsedHint = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 10px;
  letter-spacing: 0.08em;
  padding-top: 40px;
  text-align: center;
  text-transform: uppercase;
  writing-mode: vertical-rl;
`;

const StyledHeader = styled.div`
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 20px 14px;
`;

const StyledTitleRow = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: space-between;
`;

const StyledTitle = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: 16px;
  font-weight: ${themeCssVariables.font.weight.semiBold};
  letter-spacing: -0.01em;
`;

const StyledHelpTriggerButton = styled.button`
  align-items: center;
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: 50%;
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  font-family: ${themeCssVariables.font.family};
  font-size: 11px;
  font-weight: ${themeCssVariables.font.weight.medium};
  height: 18px;
  justify-content: center;
  padding: 0;
  width: 18px;
  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledSubtitle = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 12px;
`;

const StyledNewButtonRow = styled.div`
  padding: 12px 12px 4px;
`;

/* oxlint-disable twenty/no-hardcoded-colors */
const StyledNewButton = styled.button`
  align-items: center;
  background: ${themeCssVariables.color.orange};
  border: 0;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: #ffffff;
  cursor: pointer;
  display: flex;
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  font-weight: ${themeCssVariables.font.weight.medium};
  gap: 6px;
  justify-content: center;
  padding: 8px 12px;
  text-decoration: none;
  width: 100%;
  &:hover {
    filter: brightness(0.95);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const StyledCreateForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
`;

const StyledCreateInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: 12px;
  padding: 6px 10px;
  &:focus {
    border-color: ${themeCssVariables.color.orange};
    outline: 0;
  }
`;

const StyledCreateRow = styled.div`
  display: flex;
  gap: 6px;
`;

const StyledCreateActionButton = styled.button<{ primary?: boolean }>`
  background: ${(p) =>
    p.primary === true
      ? themeCssVariables.color.orange
      : themeCssVariables.background.transparent.lighter};
  border: 1px solid
    ${(p) =>
      p.primary === true
        ? themeCssVariables.color.orange
        : themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${(p) =>
    p.primary === true ? '#ffffff' : themeCssVariables.font.color.primary};
  cursor: pointer;
  flex: 1;
  font-family: ${themeCssVariables.font.family};
  font-size: 11.5px;
  padding: 5px 10px;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
/* oxlint-enable twenty/no-hardcoded-colors */

const StyledSearchRow = styled.div`
  padding: 0 12px 4px;
`;

const StyledSearchInput = styled.input`
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: 12px;
  padding: 6px 10px;
  width: 100%;
  &:focus {
    border-color: ${themeCssVariables.color.orange};
    outline: 0;
  }
  &::placeholder {
    color: ${themeCssVariables.font.color.tertiary};
  }
`;

const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 12px 12px 4px;
`;

const StyledSectionLabel = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 11px;
  font-weight: ${themeCssVariables.font.weight.semiBold};
  letter-spacing: 0.06em;
  padding: 6px 8px;
  text-transform: uppercase;
`;

const StyledItemRow = styled.div<{
  active?: boolean;
  isDragging?: boolean;
  isDropTarget?: boolean;
  isHighlighted?: boolean;
}>`
  align-items: center;
  background: ${(p) => {
    if (p.isHighlighted === true)
      return themeCssVariables.background.transparent.medium;
    if (p.active === true)
      return themeCssVariables.background.transparent.lighter;
    return 'transparent';
  }};
  border-left: 2px solid
    ${(p) =>
      p.isHighlighted === true
        ? themeCssVariables.color.orange
        : 'transparent'};
  border-radius: ${themeCssVariables.border.radius.sm};
  border-top: 2px solid
    ${(p) =>
      p.isDropTarget === true ? themeCssVariables.color.orange : 'transparent'};
  display: flex;
  opacity: ${(p) => (p.isDragging === true ? 0.4 : 1)};
  scroll-margin: 60px;
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
  }
`;

const StyledDragHandle = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  cursor: grab;
  flex-shrink: 0;
  font-size: 12px;
  letter-spacing: -1px;
  line-height: 1;
  padding: 0 4px 0 6px;
  user-select: none;
  &:active {
    cursor: grabbing;
  }
  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledItemLink = styled(Link)`
  align-items: center;
  background: transparent;
  border: 0;
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  display: flex;
  flex: 1;
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  gap: 10px;
  min-width: 0;
  padding: 7px 10px;
  text-align: left;
  text-decoration: none;
`;

const StyledItemLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledItemBadge = styled.span`
  background: ${themeCssVariables.background.transparent.lighter};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.tertiary};
  flex-shrink: 0;
  font-size: 10px;
  font-weight: ${themeCssVariables.font.weight.medium};
  letter-spacing: 0.04em;
  padding: 1px 6px;
  text-transform: uppercase;
`;

const StyledPinButton = styled.button<{ pinned: boolean }>`
  background: transparent;
  border: 0;
  color: ${(p) =>
    p.pinned
      ? themeCssVariables.color.orange
      : themeCssVariables.font.color.tertiary};
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  &:hover {
    color: ${themeCssVariables.color.orange};
  }
`;

const StyledEmpty = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 12px;
  padding: 6px 10px;
`;

// Help overlay — fixed full-screen dimmer with a centered card listing
// every keyboard shortcut the sidebar reacts to. Triggered by "?" and
// closed by Escape, click-outside, or the close button.
/* oxlint-disable twenty/no-hardcoded-colors */
const StyledHelpBackdrop = styled.div`
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: 9999;
`;

const StyledHelpCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
  padding: 22px 24px;
  width: 90%;
`;
/* oxlint-enable twenty/no-hardcoded-colors */

const StyledHelpHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const StyledHelpTitle = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: 15px;
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledHelpClose = styled.button`
  background: transparent;
  border: 0;
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 4px 8px;
  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledHelpRow = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 4px 0;
`;

const StyledHelpDescription = styled.span`
  color: ${themeCssVariables.font.color.secondary};
  font-size: 12.5px;
`;

const StyledHelpKey = styled.kbd`
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: 11px;
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: 2px 7px;
  white-space: nowrap;
`;

const StyledHelpHint = styled.div`
  border-top: 1px solid ${themeCssVariables.border.color.light};
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 11px;
  margin-top: 4px;
  padding-top: 10px;
`;

type Shortcut = { keys: string; description: string };
const SHORTCUTS: Shortcut[] = [
  { keys: '?', description: 'Open this shortcut help' },
  { keys: '/', description: 'Focus the sidebar filter' },
  { keys: '↑ ↓', description: 'Walk filtered results' },
  { keys: 'Enter', description: 'Open highlighted / first match' },
  { keys: '[', description: 'Collapse / expand sidebar' },
  { keys: 'g 1', description: 'Go to Email Campaigns' },
  { keys: 'g 2', description: 'Go to Marketing Campaigns' },
  { keys: 'g 3', description: 'Go to Sequences' },
  { keys: 'g 4', description: 'Go to Forms' },
  { keys: 'g 5', description: 'Go to Analytics' },
  { keys: 'g 6', description: 'Go to Audiences (People)' },
  { keys: 'Esc', description: 'Close dialogs / cancel forms' },
];

export const MarketingToolSidebar = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  // oxlint-disable-next-line twenty/no-navigate-prefer-link -- jumping
  // to the first match on Enter is dynamic navigation, not a static
  // link destination.
  const navigate = useNavigate();
  const config = getConfigForPath(location.pathname);
  const [filterText, setFilterText] = useState('');
  // Callback-ref pattern: capture the input element in component state
  // so the global keydown handler can call .focus() on it. Avoids
  // useRef which the codebase discourages for state storage.
  const [searchInputEl, setSearchInputEl] = useState<HTMLInputElement | null>(
    null,
  );

  // Inline create form state. Click "+ New" → opens a small form below
  // with a name input + create button. On submit creates the record
  // via Twenty's useCreateOneRecord and navigates to its show page.
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Sidebar collapse state, persisted to localStorage so the user's
  // preference survives reloads.
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return (
        window.localStorage.getItem('twenty.marketingSidebar.collapsed') === '1'
      );
    } catch {
      return false;
    }
  });
  const toggleCollapsed = () => {
    setIsCollapsed((c) => {
      const next = !c;
      try {
        window.localStorage.setItem(
          'twenty.marketingSidebar.collapsed',
          next ? '1' : '0',
        );
      } catch {
        // ignore quota / disabled storage
      }
      return next;
    });
  };

  // Help overlay state. Opens on "?", closes on Escape / backdrop click /
  // close button. Independent of the collapse state so the user can
  // discover shortcuts even when the sidebar is collapsed.
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Drag-to-reorder state for pinned items. We hold the dragged record's
  // id and the id of the row currently under the pointer (drop target)
  // so we can render the orange insertion indicator. Both are reset on
  // drop / dragend.
  const [draggingPinId, setDraggingPinId] = useState<string | null>(null);
  const [dropTargetPinId, setDropTargetPinId] = useState<string | null>(null);

  // Keyboard navigation through filtered results. Pressing ArrowDown /
  // ArrowUp inside the search input walks the highlighted item; Enter
  // opens it. -1 means "no highlight, fall back to first match" so an
  // empty filter or untouched search still has the original behavior.
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  // Reset highlight whenever the filter text changes so a new query
  // doesn't keep the previous query's highlight pointing at a row that
  // may now be off-screen / out of the filtered list.
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filterText]);

  // Scroll the currently-highlighted row into view on each arrow step.
  // The render below stamps data-highlighted="true" on the highlighted
  // row; we look it up here after paint and call scrollIntoView with
  // block:'nearest' so the row settles inside the sidebar's overflow
  // area without yanking the page itself.
  useEffect(() => {
    if (highlightedIndex < 0) return;
    const el = document.querySelector<HTMLDivElement>(
      '[data-highlighted="true"]',
    );
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [highlightedIndex]);

  // Browser-history-style recently-visited tracker. Mirrors localStorage
  // into component state so re-renders pick up new visits and so
  // mutations from other tabs sync via the storage event.
  const [recentVisits, setRecentVisits] = useState<Visit[]>(() => readVisits());
  useEffect(() => {
    const refresh = () => setRecentVisits(readVisits());
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // Create-one hook for the current section's object. Always call with
  // a fallback name so the hook list stays stable across renders.
  const { createOneRecord } = useCreateOneRecord<RecentRecord>({
    objectNameSingular: config?.objectNameSingular ?? 'campaign',
    shouldMatchRootQueryFilter: true,
  });

  // Cross-section recent feed shown on /marketing/analytics. Skipped on
  // every other route. Queries the four marketing record types in
  // parallel; we merge + sort below by updatedAt.
  const isOnAnalytics = location.pathname.startsWith('/marketing/analytics');
  const xRecentCampaigns = useFindManyRecords<RecentRecord>({
    objectNameSingular: 'campaign',
    limit: 5,
    orderBy: [{ updatedAt: 'DescNullsLast' }],
    recordGqlFields: { id: true, name: true, updatedAt: true },
    skip: !isOnAnalytics,
  });
  const xRecentMcs = useFindManyRecords<RecentRecord>({
    objectNameSingular: 'marketingCampaign',
    limit: 5,
    orderBy: [{ updatedAt: 'DescNullsLast' }],
    recordGqlFields: { id: true, name: true, updatedAt: true },
    skip: !isOnAnalytics,
  });
  const xRecentSequences = useFindManyRecords<RecentRecord>({
    objectNameSingular: 'sequence',
    limit: 5,
    orderBy: [{ updatedAt: 'DescNullsLast' }],
    recordGqlFields: { id: true, name: true, updatedAt: true },
    skip: !isOnAnalytics,
  });
  const xRecentForms = useFindManyRecords<RecentRecord>({
    objectNameSingular: 'form',
    limit: 5,
    orderBy: [{ updatedAt: 'DescNullsLast' }],
    recordGqlFields: { id: true, name: true, updatedAt: true },
    skip: !isOnAnalytics,
  });

  // Global keyboard shortcuts on marketing routes:
  //   "/"   focus sidebar filter
  //   "?"   open shortcut help overlay
  //   "["   toggle sidebar collapse
  //   Esc   close help overlay (when open)
  // All skip when the user is already typing in a form/contenteditable
  // element so we don't intercept their input.
  useEffect(() => {
    if (!config) return;
    const isTypingInForm = (target: EventTarget | null): boolean => {
      const el = target as HTMLElement | null;
      const tag = el?.tagName ?? '';
      return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        el?.isContentEditable === true
      );
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // Escape always closes the help overlay regardless of focus.
      if (e.key === 'Escape' && isHelpOpen) {
        e.preventDefault();
        setIsHelpOpen(false);
        return;
      }
      if (isTypingInForm(e.target)) return;
      if (e.key === '/') {
        e.preventDefault();
        searchInputEl?.focus();
        searchInputEl?.select();
        return;
      }
      // "?" is shift+/ on US layouts; check the literal key so we catch
      // any layout that produces the glyph.
      if (e.key === '?') {
        e.preventDefault();
        setIsHelpOpen((open) => !open);
        return;
      }
      if (e.key === '[') {
        e.preventDefault();
        toggleCollapsed();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // toggleCollapsed and setIsHelpOpen are stable across renders;
    // intentionally only re-bind on config / input element / overlay-state
    // changes so the listener captures the freshest values without
    // re-creating itself on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, searchInputEl, isHelpOpen]);

  // Object metadata — needed to resolve the views family selector. The
  // hook works even when called with a missing/invalid name (it returns
  // a stub), so we always call it, then guard usage.
  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular: config?.objectNameSingular ?? 'campaign',
  });

  const viewsByObjectMetadataIdFamily = useAtomFamilySelectorValue(
    viewsByObjectMetadataIdFamilySelector,
    objectMetadataItem.id,
  );
  const views = viewsByObjectMetadataIdFamily;

  // Recent records — top 5 by createdAt desc.
  const { records: recentRecords, loading: recentLoading } =
    useFindManyRecords<RecentRecord>({
      objectNameSingular: config?.objectNameSingular ?? 'campaign',
      limit: 5,
      orderBy: [{ createdAt: 'DescNullsLast' }],
      recordGqlFields: { id: true, name: true },
      skip: !config,
    });

  // Pinned records — fetch by id once we know which ids are pinned for
  // the current section. Pin state is in localStorage; useState mirrors
  // it for re-render on toggle.
  const [pinnedMap, setPinnedMap] = useState<PinnedMap>(() => readPinned());
  const pinnedIds = config ? (pinnedMap[config.objectNameSingular] ?? []) : [];

  const { records: pinnedRecords } = useFindManyRecords<RecentRecord>({
    objectNameSingular: config?.objectNameSingular ?? 'campaign',
    limit: 25,
    filter:
      pinnedIds.length > 0
        ? { id: { in: pinnedIds } }
        : { id: { eq: 'no-match' } },
    recordGqlFields: { id: true, name: true },
    skip: !config || pinnedIds.length === 0,
  });

  // Re-read pinned map on focus + storage event so toggling in one tab
  // updates other tabs.
  useEffect(() => {
    const refresh = () => setPinnedMap(readPinned());
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // Log visits to record show pages. Computed up here (before the
  // early return) so the useEffect call order stays stable across
  // renders. We re-derive the show-path record id and name lookup
  // inside the effect; the deps trigger on URL changes.
  useEffect(() => {
    if (!config) return;
    const recordId = getCurrentRecordId(location.pathname, config.showPath);
    if (recordId === null) return;
    const fromList =
      recentRecords.find((r) => r.id === recordId) ??
      pinnedRecords.find((r) => r.id === recordId);
    logVisit({
      objectNameSingular: config.objectNameSingular,
      id: recordId,
      name: fromList?.name ?? null,
    });
    setRecentVisits(readVisits());
  }, [config, location.pathname, recentRecords, pinnedRecords]);

  if (!config) return null;

  const indexPath = `/objects/${config.objectNamePlural}`;
  const currentViewId = searchParams.get('viewId');
  const currentRecordId = getCurrentRecordId(
    location.pathname,
    config.showPath,
  );
  const isOnIndex =
    location.pathname.startsWith(`/objects/${config.objectNamePlural}`) &&
    !isDefined(currentViewId);
  const isPinned = (id: string): boolean => pinnedIds.includes(id);

  // Lower-case substring match used for the sidebar's search input.
  // Matches against the record/view name; empty filter passes everything.
  const matchesFilter = (name: string | null | undefined): boolean => {
    if (filterText === '') return true;
    return (name ?? '').toLowerCase().includes(filterText.toLowerCase());
  };

  const filteredViews = views.filter((v) => matchesFilter(v.name));
  const filteredPinned = pinnedRecords.filter((r) => matchesFilter(r.name));
  const filteredRecent = recentRecords
    .filter((r) => !isPinned(r.id))
    .filter((r) => matchesFilter(r.name));

  // Merge the four cross-section recent queries into one updatedAt-
  // sorted feed. Each entry remembers its source object so we can
  // route to the right show page and stamp the right badge.
  type CrossRecord = {
    id: string;
    name: string | null;
    updatedAt: string | null;
    objectNameSingular: string;
    showPath: string;
    badge: string;
  };
  const crossRecent: CrossRecord[] = isOnAnalytics
    ? [
        ...xRecentCampaigns.records.map<CrossRecord>((r) => ({
          id: r.id,
          name: r.name ?? null,
          updatedAt:
            (r as RecentRecord & { updatedAt?: string }).updatedAt ?? null,
          objectNameSingular: 'campaign',
          showPath: '/object/campaign',
          badge: 'Email',
        })),
        ...xRecentMcs.records.map<CrossRecord>((r) => ({
          id: r.id,
          name: r.name ?? null,
          updatedAt:
            (r as RecentRecord & { updatedAt?: string }).updatedAt ?? null,
          objectNameSingular: 'marketingCampaign',
          showPath: '/object/marketingCampaign',
          badge: 'MC',
        })),
        ...xRecentSequences.records.map<CrossRecord>((r) => ({
          id: r.id,
          name: r.name ?? null,
          updatedAt:
            (r as RecentRecord & { updatedAt?: string }).updatedAt ?? null,
          objectNameSingular: 'sequence',
          showPath: '/object/sequence',
          badge: 'Seq',
        })),
        ...xRecentForms.records.map<CrossRecord>((r) => ({
          id: r.id,
          name: r.name ?? null,
          updatedAt:
            (r as RecentRecord & { updatedAt?: string }).updatedAt ?? null,
          objectNameSingular: 'form',
          showPath: '/object/form',
          badge: 'Form',
        })),
      ]
        .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
        .slice(0, 8)
    : [];
  const filteredCrossRecent = crossRecent.filter((r) => matchesFilter(r.name));

  // Map visit objectNameSingular → short badge for the "Last visited"
  // list. Anything not in this map shows the singular as-is.
  const badgeForObject = (objectNameSingular: string): string => {
    const section = SECTION_CONFIGS.find(
      (s) => s.objectNameSingular === objectNameSingular,
    );
    if (!section) return objectNameSingular;
    // Compact 1-4 char badge derived from the section title.
    if (section.objectNameSingular === 'campaign') return 'Email';
    if (section.objectNameSingular === 'marketingCampaign') return 'MC';
    if (section.objectNameSingular === 'sequence') return 'Seq';
    if (section.objectNameSingular === 'form') return 'Form';
    if (section.objectNameSingular === 'person') return 'Person';
    if (section.objectNameSingular === 'company') return 'Co';
    return objectNameSingular;
  };
  const filteredVisits = recentVisits
    .filter((v) => v.id !== currentRecordId)
    .filter((v) => matchesFilter(v.name))
    .slice(0, 8);
  const hasAnyResults =
    filteredViews.length > 0 ||
    filteredPinned.length > 0 ||
    filteredRecent.length > 0;

  const togglePin = (id: string) => {
    const next = { ...pinnedMap };
    const list = next[config.objectNameSingular] ?? [];
    next[config.objectNameSingular] = list.includes(id)
      ? list.filter((x) => x !== id)
      : [...list, id];
    setPinnedMap(next);
    writePinned(next);
  };

  // Move a pinned id within the current section's pinned list. The
  // dragged id is removed from its current position and re-inserted
  // immediately *before* the target id; if target is null the item moves
  // to the end. Persists to localStorage so the order survives reloads.
  const reorderPinned = (sourceId: string, targetId: string | null) => {
    const list = pinnedMap[config.objectNameSingular] ?? [];
    if (!list.includes(sourceId)) return;
    if (sourceId === targetId) return;
    const without = list.filter((x) => x !== sourceId);
    const insertAt =
      targetId === null
        ? without.length
        : without.findIndex((x) => x === targetId);
    const safeIndex = insertAt === -1 ? without.length : insertAt;
    const reordered = [
      ...without.slice(0, safeIndex),
      sourceId,
      ...without.slice(safeIndex),
    ];
    const nextMap = { ...pinnedMap, [config.objectNameSingular]: reordered };
    setPinnedMap(nextMap);
    writePinned(nextMap);
  };

  // The pinned records query returns rows in arbitrary order (filter
  // {id: {in: [...]}} doesn't preserve list order). Reorder the loaded
  // records to match pinnedIds so the UI reflects the user's drag order.
  const orderedPinnedRecords: RecentRecord[] = pinnedIds
    .map((id) => filteredPinned.find((r) => r.id === id))
    .filter((r): r is RecentRecord => r !== undefined);

  // Flat list of all clickable items in current render order. Used for
  // arrow-key keyboard navigation: highlightedIndex points into this
  // list, ArrowDown/Up walks it, Enter opens flatItems[highlightedIndex].
  // Each entry carries a unique React-style key so the row can match
  // itself against the highlighted entry without index-counting drift.
  type FlatItem = { key: string; to: string };
  const flatItems: FlatItem[] = [
    ...filteredViews.map<FlatItem>((v) => ({
      key: `view:${v.id}`,
      to: `${indexPath}?viewId=${v.id}`,
    })),
    ...orderedPinnedRecords.map<FlatItem>((r) => ({
      key: `pinned:${r.id}`,
      to: `${config.showPath}/${r.id}`,
    })),
    ...filteredVisits.map<FlatItem>((v) => ({
      key: `visit:${v.objectNameSingular}-${v.id}`,
      to: `/object/${v.objectNameSingular}/${v.id}`,
    })),
    ...filteredCrossRecent.map<FlatItem>((r) => ({
      key: `cross:${r.objectNameSingular}-${r.id}`,
      to: `${r.showPath}/${r.id}`,
    })),
    ...filteredRecent.map<FlatItem>((r) => ({
      key: `recent:${r.id}`,
      to: `${config.showPath}/${r.id}`,
    })),
  ];
  const highlightedKey =
    highlightedIndex >= 0 && highlightedIndex < flatItems.length
      ? flatItems[highlightedIndex].key
      : null;

  return (
    <StyledSidebar collapsed={isCollapsed}>
      {isHelpOpen && (
        <StyledHelpBackdrop
          onClick={() => setIsHelpOpen(false)}
          role="presentation"
        >
          <StyledHelpCard
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="marketing-sidebar-help-title"
          >
            <StyledHelpHeader>
              <StyledHelpTitle id="marketing-sidebar-help-title">
                Keyboard shortcuts
              </StyledHelpTitle>
              <StyledHelpClose
                type="button"
                onClick={() => setIsHelpOpen(false)}
                aria-label="Close shortcut help"
              >
                ×
              </StyledHelpClose>
            </StyledHelpHeader>
            {SHORTCUTS.map((s) => (
              <StyledHelpRow key={s.keys}>
                <StyledHelpDescription>{s.description}</StyledHelpDescription>
                <StyledHelpKey>{s.keys}</StyledHelpKey>
              </StyledHelpRow>
            ))}
            <StyledHelpHint>
              Tip: shortcuts ignore key presses while you&apos;re typing in a
              form or text editor.
            </StyledHelpHint>
          </StyledHelpCard>
        </StyledHelpBackdrop>
      )}
      <StyledCollapseToggle
        collapsed={isCollapsed}
        onClick={toggleCollapsed}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        type="button"
      >
        {isCollapsed ? '›' : '‹'}
      </StyledCollapseToggle>
      {isCollapsed ? (
        <StyledCollapsedHint>{config.title}</StyledCollapsedHint>
      ) : (
        <>
          <StyledHeader>
            <StyledTitleRow>
              <StyledTitle>{config.title}</StyledTitle>
              <StyledHelpTriggerButton
                type="button"
                onClick={() => setIsHelpOpen(true)}
                title="Keyboard shortcuts (?)"
                aria-label="Show keyboard shortcuts"
              >
                ?
              </StyledHelpTriggerButton>
            </StyledTitleRow>
            <StyledSubtitle>{config.subtitle}</StyledSubtitle>
          </StyledHeader>

          <StyledNewButtonRow>
            {isCreateOpen ? (
              <StyledCreateForm
                onSubmit={async (e) => {
                  e.preventDefault();
                  const trimmed = newName.trim();
                  if (trimmed === '' || isCreating) return;
                  setIsCreating(true);
                  try {
                    const created = await createOneRecord({
                      name: trimmed,
                    } as Partial<RecentRecord>);
                    setIsCreateOpen(false);
                    setNewName('');
                    if (isDefined(created?.id)) {
                      navigate(`${config.showPath}/${created.id}`);
                    }
                  } finally {
                    setIsCreating(false);
                  }
                }}
              >
                <StyledCreateInput
                  autoFocus
                  type="text"
                  placeholder={`New ${config.title.replace(/s$/, '').toLowerCase()} name`}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsCreateOpen(false);
                      setNewName('');
                    }
                  }}
                  disabled={isCreating}
                />
                <StyledCreateRow>
                  <StyledCreateActionButton
                    type="button"
                    onClick={() => {
                      setIsCreateOpen(false);
                      setNewName('');
                    }}
                    disabled={isCreating}
                  >
                    Cancel
                  </StyledCreateActionButton>
                  <StyledCreateActionButton
                    primary
                    type="submit"
                    disabled={isCreating || newName.trim() === ''}
                  >
                    {isCreating ? 'Creating…' : 'Create'}
                  </StyledCreateActionButton>
                </StyledCreateRow>
              </StyledCreateForm>
            ) : (
              <StyledNewButton
                type="button"
                onClick={() => setIsCreateOpen(true)}
              >
                + New {config.title.replace(/s$/, '').toLowerCase()}
              </StyledNewButton>
            )}
          </StyledNewButtonRow>

          <StyledSearchRow>
            <StyledSearchInput
              ref={setSearchInputEl}
              type="search"
              placeholder="Filter — / focus · ↑↓ pick · Enter open"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              onKeyDown={(e) => {
                // Arrow-key walk through filtered results.
                if (e.key === 'ArrowDown') {
                  if (flatItems.length === 0) return;
                  e.preventDefault();
                  setHighlightedIndex(
                    (i) => (i + 1) % Math.max(flatItems.length, 1),
                  );
                  return;
                }
                if (e.key === 'ArrowUp') {
                  if (flatItems.length === 0) return;
                  e.preventDefault();
                  setHighlightedIndex(
                    (i) =>
                      (i - 1 + flatItems.length) %
                      Math.max(flatItems.length, 1),
                  );
                  return;
                }
                if (e.key === 'Escape') {
                  // Clear highlight and unfocus so subsequent "/" can re-
                  // focus cleanly. Don't blow away the filter text — user
                  // may still want to refine.
                  setHighlightedIndex(-1);
                  searchInputEl?.blur();
                  return;
                }
                if (e.key !== 'Enter') return;
                e.preventDefault();
                // Highlighted item wins; otherwise fall back to first match.
                let target: string | null = null;
                if (
                  highlightedIndex >= 0 &&
                  highlightedIndex < flatItems.length
                ) {
                  target = flatItems[highlightedIndex].to;
                } else if (filterText !== '' && flatItems.length > 0) {
                  target = flatItems[0].to;
                }
                if (target !== null) {
                  navigate(target);
                  setFilterText('');
                  setHighlightedIndex(-1);
                }
              }}
              aria-label="Filter sidebar"
            />
          </StyledSearchRow>

          <StyledSection>
            <StyledSectionLabel>Section</StyledSectionLabel>
            <StyledItemRow active={isOnIndex}>
              <StyledItemLink to={indexPath}>
                <StyledItemLabel>
                  All {config.title.toLowerCase()}
                </StyledItemLabel>
              </StyledItemLink>
            </StyledItemRow>
          </StyledSection>

          {filterText !== '' && !hasAnyResults && (
            <StyledSection>
              <StyledEmpty>No matches for &quot;{filterText}&quot;</StyledEmpty>
            </StyledSection>
          )}

          {filteredViews.length > 0 && (
            <StyledSection>
              <StyledSectionLabel>Views</StyledSectionLabel>
              {filteredViews.map((view) => (
                <StyledItemRow
                  key={view.id}
                  data-sidebar-row-key={`view:${view.id}`}
                  data-highlighted={
                    highlightedKey === `view:${view.id}` ? 'true' : undefined
                  }
                  active={currentViewId === view.id}
                  isHighlighted={highlightedKey === `view:${view.id}`}
                >
                  <StyledItemLink to={`${indexPath}?viewId=${view.id}`}>
                    <StyledItemLabel>{view.name}</StyledItemLabel>
                  </StyledItemLink>
                </StyledItemRow>
              ))}
            </StyledSection>
          )}

          {pinnedIds.length > 0 && orderedPinnedRecords.length > 0 && (
            <StyledSection
              onDragOver={(e) => {
                // Allow drop into empty space at the bottom of the section
                // by clearing the per-row target when the pointer leaves
                // any specific row.
                if (draggingPinId !== null) e.preventDefault();
              }}
              onDrop={(e) => {
                if (draggingPinId === null) return;
                e.preventDefault();
                // If the drop target is unset (pointer in section gap),
                // append to the end.
                reorderPinned(draggingPinId, dropTargetPinId);
                setDraggingPinId(null);
                setDropTargetPinId(null);
              }}
            >
              <StyledSectionLabel>Pinned</StyledSectionLabel>
              {orderedPinnedRecords.map((record) => (
                <StyledItemRow
                  key={record.id}
                  data-sidebar-row-key={`pinned:${record.id}`}
                  data-highlighted={
                    highlightedKey === `pinned:${record.id}`
                      ? 'true'
                      : undefined
                  }
                  active={currentRecordId === record.id}
                  isDragging={draggingPinId === record.id}
                  isDropTarget={
                    dropTargetPinId === record.id && draggingPinId !== record.id
                  }
                  isHighlighted={highlightedKey === `pinned:${record.id}`}
                  draggable
                  onDragStart={(e) => {
                    setDraggingPinId(record.id);
                    e.dataTransfer.effectAllowed = 'move';
                    // Some browsers require setData for drag to start.
                    e.dataTransfer.setData('text/plain', record.id);
                  }}
                  onDragEnter={() => {
                    if (draggingPinId !== null && draggingPinId !== record.id) {
                      setDropTargetPinId(record.id);
                    }
                  }}
                  onDragOver={(e) => {
                    if (draggingPinId !== null) {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }
                  }}
                  onDrop={(e) => {
                    if (draggingPinId === null) return;
                    e.preventDefault();
                    e.stopPropagation();
                    reorderPinned(draggingPinId, record.id);
                    setDraggingPinId(null);
                    setDropTargetPinId(null);
                  }}
                  onDragEnd={() => {
                    setDraggingPinId(null);
                    setDropTargetPinId(null);
                  }}
                >
                  <StyledDragHandle title="Drag to reorder" aria-hidden="true">
                    ⋮⋮
                  </StyledDragHandle>
                  <StyledItemLink
                    to={`${config.showPath}/${record.id}`}
                    title={record.name ?? '(unnamed)'}
                  >
                    <StyledItemLabel>
                      {record.name ?? '(unnamed)'}
                    </StyledItemLabel>
                  </StyledItemLink>
                  <StyledPinButton
                    pinned={true}
                    onClick={() => togglePin(record.id)}
                    title="Unpin"
                    type="button"
                  >
                    ★
                  </StyledPinButton>
                </StyledItemRow>
              ))}
            </StyledSection>
          )}

          {filteredVisits.length > 0 && (
            <StyledSection>
              <StyledSectionLabel>Last visited</StyledSectionLabel>
              {filteredVisits.map((v) => {
                const visitKey = `visit:${v.objectNameSingular}-${v.id}`;
                return (
                  <StyledItemRow
                    key={`${v.objectNameSingular}-${v.id}`}
                    data-sidebar-row-key={visitKey}
                    data-highlighted={
                      highlightedKey === visitKey ? 'true' : undefined
                    }
                    isHighlighted={highlightedKey === visitKey}
                  >
                    <StyledItemLink
                      to={`/object/${v.objectNameSingular}/${v.id}`}
                      title={v.name ?? '(unnamed)'}
                    >
                      <StyledItemBadge>
                        {badgeForObject(v.objectNameSingular)}
                      </StyledItemBadge>
                      <StyledItemLabel>{v.name ?? '(unnamed)'}</StyledItemLabel>
                    </StyledItemLink>
                  </StyledItemRow>
                );
              })}
            </StyledSection>
          )}

          {isOnAnalytics && filteredCrossRecent.length > 0 && (
            <StyledSection>
              <StyledSectionLabel>Recently updated</StyledSectionLabel>
              {filteredCrossRecent.map((record) => {
                const crossKey = `cross:${record.objectNameSingular}-${record.id}`;
                return (
                  <StyledItemRow
                    key={`${record.objectNameSingular}-${record.id}`}
                    data-sidebar-row-key={crossKey}
                    data-highlighted={
                      highlightedKey === crossKey ? 'true' : undefined
                    }
                    isHighlighted={highlightedKey === crossKey}
                  >
                    <StyledItemLink
                      to={`${record.showPath}/${record.id}`}
                      title={record.name ?? '(unnamed)'}
                    >
                      <StyledItemBadge>{record.badge}</StyledItemBadge>
                      <StyledItemLabel>
                        {record.name ?? '(unnamed)'}
                      </StyledItemLabel>
                    </StyledItemLink>
                  </StyledItemRow>
                );
              })}
            </StyledSection>
          )}

          <StyledSection>
            <StyledSectionLabel>Recent</StyledSectionLabel>
            {recentLoading && recentRecords.length === 0 ? (
              <StyledEmpty>Loading…</StyledEmpty>
            ) : recentRecords.length === 0 ? (
              <StyledEmpty>No records yet</StyledEmpty>
            ) : filteredRecent.length === 0 && filterText !== '' ? null : (
              filteredRecent.map((record) => (
                <StyledItemRow
                  key={record.id}
                  data-sidebar-row-key={`recent:${record.id}`}
                  data-highlighted={
                    highlightedKey === `recent:${record.id}`
                      ? 'true'
                      : undefined
                  }
                  active={currentRecordId === record.id}
                  isHighlighted={highlightedKey === `recent:${record.id}`}
                >
                  <StyledItemLink
                    to={`${config.showPath}/${record.id}`}
                    title={record.name ?? '(unnamed)'}
                  >
                    <StyledItemLabel>
                      {record.name ?? '(unnamed)'}
                    </StyledItemLabel>
                  </StyledItemLink>
                  <StyledPinButton
                    pinned={false}
                    onClick={() => togglePin(record.id)}
                    title="Pin"
                    type="button"
                  >
                    ☆
                  </StyledPinButton>
                </StyledItemRow>
              ))
            )}
          </StyledSection>
        </>
      )}
    </StyledSidebar>
  );
};
