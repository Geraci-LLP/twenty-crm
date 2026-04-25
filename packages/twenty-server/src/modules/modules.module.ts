import { Module } from '@nestjs/common';

import { CalendarModule } from 'src/modules/calendar/calendar.module';
import { CampaignModule } from 'src/modules/campaign/campaign.module';
import { DocumentTrackingModule } from 'src/modules/document-tracking/document-tracking.module';
import { FormModule } from 'src/modules/form/form.module';
import { LandingPageModule } from 'src/modules/landing-page/landing-page.module';
import { LeadModule } from 'src/modules/lead/lead.module';
import { MarketingCampaignModule } from 'src/modules/marketing-campaign/marketing-campaign.module';
import { LiveChatModule } from 'src/modules/live-chat/live-chat.module';
import { MeetingSchedulerModule } from 'src/modules/meeting-scheduler/meeting-scheduler.module';
import { SalesSequenceModule } from 'src/modules/sales-sequence/sales-sequence.module';
import { ConnectedAccountModule } from 'src/modules/connected-account/connected-account.module';
import { FavoriteFolderModule } from 'src/modules/favorite-folder/favorite-folder.module';
import { FavoriteModule } from 'src/modules/favorite/favorite.module';
import { MessagingModule } from 'src/modules/messaging/messaging.module';
import { WorkflowModule } from 'src/modules/workflow/workflow.module';
import { WorkspaceMemberModule } from 'src/modules/workspace-member/workspace-member.module';

@Module({
  imports: [
    MessagingModule,
    CalendarModule,
    CampaignModule,
    DocumentTrackingModule,
    FormModule,
    LandingPageModule,
    LeadModule,
    LiveChatModule,
    MarketingCampaignModule,
    MeetingSchedulerModule,
    SalesSequenceModule,
    ConnectedAccountModule,
    WorkflowModule,
    FavoriteFolderModule,
    FavoriteModule,
    WorkspaceMemberModule,
  ],
  providers: [],
  exports: [],
})
export class ModulesModule {}
