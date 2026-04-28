import { useLingui } from '@lingui/react/macro';
import { AppPath, SettingsPath } from 'twenty-shared/types';
import {
  IconHelpCircle,
  IconLayoutDashboard,
  IconSettings,
  IconUsers,
} from 'twenty-ui/display';
import { AnimatedExpandableContainer } from 'twenty-ui/layout';

import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { getDocumentationUrl } from '@/support/utils/getDocumentationUrl';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { REACT_APP_DASHBOARD_URL } from '~/config';

import { NavigationDrawerAnimatedCollapseWrapper } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerAnimatedCollapseWrapper';
import { NavigationDrawerItem } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerItem';
import { NavigationDrawerSection } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSection';
import { NavigationDrawerSectionTitle } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSectionTitle';
import { useNavigationSection } from '@/ui/navigation/navigation-drawer/hooks/useNavigationSection';
import { isNavigationSectionOpenFamilyState } from '@/ui/navigation/navigation-drawer/states/isNavigationSectionOpenFamilyState';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

export const NavigationDrawerOtherSection = () => {
  const { t } = useLingui();
  const navigateSettings = useNavigateSettings();
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);

  const { toggleNavigationSection } = useNavigationSection('Other');
  const isNavigationSectionOpen = useAtomFamilyStateValue(
    isNavigationSectionOpenFamilyState,
    'Other',
  );

  const handleSettingsClick = () => {
    navigateSettings(SettingsPath.ProfilePage);
  };

  const handleClientPortalClick = () => {
    window.open(AppPath.PortalLogin, '_blank', 'noopener,noreferrer');
  };

  // Resolve the external dashboard URL from env, then navigate to the
  // dashboard-redirect page with it as a returnTo. That page mints an
  // audience-scoped JWT and forwards the user to the dashboard app.
  const handleDashboardClick = () => {
    if (!REACT_APP_DASHBOARD_URL) {
      // eslint-disable-next-line no-alert
      alert(
        'Dashboard URL is not configured. Set REACT_APP_DASHBOARD_URL in the frontend environment.',
      );
      return;
    }

    window.location.href = `${AppPath.DashboardRedirect}?returnTo=${encodeURIComponent(REACT_APP_DASHBOARD_URL)}`;
  };

  return (
    <NavigationDrawerSection>
      <NavigationDrawerAnimatedCollapseWrapper>
        <NavigationDrawerSectionTitle
          label={t`Other`}
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
          label={t`Dashboard`}
          Icon={IconLayoutDashboard}
          onClick={handleDashboardClick}
        />
        <NavigationDrawerItem
          label={t`Client Portal`}
          Icon={IconUsers}
          onClick={handleClientPortalClick}
        />
        <NavigationDrawerItem
          label={t`Settings`}
          Icon={IconSettings}
          onClick={handleSettingsClick}
        />
        <NavigationDrawerItem
          label={t`Documentation`}
          to={getDocumentationUrl({
            locale: currentWorkspaceMember?.locale,
          })}
          Icon={IconHelpCircle}
        />
      </AnimatedExpandableContainer>
    </NavigationDrawerSection>
  );
};
