export enum AppPath {
  // Not logged-in
  Verify = '/verify',
  VerifyEmail = '/verify-email',
  SignInUp = '/welcome',
  Invite = '/invite/:workspaceInviteHash',
  ResetPassword = '/reset-password/:passwordResetToken',

  // Onboarding
  CreateWorkspace = '/create/workspace',
  CreateProfile = '/create/profile',
  SyncEmails = '/sync/emails',
  InviteTeam = '/invite-team',
  PlanRequired = '/plan-required',
  PlanRequiredSuccess = '/plan-required/payment-success',
  BookCallDecision = '/book-call-decision',
  BookCall = '/book-call',

  // Onboarded
  Index = '/',
  TasksPage = '/objects/tasks',
  OpportunitiesPage = '/objects/opportunities',

  RecordIndexPage = '/objects/:objectNamePlural',
  RecordShowPage = '/object/:objectNameSingular/:objectRecordId',

  Settings = `settings`,
  SettingsCatchAll = `/${Settings}/*`,
  Developers = `developers`,
  DevelopersCatchAll = `/${Developers}/*`,

  Authorize = '/authorize',

  // Public pages (no auth required)
  PublicForm = '/forms/:workspaceId/:formId',
  PublicLandingPage = '/lp/:workspaceId/:slug',
  PublicBooking = '/book/:workspaceId/:meetingTypeId',
  PublicDocument = '/docs/:workspaceId/:slug',
  PublicQuote = '/q/:workspaceId/:slug',

  // Client portal (separate auth)
  Portal = '/portal',
  PortalLogin = '/portal/login',
  PortalVerify = '/portal/verify',
  PortalQuotes = '/portal/quotes',
  PortalQuoteDetail = '/portal/quotes/:id',
  PortalDocuments = '/portal/documents',

  // Dashboard redirect
  DashboardRedirect = '/dashboard-redirect',

  // 404 page not found
  NotFoundWildcard = '*',
  NotFound = '/not-found',
}
