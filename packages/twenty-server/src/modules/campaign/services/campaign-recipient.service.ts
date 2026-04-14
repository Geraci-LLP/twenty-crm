import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  FindOperator,
  ILike,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
  type FindOptionsWhere,
} from 'typeorm';
import { ViewFilterOperand } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { FieldMetadataEntity } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { ViewFilterEntity } from 'src/engine/metadata-modules/view-filter/entities/view-filter.entity';
import { type ViewFilterValue } from 'src/engine/metadata-modules/view-filter/types/view-filter-value.type';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import {
  CampaignRecipientStatus,
  type CampaignRecipientWorkspaceEntity,
} from 'src/modules/campaign/standard-objects/campaign-recipient.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

// Compound/JSONB fields that cannot be filtered with simple TypeORM WHERE conditions
const UNSUPPORTED_PERSON_FILTER_FIELDS = new Set([
  'name',
  'emails',
  'phones',
  'linkedinLink',
  'xLink',
  'createdBy',
  'updatedBy',
  'searchVector',
  'avatarFile',
]);

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
    @InjectRepository(ViewFilterEntity)
    private readonly viewFilterRepository: Repository<ViewFilterEntity>,
    @InjectRepository(FieldMetadataEntity)
    private readonly fieldMetadataRepository: Repository<FieldMetadataEntity>,
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
    const personRepository =
      await this.globalWorkspaceOrmManager.getRepository<PersonWorkspaceEntity>(
        workspaceId,
        'person',
        { shouldBypassPermissionChecks: true },
      );

    // Fetch all view filters for this view
    const viewFilters = await this.viewFilterRepository.find({
      where: { viewId },
    });

    // Build TypeORM WHERE clause from filters, skipping unsupported field types
    const whereClause: FindOptionsWhere<PersonWorkspaceEntity> = {};
    let appliedCount = 0;

    if (viewFilters.length > 0) {
      const fieldMetadataIds = viewFilters.map((f) => f.fieldMetadataId);
      const fieldMetadatas = await this.fieldMetadataRepository.find({
        where: { id: In(fieldMetadataIds) },
        select: ['id', 'name'],
      });
      const fieldNameById = new Map(fieldMetadatas.map((f) => [f.id, f.name]));

      for (const filter of viewFilters) {
        const fieldName = fieldNameById.get(filter.fieldMetadataId);

        if (!isDefined(fieldName)) {
          this.logger.warn(
            `Skipping view filter: field metadata ${filter.fieldMetadataId} not found`,
          );
          continue;
        }

        if (UNSUPPORTED_PERSON_FILTER_FIELDS.has(fieldName)) {
          this.logger.warn(
            `Skipping compound/JSONB field filter: ${fieldName} (not supported for recipient resolution)`,
          );
          continue;
        }

        const condition = this.buildWhereCondition(
          filter.operand,
          filter.value as ViewFilterValue,
        );

        if (isDefined(condition)) {
          (whereClause as Record<string, unknown>)[fieldName] = condition;
          appliedCount++;
        }
      }
    }

    this.logger.log(
      `Resolving recipients from saved view ${viewId}: applied ${appliedCount}/${viewFilters.length} filters`,
    );

    const persons = await personRepository.find({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
    });

    this.logger.log(
      `Resolved ${persons.length} persons from saved view ${viewId}`,
    );

    return this.createRecipientsFromPersons(persons, campaignId, workspaceId);
  }

  private buildWhereCondition(
    operand: ViewFilterOperand,
    value: ViewFilterValue,
  ): FindOperator<unknown> | string | boolean | number | null | undefined {
    // Handle IS_EMPTY / IS_NOT_EMPTY / IS_NOT_NULL regardless of value type
    if (operand === ViewFilterOperand.IS_EMPTY) {
      return IsNull();
    }
    if (
      operand === ViewFilterOperand.IS_NOT_EMPTY ||
      operand === ViewFilterOperand.IS_NOT_NULL
    ) {
      return Not(IsNull());
    }

    // Array values (multi-select / IN lists)
    if (Array.isArray(value)) {
      if (operand === ViewFilterOperand.IS) return In(value);
      if (operand === ViewFilterOperand.IS_NOT) return Not(In(value));
      return undefined;
    }

    // String values
    if (typeof value === 'string') {
      switch (operand) {
        case ViewFilterOperand.IS:
          return value;
        case ViewFilterOperand.IS_NOT:
          return Not(value);
        case ViewFilterOperand.CONTAINS:
          return ILike(`%${value}%`);
        case ViewFilterOperand.DOES_NOT_CONTAIN:
          return Not(ILike(`%${value}%`));
        case ViewFilterOperand.LESS_THAN_OR_EQUAL:
          return LessThanOrEqual(value);
        case ViewFilterOperand.GREATER_THAN_OR_EQUAL:
          return MoreThanOrEqual(value);
        default:
          return undefined;
      }
    }

    // Boolean / number values
    if (typeof value === 'boolean' || typeof value === 'number') {
      if (operand === ViewFilterOperand.IS) return value;
      if (operand === ViewFilterOperand.IS_NOT) return Not(value);
    }

    return undefined;
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
