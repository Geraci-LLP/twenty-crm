import { Injectable, Logger } from '@nestjs/common';

import { isDefined } from 'twenty-shared/utils';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import {
  type LeadCreationResult,
  type LeadInput,
} from 'src/modules/lead/types/lead-input.type';
import { normalizePhoneToE164 } from 'src/modules/lead/utils/map-fields-to-lead.util';

@Injectable()
export class LeadCreationService {
  private readonly logger = new Logger(LeadCreationService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  async findOrCreatePerson(
    workspaceId: string,
    input: LeadInput,
  ): Promise<LeadCreationResult> {
    const email = input.email.trim().toLowerCase();
    if (!email) {
      throw new Error('Email is required to create or find a lead');
    }

    const authContext = buildSystemAuthContext(workspaceId);

    return this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const personRepository =
          await this.globalWorkspaceOrmManager.getRepository<PersonWorkspaceEntity>(
            workspaceId,
            'person',
            { shouldBypassPermissionChecks: true },
          );

        // Dedup by primary email — Twenty stores email in EMAILS composite,
        // queryable as `emails.primaryEmail`.
        const existing = await personRepository
          .createQueryBuilder('person')
          .where(`LOWER("person"."emailsPrimaryEmail") = :email`, { email })
          .limit(1)
          .getOne();

        // Dedupe + tag merge: if the person already exists and the
        // input carries tags, union them onto the existing record so
        // a user who fills out two forms ends up with both tags.
        if (isDefined(existing)) {
          const inputTags = input.tags ?? [];
          if (inputTags.length > 0) {
            const existingTags = Array.isArray(
              (existing as { tags?: string[] | null }).tags,
            )
              ? (((existing as { tags?: string[] | null }).tags ?? []) as string[])
              : [];
            const merged = Array.from(
              new Set([...existingTags, ...inputTags]),
            );
            if (merged.length !== existingTags.length) {
              await personRepository.update(
                { id: existing.id },
                { tags: merged } as Partial<PersonWorkspaceEntity>,
              );
            }
          }
          return { personId: existing.id, created: false };
        }

        const personData: Record<string, unknown> = {
          emails: { primaryEmail: email },
        };

        if (input.firstName || input.lastName) {
          personData.name = {
            firstName: input.firstName ?? '',
            lastName: input.lastName ?? '',
          };
        }

        if (input.phone) {
          const normalized = normalizePhoneToE164(input.phone);
          if (normalized) {
            personData.phones = { primaryPhoneNumber: normalized };
          }
        }

        if (input.jobTitle) personData.jobTitle = input.jobTitle;
        if (input.city) personData.city = input.city;
        if (Array.isArray(input.tags) && input.tags.length > 0) {
          personData.tags = input.tags;
        }

        if (input.linkedinUrl) {
          let url = input.linkedinUrl;
          if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
          personData.linkedinLink = { primaryLinkUrl: url };
        }

        if (input.twitterHandle) {
          const handle = input.twitterHandle.replace(/^@/, '').trim();
          if (handle) {
            personData.xLink = {
              primaryLinkUrl: `https://x.com/${handle}`,
              primaryLinkLabel: '@' + handle,
            };
          }
        }

        const created = await personRepository.save(personData);

        this.logger.log(
          `Created Person ${created.id} (${email}) source=${input.source ?? 'unknown'}`,
        );

        return { personId: created.id, created: true };
      },
      authContext,
    );
  }
}
