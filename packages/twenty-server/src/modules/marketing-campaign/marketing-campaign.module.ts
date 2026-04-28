import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { MarketingCampaignStatsCronCommand } from 'src/modules/marketing-campaign/crons/commands/marketing-campaign-stats.cron.command';
import { MarketingCampaignStatsCronJob } from 'src/modules/marketing-campaign/crons/jobs/marketing-campaign-stats.cron.job';
import { MarketingCampaignStatsService } from 'src/modules/marketing-campaign/services/marketing-campaign-stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity])],
  providers: [
    MarketingCampaignStatsService,
    MarketingCampaignStatsCronJob,
    MarketingCampaignStatsCronCommand,
  ],
  exports: [MarketingCampaignStatsService, MarketingCampaignStatsCronCommand],
})
export class MarketingCampaignModule {}
