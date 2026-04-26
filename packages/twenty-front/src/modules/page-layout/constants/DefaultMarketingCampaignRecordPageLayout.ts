import { DEFAULT_MARKETING_CAMPAIGN_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultMarketingCampaignRecordPageLayoutId';
import { type PageLayout } from '@/page-layout/types/PageLayout';
import {
  PageLayoutTabLayoutMode,
  PageLayoutType,
  WidgetConfigurationType,
  WidgetType,
} from '~/generated-metadata/graphql';

// Default record-page layout for MarketingCampaign records. Tabs:
//   - Stats: hosts MarketingCampaignStatsWidget (rolled-up Email metrics from PR 33)
//   - Details: auto-generated FIELDS list
//   - Timeline: standard activity timeline
//
// WidgetType.MARKETING_CAMPAIGN_STATS was added to the server enum in
// PR 33 but the generated frontend enum lags codegen, so the value is
// cast inline from a string literal below until the enum is regenerated.
export const DEFAULT_MARKETING_CAMPAIGN_RECORD_PAGE_LAYOUT: PageLayout = {
  __typename: 'PageLayout',
  id: DEFAULT_MARKETING_CAMPAIGN_RECORD_PAGE_LAYOUT_ID,
  name: 'Default Marketing Campaign Layout',
  type: PageLayoutType.RECORD_PAGE,
  objectMetadataId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  tabs: [
    {
      __typename: 'PageLayoutTab',
      applicationId: '',
      id: 'marketing-campaign-tab-stats',
      title: 'Stats',
      icon: 'IconChartBar',
      position: 100,
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      pageLayoutId: DEFAULT_MARKETING_CAMPAIGN_RECORD_PAGE_LAYOUT_ID,
      isOverridden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      widgets: [
        {
          __typename: 'PageLayoutWidget',
          id: 'marketing-campaign-widget-stats',
          pageLayoutTabId: 'marketing-campaign-tab-stats',
          title: 'Performance',
          type: 'MARKETING_CAMPAIGN_STATS' as WidgetType,
          objectMetadataId: null,
          gridPosition: {
            __typename: 'GridPosition',
            row: 0,
            column: 0,
            rowSpan: 12,
            columnSpan: 12,
          },
          configuration: {
            __typename: 'FieldsConfiguration',
            configurationType: WidgetConfigurationType.FIELDS,
            viewId: null,
          },
          isOverridden: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
        },
      ],
    },
    {
      __typename: 'PageLayoutTab',
      applicationId: '',
      id: 'marketing-campaign-tab-fields',
      title: 'Details',
      icon: 'IconList',
      position: 200,
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      pageLayoutId: DEFAULT_MARKETING_CAMPAIGN_RECORD_PAGE_LAYOUT_ID,
      isOverridden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      widgets: [
        {
          __typename: 'PageLayoutWidget',
          id: 'marketing-campaign-widget-fields',
          pageLayoutTabId: 'marketing-campaign-tab-fields',
          title: 'Fields',
          type: WidgetType.FIELDS,
          objectMetadataId: null,
          gridPosition: {
            __typename: 'GridPosition',
            row: 0,
            column: 0,
            rowSpan: 12,
            columnSpan: 12,
          },
          configuration: {
            __typename: 'FieldsConfiguration',
            configurationType: WidgetConfigurationType.FIELDS,
            viewId: null,
          },
          isOverridden: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
        },
      ],
    },
    {
      __typename: 'PageLayoutTab',
      applicationId: '',
      id: 'marketing-campaign-tab-timeline',
      title: 'Timeline',
      icon: 'IconTimelineEvent',
      position: 300,
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      pageLayoutId: DEFAULT_MARKETING_CAMPAIGN_RECORD_PAGE_LAYOUT_ID,
      isOverridden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      widgets: [
        {
          __typename: 'PageLayoutWidget',
          id: 'marketing-campaign-widget-timeline',
          pageLayoutTabId: 'marketing-campaign-tab-timeline',
          title: 'Timeline',
          type: WidgetType.TIMELINE,
          objectMetadataId: null,
          gridPosition: {
            __typename: 'GridPosition',
            row: 0,
            column: 0,
            rowSpan: 6,
            columnSpan: 12,
          },
          configuration: {
            __typename: 'FieldsConfiguration',
            configurationType: WidgetConfigurationType.FIELDS,
            viewId: null,
          },
          isOverridden: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
        },
      ],
    },
  ],
};
