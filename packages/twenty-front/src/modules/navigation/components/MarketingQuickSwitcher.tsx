import { styled } from '@linaria/react';
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { readVisits } from '@/navigation/utils/recentlyVisitedStore';

// Read the marketing sidebar's pinned map so we can star result rows
// for records the user has pinned. Same shape and storage key the
// sidebar uses (Record<objectNameSingular, recordId[]>).
const readPinnedFromStorage = (): Record<string, string[]> => {
  try {
    const raw = window.localStorage.getItem('twenty.marketingSidebar.pinned');
    if (raw === null || raw === '') return {};
    const parsed = JSON.parse(raw) as Record<string, string[]>;
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed;
  } catch {
    return {};
  }
};

// Read the marketing sidebar's recent-search list. Stored under the
// same localStorage key the sidebar uses so the lists stay in sync.
const readRecentSearchesFromStorage = (): string[] => {
  try {
    const raw = window.localStorage.getItem(
      'twenty.marketingSidebar.recentSearches',
    );
    if (raw === null || raw === '') return [];
    const parsed = JSON.parse(raw) as string[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === 'string').slice(0, 5);
  } catch {
    return [];
  }
};

// Global Cmd/Ctrl+K command palette. Available on every route — not
// just marketing sections — so the user can jump anywhere without
// reaching for the sidebar. Shows section-navigation shortcuts at the
// top and cross-section name search results below.
//
// This overlay is intentionally simpler than the marketing sidebar:
// fewer sections, no pinning / drag, no recent searches. It's a fast
// jump-to surface, not a workspace.

type RecentRecord = ObjectRecord & { name?: string | null };

type SectionNavItem = {
  label: string;
  href: string;
  hint: string;
  badge: string;
};

const SECTION_NAV: SectionNavItem[] = [
  {
    label: 'Email Campaigns',
    href: '/objects/campaigns',
    hint: 'g 1',
    badge: 'Email',
  },
  {
    label: 'Marketing Campaigns',
    href: '/objects/marketingCampaigns',
    hint: 'g 2',
    badge: 'MC',
  },
  {
    label: 'Sequences',
    href: '/objects/sequences',
    hint: 'g 3',
    badge: 'Seq',
  },
  { label: 'Forms', href: '/objects/forms', hint: 'g 4', badge: 'Form' },
  {
    label: 'Landing Pages',
    href: '/objects/landingPages',
    hint: '',
    badge: 'Page',
  },
  {
    label: 'Marketing Analytics',
    href: '/marketing/analytics',
    hint: 'g 5',
    badge: 'Stats',
  },
  {
    label: 'People (Audiences)',
    href: '/objects/people',
    hint: 'g 6',
    badge: 'Person',
  },
  { label: 'Companies', href: '/objects/companies', hint: '', badge: 'Co' },
];

// Action commands — non-navigation entries that perform a side effect
// (toggle, create, sign out). Each has a runner closed over by the
// component below. Actions are matched by keyword: typing "create",
// "new", "toggle", "sign", "settings", etc. surfaces them in the
// Actions group. They're hidden when the input is empty so the
// default open is purely focused on navigation / visits.
type ActionCommand = {
  key: string;
  label: string;
  badge: string;
  // Free-form keywords matched against the input. Concatenated with the
  // label so a user typing "create email" finds "New Email Campaign".
  keywords: string;
};

const ACTION_COMMANDS: ActionCommand[] = [
  {
    key: 'action:new-campaign',
    label: 'New Email Campaign',
    badge: 'Action',
    keywords: 'create new email campaign send',
  },
  {
    key: 'action:new-marketing-campaign',
    label: 'New Marketing Campaign',
    badge: 'Action',
    keywords: 'create new marketing campaign group',
  },
  {
    key: 'action:new-sequence',
    label: 'New Sequence',
    badge: 'Action',
    keywords: 'create new sequence cadence drip',
  },
  {
    key: 'action:new-form',
    label: 'New Form',
    badge: 'Action',
    keywords: 'create new form lead capture embed',
  },
  {
    key: 'action:new-landing-page',
    label: 'New Landing Page',
    badge: 'Action',
    keywords: 'create new landing page lp web public',
  },
  {
    key: 'action:settings',
    label: 'Open Settings',
    badge: 'Action',
    keywords: 'settings preferences profile workspace',
  },
  {
    key: 'action:toggle-sidebar',
    label: 'Toggle sidebar collapse',
    badge: 'Action',
    keywords: 'toggle sidebar collapse expand show hide narrow wide',
  },
];

// Side-effect runner for non-navigation actions. Returns true if the
// action was handled (caller should close the switcher and skip the
// default navigate); false if the caller should fall back to navigate.
const runAction = (actionKey: string): boolean => {
  if (actionKey === 'action:toggle-sidebar') {
    // The marketing sidebar listens for this CustomEvent and flips
    // its collapse state. Defined here as a contract; sidebar wires
    // it up in its keydown effect.
    window.dispatchEvent(new CustomEvent('marketing-sidebar:toggle-collapse'));
    return true;
  }
  return false;
};

// Toggle pin state in the same localStorage map the sidebar uses.
// Returns true if the record is now pinned, false if it was unpinned.
const togglePinInStorage = (
  objectNameSingular: string,
  recordId: string,
): boolean => {
  try {
    const raw = window.localStorage.getItem('twenty.marketingSidebar.pinned');
    const map =
      raw === null ? {} : (JSON.parse(raw) as Record<string, string[]>);
    const list = map[objectNameSingular] ?? [];
    const wasPinned = list.includes(recordId);
    map[objectNameSingular] = wasPinned
      ? list.filter((x) => x !== recordId)
      : [recordId, ...list];
    window.localStorage.setItem(
      'twenty.marketingSidebar.pinned',
      JSON.stringify(map),
    );
    // Storage events don't fire in the same tab, so dispatch a synthetic
    // event for any sidebar in this tab to pick up.
    window.dispatchEvent(new StorageEvent('storage'));
    return !wasPinned;
  } catch {
    return false;
  }
};

/* oxlint-disable twenty/no-hardcoded-colors */
const StyledBackdrop = styled.div`
  align-items: flex-start;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  inset: 0;
  justify-content: center;
  padding-top: 12vh;
  position: fixed;
  z-index: 9998;
`;

const StyledCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  max-height: 70vh;
  max-width: 540px;
  overflow: hidden;
  width: 90%;
`;
/* oxlint-enable twenty/no-hardcoded-colors */

const StyledInputRow = styled.div`
  align-items: center;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  padding: 0 18px;
`;

const StyledContextChip = styled.span`
  background: ${themeCssVariables.background.transparent.lighter};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.tertiary};
  flex-shrink: 0;
  font-family: ${themeCssVariables.font.family};
  font-size: 11px;
  letter-spacing: 0.04em;
  margin-right: 10px;
  padding: 3px 8px;
  text-transform: uppercase;
`;

const StyledInput = styled.input`
  background: transparent;
  border: 0;
  color: ${themeCssVariables.font.color.primary};
  flex: 1;
  font-family: ${themeCssVariables.font.family};
  font-size: 15px;
  outline: 0;
  padding: 14px 0;
  &::placeholder {
    color: ${themeCssVariables.font.color.tertiary};
  }
`;

const StyledResultsScroll = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 6px 0;
`;

const StyledSectionLabel = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 10.5px;
  font-weight: ${themeCssVariables.font.weight.semiBold};
  letter-spacing: 0.06em;
  padding: 8px 18px 4px;
  text-transform: uppercase;
`;

const StyledResultRow = styled.button<{ isHighlighted?: boolean }>`
  align-items: center;
  background: ${(p) =>
    p.isHighlighted === true
      ? themeCssVariables.background.transparent.medium
      : 'transparent'};
  border: 0;
  border-left: 2px solid
    ${(p) =>
      p.isHighlighted === true
        ? themeCssVariables.color.orange
        : 'transparent'};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  display: flex;
  font-family: ${themeCssVariables.font.family};
  font-size: 13px;
  gap: 10px;
  padding: 8px 16px;
  scroll-margin: 60px;
  text-align: left;
  width: 100%;
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
  }
`;

const StyledBadge = styled.span`
  background: ${themeCssVariables.background.transparent.lighter};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.tertiary};
  flex-shrink: 0;
  font-size: 10px;
  font-weight: ${themeCssVariables.font.weight.medium};
  letter-spacing: 0.04em;
  padding: 2px 7px;
  text-transform: uppercase;
`;

const StyledPinStar = styled.span`
  color: ${themeCssVariables.color.orange};
  flex-shrink: 0;
  font-size: 11px;
`;

const StyledLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* oxlint-disable twenty/no-hardcoded-colors */
const StyledHighlight = styled.span`
  background: ${themeCssVariables.color.orange};
  border-radius: 2px;
  color: #ffffff;
  padding: 0 2px;
`;
/* oxlint-enable twenty/no-hardcoded-colors */

// Render a label with all occurrences of `query` (case-insensitive)
// wrapped in StyledHighlight. Plain string when query is empty so we
// don't pay for split() / regex on every render of every row.
const renderHighlighted = (label: string, query: string): ReactNode => {
  if (query === '') return label;
  const trimmed = query.trim();
  if (trimmed === '') return label;
  const lc = label.toLowerCase();
  const lq = trimmed.toLowerCase();
  const out: ReactNode[] = [];
  let cursor = 0;
  let next = lc.indexOf(lq, cursor);
  let key = 0;
  while (next !== -1) {
    if (next > cursor) {
      out.push(label.slice(cursor, next));
    }
    out.push(
      <StyledHighlight key={key++}>
        {label.slice(next, next + trimmed.length)}
      </StyledHighlight>,
    );
    cursor = next + trimmed.length;
    next = lc.indexOf(lq, cursor);
  }
  if (cursor < label.length) out.push(label.slice(cursor));
  return out;
};

const StyledHint = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  font-family: ${themeCssVariables.font.family};
  font-size: 11px;
  letter-spacing: 0.04em;
`;

const StyledRecentSearchRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px 18px 4px;
`;

const StyledRecentSearchChip = styled.button`
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: 12px;
  color: ${themeCssVariables.font.color.secondary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: 11px;
  padding: 3px 9px;
  &:hover {
    background: ${themeCssVariables.background.transparent.medium};
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledFooter = styled.div`
  border-top: 1px solid ${themeCssVariables.border.color.light};
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  font-size: 11px;
  gap: 14px;
  padding: 8px 18px;
`;

const StyledEmpty = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: 13px;
  padding: 14px 18px;
`;

type SearchHit = {
  key: string;
  href: string;
  label: string;
  badge: string;
  group: 'today' | 'visits' | 'actions' | 'navigation' | 'records';
  // Optional record metadata so the row can render a star when the
  // record is pinned in the sidebar.
  recordObject?: string;
  recordId?: string;
};

// Map an action key to the route that triggers it. The "create" routes
// add ?create=1 which the marketing sidebar listens for and opens its
// inline create form on mount.
const hrefForAction = (actionKey: string): string => {
  if (actionKey === 'action:new-campaign') return '/objects/campaigns?create=1';
  if (actionKey === 'action:new-marketing-campaign')
    return '/objects/marketingCampaigns?create=1';
  if (actionKey === 'action:new-sequence') return '/objects/sequences?create=1';
  if (actionKey === 'action:new-form') return '/objects/forms?create=1';
  if (actionKey === 'action:new-landing-page')
    return '/objects/landingPages?create=1';
  if (actionKey === 'action:settings') return '/settings/profile';
  return '/';
};

// Detect a friendly label for the current URL so the switcher can show
// the user where they are. Matches the same set of marketing routes
// the sidebar handles, plus a generic "Settings" fallback.
const labelForCurrentPath = (pathname: string): string | null => {
  if (pathname.startsWith('/objects/campaigns')) return 'Email Campaigns';
  if (pathname.startsWith('/objects/marketingCampaigns'))
    return 'Marketing Campaigns';
  if (pathname.startsWith('/objects/sequences')) return 'Sequences';
  if (pathname.startsWith('/objects/forms')) return 'Forms';
  if (pathname.startsWith('/objects/people')) return 'People';
  if (pathname.startsWith('/objects/companies')) return 'Companies';
  if (pathname.startsWith('/object/campaign')) return 'Email Campaign';
  if (pathname.startsWith('/object/marketingCampaign'))
    return 'Marketing Campaign';
  if (pathname.startsWith('/object/sequence')) return 'Sequence';
  if (pathname.startsWith('/object/form')) return 'Form';
  if (pathname.startsWith('/object/person')) return 'Person';
  if (pathname.startsWith('/object/company')) return 'Company';
  if (pathname.startsWith('/marketing/analytics')) return 'Analytics';
  if (pathname.startsWith('/settings')) return 'Settings';
  return null;
};

// Map a recently-visited record's objectNameSingular into a short
// uppercase badge that matches the convention used by the marketing
// sidebar's "Last visited" group.
const badgeForVisitObject = (objectNameSingular: string): string => {
  if (objectNameSingular === 'campaign') return 'Email';
  if (objectNameSingular === 'marketingCampaign') return 'MC';
  if (objectNameSingular === 'sequence') return 'Seq';
  if (objectNameSingular === 'form') return 'Form';
  if (objectNameSingular === 'landingPage') return 'Page';
  if (objectNameSingular === 'person') return 'Person';
  if (objectNameSingular === 'company') return 'Co';
  return objectNameSingular;
};

export const MarketingQuickSwitcher = () => {
  // oxlint-disable-next-line twenty/no-navigate-prefer-link -- the
  // switcher resolves to a dynamic destination chosen by the user; a
  // static <Link> doesn't fit.
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [inputEl, setInputEl] = useState<HTMLInputElement | null>(null);

  // Snapshot of visits read on each open. Held in component state so a
  // re-open after the user clicked into a record reflects the new visit
  // order without waiting for a focus/storage event. Bounded to 8 so
  // the list stays scannable.
  const [visits, setVisits] = useState<
    {
      id: string;
      name: string | null;
      objectNameSingular: string;
      visitedAt: number;
      visitCount: number;
    }[]
  >([]);

  // Recent searches mirror what the sidebar tracks. Surfaced as quick-
  // select chips when the input is empty.
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [pinnedMap, setPinnedMap] = useState<Record<string, string[]>>({});

  // Global Cmd/Ctrl+K to open. Shift+Cmd+K opens with the last query
  // pre-filled — quick re-execute of a previous search. Cmd+, jumps
  // straight to Settings (the OS-conventional shortcut). Esc to close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (e.shiftKey && !isOpen) {
          // Shift modifier on open recalls the most recent query.
          try {
            const last = window.localStorage.getItem(
              'twenty.quickSwitcher.lastQuery',
            );
            if (last !== null && last !== '') setText(last);
          } catch {
            // ignore
          }
        }
        setIsOpen((v) => !v);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        navigate('/settings/profile');
        return;
      }
      // Cmd+1..6 jumps to the corresponding marketing section without
      // even opening the switcher — the fast path for users who know
      // exactly where they want to go.
      if ((e.metaKey || e.ctrlKey) && /^[1-6]$/.test(e.key) && !e.altKey) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx >= 0 && idx < SECTION_NAV.length) {
          e.preventDefault();
          navigate(SECTION_NAV[idx].href);
          if (isOpen) setIsOpen(false);
          return;
        }
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // navigate is stable; safe to omit from deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Reset state on every open so a fresh open isn't pre-populated with
  // the previous query / highlight. Re-read visits each time so the
  // top of the list reflects the user's most recent activity.
  useEffect(() => {
    if (!isOpen) return;
    setText('');
    setHighlightedIndex(0);
    setVisits(
      readVisits()
        .slice(0, 8)
        .map((v) => ({
          id: v.id,
          name: v.name,
          objectNameSingular: v.objectNameSingular,
          visitedAt: v.visitedAt,
          visitCount: v.visitCount ?? 1,
        })),
    );
    setSavedSearches(readRecentSearchesFromStorage());
    setPinnedMap(readPinnedFromStorage());
    // Defer focus to the next paint so the modal has actually mounted.
    const id = window.setTimeout(() => inputEl?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [isOpen, inputEl]);

  // Auto-scroll the highlighted Cmd+K row into view as the user walks
  // up / down with arrow keys. Same pattern as the sidebar's filter
  // navigation: data-attribute on the highlighted row, querySelector +
  // scrollIntoView in an effect.
  useEffect(() => {
    if (highlightedIndex < 0 || !isOpen) return;
    const id = window.setTimeout(() => {
      const el = document.querySelector<HTMLButtonElement>(
        '[data-cmdk-highlighted="true"]',
      );
      el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 0);
    return () => window.clearTimeout(id);
  }, [highlightedIndex, isOpen]);

  const queryActive = text.trim().length >= 2;
  const queryPattern = `%${text.trim()}%`;
  // "Today's records" group: 24h-window of recently-visited records,
  // shown when the input is empty as a complement to "Recently visited"
  // which is unbounded. Uses the same in-memory visits snapshot.
  const dayCutoff = Date.now() - 24 * 60 * 60 * 1000;

  const xCampaigns = useFindManyRecords<RecentRecord>({
    objectNameSingular: 'campaign',
    limit: 5,
    filter: queryActive
      ? { name: { ilike: queryPattern } }
      : { id: { eq: 'no-match' } },
    recordGqlFields: { id: true, name: true },
    skip: !queryActive,
  });
  const xMcs = useFindManyRecords<RecentRecord>({
    objectNameSingular: 'marketingCampaign',
    limit: 5,
    filter: queryActive
      ? { name: { ilike: queryPattern } }
      : { id: { eq: 'no-match' } },
    recordGqlFields: { id: true, name: true },
    skip: !queryActive,
  });
  const xSequences = useFindManyRecords<RecentRecord>({
    objectNameSingular: 'sequence',
    limit: 5,
    filter: queryActive
      ? { name: { ilike: queryPattern } }
      : { id: { eq: 'no-match' } },
    recordGqlFields: { id: true, name: true },
    skip: !queryActive,
  });
  const xForms = useFindManyRecords<RecentRecord>({
    objectNameSingular: 'form',
    limit: 5,
    filter: queryActive
      ? { name: { ilike: queryPattern } }
      : { id: { eq: 'no-match' } },
    recordGqlFields: { id: true, name: true },
    skip: !queryActive,
  });
  // Landing pages use `title` instead of `name` for their human label.
  // Same ilike filter pattern, just on the appropriate field.
  const xLandingPages = useFindManyRecords<RecentRecord & { title?: string }>({
    objectNameSingular: 'landingPage',
    limit: 5,
    filter: queryActive
      ? { title: { ilike: queryPattern } }
      : { id: { eq: 'no-match' } },
    recordGqlFields: { id: true, title: true },
    skip: !queryActive,
  });

  if (!isOpen) return null;

  const lower = text.toLowerCase();
  const navigationHits: SearchHit[] = SECTION_NAV.filter(
    (n) => text === '' || n.label.toLowerCase().includes(lower),
  ).map<SearchHit>((n) => ({
    key: `nav:${n.href}`,
    href: n.href,
    label: n.label,
    badge: n.badge,
    group: 'navigation',
  }));

  const recordHits: SearchHit[] = queryActive
    ? [
        ...xCampaigns.records.map<SearchHit>((r) => ({
          key: `r:campaign-${r.id}`,
          href: `/object/campaign/${r.id}`,
          label: r.name ?? '(unnamed)',
          badge: 'Email',
          group: 'records',
          recordObject: 'campaign',
          recordId: r.id,
        })),
        ...xMcs.records.map<SearchHit>((r) => ({
          key: `r:mc-${r.id}`,
          href: `/object/marketingCampaign/${r.id}`,
          label: r.name ?? '(unnamed)',
          badge: 'MC',
          group: 'records',
          recordObject: 'marketingCampaign',
          recordId: r.id,
        })),
        ...xSequences.records.map<SearchHit>((r) => ({
          key: `r:seq-${r.id}`,
          href: `/object/sequence/${r.id}`,
          label: r.name ?? '(unnamed)',
          badge: 'Seq',
          group: 'records',
          recordObject: 'sequence',
          recordId: r.id,
        })),
        ...xForms.records.map<SearchHit>((r) => ({
          key: `r:form-${r.id}`,
          href: `/object/form/${r.id}`,
          label: r.name ?? '(unnamed)',
          badge: 'Form',
          group: 'records',
          recordObject: 'form',
          recordId: r.id,
        })),
        ...xLandingPages.records.map<SearchHit>((r) => ({
          key: `r:lp-${r.id}`,
          href: `/object/landingPage/${r.id}`,
          label: (r as { title?: string }).title ?? '(untitled)',
          badge: 'Page',
          group: 'records',
          recordObject: 'landingPage',
          recordId: r.id,
        })),
      ].slice(0, 16)
    : [];

  // Visits are only useful when the user hasn't started typing yet —
  // they're a "what was I just doing" surface, not a search result.
  // Filter out any visit whose name doesn't match the current filter
  // text so a typed query still narrows them.
  // Today-only visit hits — shown when the input is empty as a "what
  // I touched today" surface. Filter applies as text narrows the list.
  const todayHits: SearchHit[] =
    text === ''
      ? visits
          .filter((v) => v.visitedAt >= dayCutoff)
          .slice(0, 5)
          .map<SearchHit>((v) => ({
            key: `today:${v.objectNameSingular}-${v.id}`,
            href: `/object/${v.objectNameSingular}/${v.id}`,
            label: v.name ?? '(unnamed)',
            badge: badgeForVisitObject(v.objectNameSingular),
            group: 'today',
            recordObject: v.objectNameSingular,
            recordId: v.id,
          }))
      : [];

  const visitHits: SearchHit[] = visits
    .filter(
      (v) =>
        text === '' ||
        (v.name ?? '').toLowerCase().includes(text.toLowerCase()),
    )
    .sort((a, b) => b.visitedAt - a.visitedAt)
    .map<SearchHit>((v) => ({
      key: `v:${v.objectNameSingular}-${v.id}`,
      href: `/object/${v.objectNameSingular}/${v.id}`,
      label: v.name ?? '(unnamed)',
      badge: badgeForVisitObject(v.objectNameSingular),
      group: 'visits',
      recordObject: v.objectNameSingular,
      recordId: v.id,
    }));

  // Actions surface only when the user has typed something — keeping the
  // empty open focused on visits + section navigation, not a static
  // wall of "New X" entries the user didn't ask for.
  const actionHits: SearchHit[] =
    text.trim().length === 0
      ? []
      : ACTION_COMMANDS.filter((a) => {
          const haystack = `${a.label} ${a.keywords}`.toLowerCase();
          return haystack.includes(lower);
        }).map<SearchHit>((a) => ({
          key: a.key,
          href: hrefForAction(a.key),
          label: a.label,
          badge: a.badge,
          group: 'actions',
        }));

  // Today's hits go above visits so the "what was I working on today"
  // mental model is the first thing the user sees.
  const dedupedVisitHits = visitHits.filter(
    (v) => !todayHits.some((t) => t.key.replace('today:', 'v:') === v.key),
  );
  const allHits: SearchHit[] = [
    ...todayHits,
    ...dedupedVisitHits,
    ...actionHits,
    ...navigationHits,
    ...recordHits,
  ];
  const safeIndex =
    allHits.length === 0
      ? -1
      : Math.min(Math.max(highlightedIndex, 0), allHits.length - 1);
  const highlightedKey = safeIndex >= 0 ? allHits[safeIndex].key : null;

  // Find the index of the first item belonging to a different group
  // than the currently-highlighted one. Used by Tab to "jump to next
  // group". Wraps to the start once we run out of groups.
  const indexOfNextGroupStart = (currentIndex: number): number => {
    if (allHits.length === 0) return -1;
    const currentGroup = allHits[currentIndex]?.group ?? null;
    for (let i = 1; i <= allHits.length; i++) {
      const probe = (currentIndex + i) % allHits.length;
      if (allHits[probe].group !== currentGroup) return probe;
    }
    return currentIndex;
  };

  const onInputKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    // Cmd+P / Ctrl+P toggles pin on the currently highlighted record
    // hit (records and visits are pinnable; sections / actions aren't).
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
      const target = allHits[Math.max(safeIndex, 0)];
      if (
        target !== undefined &&
        target.recordObject !== undefined &&
        target.recordId !== undefined
      ) {
        e.preventDefault();
        const nowPinned = togglePinInStorage(
          target.recordObject,
          target.recordId,
        );
        setPinnedMap(readPinnedFromStorage());
        // Visual feedback in the input — placeholder briefly hints what
        // happened. Cleared on next render anyway.
        if (nowPinned) {
          // no-op: the ★ rendering will reflect the new state
        }
        return;
      }
    }
    // Cmd+Backspace clears the entire input in one keystroke (common
    // OS-level shortcut for "delete word" / "clear").
    if ((e.metaKey || e.ctrlKey) && e.key === 'Backspace') {
      e.preventDefault();
      setText('');
      setHighlightedIndex(0);
      return;
    }
    // Backspace on an empty input is a quick "close" shortcut — common
    // pattern in command palettes (Linear, Raycast, GitHub).
    if (e.key === 'Backspace' && text === '') {
      e.preventDefault();
      setIsOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      if (allHits.length === 0) return;
      e.preventDefault();
      setHighlightedIndex((i) => (i + 1) % allHits.length);
      return;
    }
    if (e.key === 'ArrowUp') {
      if (allHits.length === 0) return;
      e.preventDefault();
      setHighlightedIndex((i) => (i - 1 + allHits.length) % allHits.length);
      return;
    }
    if (e.key === 'PageDown') {
      if (allHits.length === 0) return;
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 5, allHits.length - 1));
      return;
    }
    if (e.key === 'PageUp') {
      if (allHits.length === 0) return;
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 5, 0));
      return;
    }
    if (e.key === 'Home') {
      if (allHits.length === 0) return;
      e.preventDefault();
      setHighlightedIndex(0);
      return;
    }
    if (e.key === 'End') {
      if (allHits.length === 0) return;
      e.preventDefault();
      setHighlightedIndex(allHits.length - 1);
      return;
    }
    if (e.key === 'Tab') {
      if (allHits.length === 0) return;
      e.preventDefault();
      // Shift+Tab walks backwards: find the previous group's first
      // item by scanning the wrap-around list in reverse.
      if (e.shiftKey) {
        setHighlightedIndex((i) => {
          const safeI = Math.max(i, 0);
          const currentGroup = allHits[safeI]?.group ?? null;
          for (let j = 1; j <= allHits.length; j++) {
            const probe = (safeI - j + allHits.length) % allHits.length;
            if (allHits[probe].group !== currentGroup) {
              // Walk backward through the same group to find its first
              // member, so Shift+Tab feels symmetric with Tab.
              let firstOfGroup = probe;
              while (
                firstOfGroup > 0 &&
                allHits[firstOfGroup - 1].group === allHits[probe].group
              ) {
                firstOfGroup -= 1;
              }
              return firstOfGroup;
            }
          }
          return safeI;
        });
        return;
      }
      setHighlightedIndex((i) => indexOfNextGroupStart(Math.max(i, 0)));
      return;
    }
    if (e.key === '+') {
      // "+" on a highlighted Section creates a new record there. The
      // Sections group's hrefs all live under /objects/<plural>, so
      // we infer the create action from the URL.
      const target = allHits[Math.max(safeIndex, 0)];
      if (target !== undefined && target.group === 'navigation') {
        const m = target.href.match(/^\/objects\/([^/?#]+)/);
        if (m !== null) {
          e.preventDefault();
          navigate(`/objects/${m[1]}?create=1`);
          setIsOpen(false);
          return;
        }
      }
    }
    if (e.key === 'Enter') {
      if (allHits.length === 0) return;
      e.preventDefault();
      const target = allHits[Math.max(safeIndex, 0)];
      // Persist the query so Shift+Cmd+K can recall it next time.
      // Empty queries don't pollute history.
      if (text.trim().length >= 2) {
        try {
          window.localStorage.setItem(
            'twenty.quickSwitcher.lastQuery',
            text.trim(),
          );
        } catch {
          // ignore
        }
      }
      // Shift+Enter opens in a new tab (only meaningful for href-based
      // hits — actions still run in-place).
      if (e.shiftKey && target.group !== 'actions') {
        window.open(target.href, '_blank', 'noopener,noreferrer');
        setIsOpen(false);
        return;
      }
      if (target.group === 'actions' && runAction(target.key)) {
        setIsOpen(false);
        return;
      }
      navigate(target.href);
      setIsOpen(false);
    }
  };

  return (
    <StyledBackdrop onClick={() => setIsOpen(false)} role="presentation">
      <StyledCard
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Quick switcher"
      >
        <StyledInputRow>
          {(() => {
            const ctx = labelForCurrentPath(location.pathname);
            return ctx === null ? null : (
              <StyledContextChip title={`Currently on: ${ctx}`}>
                {ctx}
              </StyledContextChip>
            );
          })()}
          <StyledInput
            ref={setInputEl}
            type="text"
            placeholder="Search records, sections, actions…"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setHighlightedIndex(0);
            }}
            onKeyDown={onInputKey}
            aria-label="Quick switcher search"
          />
        </StyledInputRow>
        <StyledResultsScroll>
          {allHits.length === 0 && queryActive && (
            <StyledEmpty>No matches for &quot;{text}&quot;</StyledEmpty>
          )}
          {text === '' && savedSearches.length > 0 && (
            <>
              <StyledSectionLabel>Recent searches</StyledSectionLabel>
              <StyledRecentSearchRow>
                {savedSearches.map((s) => (
                  <StyledRecentSearchChip
                    key={s}
                    type="button"
                    onClick={() => {
                      setText(s);
                      setHighlightedIndex(0);
                      inputEl?.focus();
                    }}
                  >
                    {s}
                  </StyledRecentSearchChip>
                ))}
              </StyledRecentSearchRow>
            </>
          )}
          {text === '' &&
            visitHits.length === 0 &&
            savedSearches.length === 0 && (
              <StyledEmpty>
                No recent visits yet — open a record and it&apos;ll show up here
                for one-click return.
              </StyledEmpty>
            )}
          {todayHits.length > 0 && (
            <>
              <StyledSectionLabel>Today</StyledSectionLabel>
              {todayHits.map((hit) => {
                const isCurrent = location.pathname === hit.href;
                return (
                  <StyledResultRow
                    key={hit.key}
                    type="button"
                    isHighlighted={highlightedKey === hit.key}
                    data-cmdk-highlighted={
                      highlightedKey === hit.key ? 'true' : undefined
                    }
                    onClick={() => {
                      navigate(hit.href);
                      setIsOpen(false);
                    }}
                  >
                    <StyledBadge>{hit.badge}</StyledBadge>
                    {hit.recordObject !== undefined &&
                      hit.recordId !== undefined &&
                      (pinnedMap[hit.recordObject] ?? []).includes(
                        hit.recordId,
                      ) && (
                        <StyledPinStar
                          aria-label="pinned"
                          title="Pinned in sidebar"
                        >
                          ★
                        </StyledPinStar>
                      )}
                    <StyledLabel>
                      {renderHighlighted(hit.label, text)}
                    </StyledLabel>
                    {isCurrent && <StyledHint>current</StyledHint>}
                  </StyledResultRow>
                );
              })}
            </>
          )}
          {dedupedVisitHits.length > 0 && (
            <>
              <StyledSectionLabel>Recently visited</StyledSectionLabel>
              {dedupedVisitHits.map((hit) => {
                const isCurrent = location.pathname === hit.href;
                return (
                  <StyledResultRow
                    key={hit.key}
                    type="button"
                    isHighlighted={highlightedKey === hit.key}
                    data-cmdk-highlighted={
                      highlightedKey === hit.key ? 'true' : undefined
                    }
                    onClick={() => {
                      navigate(hit.href);
                      setIsOpen(false);
                    }}
                  >
                    <StyledBadge>{hit.badge}</StyledBadge>
                    {hit.recordObject !== undefined &&
                      hit.recordId !== undefined &&
                      (pinnedMap[hit.recordObject] ?? []).includes(
                        hit.recordId,
                      ) && (
                        <StyledPinStar
                          aria-label="pinned"
                          title="Pinned in sidebar"
                        >
                          ★
                        </StyledPinStar>
                      )}
                    <StyledLabel>
                      {renderHighlighted(hit.label, text)}
                    </StyledLabel>
                    {isCurrent && <StyledHint>current</StyledHint>}
                  </StyledResultRow>
                );
              })}
            </>
          )}
          {actionHits.length > 0 && (
            <>
              <StyledSectionLabel>Actions</StyledSectionLabel>
              {actionHits.map((hit) => (
                <StyledResultRow
                  key={hit.key}
                  type="button"
                  isHighlighted={highlightedKey === hit.key}
                  data-cmdk-highlighted={
                    highlightedKey === hit.key ? 'true' : undefined
                  }
                  onClick={() => {
                    if (runAction(hit.key)) {
                      setIsOpen(false);
                      return;
                    }
                    navigate(hit.href);
                    setIsOpen(false);
                  }}
                >
                  <StyledBadge>{hit.badge}</StyledBadge>
                  <StyledLabel>
                    {renderHighlighted(hit.label, text)}
                  </StyledLabel>
                </StyledResultRow>
              ))}
            </>
          )}
          {navigationHits.length > 0 && (
            <>
              <StyledSectionLabel>Sections</StyledSectionLabel>
              {navigationHits.map((hit) => {
                const navItem = SECTION_NAV.find((n) => n.href === hit.href);
                const isCurrent = location.pathname.startsWith(hit.href);
                return (
                  <StyledResultRow
                    key={hit.key}
                    type="button"
                    isHighlighted={highlightedKey === hit.key}
                    data-cmdk-highlighted={
                      highlightedKey === hit.key ? 'true' : undefined
                    }
                    onClick={() => {
                      navigate(hit.href);
                      setIsOpen(false);
                    }}
                  >
                    <StyledBadge>{hit.badge}</StyledBadge>
                    <StyledLabel>
                      {renderHighlighted(hit.label, text)}
                    </StyledLabel>
                    {isCurrent && <StyledHint>current</StyledHint>}
                    {navItem !== undefined && navItem.hint !== '' && (
                      <StyledHint>{navItem.hint}</StyledHint>
                    )}
                  </StyledResultRow>
                );
              })}
            </>
          )}
          {recordHits.length > 0 && (
            <>
              <StyledSectionLabel>Records</StyledSectionLabel>
              {recordHits.map((hit) => (
                <StyledResultRow
                  key={hit.key}
                  type="button"
                  isHighlighted={highlightedKey === hit.key}
                  data-cmdk-highlighted={
                    highlightedKey === hit.key ? 'true' : undefined
                  }
                  onClick={() => {
                    navigate(hit.href);
                    setIsOpen(false);
                  }}
                >
                  <StyledBadge>{hit.badge}</StyledBadge>
                  {hit.recordObject !== undefined &&
                    hit.recordId !== undefined &&
                    (pinnedMap[hit.recordObject] ?? []).includes(
                      hit.recordId,
                    ) && (
                      <StyledPinStar
                        aria-label="pinned"
                        title="Pinned in sidebar"
                      >
                        ★
                      </StyledPinStar>
                    )}
                  <StyledLabel>
                    {renderHighlighted(hit.label, text)}
                  </StyledLabel>
                </StyledResultRow>
              ))}
            </>
          )}
        </StyledResultsScroll>
        <StyledFooter>
          <span>↑↓ nav</span>
          <span>Tab group</span>
          <span>↵ open</span>
          <span>⇧↵ tab</span>
          <span>⌘P pin</span>
          <span>+ new</span>
          <span>⌫ close</span>
          <span style={{ marginLeft: 'auto' }}>
            {allHits.length} result{allHits.length === 1 ? '' : 's'}
          </span>
        </StyledFooter>
      </StyledCard>
    </StyledBackdrop>
  );
};
