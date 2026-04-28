import { DEFAULT_SEQUENCE_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultSequenceRecordPageLayoutId';
import { type PageLayout } from '@/page-layout/types/PageLayout';
import {
  PageLayoutTabLayoutMode,
  PageLayoutType,
  WidgetConfigurationType,
  WidgetType,
} from '~/generated-metadata/graphql';

// Default record-page layout for Sequence records. Tabs:
//   - Cadence: hosts SequenceCadenceWidget (custom step editor from PR 32)
//   - Details: auto-generated FIELDS list
//   - Timeline: standard activity timeline
//
// WidgetType.SEQUENCE_CADENCE was added to the server enum in PR 32 but
// the generated frontend enum lags codegen, so the value is cast inline
// from a string literal below until the enum is regenerated. This matches
// the fallback pattern in WidgetContentRenderer.
export const DEFAULT_SEQUENCE_RECORD_PAGE_LAYOUT: PageLayout = {
  __typename: 'PageLayout',
  id: DEFAULT_SEQUENCE_RECORD_PAGE_LAYOUT_ID,
  name: 'Default Sequence Layout',
  type: PageLayoutType.RECORD_PAGE,
  objectMetadataId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  tabs: [
    {
      __typename: 'PageLayoutTab',
      applicationId: '',
      id: 'sequence-tab-cadence',
      title: 'Cadence',
      icon: 'IconRoute',
      position: 100,
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      pageLayoutId: DEFAULT_SEQUENCE_RECORD_PAGE_LAYOUT_ID,
      isOverridden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      widgets: [
        {
          __typename: 'PageLayoutWidget',
          id: 'sequence-widget-cadence',
          pageLayoutTabId: 'sequence-tab-cadence',
          title: 'Cadence',
          type: 'SEQUENCE_CADENCE' as WidgetType,
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
      id: 'sequence-tab-fields',
      title: 'Details',
      icon: 'IconList',
      position: 200,
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      pageLayoutId: DEFAULT_SEQUENCE_RECORD_PAGE_LAYOUT_ID,
      isOverridden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      widgets: [
        {
          __typename: 'PageLayoutWidget',
          id: 'sequence-widget-fields',
          pageLayoutTabId: 'sequence-tab-fields',
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
      id: 'sequence-tab-timeline',
      title: 'Timeline',
      icon: 'IconTimelineEvent',
      position: 300,
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      pageLayoutId: DEFAULT_SEQUENCE_RECORD_PAGE_LAYOUT_ID,
      isOverridden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      widgets: [
        {
          __typename: 'PageLayoutWidget',
          id: 'sequence-widget-timeline',
          pageLayoutTabId: 'sequence-tab-timeline',
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
