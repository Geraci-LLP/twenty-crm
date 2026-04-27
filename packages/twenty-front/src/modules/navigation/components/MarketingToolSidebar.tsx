import { styled } from '@linaria/react';
import { type MouseEvent as ReactMouseEvent, useEffect, useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import {
  IconBuildingSkyscraper,
  IconChartBar,
  IconFileText,
  IconLayoutKanban,
  IconMail,
  IconSend,
  IconUser,
  IconWorld,
  type TablerIconsProps,
} from 'twenty-ui/display';

import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import {
  clearVisits,
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

type SectionIcon = (props: TablerIconsProps) => JSX.Element;

type SectionConfig = {
  title: string;
  subtitle: string;
  objectNameSingular: string;
  objectNamePlural: string;
  showPath: string;
  Icon: SectionIcon;
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
    Icon: IconMail,
  },
  {
    title: 'Marketing Campaigns',
    subtitle: 'Campaign-level groupings',
    objectNameSingular: 'marketingCampaign',
    objectNamePlural: 'marketingCampaigns',
    showPath: '/object/marketingCampaign',
    Icon: IconLayoutKanban,
  },
  {
    title: 'Sequences',
    subtitle: 'Multi-step automated cadences',
    objectNameSingular: 'sequence',
    objectNamePlural: 'sequences',
    showPath: '/object/sequence',
    Icon: IconSend,
  },
  {
    title: 'Forms',
    subtitle: 'Lead-capture forms and embeds',
    objectNameSingular: 'form',
    objectNamePlural: 'forms',
    showPath: '/object/form',
    Icon: IconFileText,
  },
  {
    title: 'Landing Pages',
    subtitle: 'Public marketing pages with sections + modules',
    objectNameSingular: 'landingPage',
    objectNamePlural: 'landingPages',
    showPath: '/object/landingPage',
    Icon: IconWorld,
  },
  {
    title: 'People',
    subtitle: 'Contacts and audience members',
    objectNameSingular: 'person',
    objectNamePlural: 'people',
    showPath: '/object/person',
    Icon: IconUser,
  },
  {
    title: 'Companies',
    subtitle: 'Organizations and accounts',
    objectNameSingular: 'company',
    objectNamePlural: 'companies',
    showPath: '/object/company',
    Icon: IconBuildingSkyscraper,
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
      Icon: IconChartBar,
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

// Compact relative-time formatter for visit timestamps. Returns short
// labels ("now", "5m", "2h", "yesterday", "3d", "Apr 24") so the strings
// fit on a single sidebar row without truncating the record name.
const formatRelativeShort = (ms: number): string => {
  const diff = Date.now() - ms;
  if (diff < 0) return 'now';
  const sec = Math.floor(diff / 1000);
  if (sec < 30) return 'now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  // "yesterday" reads more naturally than "1d" for the previous day —
  // matches the way most users describe a single-day-old visit.
  const visitedDate = new Date(ms);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (
    visitedDate.getFullYear() === yesterday.getFullYear() &&
    visitedDate.getMonth() === yesterday.getMonth() &&
    visitedDate.getDate() === yesterday.getDate()
  ) {
    return 'yest';
  }
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d`;
  return visitedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

// Pinned records are localStorage-only — no server roundtrip. Keyed by
// objectNameSingular so a user's pinned campaigns don't bleed into their
// pinned sequences.
const PINNED_STORAGE_KEY = 'twenty.marketingSidebar.pinned';

// Optional per-record alias map. Lets the user rename a pinned record's
// label in-place (double-click on a pinned row) without touching the
// underlying record name. Keyed by `${objectNameSingular}:${recordId}`
// so it works across all sections.
const PIN_ALIAS_STORAGE_KEY = 'twenty.marketingSidebar.pinAliases';
type AliasMap = Record<string, string>;
const readPinAliases = (): AliasMap => {
  try {
    const raw = window.localStorage.getItem(PIN_ALIAS_STORAGE_KEY);
    if (raw === null || raw === '') return {};
    const parsed = JSON.parse(raw) as AliasMap;
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed;
  } catch {
    return {};
  }
};
const writePinAliases = (next: AliasMap): void => {
  try {
    window.localStorage.setItem(PIN_ALIAS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
};

// Recent search history. Capped at 5 entries; newest first; case-
// preserved as the user typed it. Used to surface quick-select chips
// when the filter input is empty.
const RECENT_SEARCHES_STORAGE_KEY = 'twenty.marketingSidebar.recentSearches';
const MAX_RECENT_SEARCHES = 5;

const readRecentSearches = (): string[] => {
  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
    if (raw === null || raw === '') return [];
    const parsed = JSON.parse(raw) as string[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s): s is string => typeof s === 'string')
      .slice(0, 10);
  } catch {
    return [];
  }
};

const writeRecentSearches = (next: string[]): void => {
  try {
    window.localStorage.setItem(
      RECENT_SEARCHES_STORAGE_KEY,
      JSON.stringify(next),
    );
  } catch {
    // ignore quota / disabled storage
  }
};

const pushRecentSearch = (term: string): string[] => {
  const trimmed = term.trim();
  if (trimmed.length < 2) return readRecentSearches();
  const existing = readRecentSearches();
  // Case-insensitive dedupe so "Test" and "test" don't both clutter the
  // chip strip; keep the casing from the most recent entry.
  const without = existing.filter(
    (s) => s.toLowerCase() !== trimmed.toLowerCase(),
  );
  const next = [trimmed, ...without].slice(0, MAX_RECENT_SEARCHES);
  writeRecentSearches(next);
  return next;
};

const removeRecentSearch = (term: string): string[] => {
  const existing = readRecentSearches();
  const next = existing.filter((s) => s.toLowerCase() !== term.toLowerCase());
  writeRecentSearches(next);
  return next;
};

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

const StyledSidebar = styled.aside<{ collapsed: boolean; widthPx: number }>`
  background: ${themeCssVariables.background.primary};
  border-right: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  min-width: 0;
  overflow-y: auto;
  position: relative;
  /* Skip the width transition while the user is actively dragging the
   * resizer — otherwise the sidebar lags the pointer in a very visible
   * way. Width changes via collapse toggle still animate. */
  transition: width 0.18s;
  width: ${(p) => (p.collapsed ? '24px' : `${p.widthPx}px`)};
`;

const StyledResizeHandle = styled.div`
  bottom: 0;
  cursor: col-resize;
  position: absolute;
  right: -3px;
  top: 0;
  width: 6px;
  z-index: 2;
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
  }
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

const StyledCollapsedHint = styled.button`
  background: transparent;
  border: 0;
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: 10px;
  letter-spacing: 0.08em;
  padding: 40px 0 0;
  text-align: center;
  text-transform: uppercase;
  width: 100%;
  writing-mode: vertical-rl;
  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledHeader = styled.div`
  background: ${themeCssVariables.background.primary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 20px 14px;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const StyledTitleRow = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: space-between;
`;

const StyledTitle = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.primary};
  display: flex;
  font-size: 16px;
  font-weight: ${themeCssVariables.font.weight.semiBold};
  gap: 8px;
  letter-spacing: -0.01em;
`;

const StyledTitleIcon = styled.button`
  align-items: center;
  background: ${themeCssVariables.background.transparent.lighter};
  border: 0;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.color.orange};
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 22px;
  justify-content: center;
  padding: 0;
  width: 22px;
  &:hover {
    filter: brightness(0.95);
  }
`;

const StyledCountChip = styled.span`
  background: ${themeCssVariables.background.transparent.lighter};
  border-radius: 10px;
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 10.5px;
  font-weight: ${themeCssVariables.font.weight.medium};
  margin-left: 8px;
  padding: 1px 7px;
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
  position: relative;
`;

const StyledSearchClearButton = styled.button`
  background: transparent;
  border: 0;
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0 6px;
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  &:hover {
    color: ${themeCssVariables.font.color.primary};
  }
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

const StyledChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 0 12px 8px;
`;

const StyledChip = styled.button`
  align-items: center;
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: 12px;
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  display: inline-flex;
  font-family: ${themeCssVariables.font.family};
  font-size: 11px;
  gap: 4px;
  max-width: 100%;
  overflow: hidden;
  padding: 3px 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover {
    background: ${themeCssVariables.background.transparent.medium};
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledChipRemove = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  padding-left: 2px;
  &:hover {
    color: ${themeCssVariables.color.orange};
  }
`;

// Right-click context menu — fixed position so it can escape the
// sidebar's overflow:auto. Sits above the help overlay's z-index by
// design so a context menu opened over an open help overlay still
// works (rare edge case but harmless).
/* oxlint-disable twenty/no-hardcoded-colors */
const StyledContextMenu = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  min-width: 180px;
  padding: 4px;
  position: fixed;
  z-index: 10000;
`;
/* oxlint-enable twenty/no-hardcoded-colors */

const StyledContextMenuItem = styled.button`
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  display: flex;
  font-family: ${themeCssVariables.font.family};
  font-size: 12.5px;
  gap: 8px;
  padding: 6px 10px;
  text-align: left;
  width: 100%;
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
  }
`;

/* oxlint-disable twenty/no-hardcoded-colors */
const StyledContextMenuToast = styled.div`
  background: ${themeCssVariables.color.orange};
  border-radius: ${themeCssVariables.border.radius.sm};
  bottom: 24px;
  color: #ffffff;
  font-family: ${themeCssVariables.font.family};
  font-size: 12px;
  left: 50%;
  padding: 8px 14px;
  pointer-events: none;
  position: fixed;
  transform: translateX(-50%);
  z-index: 10001;
`;
/* oxlint-enable twenty/no-hardcoded-colors */

const StyledSectionLabel = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 11px;
  font-weight: ${themeCssVariables.font.weight.semiBold};
  letter-spacing: 0.06em;
  padding: 6px 8px;
  text-transform: uppercase;
`;

const StyledSectionLabelRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 4px 0 0;
`;

const StyledSectionAction = styled.button`
  background: transparent;
  border: 0;
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: 10px;
  letter-spacing: 0.04em;
  padding: 4px 6px;
  text-transform: uppercase;
  &:hover {
    color: ${themeCssVariables.color.orange};
  }
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

const StyledItemTimestamp = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  flex-shrink: 0;
  font-size: 10px;
  letter-spacing: 0.04em;
  padding-left: 6px;
  padding-right: 8px;
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

const StyledEmptyCta = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 14px 10px;
  text-align: center;
`;

const StyledEmptyCtaText = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 12px;
  line-height: 1.4;
`;

/* oxlint-disable twenty/no-hardcoded-colors */
const StyledEmptyCtaButton = styled.button`
  background: ${themeCssVariables.color.orange};
  border: 0;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: #ffffff;
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: 12px;
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: 6px 12px;
  &:hover {
    filter: brightness(0.95);
  }
`;
/* oxlint-enable twenty/no-hardcoded-colors */

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
  { keys: '⌘ K', description: 'Open quick switcher (any route)' },
  { keys: '/', description: 'Focus the sidebar filter' },
  { keys: '↑ ↓', description: 'Walk filtered results' },
  { keys: 'Enter', description: 'Open highlighted / first match' },
  { keys: '⇧ Enter', description: 'Open in new tab (Cmd+K)' },
  { keys: 'Tab', description: 'Jump to next group (Cmd+K)' },
  { keys: '[', description: 'Collapse / expand sidebar' },
  { keys: 'g 1', description: 'Go to Email Campaigns' },
  { keys: 'g 2', description: 'Go to Marketing Campaigns' },
  { keys: 'g 3', description: 'Go to Sequences' },
  { keys: 'g 4', description: 'Go to Forms' },
  { keys: 'g 5', description: 'Go to Analytics' },
  { keys: 'g 6', description: 'Go to Audiences (People)' },
  { keys: 'c', description: 'Create a new record in this section' },
  { keys: 'p', description: 'Pin / unpin the current record' },
  { keys: 'y', description: 'Yank (copy) the current record link' },
  { keys: 'j / k', description: 'Next / previous marketing section' },
  { keys: 'n / b', description: 'Next / previous pinned record' },
  { keys: '1 – 9', description: 'Jump to pinned record at that position' },
  { keys: 'z', description: 'Open shortcut help (alternate to ?)' },
  { keys: '⌘ ,', description: 'Open Settings' },
  { keys: 'm', description: 'Go to marketing analytics' },
  { keys: 'f', description: 'Focus filter (alternate to /)' },
  { keys: 'g g', description: 'Scroll sidebar to top' },
  { keys: '⇧ G', description: 'Scroll sidebar to bottom' },
  { keys: 'Tab', description: 'From filter, jump to first row' },
  { keys: '⌘ 1 – 6', description: 'Direct section jump (any route)' },
  { keys: '⌘ P', description: 'Pin/unpin highlighted (in Cmd+K)' },
  { keys: '⌫', description: 'On empty Cmd+K input: close' },
  { keys: 'Esc', description: 'Close dialogs / cancel forms' },
];

export const MarketingToolSidebar = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  // oxlint-disable-next-line twenty/no-navigate-prefer-link -- jumping
  // to the first match on Enter is dynamic navigation, not a static
  // link destination.
  const navigate = useNavigate();
  const config = getConfigForPath(location.pathname);
  // Filter text initial value priority:
  //   1. ?q= URL param (shared-link wins)
  //   2. last filter saved for this section in localStorage
  //   3. empty
  // Persisting per-section means navigating away and back keeps your
  // filter without polluting history with a query string on every key.
  const [filterText, setFilterText] = useState<string>(() => {
    const param = searchParams.get('q');
    if (param !== null && param !== '') return param;
    if (config !== null) {
      try {
        const saved = window.localStorage.getItem(
          `twenty.marketingSidebar.filter.${config.objectNameSingular}`,
        );
        if (saved !== null) return saved;
      } catch {
        // ignore
      }
    }
    return '';
  });
  // Persist filter changes to per-section localStorage so they survive
  // navigation away / back. Skipped if config is null.
  useEffect(() => {
    if (config === null) return;
    try {
      window.localStorage.setItem(
        `twenty.marketingSidebar.filter.${config.objectNameSingular}`,
        filterText,
      );
    } catch {
      // ignore quota / disabled storage
    }
  }, [filterText, config]);

  // When the section changes (user navigates marketing → people, etc.),
  // load that section's last filter. This is the counterpart to the
  // persistence effect above; together they let each section remember
  // its own filter independently.
  useEffect(() => {
    if (config === null) return;
    try {
      const saved = window.localStorage.getItem(
        `twenty.marketingSidebar.filter.${config.objectNameSingular}`,
      );
      if (saved !== null) {
        setFilterText(saved);
      } else {
        setFilterText('');
      }
    } catch {
      // ignore
    }
    // Intentionally only re-runs when the section changes, not on every
    // filterText keystroke — the persistence effect above handles writes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.objectNameSingular]);
  // Sync param → state on navigation. If the user lands on a new ?q=
  // URL while the sidebar is mounted (e.g. clicks a shared link in a
  // sibling tab), reflect the new filter. We deliberately don't write
  // back: the input is the source of truth once the user types.
  useEffect(() => {
    const paramQ = searchParams.get('q');
    if (paramQ !== null && paramQ !== filterText) {
      setFilterText(paramQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);
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

  // Cmd+K's "New X" actions navigate here with ?create=1 — when we see
  // that param we auto-open the inline create form and strip the param
  // from the URL so a refresh doesn't re-open the form unexpectedly.
  useEffect(() => {
    if (searchParams.get('create') !== '1') return;
    setIsCreateOpen(true);
    const next = new URLSearchParams(searchParams);
    next.delete('create');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  // Sidebar width — dragged via the right-edge resize handle, persisted
  // to localStorage as a number of pixels. Clamped to a sane range so a
  // misclick can't squish or balloon the sidebar.
  const SIDEBAR_MIN_PX = 200;
  const SIDEBAR_MAX_PX = 480;
  const SIDEBAR_DEFAULT_PX = 240;
  const [sidebarWidthPx, setSidebarWidthPx] = useState<number>(() => {
    try {
      const raw = window.localStorage.getItem('twenty.marketingSidebar.width');
      const parsed = raw === null ? NaN : parseInt(raw, 10);
      if (Number.isNaN(parsed)) return SIDEBAR_DEFAULT_PX;
      return Math.max(SIDEBAR_MIN_PX, Math.min(SIDEBAR_MAX_PX, parsed));
    } catch {
      return SIDEBAR_DEFAULT_PX;
    }
  });
  // Snapshot of the pointer / starting width during a drag. null when
  // no resize is in progress.
  const [resizeStart, setResizeStart] = useState<{
    pointerX: number;
    startWidth: number;
  } | null>(null);
  useEffect(() => {
    if (resizeStart === null) return;
    const onMove = (e: PointerEvent) => {
      const delta = e.clientX - resizeStart.pointerX;
      const next = Math.max(
        SIDEBAR_MIN_PX,
        Math.min(SIDEBAR_MAX_PX, resizeStart.startWidth + delta),
      );
      setSidebarWidthPx(next);
    };
    const onUp = () => setResizeStart(null);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [resizeStart]);

  // Persist width to localStorage whenever it settles. We could write on
  // every pointermove but localStorage writes are synchronous and the
  // user is unlikely to refresh mid-drag — debouncing via the resize
  // gesture's natural endpoints (release / collapse toggle) is enough.
  useEffect(() => {
    if (resizeStart !== null) return;
    try {
      window.localStorage.setItem(
        'twenty.marketingSidebar.width',
        String(sidebarWidthPx),
      );
    } catch {
      // ignore quota / disabled storage
    }
  }, [sidebarWidthPx, resizeStart]);

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

  // Apollo refetch handler — Cmd+K's "Refresh" action and the sidebar's
  // own ↻ button both dispatch this event. We can't directly call the
  // useFindManyRecords refetch here because it's not exposed across
  // components; we send a window event that any data hook listens for.
  // Twenty's Apollo cache evict pattern is too heavy for a "soft
  // refresh", so the toast is mostly a UX cue while Apollo re-polls
  // on its own schedule.

  // Cmd+K's "Toggle sidebar collapse" action dispatches a custom event;
  // listen here so the switcher can reach across the component tree
  // without prop-drilling.
  useEffect(() => {
    const onToggle = () => toggleCollapsed();
    window.addEventListener('marketing-sidebar:toggle-collapse', onToggle);
    return () =>
      window.removeEventListener('marketing-sidebar:toggle-collapse', onToggle);
    // toggleCollapsed reads/writes localStorage but uses a setState
    // updater under the hood so it's stable for our purposes; intentional
    // empty deps to register the listener exactly once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-collapse on narrow windows so the main content area gets the
  // space it needs. We don't auto-expand back when the window widens —
  // the user might have collapsed it deliberately, and we want their
  // explicit click via the toggle / "[" / Cmd+K to win on re-open.
  // Threshold of 1100px chosen to match where Twenty's table view also
  // gets cramped. Toast lets the user know the sidebar auto-collapsed
  // — they might think a click went missing otherwise.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1100 && !isCollapsed) {
        toggleCollapsed();
        setToast('Sidebar auto-collapsed (narrow window)');
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // Same stability assumption as the toggle listener above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCollapsed]);

  // Drag-to-reorder state for pinned items. We hold the dragged record's
  // id and the id of the row currently under the pointer (drop target)
  // so we can render the orange insertion indicator. Both are reset on
  // drop / dragend.
  const [draggingPinId, setDraggingPinId] = useState<string | null>(null);
  const [dropTargetPinId, setDropTargetPinId] = useState<string | null>(null);

  // Pinned alias map — id-prefixed key to allow per-section aliases.
  const [pinAliases, setPinAliases] = useState<AliasMap>(() =>
    readPinAliases(),
  );
  const [aliasEditingId, setAliasEditingId] = useState<string | null>(null);
  const [aliasDraft, setAliasDraft] = useState<string>('');
  const aliasKey = (id: string) => `${config?.objectNameSingular ?? ''}:${id}`;
  const labelForPinned = (record: RecentRecord): string => {
    const alias = pinAliases[aliasKey(record.id)];
    if (typeof alias === 'string' && alias.trim().length > 0) return alias;
    return record.name ?? '(unnamed)';
  };

  // Keyboard navigation through filtered results. Pressing ArrowDown /
  // ArrowUp inside the search input walks the highlighted item; Enter
  // opens it. -1 means "no highlight, fall back to first match" so an
  // empty filter or untouched search still has the original behavior.
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  // Recent searches — surfaced as quick-select chips when the filter is
  // empty. Persisted to localStorage so chips survive reloads. The
  // storage event listener keeps tabs in sync.
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    readRecentSearches(),
  );
  useEffect(() => {
    const refresh = () => setRecentSearches(readRecentSearches());
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);

  // Right-click context menu state. Tracks pointer position (clamped on
  // render so the menu can't render off-screen), the record's url + id,
  // and the row's source (so we know whether "Pin" or "Unpin" applies).
  type ContextMenuState = {
    x: number;
    y: number;
    href: string;
    objectNameSingular: string;
    recordId: string;
    label: string;
    source: 'pinned' | 'recent' | 'visit' | 'cross';
  };
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Auto-dismiss the toast after a brief moment.
  useEffect(() => {
    if (toast === null) return;
    const id = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  // Close the context menu on any click outside or on Escape.
  useEffect(() => {
    if (contextMenu === null) return;
    const close = () => setContextMenu(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('click', close);
    window.addEventListener('contextmenu', close);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('contextmenu', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [contextMenu]);

  const openContextMenu = (
    e: ReactMouseEvent,
    state: Omit<ContextMenuState, 'x' | 'y'>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    // Clamp so the menu stays within the viewport (rough estimate; the
    // actual width depends on the longest label but 200px is a safe upper
    // bound for our 4 menu items).
    const x = Math.min(e.clientX, window.innerWidth - 200);
    const y = Math.min(e.clientY, window.innerHeight - 180);
    setContextMenu({ ...state, x, y });
  };

  // Reset highlight whenever the filter text changes so a new query
  // doesn't keep the previous query's highlight pointing at a row that
  // may now be off-screen / out of the filtered list.
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filterText]);

  // Scroll the active record into view when the route changes — same UX
  // as IDE file trees that auto-scroll to the active file when you open
  // it. Skipped when collapsed since the rows aren't rendered. We
  // re-derive the record id from pathname inside the effect so it can
  // run before the more-elaborate currentRecordId computation below.
  useEffect(() => {
    if (config === null || isCollapsed) return;
    const recId = getCurrentRecordId(location.pathname, config.showPath);
    if (recId === null) return;
    const id = window.setTimeout(() => {
      const el = document.querySelector<HTMLDivElement>(
        `[data-sidebar-row-key="pinned:${CSS.escape(recId)}"], [data-sidebar-row-key="recent:${CSS.escape(recId)}"]`,
      );
      el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 50);
    return () => window.clearTimeout(id);
  }, [config, location.pathname, isCollapsed]);

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

  // Cross-section name search: when the filter text is >=2 chars, fire
  // ilike queries on the four marketing object types so results from
  // *other* sections show up at the top of the sidebar. Person and
  // Company are excluded because their "name" is a structured object
  // (firstName/lastName / domainName) and would need a different filter
  // shape — out of scope for the cross-section pattern here.
  const xSearchActive = filterText.trim().length >= 2 && config !== null;
  const xSearchPattern = `%${filterText.trim()}%`;
  const currentObjectNameSingular = config?.objectNameSingular ?? '';
  const xSearchCampaigns = useFindManyRecords<RecentRecord>({
    objectNameSingular: 'campaign',
    limit: 5,
    filter: xSearchActive
      ? { name: { ilike: xSearchPattern } }
      : { id: { eq: 'no-match' } },
    recordGqlFields: { id: true, name: true },
    skip: !xSearchActive || currentObjectNameSingular === 'campaign',
  });
  const xSearchMcs = useFindManyRecords<RecentRecord>({
    objectNameSingular: 'marketingCampaign',
    limit: 5,
    filter: xSearchActive
      ? { name: { ilike: xSearchPattern } }
      : { id: { eq: 'no-match' } },
    recordGqlFields: { id: true, name: true },
    skip: !xSearchActive || currentObjectNameSingular === 'marketingCampaign',
  });
  const xSearchSequences = useFindManyRecords<RecentRecord>({
    objectNameSingular: 'sequence',
    limit: 5,
    filter: xSearchActive
      ? { name: { ilike: xSearchPattern } }
      : { id: { eq: 'no-match' } },
    recordGqlFields: { id: true, name: true },
    skip: !xSearchActive || currentObjectNameSingular === 'sequence',
  });
  const xSearchForms = useFindManyRecords<RecentRecord>({
    objectNameSingular: 'form',
    limit: 5,
    filter: xSearchActive
      ? { name: { ilike: xSearchPattern } }
      : { id: { eq: 'no-match' } },
    recordGqlFields: { id: true, name: true },
    skip: !xSearchActive || currentObjectNameSingular === 'form',
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
      if (
        e.key === '/' ||
        (e.key === 'f' && !e.shiftKey && !e.metaKey && !e.ctrlKey)
      ) {
        e.preventDefault();
        // If sidebar is collapsed, expand it first so the input mounts;
        // the focus has to wait for the next paint via setTimeout(0).
        if (isCollapsed) {
          toggleCollapsed();
          window.setTimeout(() => {
            // Use a fresh querySelector since searchInputEl was null
            // when the listener was bound.
            const el =
              document.querySelector<HTMLInputElement>(
                'aside[aria-label="Resize sidebar"], aside input[aria-label="Filter sidebar"]',
              ) ??
              document.querySelector<HTMLInputElement>(
                'input[aria-label="Filter sidebar"]',
              );
            el?.focus();
            el?.select();
          }, 0);
          return;
        }
        searchInputEl?.focus();
        searchInputEl?.select();
        return;
      }
      // "?" is shift+/ on US layouts; check the literal key so we catch
      // any layout that produces the glyph. "z" is an unmodified alias
      // for keyboards/layouts where "?" isn't easily reachable.
      if (e.key === '?' || (e.key === 'z' && !e.shiftKey)) {
        e.preventDefault();
        setIsHelpOpen((open) => !open);
        return;
      }
      if (e.key === '[') {
        e.preventDefault();
        toggleCollapsed();
        return;
      }
      if (e.key === 'c' && !e.shiftKey) {
        // Quick-create shortcut. Expand the sidebar first if needed so
        // the form actually mounts visibly.
        e.preventDefault();
        if (isCollapsed) toggleCollapsed();
        setIsCreateOpen(true);
        return;
      }
      if (e.key === 'j' && !e.shiftKey) {
        // Walk to the next marketing section's index page. Wraps from
        // last to first.
        e.preventDefault();
        const idx = SECTION_CONFIGS.findIndex(
          (s) => s.objectNameSingular === config.objectNameSingular,
        );
        const safeIdx = idx === -1 ? 0 : idx;
        const nextCfg = SECTION_CONFIGS[(safeIdx + 1) % SECTION_CONFIGS.length];
        navigate(`/objects/${nextCfg.objectNamePlural}`);
        return;
      }
      if (e.key === 'k' && !e.shiftKey) {
        // Walk to the previous marketing section's index page. Wraps
        // from first to last.
        e.preventDefault();
        const idx = SECTION_CONFIGS.findIndex(
          (s) => s.objectNameSingular === config.objectNameSingular,
        );
        const safeIdx = idx === -1 ? 0 : idx;
        const prevCfg =
          SECTION_CONFIGS[
            (safeIdx - 1 + SECTION_CONFIGS.length) % SECTION_CONFIGS.length
          ];
        navigate(`/objects/${prevCfg.objectNamePlural}`);
        return;
      }
      if (e.key === 'p' && !e.shiftKey) {
        // Pin/unpin the currently-viewed record. Only meaningful on a
        // show page; index pages get no-op.
        const rec = getCurrentRecordId(location.pathname, config.showPath);
        if (rec === null) return;
        e.preventDefault();
        const list = pinnedMap[config.objectNameSingular] ?? [];
        const wasPinned = list.includes(rec);
        const next = { ...pinnedMap };
        next[config.objectNameSingular] = wasPinned
          ? list.filter((x) => x !== rec)
          : [rec, ...list];
        setPinnedMap(next);
        writePinned(next);
        setToast(wasPinned ? 'Unpinned' : 'Pinned');
        return;
      }
      // "G" (shift+g) scrolls the sidebar to the bottom — vim-like.
      // "g g" (two unmodified g presses within 600ms) scrolls to top.
      if (e.key === 'G' && e.shiftKey) {
        e.preventDefault();
        const aside = document.querySelector<HTMLElement>(
          'aside[data-marketing-sidebar="true"]',
        );
        if (aside !== null) {
          aside.scrollTo({ top: aside.scrollHeight, behavior: 'smooth' });
        }
        return;
      }
      if (e.key === 'g' && !e.shiftKey) {
        const now = Date.now();
        const last =
          (window as unknown as { __twentyLastG?: number }).__twentyLastG ?? 0;
        if (now - last < 600) {
          e.preventDefault();
          const aside = document.querySelector<HTMLElement>(
            'aside[data-marketing-sidebar="true"]',
          );
          if (aside !== null) {
            aside.scrollTo({ top: 0, behavior: 'smooth' });
          }
          (window as unknown as { __twentyLastG?: number }).__twentyLastG = 0;
          return;
        }
        (window as unknown as { __twentyLastG?: number }).__twentyLastG = now;
      }
      // "n" / "b" walk through pinned records of the current section.
      // Useful for review-style workflows where you want to step through
      // your pinned items without using the mouse.
      if ((e.key === 'n' || e.key === 'b') && !e.shiftKey) {
        const list = pinnedMap[config.objectNameSingular] ?? [];
        if (list.length === 0) return;
        e.preventDefault();
        const cur = getCurrentRecordId(location.pathname, config.showPath);
        const idx = cur === null ? -1 : list.indexOf(cur);
        const nextIdx =
          e.key === 'n'
            ? (idx + 1 + list.length) % list.length
            : (idx - 1 + list.length) % list.length;
        navigate(`${config.showPath}/${list[nextIdx]}`);
        return;
      }
      // Digit 1-9 (no shift, no modifier) jumps to the pinned record at
      // that position in the current section. Out-of-range digits are
      // silently ignored. Skipped if pinned list is empty so digits
      // remain free for any future global digit shortcuts.
      if (
        /^[1-9]$/.test(e.key) &&
        !e.shiftKey &&
        (pinnedMap[config.objectNameSingular] ?? []).length > 0
      ) {
        const idx = parseInt(e.key, 10) - 1;
        const list = pinnedMap[config.objectNameSingular] ?? [];
        if (idx < list.length) {
          e.preventDefault();
          navigate(`${config.showPath}/${list[idx]}`);
          return;
        }
      }
      if (e.key === 'm' && !e.shiftKey) {
        // "m" jumps to the marketing analytics page from any marketing
        // route. Quick "metrics" overview without needing to navigate
        // through the drawer.
        e.preventDefault();
        navigate('/marketing/analytics');
        return;
      }
      if (e.key === 'y' && !e.shiftKey) {
        // Yank (copy) the current record's link to the clipboard.
        // Vim-derived shortcut — same affordance as the right-click
        // context menu's "Copy link", but without the menu round-trip.
        const rec = getCurrentRecordId(location.pathname, config.showPath);
        if (rec === null) return;
        e.preventDefault();
        const absolute = `${window.location.origin}${config.showPath}/${rec}`;
        navigator.clipboard
          .writeText(absolute)
          .then(() => setToast('Link copied'))
          .catch(() => setToast('Could not copy link'));
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

  // Recent records — top 5 by createdAt desc. totalCount is consumed
  // alongside the rows so we can surface "X total" in the section
  // header without paying an extra query.
  const {
    records: recentRecords,
    loading: recentLoading,
    totalCount: sectionTotalCount,
  } = useFindManyRecords<RecentRecord>({
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

  // Cross-section ilike search results — merged from the four xSearch
  // queries when the filter is active. Same CrossRecord shape so the
  // existing badge/show-path machinery works without extra plumbing.
  const crossSearch: CrossRecord[] = xSearchActive
    ? [
        ...xSearchCampaigns.records.map<CrossRecord>((r) => ({
          id: r.id,
          name: r.name ?? null,
          updatedAt: null,
          objectNameSingular: 'campaign',
          showPath: '/object/campaign',
          badge: 'Email',
        })),
        ...xSearchMcs.records.map<CrossRecord>((r) => ({
          id: r.id,
          name: r.name ?? null,
          updatedAt: null,
          objectNameSingular: 'marketingCampaign',
          showPath: '/object/marketingCampaign',
          badge: 'MC',
        })),
        ...xSearchSequences.records.map<CrossRecord>((r) => ({
          id: r.id,
          name: r.name ?? null,
          updatedAt: null,
          objectNameSingular: 'sequence',
          showPath: '/object/sequence',
          badge: 'Seq',
        })),
        ...xSearchForms.records.map<CrossRecord>((r) => ({
          id: r.id,
          name: r.name ?? null,
          updatedAt: null,
          objectNameSingular: 'form',
          showPath: '/object/form',
          badge: 'Form',
        })),
      ].slice(0, 12)
    : [];

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

  // Most-visited records of the *current* section. Sorted by visit
  // count descending; only included if a record has been visited 3+
  // times so the section doesn't show every recent visit twice.
  const mostVisitedInSection = recentVisits
    .filter((v) => v.objectNameSingular === config.objectNameSingular)
    .filter((v) => (v.visitCount ?? 1) >= 3)
    .filter((v) => !pinnedIds.includes(v.id))
    .filter((v) => v.id !== currentRecordId)
    .filter((v) => matchesFilter(v.name))
    .sort((a, b) => (b.visitCount ?? 1) - (a.visitCount ?? 1))
    .slice(0, 3);
  const hasAnyResults =
    filteredViews.length > 0 ||
    filteredPinned.length > 0 ||
    filteredRecent.length > 0 ||
    crossSearch.length > 0;

  const togglePin = (id: string) => {
    const next = { ...pinnedMap };
    const list = next[config.objectNameSingular] ?? [];
    // Newly-pinned records go to the top, not the bottom — that's where
    // most users expect to see "the thing I just pinned" given how
    // muscle-memory thinks about pinning. The drag-handle still lets
    // them re-order afterwards if they want a different position.
    next[config.objectNameSingular] = list.includes(id)
      ? list.filter((x) => x !== id)
      : [id, ...list];
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
    ...crossSearch.map<FlatItem>((r) => ({
      key: `xsearch:${r.objectNameSingular}-${r.id}`,
      to: `${r.showPath}/${r.id}`,
    })),
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
    <StyledSidebar
      collapsed={isCollapsed}
      widthPx={sidebarWidthPx}
      data-marketing-sidebar="true"
    >
      {contextMenu !== null && (
        <StyledContextMenu
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          <StyledContextMenuItem
            type="button"
            onClick={() => {
              window.open(contextMenu.href, '_blank', 'noopener,noreferrer');
              setContextMenu(null);
            }}
          >
            ↗ Open in new tab
          </StyledContextMenuItem>
          <StyledContextMenuItem
            type="button"
            onClick={async () => {
              const absolute = `${window.location.origin}${contextMenu.href}`;
              try {
                await navigator.clipboard.writeText(absolute);
                setToast(`Copied link to ${contextMenu.label}`);
              } catch {
                setToast('Could not copy link');
              }
              setContextMenu(null);
            }}
          >
            ⎘ Copy link
          </StyledContextMenuItem>
          {(contextMenu.source === 'pinned' ||
            contextMenu.source === 'recent') && (
            <StyledContextMenuItem
              type="button"
              onClick={() => {
                togglePin(contextMenu.recordId);
                setToast(
                  contextMenu.source === 'pinned'
                    ? `Unpinned ${contextMenu.label}`
                    : `Pinned ${contextMenu.label}`,
                );
                setContextMenu(null);
              }}
            >
              {contextMenu.source === 'pinned' ? '☆ Unpin' : '★ Pin'}
            </StyledContextMenuItem>
          )}
          {contextMenu.source === 'pinned' && (
            <StyledContextMenuItem
              type="button"
              onClick={() => {
                // Move to top of pinned list — a common shortcut for
                // promoting a record to "primary".
                const next = { ...pinnedMap };
                const list = next[config.objectNameSingular] ?? [];
                next[config.objectNameSingular] = [
                  contextMenu.recordId,
                  ...list.filter((x) => x !== contextMenu.recordId),
                ];
                setPinnedMap(next);
                writePinned(next);
                setToast('Moved to top');
                setContextMenu(null);
              }}
            >
              ⤴ Move to top
            </StyledContextMenuItem>
          )}
          {contextMenu.source === 'visit' && (
            <StyledContextMenuItem
              type="button"
              onClick={() => {
                // Remove just this entry from visit history.
                const remaining = recentVisits.filter(
                  (v) =>
                    !(
                      v.objectNameSingular === contextMenu.objectNameSingular &&
                      v.id === contextMenu.recordId
                    ),
                );
                try {
                  window.localStorage.setItem(
                    'twenty.lastVisited',
                    JSON.stringify(remaining),
                  );
                } catch {
                  // ignore
                }
                setRecentVisits(remaining);
                setToast('Removed from history');
                setContextMenu(null);
              }}
            >
              🗑 Remove from history
            </StyledContextMenuItem>
          )}
        </StyledContextMenu>
      )}
      {toast !== null && (
        <StyledContextMenuToast>{toast}</StyledContextMenuToast>
      )}
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
      {!isCollapsed && (
        <StyledResizeHandle
          role="separator"
          aria-label="Resize sidebar"
          onPointerDown={(e) => {
            e.preventDefault();
            setResizeStart({
              pointerX: e.clientX,
              startWidth: sidebarWidthPx,
            });
          }}
          onDoubleClick={() => {
            // Double-click resets to the default width — same affordance
            // most desktop apps use for a panel resizer.
            setSidebarWidthPx(SIDEBAR_DEFAULT_PX);
            try {
              window.localStorage.setItem(
                'twenty.marketingSidebar.width',
                String(SIDEBAR_DEFAULT_PX),
              );
            } catch {
              // ignore
            }
          }}
        />
      )}
      {isCollapsed ? (
        <StyledCollapsedHint
          type="button"
          onClick={toggleCollapsed}
          aria-label="Expand sidebar"
          title="Click to expand sidebar"
        >
          {(() => {
            // When viewing a record, surface its name in the vertical
            // hint so the user has context without expanding the
            // sidebar. Falls back to the section title on index pages.
            if (currentRecordId !== null) {
              const fromList =
                pinnedRecords.find((r) => r.id === currentRecordId)?.name ??
                recentRecords.find((r) => r.id === currentRecordId)?.name ??
                null;
              if (fromList !== null && fromList !== '') {
                return `${config.title} · ${fromList}`;
              }
            }
            return config.title;
          })()}
        </StyledCollapsedHint>
      ) : (
        <>
          <StyledHeader>
            <StyledTitleRow>
              <StyledTitle>
                <StyledTitleIcon
                  type="button"
                  onClick={toggleCollapsed}
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                >
                  <config.Icon size={14} />
                </StyledTitleIcon>
                {config.title}
                {typeof sectionTotalCount === 'number' && (
                  <StyledCountChip
                    title={`${sectionTotalCount} total ${config.title.toLowerCase()}`}
                  >
                    {sectionTotalCount >= 1000
                      ? `${(sectionTotalCount / 1000).toFixed(1)}k`
                      : sectionTotalCount}
                  </StyledCountChip>
                )}
              </StyledTitle>
              {currentRecordId !== null && (
                <StyledHelpTriggerButton
                  type="button"
                  onClick={() => {
                    togglePin(currentRecordId);
                    setToast(
                      pinnedIds.includes(currentRecordId)
                        ? 'Unpinned'
                        : 'Pinned',
                    );
                  }}
                  title={
                    pinnedIds.includes(currentRecordId)
                      ? 'Unpin this page (p)'
                      : 'Pin this page (p)'
                  }
                  aria-label="Pin / unpin current page"
                  style={{
                    color: pinnedIds.includes(currentRecordId)
                      ? themeCssVariables.color.orange
                      : undefined,
                  }}
                >
                  {pinnedIds.includes(currentRecordId) ? '★' : '☆'}
                </StyledHelpTriggerButton>
              )}
              <StyledHelpTriggerButton
                type="button"
                onClick={() => setIsHelpOpen(true)}
                title="Keyboard shortcuts (?)"
                aria-label="Show keyboard shortcuts"
              >
                ?
              </StyledHelpTriggerButton>
            </StyledTitleRow>
            <StyledSubtitle>
              {(() => {
                // On a record show page, prefer a breadcrumb-style
                // subtitle that names the section + record so the
                // sidebar's header doubles as breadcrumb context.
                if (currentRecordId !== null) {
                  const fromList =
                    pinnedRecords.find((r) => r.id === currentRecordId)?.name ??
                    recentRecords.find((r) => r.id === currentRecordId)?.name ??
                    null;
                  if (fromList !== null && fromList !== '') {
                    return `${config.title} › ${fromList}`;
                  }
                }
                return config.subtitle;
              })()}
            </StyledSubtitle>
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
                  // Two-stage Escape: first press clears non-empty filter
                  // text (most common need); second press unfocuses the
                  // input so subsequent "/" can re-focus cleanly. Mirrors
                  // how most search UIs (VS Code, Sublime) handle Esc.
                  if (filterText !== '') {
                    setFilterText('');
                    setHighlightedIndex(-1);
                    return;
                  }
                  setHighlightedIndex(-1);
                  searchInputEl?.blur();
                  return;
                }
                if (e.key === 'Tab' && !e.shiftKey) {
                  // Tab from the filter input pushes highlight to the
                  // first match and unfocuses the input, so subsequent
                  // arrow keys / Enter continue from there. Lets a
                  // user move into the result list without removing
                  // their hand from the keyboard.
                  if (flatItems.length === 0) return;
                  e.preventDefault();
                  setHighlightedIndex(0);
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
                  // Persist the term to recent-searches before clearing.
                  // Skip if the filter was empty (Enter on a blank input
                  // shouldn't pollute history).
                  if (filterText.trim().length >= 2) {
                    setRecentSearches(pushRecentSearch(filterText));
                  }
                  navigate(target);
                  setFilterText('');
                  setHighlightedIndex(-1);
                }
              }}
              aria-label="Filter sidebar"
            />
            {filterText !== '' && (
              <StyledSearchClearButton
                type="button"
                aria-label="Clear filter"
                title="Clear filter"
                onClick={() => {
                  setFilterText('');
                  setHighlightedIndex(-1);
                  searchInputEl?.focus();
                }}
              >
                ×
              </StyledSearchClearButton>
            )}
          </StyledSearchRow>

          {filterText === '' && recentSearches.length > 0 && (
            <StyledChipRow>
              {recentSearches.map((term) => (
                <StyledChip
                  key={term}
                  type="button"
                  onClick={() => {
                    setFilterText(term);
                    searchInputEl?.focus();
                  }}
                  title={`Re-run search for "${term}"`}
                >
                  <span>{term}</span>
                  <StyledChipRemove
                    role="button"
                    aria-label={`Remove "${term}" from recent searches`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setRecentSearches(removeRecentSearch(term));
                    }}
                  >
                    ×
                  </StyledChipRemove>
                </StyledChip>
              ))}
              {recentSearches.length > 1 && (
                <StyledChip
                  type="button"
                  onClick={() => {
                    writeRecentSearches([]);
                    setRecentSearches([]);
                  }}
                  title="Clear all recent searches"
                >
                  Clear
                </StyledChip>
              )}
            </StyledChipRow>
          )}

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

          {crossSearch.length > 0 && (
            <StyledSection>
              <StyledSectionLabel>
                Across sections
                {crossSearch.length > 0 ? ` · ${crossSearch.length}` : ''}
              </StyledSectionLabel>
              {crossSearch.map((record) => {
                const xKey = `xsearch:${record.objectNameSingular}-${record.id}`;
                return (
                  <StyledItemRow
                    key={xKey}
                    data-sidebar-row-key={xKey}
                    data-highlighted={
                      highlightedKey === xKey ? 'true' : undefined
                    }
                    isHighlighted={highlightedKey === xKey}
                    onContextMenu={(e) =>
                      openContextMenu(e, {
                        href: `${record.showPath}/${record.id}`,
                        objectNameSingular: record.objectNameSingular,
                        recordId: record.id,
                        label: record.name ?? '(unnamed)',
                        source: 'cross',
                      })
                    }
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

          {pinnedIds.length === 0 && (
            <StyledSection>
              <StyledSectionLabel>Pinned</StyledSectionLabel>
              <StyledEmpty>
                Press <kbd>p</kbd> on any record to pin it for quick access.
              </StyledEmpty>
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
              <StyledSectionLabelRow>
                <StyledSectionLabel>
                  Pinned
                  {orderedPinnedRecords.length > 0
                    ? ` · ${orderedPinnedRecords.length}`
                    : ''}
                </StyledSectionLabel>
                {orderedPinnedRecords.length > 1 && (
                  <StyledSectionAction
                    type="button"
                    title="Unpin all"
                    onClick={() => {
                      const next = { ...pinnedMap };
                      next[config.objectNameSingular] = [];
                      setPinnedMap(next);
                      writePinned(next);
                      setToast('Cleared pinned');
                    }}
                  >
                    Clear
                  </StyledSectionAction>
                )}
              </StyledSectionLabelRow>
              {orderedPinnedRecords.map((record, pinnedIdx) => (
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
                  onContextMenu={(e) =>
                    openContextMenu(e, {
                      href: `${config.showPath}/${record.id}`,
                      objectNameSingular: config.objectNameSingular,
                      recordId: record.id,
                      label: record.name ?? '(unnamed)',
                      source: 'pinned',
                    })
                  }
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
                  {aliasEditingId === record.id ? (
                    <StyledCreateInput
                      autoFocus
                      style={{ flex: 1, marginLeft: 4 }}
                      type="text"
                      value={aliasDraft}
                      onChange={(e) => setAliasDraft(e.target.value)}
                      onBlur={() => {
                        const next = { ...pinAliases };
                        const trimmed = aliasDraft.trim();
                        const k = aliasKey(record.id);
                        if (trimmed === '' || trimmed === record.name) {
                          delete next[k];
                        } else {
                          next[k] = trimmed;
                        }
                        setPinAliases(next);
                        writePinAliases(next);
                        setAliasEditingId(null);
                        setAliasDraft('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter')
                          (e.target as HTMLInputElement).blur();
                        if (e.key === 'Escape') {
                          setAliasEditingId(null);
                          setAliasDraft('');
                        }
                      }}
                    />
                  ) : (
                    <StyledItemLink
                      to={`${config.showPath}/${record.id}`}
                      title={
                        pinnedIdx < 9
                          ? `${labelForPinned(record)} — press ${pinnedIdx + 1} to jump here, double-click to rename`
                          : `${labelForPinned(record)} — double-click to rename`
                      }
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        setAliasEditingId(record.id);
                        setAliasDraft(labelForPinned(record));
                      }}
                    >
                      {pinnedIdx < 9 && (
                        <StyledItemBadge
                          style={{ minWidth: 14, padding: '1px 4px' }}
                        >
                          {pinnedIdx + 1}
                        </StyledItemBadge>
                      )}
                      <StyledItemLabel>
                        {labelForPinned(record)}
                      </StyledItemLabel>
                    </StyledItemLink>
                  )}
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

          {mostVisitedInSection.length > 0 && (
            <StyledSection>
              <StyledSectionLabel>
                Frequently visited · {mostVisitedInSection.length}
              </StyledSectionLabel>
              {mostVisitedInSection.map((v) => (
                <StyledItemRow
                  key={`mv-${v.id}`}
                  active={currentRecordId === v.id}
                >
                  <StyledItemLink
                    to={`${config.showPath}/${v.id}`}
                    title={`${v.name ?? '(unnamed)'} — ${v.visitCount ?? 1}× visits`}
                  >
                    <StyledItemLabel>{v.name ?? '(unnamed)'}</StyledItemLabel>
                    <StyledItemTimestamp>
                      {v.visitCount ?? 1}×
                    </StyledItemTimestamp>
                  </StyledItemLink>
                  <StyledPinButton
                    pinned={false}
                    onClick={() => togglePin(v.id)}
                    title="Pin"
                    type="button"
                  >
                    ☆
                  </StyledPinButton>
                </StyledItemRow>
              ))}
            </StyledSection>
          )}

          {filteredVisits.length > 0 && (
            <StyledSection>
              <StyledSectionLabelRow>
                <StyledSectionLabel>
                  Last visited
                  {filteredVisits.length > 0
                    ? ` · ${filteredVisits.length}`
                    : ''}
                </StyledSectionLabel>
                <StyledSectionAction
                  type="button"
                  onClick={() => {
                    clearVisits();
                    setRecentVisits([]);
                  }}
                  title="Clear visit history"
                >
                  Clear
                </StyledSectionAction>
              </StyledSectionLabelRow>
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
                    onContextMenu={(e) =>
                      openContextMenu(e, {
                        href: `/object/${v.objectNameSingular}/${v.id}`,
                        objectNameSingular: v.objectNameSingular,
                        recordId: v.id,
                        label: v.name ?? '(unnamed)',
                        source: 'visit',
                      })
                    }
                  >
                    <StyledItemLink
                      to={`/object/${v.objectNameSingular}/${v.id}`}
                      title={`${v.name ?? '(unnamed)'} — visited ${new Date(v.visitedAt).toLocaleString()}${(v.visitCount ?? 1) > 1 ? ` (${v.visitCount}× total)` : ''}`}
                    >
                      <StyledItemBadge>
                        {badgeForObject(v.objectNameSingular)}
                      </StyledItemBadge>
                      <StyledItemLabel>{v.name ?? '(unnamed)'}</StyledItemLabel>
                      <StyledItemTimestamp>
                        {(v.visitCount ?? 1) > 1
                          ? `${v.visitCount}× ${formatRelativeShort(v.visitedAt)}`
                          : formatRelativeShort(v.visitedAt)}
                      </StyledItemTimestamp>
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
            <StyledSectionLabelRow>
              <StyledSectionLabel>Recent</StyledSectionLabel>
              {recentRecords.length > 0 && (
                <StyledSectionAction
                  type="button"
                  title="Refresh"
                  onClick={() => {
                    // Fire a custom event so any listening Apollo
                    // components can refetch. Soft-no-op otherwise.
                    window.dispatchEvent(
                      new CustomEvent('marketing-sidebar:refresh'),
                    );
                    setToast('Refreshing…');
                  }}
                >
                  ↻
                </StyledSectionAction>
              )}
            </StyledSectionLabelRow>
            {recentLoading && recentRecords.length === 0 ? (
              <StyledEmpty>Loading…</StyledEmpty>
            ) : recentRecords.length === 0 ? (
              <StyledEmptyCta>
                <StyledEmptyCtaText>
                  No {config.title.toLowerCase()} yet.
                </StyledEmptyCtaText>
                <StyledEmptyCtaButton
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                >
                  + Create your first{' '}
                  {config.title.replace(/s$/, '').toLowerCase()}
                </StyledEmptyCtaButton>
              </StyledEmptyCta>
            ) : filteredRecent.length === 0 && filterText !== '' ? null : (
              filteredRecent.map((record) => {
                // Visit count from the recently-visited store, if any.
                // Surfaced on Recent rows so users can spot frequently-
                // visited records they might want to pin.
                const recentVisit = recentVisits.find(
                  (v) =>
                    v.objectNameSingular === config.objectNameSingular &&
                    v.id === record.id,
                );
                const visitCount = recentVisit?.visitCount ?? 0;
                return (
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
                    onContextMenu={(e) =>
                      openContextMenu(e, {
                        href: `${config.showPath}/${record.id}`,
                        objectNameSingular: config.objectNameSingular,
                        recordId: record.id,
                        label: record.name ?? '(unnamed)',
                        source: 'recent',
                      })
                    }
                  >
                    <StyledItemLink
                      to={`${config.showPath}/${record.id}`}
                      title={
                        visitCount > 0
                          ? `${record.name ?? '(unnamed)'} — ${visitCount}× visits`
                          : (record.name ?? '(unnamed)')
                      }
                    >
                      <StyledItemLabel>
                        {record.name ?? '(unnamed)'}
                      </StyledItemLabel>
                      {visitCount >= 2 && (
                        <StyledItemTimestamp>{visitCount}×</StyledItemTimestamp>
                      )}
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
                );
              })
            )}
            {typeof sectionTotalCount === 'number' &&
              sectionTotalCount > recentRecords.length &&
              !recentLoading && (
                <StyledItemRow>
                  <StyledItemLink to={indexPath}>
                    <StyledItemLabel
                      style={{
                        color: themeCssVariables.font.color.tertiary,
                        fontStyle: 'italic',
                      }}
                    >
                      → View all {sectionTotalCount} in table
                    </StyledItemLabel>
                  </StyledItemLink>
                </StyledItemRow>
              )}
          </StyledSection>
        </>
      )}
    </StyledSidebar>
  );
};
