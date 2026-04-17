import { STANDARD_OBJECTS } from 'twenty-shared/metadata';

import { NavigationMenuItemType } from 'src/engine/metadata-modules/navigation-menu-item/enums/navigation-menu-item-type.enum';

export const STANDARD_NAVIGATION_MENU_ITEMS = {
  allCompanies: {
    universalIdentifier: '20202020-b001-4b01-8b01-c0aba11c0001',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.company.views.allCompanies.universalIdentifier,
    position: 0,
  },
  allPeople: {
    universalIdentifier: '20202020-b005-4b05-8b05-c0aba11c0005',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.person.views.allPeople.universalIdentifier,
    position: 1,
  },
  allOpportunities: {
    universalIdentifier: '20202020-b004-4b04-8b04-c0aba11c0004',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.opportunity.views.allOpportunities.universalIdentifier,
    position: 2,
  },
  allTasks: {
    universalIdentifier: '20202020-b006-4b06-8b06-c0aba11c0006',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.task.views.allTasks.universalIdentifier,
    position: 3,
  },
  allNotes: {
    universalIdentifier: '20202020-b003-4b03-8b03-c0aba11c0003',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.note.views.allNotes.universalIdentifier,
    position: 4,
  },
  allDashboards: {
    universalIdentifier: '20202020-b002-4b02-8b02-c0aba11c0002',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.dashboard.views.allDashboards.universalIdentifier,
    position: 5,
  },
  allCampaigns: {
    universalIdentifier: 'e3cf0001-b010-4b10-8b10-c0aba11c0010',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.campaign.views.allCampaigns.universalIdentifier,
    position: 6,
  },
  allForms: {
    universalIdentifier: '2e99e0cd-01e3-4211-a73f-7868ea92019c',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.form.views.allForms.universalIdentifier,
    position: 7,
  },
  allLandingPages: {
    universalIdentifier: 'b574f32d-a8c4-4c0a-ad3d-086e2e1dc15e',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.landingPage.views.allLandingPages.universalIdentifier,
    position: 8,
  },
  allDocuments: {
    universalIdentifier: '7f3d8b3a-212b-467a-be4c-037828c47c98',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.trackedDocument.views.allDocuments.universalIdentifier,
    position: 9,
  },
  allMeetingTypes: {
    universalIdentifier: 'a1b2c301-b010-4b10-8b10-c0aba11c0011',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.meetingType.views.allMeetingTypes.universalIdentifier,
    position: 10,
  },
  allChatWidgets: {
    universalIdentifier: 'b2c3d402-b010-4b10-8b10-c0aba11c0012',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.chatWidget.views.allChatWidgets.universalIdentifier,
    position: 11,
  },
  allSequences: {
    universalIdentifier: 'c3d4e503-b010-4b10-8b10-c0aba11c0013',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.sequence.views.allSequences.universalIdentifier,
    position: 12,
  },
  allQuotes: {
    universalIdentifier: 'd4e5f604-b010-4b10-8b10-c0aba11c0014',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.quote.views.allQuotes.universalIdentifier,
    position: 13,
  },
  workflowsFolder: {
    universalIdentifier: '20202020-b007-4b07-8b07-c0aba11c0007',
    type: NavigationMenuItemType.FOLDER,
    name: 'Workflows',
    icon: 'IconSettingsAutomation',
    position: 14,
  },
  workflowsFolderAllWorkflows: {
    universalIdentifier: '20202020-b008-4b08-8b08-c0aba11c0008',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.workflow.views.allWorkflows.universalIdentifier,
    folderUniversalIdentifier: '20202020-b007-4b07-8b07-c0aba11c0007',
    position: 0,
  },
  workflowsFolderAllWorkflowRuns: {
    universalIdentifier: '20202020-b009-4b09-8b09-c0aba11c0009',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.workflowRun.views.allWorkflowRuns.universalIdentifier,
    folderUniversalIdentifier: '20202020-b007-4b07-8b07-c0aba11c0007',
    position: 1,
  },
  workflowsFolderAllWorkflowVersions: {
    universalIdentifier: '20202020-b00a-4b0a-8b0a-c0aba11c000a',
    type: NavigationMenuItemType.OBJECT,
    viewUniversalIdentifier:
      STANDARD_OBJECTS.workflowVersion.views.allWorkflowVersions
        .universalIdentifier,
    folderUniversalIdentifier: '20202020-b007-4b07-8b07-c0aba11c0007',
    position: 2,
  },
} as const;

export const STANDARD_NAVIGATION_MENU_ITEM_DEFAULT_COLORS: Partial<
  Record<keyof typeof STANDARD_NAVIGATION_MENU_ITEMS, string>
> = {
  allCampaigns: 'green',
  allForms: 'purple',
  allLandingPages: 'sky',
  allDocuments: 'orange',
  allMeetingTypes: 'red',
  allChatWidgets: 'yellow',
  allSequences: 'turquoise',
  allQuotes: 'green',
  allCompanies: 'blue',
  allPeople: 'blue',
  allTasks: 'turquoise',
  allNotes: 'turquoise',
  allOpportunities: 'red',
  workflowsFolder: 'orange',
  allDashboards: 'gray',
  workflowsFolderAllWorkflows: 'gray',
  workflowsFolderAllWorkflowRuns: 'gray',
  workflowsFolderAllWorkflowVersions: 'gray',
};
