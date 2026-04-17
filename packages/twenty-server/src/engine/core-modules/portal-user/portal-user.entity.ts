import { Field, ObjectType } from '@nestjs/graphql';

import { IDField } from '@ptc-org/nestjs-query-graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';

@Entity({ name: 'portalUser', schema: 'core' })
@ObjectType('PortalUser')
@Index('IDX_PORTAL_USER_EMAIL_WORKSPACE', ['email', 'workspaceId'], {
  unique: true,
  where: '"deletedAt" IS NULL',
})
export class PortalUserEntity {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  email: string;

  @BeforeInsert()
  @BeforeUpdate()
  formatEmail?() {
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
  }

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'varchar' })
  name: string | null;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'timestamptz' })
  lastLoginAt: Date | null;

  // Logical FK to the workspace-schema `person` table.
  // Cross-schema, so not enforced at the DB level.
  @Field({ nullable: true })
  @Column({ nullable: true, type: 'uuid' })
  personId: string | null;

  @ManyToOne(() => WorkspaceEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspaceId' })
  workspace: Relation<WorkspaceEntity>;

  @Field()
  @Column({ type: 'uuid' })
  workspaceId: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date | null;
}
