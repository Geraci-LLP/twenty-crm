import { useLingui } from '@lingui/react/macro';
import { AppPath } from 'twenty-shared/types';
import {
  IconChartBar,
  IconFileText,
  IconLayoutKanban,
  IconMail,
  IconSend,
  IconTargetArrow,
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

export const NavigationDrawerMarketingSection = () => {
  const { t } = useLingui();

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
