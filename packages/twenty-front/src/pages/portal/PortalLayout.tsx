import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import { PortalApolloProvider } from '@/portal/components/PortalApolloProvider';
import { usePortalAuth } from '@/portal/hooks/usePortalAuth';

const StyledShell = styled.div`
  background: ${themeCssVariables.background.noisy};
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`;

const StyledHeader = styled.header`
  align-items: center;
  background: ${themeCssVariables.background.primary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  height: 56px;
  justify-content: space-between;
  padding: 0 ${themeCssVariables.spacing[6]};
`;

const StyledBrand = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledHeaderRight = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledUserEmail = styled.span`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledLogoutButton = styled.button`
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[3]};
  transition: background 150ms ease;

  &:hover {
    background: ${themeCssVariables.background.tertiary};
  }
`;

const StyledBody = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

const StyledSideNav = styled.nav`
  background: ${themeCssVariables.background.primary};
  border-right: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
  padding: ${themeCssVariables.spacing[4]};
  width: 220px;
`;

const navLinkClassName = css`
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  text-decoration: none;
  transition:
    background 150ms ease,
    color 150ms ease;

  &:hover {
    background: ${themeCssVariables.background.secondary};
    color: ${themeCssVariables.font.color.primary};
  }

  &.active {
    background: ${themeCssVariables.background.tertiary};
    color: ${themeCssVariables.font.color.primary};
    font-weight: ${themeCssVariables.font.weight.medium};
  }
`;

const StyledMain = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: ${themeCssVariables.spacing[6]};
`;

const StyledLoadingMessage = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[8]};
  text-align: center;
`;

// Inner component that has access to the portal Apollo client via provider
const PortalLayoutInner = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = usePortalAuth();

  // Redirect unauthenticated users to the login page.
  // We only redirect after loading completes to avoid a flash on first paint.
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(AppPath.PortalLogin);
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <StyledShell>
        <StyledLoadingMessage>Loading portal...</StyledLoadingMessage>
      </StyledShell>
    );
  }

  if (!isAuthenticated) {
    // Render nothing while redirect effect runs
    return null;
  }

  const displayEmail = isDefined(user) ? user.email : '';

  return (
    <StyledShell>
      <StyledHeader>
        <StyledBrand>Geraci LLP Client Portal</StyledBrand>
        <StyledHeaderRight>
          {displayEmail.length > 0 && (
            <StyledUserEmail>{displayEmail}</StyledUserEmail>
          )}
          <StyledLogoutButton onClick={logout}>Log out</StyledLogoutButton>
        </StyledHeaderRight>
      </StyledHeader>

      <StyledBody>
        <StyledSideNav>
          <NavLink to={AppPath.Portal} end className={navLinkClassName}>
            Dashboard
          </NavLink>
          <NavLink to={AppPath.PortalQuotes} className={navLinkClassName}>
            Quotes
          </NavLink>
          <NavLink to={AppPath.PortalDocuments} className={navLinkClassName}>
            Documents
          </NavLink>
          <NavLink
            to={`${AppPath.Portal}/profile`}
            className={navLinkClassName}
          >
            Profile
          </NavLink>
        </StyledSideNav>

        <StyledMain>
          <Outlet />
        </StyledMain>
      </StyledBody>
    </StyledShell>
  );
};

export const PortalLayout = () => {
  return (
    <PortalApolloProvider>
      <PortalLayoutInner />
    </PortalApolloProvider>
  );
};
