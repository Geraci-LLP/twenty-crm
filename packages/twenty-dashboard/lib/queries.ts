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

// Twenty's `WidgetConfiguration` is a GraphQL union — we have to spell out
// inline fragments per subtype to read it. We only fragment over the subtypes
// the dashboard knows how to render (charts + iframe + rich text); CRM-only
// widget types (CAMPAIGN_EDITOR, EMAILS, FORM_BUILDER, etc.) fall through and
// the renderer treats them as unsupported.
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
    configuration {
      __typename
      ... on BarChartConfiguration {
        configurationType
        aggregateOperation
        aggregateFieldMetadataId
        primaryAxisGroupByFieldMetadataId
      }
      ... on LineChartConfiguration {
        configurationType
        aggregateOperation
        aggregateFieldMetadataId
        primaryAxisGroupByFieldMetadataId
      }
      ... on PieChartConfiguration {
        configurationType
        aggregateOperation
        aggregateFieldMetadataId
        groupByFieldMetadataId
      }
      ... on GaugeChartConfiguration {
        configurationType
        aggregateOperation
        aggregateFieldMetadataId
      }
      ... on AggregateChartConfiguration {
        configurationType
        aggregateOperation
        aggregateFieldMetadataId
      }
      ... on IframeConfiguration {
        configurationType
        url
      }
      ... on StandaloneRichTextConfiguration {
        configurationType
      }
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

// Dashboard standard-object query — Twenty doesn't expose widgets as a
// nested relation on `dashboard`. Widgets live on pageLayoutTab; the view
// page fetches them separately via getPageLayoutTabs + getPageLayoutWidgets.
export const FIND_DASHBOARD_BY_ID = gql`
  ${DASHBOARD_FRAGMENT}
  query FindDashboardById($id: UUID!) {
    dashboard(filter: { id: { eq: $id } }) {
      ...DashboardFields
    }
  }
`;

// Fetches all widgets attached to a single page layout. Calls the metadata
// API which understands the PageLayout -> Tab -> Widget chain. Note this
// returns ALL tabs' widgets flattened — the dashboard view doesn't currently
// render a tabbed UI, so flattening is fine.
export const FIND_WIDGETS_BY_PAGE_LAYOUT = gql`
  ${PAGE_LAYOUT_WIDGET_FRAGMENT}
  query FindWidgetsByPageLayout($pageLayoutId: String!) {
    getPageLayoutTabs(pageLayoutId: $pageLayoutId) {
      id
      title
      position
    }
  }
`;

// Separate query: widgets for a single tab. We chain in JS rather than try
// to nest these in one GraphQL call, since each metadata query is a
// top-level field with its own argument set.
export const FIND_WIDGETS_BY_TAB = gql`
  ${PAGE_LAYOUT_WIDGET_FRAGMENT}
  query FindWidgetsByTab($pageLayoutTabId: String!) {
    getPageLayoutWidgets(pageLayoutTabId: $pageLayoutTabId) {
      ...PageLayoutWidgetFields
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

// Fetch the workspace's object metadata + their fields. Used to populate the
// widget config panel's dropdowns so the user picks valid UUIDs from a list
// instead of typing them by hand. We deliberately ask for a generous page
// size since most workspaces have <50 standard objects total.
export const FIND_OBJECTS_WITH_FIELDS = gql`
  query FindObjectsWithFields {
    objects(paging: { first: 100 }) {
      edges {
        node {
          id
          nameSingular
          labelSingular
          labelPlural
          isSystem
          isCustom
          fields(paging: { first: 200 }) {
            edges {
              node {
                id
                name
                label
                type
              }
            }
          }
        }
      }
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
