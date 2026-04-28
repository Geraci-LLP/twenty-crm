import { Injectable, Logger } from '@nestjs/common';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';

// MarketingCampaign aggregate fields (NUMBER), populated from related Email/Form/Sequence records.
type MarketingCampaignRecord = {
  id: string;
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;
  emailsBounced: number;
  emailsUnsubscribed: number;
  formSubmissions: number;
  sequenceEnrollments: number;
};

type EmailStats = {
  marketingCampaignId: string | null;
  sentCount: number;
  openCount: number;
  clickCount: number;
  bounceCount: number;
  unsubscribeCount: number;
};

type FormStats = {
  marketingCampaignId: string | null;
  submissionCount: number;
};

type SequenceStats = {
  marketingCampaignId: string | null;
  enrollmentCount: number;
};

@Injectable()
export class MarketingCampaignStatsService {
  private readonly logger = new Logger(MarketingCampaignStatsService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  // Recomputes aggregate counts for every MarketingCampaign in a workspace by
  // summing values from related Email/Form/Sequence records. Idempotent — runs in
  // a single workspace context, doesn't trigger writes for unchanged values.
  async recomputeWorkspace(workspaceId: string): Promise<number> {
    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const mcRepository =
          await this.globalWorkspaceOrmManager.getRepository<MarketingCampaignRecord>(
            workspaceId,
            'marketingCampaign',
            { shouldBypassPermissionChecks: true },
          );

        const campaigns = await mcRepository.find();
        if (campaigns.length === 0) return 0;

        const emailRepository =
          await this.globalWorkspaceOrmManager.getRepository<EmailStats>(
            workspaceId,
            'campaign', // entity name unchanged; only label was renamed to "Email"
            { shouldBypassPermissionChecks: true },
          );

        const formRepository =
          await this.globalWorkspaceOrmManager.getRepository<FormStats>(
            workspaceId,
            'form',
            { shouldBypassPermissionChecks: true },
          );

        const sequenceRepository =
          await this.globalWorkspaceOrmManager.getRepository<SequenceStats>(
            workspaceId,
            'sequence',
            { shouldBypassPermissionChecks: true },
          );

        // Pull every related record once; bucket by MC id so we don't N+1 the DB
        // when there are many campaigns.
        const allEmails = (await emailRepository
          .createQueryBuilder('e')
          .select([
            'e."marketingCampaignId" AS "marketingCampaignId"',
            'COALESCE(e."sentCount", 0)::int AS "sentCount"',
            'COALESCE(e."openCount", 0)::int AS "openCount"',
            'COALESCE(e."clickCount", 0)::int AS "clickCount"',
            'COALESCE(e."bounceCount", 0)::int AS "bounceCount"',
            'COALESCE(e."unsubscribeCount", 0)::int AS "unsubscribeCount"',
          ])
          .where('e."marketingCampaignId" IS NOT NULL')
          .getRawMany()) as EmailStats[];

        const allForms = (await formRepository
          .createQueryBuilder('f')
          .select([
            'f."marketingCampaignId" AS "marketingCampaignId"',
            'COALESCE(f."submissionCount", 0)::int AS "submissionCount"',
          ])
          .where('f."marketingCampaignId" IS NOT NULL')
          .getRawMany()) as FormStats[];

        const allSequences = (await sequenceRepository
          .createQueryBuilder('s')
          .select([
            's."marketingCampaignId" AS "marketingCampaignId"',
            'COALESCE(s."enrollmentCount", 0)::int AS "enrollmentCount"',
          ])
          .where('s."marketingCampaignId" IS NOT NULL')
          .getRawMany()) as SequenceStats[];

        const aggregates = new Map<string, MarketingCampaignRecord>();
        for (const c of campaigns) {
          aggregates.set(c.id, {
            id: c.id,
            emailsSent: 0,
            emailsOpened: 0,
            emailsClicked: 0,
            emailsBounced: 0,
            emailsUnsubscribed: 0,
            formSubmissions: 0,
            sequenceEnrollments: 0,
          });
        }

        for (const e of allEmails) {
          if (!e.marketingCampaignId) continue;
          const agg = aggregates.get(e.marketingCampaignId);
          if (!agg) continue;
          agg.emailsSent += e.sentCount;
          agg.emailsOpened += e.openCount;
          agg.emailsClicked += e.clickCount;
          agg.emailsBounced += e.bounceCount;
          agg.emailsUnsubscribed += e.unsubscribeCount;
        }
        for (const f of allForms) {
          if (!f.marketingCampaignId) continue;
          const agg = aggregates.get(f.marketingCampaignId);
          if (agg) agg.formSubmissions += f.submissionCount;
        }
        for (const s of allSequences) {
          if (!s.marketingCampaignId) continue;
          const agg = aggregates.get(s.marketingCampaignId);
          if (agg) agg.sequenceEnrollments += s.enrollmentCount;
        }

        let updatedCount = 0;
        for (const c of campaigns) {
          const agg = aggregates.get(c.id);
          if (!agg) continue;

          // Skip writes when nothing changed — keeps updatedAt clean.
          if (
            agg.emailsSent === c.emailsSent &&
            agg.emailsOpened === c.emailsOpened &&
            agg.emailsClicked === c.emailsClicked &&
            agg.emailsBounced === c.emailsBounced &&
            agg.emailsUnsubscribed === c.emailsUnsubscribed &&
            agg.formSubmissions === c.formSubmissions &&
            agg.sequenceEnrollments === c.sequenceEnrollments
          ) {
            continue;
          }

          await mcRepository.update(
            { id: c.id },
            {
              emailsSent: agg.emailsSent,
              emailsOpened: agg.emailsOpened,
              emailsClicked: agg.emailsClicked,
              emailsBounced: agg.emailsBounced,
              emailsUnsubscribed: agg.emailsUnsubscribed,
              formSubmissions: agg.formSubmissions,
              sequenceEnrollments: agg.sequenceEnrollments,
            },
          );
          updatedCount++;
        }

        if (updatedCount > 0) {
          this.logger.log(
            `Recomputed stats for ${updatedCount} MarketingCampaign(s) in workspace ${workspaceId}`,
          );
        }
        return updatedCount;
      },
      authContext,
      { lite: true },
    );
  }
}
