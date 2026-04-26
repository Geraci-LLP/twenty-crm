import { CoreObjectNameSingular } from 'twenty-shared/types';
import { DEFAULT_CAMPAIGN_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultCampaignRecordPageLayoutId';
import { DEFAULT_FORM_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultFormRecordPageLayoutId';
import { DEFAULT_LANDING_PAGE_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultLandingPageRecordPageLayoutId';
import { DEFAULT_MARKETING_CAMPAIGN_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultMarketingCampaignRecordPageLayoutId';
import { DEFAULT_SEQUENCE_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultSequenceRecordPageLayoutId';
import { DEFAULT_CAMPAIGN_TEMPLATE_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultCampaignTemplateRecordPageLayoutId';
import { DEFAULT_COMPANY_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultCompanyRecordPageLayoutId';
import { DEFAULT_MESSAGE_THREAD_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultMessageThreadRecordPageLayoutId';
import { DEFAULT_NOTE_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultNoteRecordPageLayoutId';
import { DEFAULT_OPPORTUNITY_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultOpportunityRecordPageLayoutId';
import { DEFAULT_PERSON_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultPersonRecordPageLayoutId';
import { DEFAULT_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultRecordPageLayoutId';
import { DEFAULT_TASK_RECORD_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultTaskRecordPageLayoutId';
import { DEFAULT_WORKFLOW_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultWorkflowPageLayoutId';
import { DEFAULT_WORKFLOW_RUN_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultWorkflowRunPageLayoutId';
import { DEFAULT_WORKFLOW_VERSION_PAGE_LAYOUT_ID } from '@/page-layout/constants/DefaultWorkflowVersionPageLayoutId';

const OBJECT_NAME_TO_DEFAULT_LAYOUT_ID: Record<string, string> = {
  [CoreObjectNameSingular.Campaign]: DEFAULT_CAMPAIGN_RECORD_PAGE_LAYOUT_ID,
  [CoreObjectNameSingular.CampaignTemplate]:
    DEFAULT_CAMPAIGN_TEMPLATE_RECORD_PAGE_LAYOUT_ID,
  [CoreObjectNameSingular.Company]: DEFAULT_COMPANY_RECORD_PAGE_LAYOUT_ID,
  [CoreObjectNameSingular.Form]: DEFAULT_FORM_RECORD_PAGE_LAYOUT_ID,
  [CoreObjectNameSingular.LandingPage]:
    DEFAULT_LANDING_PAGE_RECORD_PAGE_LAYOUT_ID,
  [CoreObjectNameSingular.Person]: DEFAULT_PERSON_RECORD_PAGE_LAYOUT_ID,
  [CoreObjectNameSingular.Opportunity]:
    DEFAULT_OPPORTUNITY_RECORD_PAGE_LAYOUT_ID,
  [CoreObjectNameSingular.Note]: DEFAULT_NOTE_RECORD_PAGE_LAYOUT_ID,
  [CoreObjectNameSingular.Task]: DEFAULT_TASK_RECORD_PAGE_LAYOUT_ID,
  [CoreObjectNameSingular.Workflow]: DEFAULT_WORKFLOW_PAGE_LAYOUT_ID,
  [CoreObjectNameSingular.WorkflowVersion]:
    DEFAULT_WORKFLOW_VERSION_PAGE_LAYOUT_ID,
  [CoreObjectNameSingular.WorkflowRun]: DEFAULT_WORKFLOW_RUN_PAGE_LAYOUT_ID,
  [CoreObjectNameSingular.MessageThread]:
    DEFAULT_MESSAGE_THREAD_RECORD_PAGE_LAYOUT_ID,
  // Sequence + MarketingCampaign objects were added via metadata-API in
  // earlier marketing work and aren't in CoreObjectNameSingular yet, so
  // use string literals matching their objectNameSingular values.
  sequence: DEFAULT_SEQUENCE_RECORD_PAGE_LAYOUT_ID,
  marketingCampaign: DEFAULT_MARKETING_CAMPAIGN_RECORD_PAGE_LAYOUT_ID,
};

export const getDefaultRecordPageLayoutId = ({
  targetObjectNameSingular,
}: {
  targetObjectNameSingular: string;
}): string => {
  return (
    OBJECT_NAME_TO_DEFAULT_LAYOUT_ID[targetObjectNameSingular] ??
    DEFAULT_RECORD_PAGE_LAYOUT_ID
  );
};
