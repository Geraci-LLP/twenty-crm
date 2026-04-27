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

import { NavigationDrawerAnimatedCollapseWrapper } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerAnimatedCollapseWrapper';
import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { NavigationDrawerSection } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSection';
import { NavigationDrawerSectionTitle } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSectionTitle';
import { useNavigationSection } from '@/ui/navigation/navigation-drawer/hooks/useNavigationSection';
import { isNavigationSectionOpenFamilyState } from '@/ui/navigation/navigation-drawer/states/isNavigationSectionOpenFamilyState';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';

// Marketing section in the main navigation drawer. Groups every marketing
// surface — Email (campaigns), Sequences, Forms, MarketingCampaign,
// Marketing Analytics — into one collapsible section so the user doesn't
// have to hunt for them in the flat workspace-objects list.
//
// Each item navigates to the existing route. The Marketing Campaign and
// Email links go to the auto-generated record list pages; Marketing
// Analytics goes to the dedicated /marketing/analytics page.
export const NavigationDrawerMarketingSection = () => {
  const { t } = useLingui();

  const { toggleNavigationSection } = useNavigationSection('Marketing');
  const isNavigationSectionOpen = useAtomFamilyStateValue(
    isNavigationSectionOpenFamilyState,
    'Marketing',
  );

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
        />
        <NavigationDrawerItem
          label={t`Marketing Campaigns`}
          to="/objects/marketingCampaigns"
          Icon={IconLayoutKanban}
        />
        <NavigationDrawerItem
          label={t`Sequences`}
          to="/objects/sequences"
          Icon={IconSend}
        />
        <NavigationDrawerItem
          label={t`Forms`}
          to="/objects/forms"
          Icon={IconFileText}
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
        />
      </AnimatedExpandableContainer>
    </NavigationDrawerSection>
  );
};
