import { type MigrationInterface, type QueryRunner } from 'typeorm';

// Adds FORM_BUILDER, LANDING_PAGE_BUILDER, and CAMPAIGN_EDITOR widget types.
// FORM_BUILDER and LANDING_PAGE_BUILDER were added to TypeScript enums on this branch
// but lacked a DB migration — included here together with CAMPAIGN_EDITOR.
export class AddCampaignEditorWidgetType1775600000000
  implements MigrationInterface
{
  name = 'AddCampaignEditorWidgetType1775600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "core"."pageLayoutWidget_type_enum" RENAME TO "pageLayoutWidget_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "core"."pageLayoutWidget_type_enum" AS ENUM('VIEW', 'IFRAME', 'FIELD', 'FIELDS', 'GRAPH', 'STANDALONE_RICH_TEXT', 'TIMELINE', 'TASKS', 'NOTES', 'FILES', 'EMAILS', 'CALENDAR', 'FIELD_RICH_TEXT', 'WORKFLOW', 'WORKFLOW_VERSION', 'WORKFLOW_RUN', 'FRONT_COMPONENT', 'RECORD_TABLE', 'EMAIL_THREAD', 'FORM_BUILDER', 'LANDING_PAGE_BUILDER', 'CAMPAIGN_EDITOR')`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."pageLayoutWidget" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."pageLayoutWidget" ALTER COLUMN "type" TYPE "core"."pageLayoutWidget_type_enum" USING "type"::"text"::"core"."pageLayoutWidget_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."pageLayoutWidget" ALTER COLUMN "type" SET DEFAULT 'VIEW'`,
    );
    await queryRunner.query(
      `DROP TYPE "core"."pageLayoutWidget_type_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "core"."pageLayoutWidget_type_enum_old" AS ENUM('VIEW', 'IFRAME', 'FIELD', 'FIELDS', 'GRAPH', 'STANDALONE_RICH_TEXT', 'TIMELINE', 'TASKS', 'NOTES', 'FILES', 'EMAILS', 'CALENDAR', 'FIELD_RICH_TEXT', 'WORKFLOW', 'WORKFLOW_VERSION', 'WORKFLOW_RUN', 'FRONT_COMPONENT', 'RECORD_TABLE', 'EMAIL_THREAD')`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."pageLayoutWidget" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."pageLayoutWidget" ALTER COLUMN "type" TYPE "core"."pageLayoutWidget_type_enum_old" USING "type"::"text"::"core"."pageLayoutWidget_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."pageLayoutWidget" ALTER COLUMN "type" SET DEFAULT 'VIEW'`,
    );
    await queryRunner.query(`DROP TYPE "core"."pageLayoutWidget_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "core"."pageLayoutWidget_type_enum_old" RENAME TO "pageLayoutWidget_type_enum"`,
    );
  }
}
