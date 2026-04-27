import { useLingui } from '@lingui/react/macro';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';
import {
  IconChartBar,
  IconFileText,
  IconLayoutKanban,
  IconMail,
  IconSend,
  IconTargetArrow,
  IconWorld,
} from 'twenty-ui/display';
import { AnimatedExpandableContainer } from 'twenty-ui/layout';

import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { NavigationDrawerAnimatedCollapseWrapper } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerAnimatedCollapseWrapper';
import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { NavigationDrawerSection } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSection';
import { NavigationDrawerSectionTitle } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSectionTitle';
import { useNavigationSection } from '@/ui/navigation/navigation-drawer/hooks/useNavigationSection';
import { isNavigationSectionOpenFamilyState } from '@/ui/navigation/navigation-drawer/states/isNavigationSectionOpenFamilyState';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';

// Marketing section in the main navigation drawer. Groups every marketing
// surface — Email (campaigns), Sequences, Forms, MarketingCampaign,
// Marketing Analytics, Audiences — into one collapsible section so the
// user doesn't have to hunt for them in the flat workspace-objects list.
//
// Each item shows a live record count via useFindManyRecords' totalCount
// (limit:1 keeps the payload tiny). Counts are tiny extra queries but
// give the user at-a-glance scale of each section.

const useObjectCount = (objectNameSingular: string): number | undefined => {
  const { totalCount } = useFindManyRecords({
    objectNameSingular,
    limit: 1,
    recordGqlFields: { id: true },
  });
  return totalCount;
};

const formatCount = (n: number | undefined): string | undefined => {
  if (n === undefined || n === 0) return undefined;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

// Two-key chord for jumping between marketing sections — press "g"
// then a digit within 1s. Inspired by GitHub's g+i / g+p shortcuts.
const MARKETING_HOTKEYS: Record<string, string> = {
  '1': '/objects/campaigns',
  '2': '/objects/marketingCampaigns',
  '3': '/objects/sequences',
  '4': '/objects/forms',
  '5': AppPath.MarketingAnalytics,
  '6': '/objects/people',
  '7': '/objects/landingPages',
};

export const NavigationDrawerMarketingSection = () => {
  const { t } = useLingui();
  // oxlint-disable-next-line twenty/no-navigate-prefer-link -- chord
  // shortcut destinations are dynamic, not static link targets.
  const navigate = useNavigate();
  const [chordPrimed, setChordPrimed] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName ?? '';
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target?.isContentEditable === true
      ) {
        return;
      }
      if (chordPrimed) {
        const dest = MARKETING_HOTKEYS[e.key];
        setChordPrimed(false);
        if (dest !== undefined) {
          e.preventDefault();
          navigate(dest);
        }
        return;
      }
      if (e.key === 'g') {
        setChordPrimed(true);
        // Auto-clear the chord state after 1s if no follow-up.
        window.setTimeout(() => setChordPrimed(false), 1000);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chordPrimed, navigate]);

  const { toggleNavigationSection } = useNavigationSection('Marketing');
  const isNavigationSectionOpen = useAtomFamilyStateValue(
    isNavigationSectionOpenFamilyState,
    'Marketing',
  );

  const campaignCount = useObjectCount('campaign');
  const marketingCampaignCount = useObjectCount('marketingCampaign');
  const sequenceCount = useObjectCount('sequence');
  const formCount = useObjectCount('form');
  const personCount = useObjectCount('person');
  const landingPageCount = useObjectCount('landingPage');

  return (
    <NavigationDrawerSection>
      <NavigationDrawerAnimatedCollapseWrapper>
        <NavigationDrawerSectionTitle
          label={t`Marketing`}
          onClick={toggleNavigationSection}
          isOpen={isNavigationSectionOpen}
        />
      </NavigationDrawerAnimatedCollapseWrapper>
      <AnimatedExpandableContainer
        isExpanded={isNavigationSectionOpen}
        dimension="height"
        mode="fit-content"
        containAnimation
        initial={false}
      >
        <NavigationDrawerItem
          label={t`Email Campaigns`}
          to="/objects/campaigns"
          Icon={IconMail}
          secondaryLabel={formatCount(campaignCount)}
        />
        <NavigationDrawerItem
          label={t`Marketing Campaigns`}
          to="/objects/marketingCampaigns"
          Icon={IconLayoutKanban}
          secondaryLabel={formatCount(marketingCampaignCount)}
        />
        <NavigationDrawerItem
          label={t`Sequences`}
          to="/objects/sequences"
          Icon={IconSend}
          secondaryLabel={formatCount(sequenceCount)}
        />
        <NavigationDrawerItem
          label={t`Forms`}
          to="/objects/forms"
          Icon={IconFileText}
          secondaryLabel={formatCount(formCount)}
        />
        <NavigationDrawerItem
          label={t`Landing Pages`}
          to="/objects/landingPages"
          Icon={IconWorld}
          secondaryLabel={formatCount(landingPageCount)}
        />
        <NavigationDrawerItem
          label={t`Analytics`}
          to={AppPath.MarketingAnalytics}
          Icon={IconChartBar}
        />
        <NavigationDrawerItem
          label={t`Audiences`}
          to="/objects/people"
          Icon={IconTargetArrow}
          secondaryLabel={formatCount(personCount)}
        />
      </AnimatedExpandableContainer>
    </NavigationDrawerSection>
  );
};
