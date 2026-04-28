import { type ActorMetadata, FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type FormSubmissionWorkspaceEntity } from 'src/modules/form/standard-objects/form-submission.workspace-entity';

const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_FORM: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export enum FormStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export class FormWorkspaceEntity extends BaseWorkspaceEntity {
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  name: string | null;
  description: string | null;
  status: string;
  fieldsConfig: object | null;
  submissionCount: number;
  thankYouMessage: string | null;
  notifyOnSubmission: boolean;
  notificationEmail: string | null;
  redirectUrl: string | null;
  sendConfirmationEmail: boolean;
  confirmationEmailSubject: string | null;
  confirmationEmailBody: string | null;
  autoCreatePerson: boolean;
  // Tags applied to a Person record when this form auto-creates one.
  // Empty / null means no tagging. Used by the lead-creation service
  // to merge into the new Person's `tags` array on submission.
  tagsToApplyOnSubmission: string[] | null;
  // Bot-protection settings. When `botProtectionEnabled` is true, the
  // public submit endpoint requires a valid Cloudflare Turnstile token
  // (server validates against the CLOUDFLARE_TURNSTILE_SECRET_KEY env
  // var). A non-empty `honeypotFieldName` instructs the server to
  // silently drop any submission whose `fields[honeypotFieldName]` is
  // a non-empty string — humans don't see the CSS-hidden field, bots
  // auto-fill it. `botProtectionSiteKey` is the Turnstile site key
  // (public) for the form's host page. Per-form so different brands
  // can use different Turnstile widgets if needed.
  botProtectionEnabled: boolean;
  botProtectionSiteKey: string | null;
  honeypotFieldName: string | null;
  // Native bot-protection layers — work standalone without Turnstile.
  // Stack them or use Turnstile, the user picks per form.
  // requireFormLoadToken: GET /schema returns a short-lived signed JWT
  //   that POST /submit must echo back. Defeats bots that POST without
  //   ever rendering the form.
  // minSubmitTimeSeconds: reject submissions with token age younger
  //   than this. Defeats instant-submit bots. Default 2.
  // rateLimitPerMinute: max submissions per source IP per 60s window.
  //   0 disables. Default 0 (off — opt-in per form).
  // allowedOrigins: per-form allowlist of Origin headers. Empty array
  //   or null means all origins allowed.
  // rejectDisposableEmails: drop submissions whose submitterEmail (or
  //   email field) ends in a known temp-mail domain.
  requireFormLoadToken: boolean;
  minSubmitTimeSeconds: number | null;
  rateLimitPerMinute: number | null;
  allowedOrigins: string[] | null;
  rejectDisposableEmails: boolean;
  additionalMarketingCampaignIds: string[] | null;
  formSubmissions: EntityRelation<FormSubmissionWorkspaceEntity[]>;
  searchVector: string;
}
