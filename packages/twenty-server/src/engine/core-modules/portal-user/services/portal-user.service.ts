import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IsNull, Repository } from 'typeorm';

import { PortalUserEntity } from 'src/engine/core-modules/portal-user/portal-user.entity';

type CreatePortalUserInput = {
  email: string;
  workspaceId: string;
  name?: string | null;
  personId?: string | null;
};

@Injectable()
export class PortalUserService {
  constructor(
    @InjectRepository(PortalUserEntity)
    private readonly portalUserRepository: Repository<PortalUserEntity>,
  ) {}

  async findByEmail(
    email: string,
    workspaceId: string,
  ): Promise<PortalUserEntity | null> {
    return this.portalUserRepository.findOne({
      where: {
        email: email.toLowerCase(),
        workspaceId,
        deletedAt: IsNull(),
      },
    });
  }

  async findById(id: string): Promise<PortalUserEntity | null> {
    return this.portalUserRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.portalUserRepository.update({ id }, { lastLoginAt: new Date() });
  }

  async create(input: CreatePortalUserInput): Promise<PortalUserEntity> {
    const portalUser = this.portalUserRepository.create({
      email: input.email.toLowerCase(),
      workspaceId: input.workspaceId,
      name: input.name ?? null,
      personId: input.personId ?? null,
      isActive: true,
    });

    return this.portalUserRepository.save(portalUser);
  }

  async list(workspaceId: string): Promise<PortalUserEntity[]> {
    return this.portalUserRepository.find({
      where: { workspaceId, deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }
}
