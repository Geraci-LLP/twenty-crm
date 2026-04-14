import { DEFAULT_CAMPAIGN_TEMPLATE_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultCampaignTemplateRecordPageLayoutId';
import { type PageLayout } from '@/page-layout/types/PageLayout';
import {
  PageLayoutTabLayoutMode,
  PageLayoutType,
  WidgetConfigurationType,
  WidgetType,
} from '~/generated-metadata/graphql';

export const DEFAULT_CAMPAIGN_TEMPLATE_RECORD_PAGE_LAYOUT: PageLayout = {
  __typename: 'PageLayout',
  id: DEFAULT_CAMPAIGN_TEMPLATE_RECORD_PAGE_LAYOUT_ID,
  name: 'Default Campaign Template Layout',
  type: PageLayoutType.RECORD_PAGE,
  objectMetadataId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  tabs: [
    {
      __typename: 'PageLayoutTab',
      applicationId: '',
      id: 'campaign-template-tab-fields',
      title: 'Home',
      icon: 'IconHome',
      position: 100,
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      pageLayoutId: DEFAULT_CAMPAIGN_TEMPLATE_RECORD_PAGE_LAYOUT_ID,
      isOverridden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      widgets: [
        {
          __typename: 'PageLayoutWidget',
          id: 'campaign-template-widget-fields',
          pageLayoutTabId: 'campaign-template-tab-fields',
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
  ],
};
