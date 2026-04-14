import { Injectable, Logger } from '@nestjs/common';

import { isDefined } from 'twenty-shared/utils';

import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import {
  DripCampaignStatus,
  type DripCampaignWorkspaceEntity,
} from 'src/modules/campaign/standard-objects/drip-campaign.workspace-entity';
import {
  DripEnrollmentStatus,
  type DripEnrollmentWorkspaceEntity,
} from 'src/modules/campaign/standard-objects/drip-enrollment.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

@Injectable()
export class DripCampaignService {
  private readonly logger = new Logger(DripCampaignService.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  async create(
    name: string,
    workspaceId: string,
  ): Promise<{ dripCampaignId: string }> {
    const dripCampaignRepository =
      await this.globalWorkspaceOrmManager.getRepository<DripCampaignWorkspaceEntity>(
        workspaceId,
        'dripCampaign',
        { shouldBypassPermissionChecks: true },
      );

    const dripCampaign = dripCampaignRepository.create({
      name,
      status: DripCampaignStatus.DRAFT,
      enrollmentCount: 0,
      activeEnrollmentCount: 0,
      completedCount: 0,
    });

    const saved = await dripCampaignRepository.save(dripCampaign);

    this.logger.log(
      `Created drip campaign "${name}" (${saved.id}) in workspace ${workspaceId}`,
    );

    return { dripCampaignId: saved.id };
  }

  async activate(dripCampaignId: string, workspaceId: string): Promise<void> {
    const dripCampaignRepository =
      await this.globalWorkspaceOrmManager.getRepository<DripCampaignWorkspaceEntity>(
        workspaceId,
        'dripCampaign',
        { shouldBypassPermissionChecks: true },
      );

    const dripCampaign = await dripCampaignRepository.findOneOrFail({
      where: { id: dripCampaignId },
    });

    if (
      dripCampaign.status !== DripCampaignStatus.DRAFT &&
      dripCampaign.status !== DripCampaignStatus.PAUSED
    ) {
      throw new Error(
        `Drip campaign must be in DRAFT or PAUSED status to activate. Current: ${dripCampaign.status}`,
      );
    }

    await dripCampaignRepository.update(
      { id: dripCampaignId },
      { status: DripCampaignStatus.ACTIVE },
    );

    this.logger.log(`Activated drip campaign ${dripCampaignId}`);
  }

  async pause(dripCampaignId: string, workspaceId: string): Promise<void> {
    const dripCampaignRepository =
      await this.globalWorkspaceOrmManager.getRepository<DripCampaignWorkspaceEntity>(
        workspaceId,
        'dripCampaign',
        { shouldBypassPermissionChecks: true },
      );

    const dripCampaign = await dripCampaignRepository.findOneOrFail({
      where: { id: dripCampaignId },
    });

    if (dripCampaign.status !== DripCampaignStatus.ACTIVE) {
      throw new Error(
        `Drip campaign must be in ACTIVE status to pause. Current: ${dripCampaign.status}`,
      );
    }

    await dripCampaignRepository.update(
      { id: dripCampaignId },
      { status: DripCampaignStatus.PAUSED },
    );

    // Pause all active enrollments
    const enrollmentRepository =
      await this.globalWorkspaceOrmManager.getRepository<DripEnrollmentWorkspaceEntity>(
        workspaceId,
        'dripEnrollment',
        { shouldBypassPermissionChecks: true },
      );

    await enrollmentRepository.update(
      {
        dripCampaignId,
        status: DripEnrollmentStatus.ACTIVE,
      },
      { status: DripEnrollmentStatus.PAUSED },
    );

    this.logger.log(`Paused drip campaign ${dripCampaignId}`);
  }

  async enrollContacts(
    dripCampaignId: string,
    personIds: string[],
    workspaceId: string,
  ): Promise<{ enrolled: number; skipped: number }> {
    const dripCampaignRepository =
      await this.globalWorkspaceOrmManager.getRepository<DripCampaignWorkspaceEntity>(
        workspaceId,
        'dripCampaign',
        { shouldBypassPermissionChecks: true },
      );

    const dripCampaign = await dripCampaignRepository.findOneOrFail({
      where: { id: dripCampaignId },
    });

    if (dripCampaign.status !== DripCampaignStatus.ACTIVE) {
      throw new Error(
        `Drip campaign must be ACTIVE to enroll contacts. Current: ${dripCampaign.status}`,
      );
    }

    const enrollmentRepository =
      await this.globalWorkspaceOrmManager.getRepository<DripEnrollmentWorkspaceEntity>(
        workspaceId,
        'dripEnrollment',
        { shouldBypassPermissionChecks: true },
      );

    const personRepository =
      await this.globalWorkspaceOrmManager.getRepository<PersonWorkspaceEntity>(
        workspaceId,
        'person',
        { shouldBypassPermissionChecks: true },
      );

    let enrolled = 0;
    let skipped = 0;
    const now = new Date().toISOString();

    for (const personId of personIds) {
      // Check if already enrolled (active or paused)
      const existingEnrollment = await enrollmentRepository.findOne({
        where: {
          dripCampaignId,
          personId,
          status: DripEnrollmentStatus.ACTIVE,
        },
      });

      if (isDefined(existingEnrollment)) {
        skipped++;
        continue;
      }

      // Verify person exists and has email
      const person = await personRepository.findOne({
        where: { id: personId },
      });

      if (!isDefined(person) || !person.emails?.primaryEmail) {
        skipped++;
        continue;
      }

      const enrollment = enrollmentRepository.create({
        dripCampaignId,
        personId,
        status: DripEnrollmentStatus.ACTIVE,
        currentStepIndex: 0,
        enrolledAt: now,
      });

      await enrollmentRepository.save(enrollment);
      enrolled++;
    }

    // Update counts on drip campaign
    await dripCampaignRepository.increment(
      { id: dripCampaignId },
      'enrollmentCount',
      enrolled,
    );

    await dripCampaignRepository.increment(
      { id: dripCampaignId },
      'activeEnrollmentCount',
      enrolled,
    );

    this.logger.log(
      `Enrolled ${enrolled} contacts in drip campaign ${dripCampaignId} (${skipped} skipped)`,
    );

    return { enrolled, skipped };
  }

  async unenroll(enrollmentId: string, workspaceId: string): Promise<void> {
    const enrollmentRepository =
      await this.globalWorkspaceOrmManager.getRepository<DripEnrollmentWorkspaceEntity>(
        workspaceId,
        'dripEnrollment',
        { shouldBypassPermissionChecks: true },
      );

    const enrollment = await enrollmentRepository.findOneOrFail({
      where: { id: enrollmentId },
    });

    if (enrollment.status !== DripEnrollmentStatus.ACTIVE) {
      throw new Error(
        `Enrollment must be in ACTIVE status to unenroll. Current: ${enrollment.status}`,
      );
    }

    await enrollmentRepository.update(
      { id: enrollmentId },
      {
        status: DripEnrollmentStatus.UNSUBSCRIBED,
        completedAt: new Date().toISOString(),
      },
    );

    // Decrement active count
    const dripCampaignRepository =
      await this.globalWorkspaceOrmManager.getRepository<DripCampaignWorkspaceEntity>(
        workspaceId,
        'dripCampaign',
        { shouldBypassPermissionChecks: true },
      );

    await dripCampaignRepository.decrement(
      { id: enrollment.dripCampaignId },
      'activeEnrollmentCount',
      1,
    );

    this.logger.log(`Unenrolled enrollment ${enrollmentId}`);
  }
}
