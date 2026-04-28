import { AppPath } from 'twenty-shared/types';

export const UNTESTED_APP_PATHS = [
  AppPath.Settings,
  AppPath.Developers,
  AppPath.PublicForm,
  AppPath.PublicLandingPage,
  AppPath.PublicBooking,
  AppPath.PublicDocument,
  // Public/portal/handoff routes added by the Geraci fork — these bypass
  // the normal page-change navigate effect (they have their own auth flows
  // or are unauthenticated viewers).
  AppPath.PublicQuote,
  AppPath.Portal,
  AppPath.PortalLogin,
  AppPath.PortalVerify,
  AppPath.PortalQuotes,
  AppPath.PortalQuoteDetail,
  AppPath.PortalDocuments,
  AppPath.DashboardRedirect,
  AppPath.MarketingAnalytics,
];
