import { styled } from '@linaria/react';
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { readVisits } from '@/navigation/utils/recentlyVisitedStore';

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

const StyledInput = styled.input`
  background: transparent;
  border: 0;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: 15px;
  outline: 0;
  padding: 14px 18px;
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

const StyledLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledHint = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  font-family: ${themeCssVariables.font.family};
  font-size: 11px;
  letter-spacing: 0.04em;
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
  group: 'visits' | 'navigation' | 'records';
};

// Map a recently-visited record's objectNameSingular into a short
// uppercase badge that matches the convention used by the marketing
// sidebar's "Last visited" group.
const badgeForVisitObject = (objectNameSingular: string): string => {
  if (objectNameSingular === 'campaign') return 'Email';
  if (objectNameSingular === 'marketingCampaign') return 'MC';
  if (objectNameSingular === 'sequence') return 'Seq';
  if (objectNameSingular === 'form') return 'Form';
  if (objectNameSingular === 'person') return 'Person';
  if (objectNameSingular === 'company') return 'Co';
  return objectNameSingular;
};

export const MarketingQuickSwitcher = () => {
  // oxlint-disable-next-line twenty/no-navigate-prefer-link -- the
  // switcher resolves to a dynamic destination chosen by the user; a
  // static <Link> doesn't fit.
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [inputEl, setInputEl] = useState<HTMLInputElement | null>(null);

  // Snapshot of visits read on each open. Held in component state so a
  // re-open after the user clicked into a record reflects the new visit
  // order without waiting for a focus/storage event. Bounded to 8 so
  // the list stays scannable.
  const [visits, setVisits] = useState<
    { id: string; name: string | null; objectNameSingular: string }[]
  >([]);

  // Global Cmd/Ctrl+K to open. Esc to close. Any other key while closed
  // is ignored. We intentionally don't filter by INPUT focus — Cmd+K
  // should work even from inside a text field, matching how Linear,
  // Notion, GitHub, and similar apps behave.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((v) => !v);
        return;
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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
        })),
    );
    // Defer focus to the next paint so the modal has actually mounted.
    const id = window.setTimeout(() => inputEl?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [isOpen, inputEl]);

  const queryActive = text.trim().length >= 2;
  const queryPattern = `%${text.trim()}%`;

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
        })),
        ...xMcs.records.map<SearchHit>((r) => ({
          key: `r:mc-${r.id}`,
          href: `/object/marketingCampaign/${r.id}`,
          label: r.name ?? '(unnamed)',
          badge: 'MC',
          group: 'records',
        })),
        ...xSequences.records.map<SearchHit>((r) => ({
          key: `r:seq-${r.id}`,
          href: `/object/sequence/${r.id}`,
          label: r.name ?? '(unnamed)',
          badge: 'Seq',
          group: 'records',
        })),
        ...xForms.records.map<SearchHit>((r) => ({
          key: `r:form-${r.id}`,
          href: `/object/form/${r.id}`,
          label: r.name ?? '(unnamed)',
          badge: 'Form',
          group: 'records',
        })),
      ].slice(0, 16)
    : [];

  // Visits are only useful when the user hasn't started typing yet —
  // they're a "what was I just doing" surface, not a search result.
  // Filter out any visit whose name doesn't match the current filter
  // text so a typed query still narrows them.
  const visitHits: SearchHit[] = visits
    .filter(
      (v) =>
        text === '' ||
        (v.name ?? '').toLowerCase().includes(text.toLowerCase()),
    )
    .map<SearchHit>((v) => ({
      key: `v:${v.objectNameSingular}-${v.id}`,
      href: `/object/${v.objectNameSingular}/${v.id}`,
      label: v.name ?? '(unnamed)',
      badge: badgeForVisitObject(v.objectNameSingular),
      group: 'visits',
    }));

  const allHits: SearchHit[] = [...visitHits, ...navigationHits, ...recordHits];
  const safeIndex =
    allHits.length === 0
      ? -1
      : Math.min(Math.max(highlightedIndex, 0), allHits.length - 1);
  const highlightedKey = safeIndex >= 0 ? allHits[safeIndex].key : null;

  const onInputKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
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
    if (e.key === 'Enter') {
      if (allHits.length === 0) return;
      e.preventDefault();
      const target = allHits[Math.max(safeIndex, 0)];
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
        <StyledInput
          ref={setInputEl}
          type="text"
          placeholder="Jump to a section or search by name…"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setHighlightedIndex(0);
          }}
          onKeyDown={onInputKey}
          aria-label="Quick switcher search"
        />
        <StyledResultsScroll>
          {allHits.length === 0 && queryActive && (
            <StyledEmpty>No matches for &quot;{text}&quot;</StyledEmpty>
          )}
          {visitHits.length > 0 && (
            <>
              <StyledSectionLabel>Recently visited</StyledSectionLabel>
              {visitHits.map((hit) => (
                <StyledResultRow
                  key={hit.key}
                  type="button"
                  isHighlighted={highlightedKey === hit.key}
                  onClick={() => {
                    navigate(hit.href);
                    setIsOpen(false);
                  }}
                >
                  <StyledBadge>{hit.badge}</StyledBadge>
                  <StyledLabel>{hit.label}</StyledLabel>
                </StyledResultRow>
              ))}
            </>
          )}
          {navigationHits.length > 0 && (
            <>
              <StyledSectionLabel>Sections</StyledSectionLabel>
              {navigationHits.map((hit) => {
                const navItem = SECTION_NAV.find((n) => n.href === hit.href);
                return (
                  <StyledResultRow
                    key={hit.key}
                    type="button"
                    isHighlighted={highlightedKey === hit.key}
                    onClick={() => {
                      navigate(hit.href);
                      setIsOpen(false);
                    }}
                  >
                    <StyledBadge>{hit.badge}</StyledBadge>
                    <StyledLabel>{hit.label}</StyledLabel>
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
                  onClick={() => {
                    navigate(hit.href);
                    setIsOpen(false);
                  }}
                >
                  <StyledBadge>{hit.badge}</StyledBadge>
                  <StyledLabel>{hit.label}</StyledLabel>
                </StyledResultRow>
              ))}
            </>
          )}
        </StyledResultsScroll>
        <StyledFooter>
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>Esc close</span>
        </StyledFooter>
      </StyledCard>
    </StyledBackdrop>
  );
};
