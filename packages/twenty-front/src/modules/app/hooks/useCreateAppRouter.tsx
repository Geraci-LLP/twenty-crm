import { AppRouterProviders } from '@/app/components/AppRouterProviders';
import { LazyRoute } from '@/app/components/LazyRoute';
import { SettingsRoutes } from '@/app/components/SettingsRoutes';
import { VerifyLoginTokenEffect } from '@/auth/components/VerifyLoginTokenEffect';

import { VerifyEmailEffect } from '@/auth/components/VerifyEmailEffect';
import indexAppPath from '@/navigation/utils/indexAppPath';
import { BlankLayout } from '@/ui/layout/page/components/BlankLayout';
import { DefaultLayout } from '@/ui/layout/page/components/DefaultLayout';
import { AppPath } from 'twenty-shared/types';

import { lazy } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

const RecordIndexPage = lazy(() =>
  import('~/pages/object-record/RecordIndexPage').then((module) => ({
    default: module.RecordIndexPage,
  })),
);

const RecordShowPage = lazy(() =>
  import('~/pages/object-record/RecordShowPage').then((module) => ({
    default: module.RecordShowPage,
  })),
);

const SignInUp = lazy(() =>
  import('~/pages/auth/SignInUp').then((module) => ({
    default: module.SignInUp,
  })),
);

const PasswordReset = lazy(() =>
  import('~/pages/auth/PasswordReset').then((module) => ({
    default: module.PasswordReset,
  })),
);

const Authorize = lazy(() =>
  import('~/pages/auth/Authorize').then((module) => ({
    default: module.Authorize,
  })),
);

const CreateWorkspace = lazy(() =>
  import('~/pages/onboarding/CreateWorkspace').then((module) => ({
    default: module.CreateWorkspace,
  })),
);

const CreateProfile = lazy(() =>
  import('~/pages/onboarding/CreateProfile').then((module) => ({
    default: module.CreateProfile,
  })),
);

const SyncEmails = lazy(() =>
  import('~/pages/onboarding/SyncEmails').then((module) => ({
    default: module.SyncEmails,
  })),
);

const InviteTeam = lazy(() =>
  import('~/pages/onboarding/InviteTeam').then((module) => ({
    default: module.InviteTeam,
  })),
);

const ChooseYourPlan = lazy(() =>
  import('~/pages/onboarding/ChooseYourPlan').then((module) => ({
    default: module.ChooseYourPlan,
  })),
);

const PaymentSuccess = lazy(() =>
  import('~/pages/onboarding/PaymentSuccess').then((module) => ({
    default: module.PaymentSuccess,
  })),
);

const BookCallDecision = lazy(() =>
  import('~/pages/onboarding/BookCallDecision').then((module) => ({
    default: module.BookCallDecision,
  })),
);

const BookCall = lazy(() =>
  import('~/pages/onboarding/BookCall').then((module) => ({
    default: module.BookCall,
  })),
);

const NotFound = lazy(() =>
  import('~/pages/not-found/NotFound').then((module) => ({
    default: module.NotFound,
  })),
);

const PublicFormPage = lazy(() =>
  import('~/pages/public-form/PublicFormPage').then((module) => ({
    default: module.PublicFormPage,
  })),
);

const PublicLandingPage = lazy(() =>
  import('~/pages/public-landing-page/PublicLandingPage').then((module) => ({
    default: module.PublicLandingPage,
  })),
);

const PublicBookingPage = lazy(() =>
  import('~/pages/public-booking/PublicBookingPage').then((module) => ({
    default: module.PublicBookingPage,
  })),
);

const PublicDocumentPage = lazy(() =>
  import('~/pages/public-document/PublicDocumentPage').then((module) => ({
    default: module.PublicDocumentPage,
  })),
);

const PublicQuotePage = lazy(() =>
  import('~/pages/public-quote/PublicQuotePage').then((module) => ({
    default: module.PublicQuotePage,
  })),
);

const PortalLayout = lazy(() =>
  import('~/pages/portal/PortalLayout').then((module) => ({
    default: module.PortalLayout,
  })),
);

const DashboardRedirectPage = lazy(() =>
  import('~/pages/dashboard-redirect/DashboardRedirectPage').then((module) => ({
    default: module.DashboardRedirectPage,
  })),
);

const PortalLoginPage = lazy(() =>
  import('~/pages/portal/PortalLoginPage').then((module) => ({
    default: module.PortalLoginPage,
  })),
);

const PortalVerifyPage = lazy(() =>
  import('~/pages/portal/PortalVerifyPage').then((module) => ({
    default: module.PortalVerifyPage,
  })),
);

const PortalDashboard = lazy(() =>
  import('~/pages/portal/PortalDashboard').then((module) => ({
    default: module.PortalDashboard,
  })),
);

const PortalQuotes = lazy(() =>
  import('~/pages/portal/PortalQuotes').then((module) => ({
    default: module.PortalQuotes,
  })),
);

const PortalQuoteDetail = lazy(() =>
  import('~/pages/portal/PortalQuoteDetail').then((module) => ({
    default: module.PortalQuoteDetail,
  })),
);

const PortalDocuments = lazy(() =>
  import('~/pages/portal/PortalDocuments').then((module) => ({
    default: module.PortalDocuments,
  })),
);

export const useCreateAppRouter = (
  isFunctionSettingsEnabled?: boolean,
  isAdminPageEnabled?: boolean,
) =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route
        element={<AppRouterProviders />}
        // To switch state to `loading` temporarily to enable us
        // to set scroll position before the page is rendered
        loader={async () => Promise.resolve(null)}
      >
        <Route element={<DefaultLayout />}>
          <Route path={AppPath.Verify} element={<VerifyLoginTokenEffect />} />
          <Route path={AppPath.VerifyEmail} element={<VerifyEmailEffect />} />
          <Route
            path={AppPath.SignInUp}
            element={
              <LazyRoute>
                <SignInUp />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.Invite}
            element={
              <LazyRoute>
                <SignInUp />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.ResetPassword}
            element={
              <LazyRoute>
                <PasswordReset />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.CreateWorkspace}
            element={
              <LazyRoute>
                <CreateWorkspace />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.CreateProfile}
            element={
              <LazyRoute>
                <CreateProfile />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.SyncEmails}
            element={
              <LazyRoute>
                <SyncEmails />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.InviteTeam}
            element={
              <LazyRoute>
                <InviteTeam />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.PlanRequired}
            element={
              <LazyRoute>
                <ChooseYourPlan />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.PlanRequiredSuccess}
            element={
              <LazyRoute>
                <PaymentSuccess />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.BookCallDecision}
            element={
              <LazyRoute>
                <BookCallDecision />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.BookCall}
            element={
              <LazyRoute>
                <BookCall />
              </LazyRoute>
            }
          />
          <Route path={indexAppPath.getIndexAppPath()} element={<></>} />
          <Route
            path={AppPath.RecordIndexPage}
            element={
              <LazyRoute>
                <RecordIndexPage />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.RecordShowPage}
            element={
              <LazyRoute>
                <RecordShowPage />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.SettingsCatchAll}
            element={
              <SettingsRoutes
                isFunctionSettingsEnabled={isFunctionSettingsEnabled}
                isAdminPageEnabled={isAdminPageEnabled}
              />
            }
          />
          <Route
            path={AppPath.NotFoundWildcard}
            element={
              <LazyRoute>
                <NotFound />
              </LazyRoute>
            }
          />
        </Route>
        <Route element={<BlankLayout />}>
          <Route
            path={AppPath.Authorize}
            element={
              <LazyRoute>
                <Authorize />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.PublicForm}
            element={
              <LazyRoute>
                <PublicFormPage />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.PublicLandingPage}
            element={
              <LazyRoute>
                <PublicLandingPage />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.PublicBooking}
            element={
              <LazyRoute>
                <PublicBookingPage />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.PublicDocument}
            element={
              <LazyRoute>
                <PublicDocumentPage />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.PublicQuote}
            element={
              <LazyRoute>
                <PublicQuotePage />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.PortalLogin}
            element={
              <LazyRoute>
                <PortalLoginPage />
              </LazyRoute>
            }
          />
          <Route
            path={AppPath.PortalVerify}
            element={
              <LazyRoute>
                <PortalVerifyPage />
              </LazyRoute>
            }
          />
          <Route
            element={
              <LazyRoute>
                <PortalLayout />
              </LazyRoute>
            }
          >
            <Route
              path={AppPath.Portal}
              element={
                <LazyRoute>
                  <PortalDashboard />
                </LazyRoute>
              }
            />
            <Route
              path={AppPath.PortalQuotes}
              element={
                <LazyRoute>
                  <PortalQuotes />
                </LazyRoute>
              }
            />
            <Route
              path={AppPath.PortalQuoteDetail}
              element={
                <LazyRoute>
                  <PortalQuoteDetail />
                </LazyRoute>
              }
            />
            <Route
              path={AppPath.PortalDocuments}
              element={
                <LazyRoute>
                  <PortalDocuments />
                </LazyRoute>
              }
            />
          </Route>
          <Route
            path={AppPath.DashboardRedirect}
            element={
              <LazyRoute>
                <DashboardRedirectPage />
              </LazyRoute>
            }
          />
        </Route>
      </Route>,
    ),
  );
