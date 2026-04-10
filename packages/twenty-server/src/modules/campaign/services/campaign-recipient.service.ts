import { Injectable, Logger } from '@nestjs/common';

import { In } from 'typeorm';

import { isDefined } from 'twenty-shared/utils';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import {
  CampaignRecipientStatus,
  type CampaignRecipientWorkspaceEntity,
} from 'src/modules/campaign/standard-objects/campaign-recipient.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

type ResolveResult = {
  created: number;
  skipped: number;
  total: number;
};

@Injectable()
export class CampaignRecipientService {
  private readonly logger = new Logger(CampaignRecipientService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  async resolveFromManual(
    personIds: string[],
    campaignId: string,
    workspaceId: string,
  ): Promise<ResolveResult> {
    const personRepository =
      await this.globalWorkspaceOrmManager.getRepository<PersonWorkspaceEntity>(
        workspaceId,
        'person',
        { shouldBypassPermissionChecks: true },
      );

    const persons = await personRepository.find({
      where: { id: In(personIds) },
    });

    return this.createRecipientsFromPersons(persons, campaignId, workspaceId);
  }

  async resolveFromSavedView(
    viewId: string,
    campaignId: string,
    workspaceId: string,
  ): Promise<ResolveResult> {
    // Query all persons — view filter resolution is complex (requires filter parsing).
    // For now, fetch all persons and let the UI pre-filter via the view.
    // TODO: Implement view filter resolution to query only matching persons.
    const personRepository =
      await this.globalWorkspaceOrmManager.getRepository<PersonWorkspaceEntity>(
        workspaceId,
        'person',
        { shouldBypassPermissionChecks: true },
      );

    const persons = await personRepository.find();

    this.logger.log(
      `Resolved ${persons.length} persons from saved view ${viewId}`,
    );

    return this.createRecipientsFromPersons(persons, campaignId, workspaceId);
  }

  private async createRecipientsFromPersons(
    persons: PersonWorkspaceEntity[],
    campaignId: string,
    workspaceId: string,
  ): Promise<ResolveResult> {
    const recipientRepository =
      await this.globalWorkspaceOrmManager.getRepository<CampaignRecipientWorkspaceEntity>(
        workspaceId,
        'campaignRecipient',
        { shouldBypassPermissionChecks: true },
      );

    // Get existing recipients to deduplicate
    const existingRecipients = await recipientRepository.find({
      where: { campaignId },
      select: ['personId'],
    });

    const existingPersonIds = new Set(
      existingRecipients
        .map((r) => r.personId)
        .filter((id): id is string => isDefined(id)),
    );

    let created = 0;
    let skipped = 0;

    for (const person of persons) {
      // Skip if already a recipient for this campaign
      if (existingPersonIds.has(person.id)) {
        skipped++;
        continue;
      }

      // Skip persons without a primary email
      const primaryEmail = person.emails?.primaryEmail;

      if (!primaryEmail) {
        skipped++;
        continue;
      }

      await recipientRepository.save({
        campaignId,
        personId: person.id,
        status: CampaignRecipientStatus.PENDING,
      });

      created++;
    }

    this.logger.log(
      `Campaign ${campaignId}: created ${created} recipients, skipped ${skipped}`,
    );

    return { created, skipped, total: created + skipped };
  }
}
