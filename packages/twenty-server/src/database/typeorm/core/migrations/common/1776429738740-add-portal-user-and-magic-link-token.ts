import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPortalUserAndMagicLinkToken1776429738740
  implements MigrationInterface
{
  name = 'AddPortalUserAndMagicLinkToken1776429738740';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the portalUser table in the core schema.
    // Client portal users are separate from the standard CRM users —
    // they authenticate via email magic-link and see only their own data.
    await queryRunner.query(`
      CREATE TABLE "core"."portalUser" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "name" character varying,
        "isActive" boolean NOT NULL DEFAULT true,
        "lastLoginAt" TIMESTAMP WITH TIME ZONE,
        "personId" uuid,
        "workspaceId" uuid NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_portalUser_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_portalUser_workspace" FOREIGN KEY ("workspaceId")
          REFERENCES "core"."workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_PORTAL_USER_EMAIL_WORKSPACE"
      ON "core"."portalUser" ("email", "workspaceId")
      WHERE "deletedAt" IS NULL
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_PORTAL_USER_WORKSPACE"
      ON "core"."portalUser" ("workspaceId")
    `);

    // The appToken.type column is a plain text column (not a Postgres enum),
    // so MAGIC_LINK_TOKEN is added implicitly at the application layer via the
    // AppTokenType TS enum. No DB alteration is required for the new token type.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "core"."IDX_PORTAL_USER_WORKSPACE"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "core"."IDX_PORTAL_USER_EMAIL_WORKSPACE"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "core"."portalUser"`);
  }
}
