import { gql } from '@apollo/client';

// Minimal fragment — the full server shape is a union on `configuration`.
// The dashboard app stores configuration as opaque JSON and lets each widget
// read the fields it needs. This avoids duplicating the massive union here.
const DASHBOARD_FRAGMENT = gql`
  fragment DashboardFields on Dashboard {
    id
    title
    pageLayoutId
    createdAt
    updatedAt
  }
`;

const PAGE_LAYOUT_WIDGET_FRAGMENT = gql`
  fragment PageLayoutWidgetFields on PageLayoutWidget {
    id
    title
    type
    objectMetadataId
    pageLayoutTabId
    gridPosition {
      column
      columnSpan
      row
      rowSpan
    }
  }
`;

export const FIND_DASHBOARDS = gql`
  ${DASHBOARD_FRAGMENT}
  query FindDashboards {
    dashboards {
      edges {
        node {
          ...DashboardFields
        }
      }
    }
  }
`;

export const FIND_DASHBOARD_BY_ID = gql`
  ${DASHBOARD_FRAGMENT}
  ${PAGE_LAYOUT_WIDGET_FRAGMENT}
  query FindDashboardById($id: UUID!) {
    dashboard(filter: { id: { eq: $id } }) {
      ...DashboardFields
      pageLayoutWidgets {
        edges {
          node {
            ...PageLayoutWidgetFields
          }
        }
      }
    }
  }
`;

export const CREATE_DASHBOARD = gql`
  ${DASHBOARD_FRAGMENT}
  mutation CreateDashboard($data: DashboardCreateInput!) {
    createDashboard(data: $data) {
      ...DashboardFields
    }
  }
`;

export const UPDATE_DASHBOARD = gql`
  ${DASHBOARD_FRAGMENT}
  mutation UpdateDashboard($id: UUID!, $data: DashboardUpdateInput!) {
    updateDashboard(id: $id, data: $data) {
      ...DashboardFields
    }
  }
`;

// PageLayoutWidget mutations live on the /metadata endpoint and use the
// metadata-service input convention (input: CreateXInput!), not the
// standard-object convention (data: XCreateInput!).
export const CREATE_PAGE_LAYOUT_WIDGET = gql`
  ${PAGE_LAYOUT_WIDGET_FRAGMENT}
  mutation CreatePageLayoutWidget($input: CreatePageLayoutWidgetInput!) {
    createPageLayoutWidget(input: $input) {
      ...PageLayoutWidgetFields
    }
  }
`;

export const UPDATE_PAGE_LAYOUT_WIDGET = gql`
  ${PAGE_LAYOUT_WIDGET_FRAGMENT}
  mutation UpdatePageLayoutWidget(
    $id: String!
    $input: UpdatePageLayoutWidgetInput!
  ) {
    updatePageLayoutWidget(id: $id, input: $input) {
      ...PageLayoutWidgetFields
    }
  }
`;

// Note: deletePageLayoutWidget mutation is not exposed by the CRM. Removing
// widgets in the builder UI clears them from local state only; persisting the
// removal will need a server-side mutation we don't yet have.

// Page-layout tab queries/mutations — widgets must attach to a tab. The CRM
// data model is Dashboard -> PageLayout -> PageLayoutTab -> PageLayoutWidget,
// and the tab id is a required field on widget create.
export const GET_PAGE_LAYOUT_TABS = gql`
  query GetPageLayoutTabs($pageLayoutId: String!) {
    getPageLayoutTabs(pageLayoutId: $pageLayoutId) {
      id
      title
      position
      pageLayoutId
    }
  }
`;

export const CREATE_PAGE_LAYOUT_TAB = gql`
  mutation CreatePageLayoutTab($input: CreatePageLayoutTabInput!) {
    createPageLayoutTab(input: $input) {
      id
      title
      position
      pageLayoutId
    }
  }
`;

// Generic aggregation query — the backend exposes `groupBy<Object>` under
// each object metadata. The field name varies, so this query is a template
// that callers should customize per object. Use `gql` inline at the call site
// for object-specific queries when needed.
export const GROUP_BY_TEMPLATE = `
  query GroupBy${'$'}ObjectName(
    ${'$'}groupBy: [FieldsGroupByInput!]!
    ${'$'}aggregate: [AggregateInput!]!
    ${'$'}filter: FilterInput
  ) {
    groupByTemplate(groupBy: ${'$'}groupBy, aggregate: ${'$'}aggregate, filter: ${'$'}filter) {
      groupByDimensions
      aggregateValues
    }
  }
`;
