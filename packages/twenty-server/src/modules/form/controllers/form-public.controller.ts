import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Ip,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isDefined } from 'twenty-shared/utils';
import { Repository } from 'typeorm';

import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { isDisposableEmail } from 'src/modules/form/constants/disposable-email-domains';
import { type FormWorkspaceEntity } from 'src/modules/form/standard-objects/form.workspace-entity';
import { type FormSubmissionWorkspaceEntity } from 'src/modules/form/standard-objects/form-submission.workspace-entity';
import { FormLoadTokenService } from 'src/modules/form/services/form-load-token.service';
import { FormRateLimiterService } from 'src/modules/form/services/form-rate-limiter.service';
import { FormSubmissionService } from 'src/modules/form/services/form-submission.service';
import { TurnstileValidatorService } from 'src/modules/form/services/turnstile-validator.service';
import { LeadCreationService } from 'src/modules/lead/services/lead-creation.service';
import { mapFieldsToLeadInput } from 'src/modules/lead/utils/map-fields-to-lead.util';

type SubmitFormBody = {
  fields: Record<string, unknown>;
  submitterEmail?: string;
  submitterName?: string;
  // Cloudflare Turnstile token from the form host page's widget.
  // Required when the form has botProtectionEnabled: true.
  captchaToken?: string;
  // Signed JWT issued by GET /schema. Required when the form has
  // requireFormLoadToken: true.
  formLoadToken?: string;
};

// Origin allowlist matching: a stored entry matches the request's
// Origin / Referer if the entry is exactly equal OR is the entry's
// hostname (so users can configure either "https://example.com" or
// "example.com"). Empty / null allowedOrigins means "all allowed".
const requestMatchesAllowlist = (
  origin: string | undefined,
  referer: string | undefined,
  allowed: string[] | null | undefined,
): boolean => {
  if (allowed === null || allowed === undefined || allowed.length === 0) {
    return true;
  }
  const sources: string[] = [];
  if (typeof origin === 'string' && origin !== '') sources.push(origin);
  if (typeof referer === 'string' && referer !== '') sources.push(referer);
  if (sources.length === 0) return false;
  for (const src of sources) {
    let host = '';
    try {
      host = new URL(src).host.toLowerCase();
    } catch {
      host = src.toLowerCase();
    }
    for (const entry of allowed) {
      const e = entry.trim().toLowerCase();
      if (e === '') continue;
      // Match either full URL string or just the host portion
      if (src.toLowerCase() === e) return true;
      if (host === e) return true;
      try {
        if (new URL(e).host.toLowerCase() === host) return true;
      } catch {
        // entry isn't a parseable URL; fall through
      }
    }
  }
  return false;
};

@Controller('forms')
export class FormPublicController {
  private readonly logger = new Logger(FormPublicController.name);

  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    private readonly formSubmissionService: FormSubmissionService,
    private readonly leadCreationService: LeadCreationService,
    private readonly turnstileValidator: TurnstileValidatorService,
    private readonly formLoadTokenService: FormLoadTokenService,
    private readonly formRateLimiter: FormRateLimiterService,
  ) {}

  @Get(':workspaceId/:formId/schema')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async getFormSchema(
    @Param('workspaceId') workspaceId: string,
    @Param('formId') formId: string,
  ) {
    await this.validateWorkspace(workspaceId);

    const authContext = buildSystemAuthContext(workspaceId);

    const form = await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const formRepository =
          await this.globalWorkspaceOrmManager.getRepository<FormWorkspaceEntity>(
            workspaceId,
            'form',
            { shouldBypassPermissionChecks: true },
          );

        return formRepository.findOne({
          where: { id: formId },
        });
      },
      authContext,
    );

    if (!isDefined(form)) {
      throw new HttpException('Form not found', HttpStatus.NOT_FOUND);
    }

    if (form.status !== 'PUBLISHED') {
      throw new HttpException('Form is not published', HttpStatus.NOT_FOUND);
    }

    // Issue a short-lived form-load token. Even forms that don't
    // require it get one — costs nothing and lets the host page
    // simply pass it through if the operator later toggles the
    // requirement on. Forms with requireFormLoadToken=false ignore
    // the token at submit time.
    const formLoadToken = this.formLoadTokenService.sign(workspaceId, formId);

    return {
      id: form.id,
      name: form.name,
      description: form.description,
      fields: form.fieldsConfig,
      thankYouMessage: form.thankYouMessage,
      redirectUrl: form.redirectUrl,
      formLoadToken,
      // Surface bot-protection requirements to the client so it can
      // wire the right widgets (Turnstile site key, etc.) without
      // having to be told out-of-band.
      botProtection: {
        requireFormLoadToken:
          (form as { requireFormLoadToken?: boolean | null })
            .requireFormLoadToken === true,
        turnstileEnabled:
          (form as { botProtectionEnabled?: boolean | null })
            .botProtectionEnabled === true,
        turnstileSiteKey:
          (form as { botProtectionSiteKey?: string | null })
            .botProtectionSiteKey ?? null,
        honeypotFieldName:
          (form as { honeypotFieldName?: string | null }).honeypotFieldName ??
          null,
      },
    };
  }

  @Post(':workspaceId/:formId/submit')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async submitForm(
    @Param('workspaceId') workspaceId: string,
    @Param('formId') formId: string,
    @Body() body: SubmitFormBody,
    @Ip() requestIp: string,
    @Headers('origin') originHeader: string | undefined,
    @Headers('referer') refererHeader: string | undefined,
  ) {
    await this.validateWorkspace(workspaceId);

    const authContext = buildSystemAuthContext(workspaceId);

    const result =
      await this.globalWorkspaceOrmManager.executeInWorkspaceContext(
        async () => {
          const formRepository =
            await this.globalWorkspaceOrmManager.getRepository<FormWorkspaceEntity>(
              workspaceId,
              'form',
              { shouldBypassPermissionChecks: true },
            );

          const form = await formRepository.findOne({
            where: { id: formId },
          });

          if (!isDefined(form)) {
            throw new HttpException('Form not found', HttpStatus.NOT_FOUND);
          }

          if (form.status !== 'PUBLISHED') {
            throw new HttpException(
              'Form is not published',
              HttpStatus.NOT_FOUND,
            );
          }

          // ────────────────────────────────────────────────────────
          // Native bot-protection layers. Order is cheap-to-expensive
          // so we reject obvious bots without doing JWT or HTTP work:
          //   1. Origin allowlist (string compare)
          //   2. Per-IP rate limit (in-memory map lookup)
          //   3. Disposable email blacklist (set lookup)
          //   4. Form-load token + time-trap (JWT verify, local)
          //   5. Honeypot (string compare on field map)
          //   6. Turnstile (network call to Cloudflare)
          // 1, 2, 4 are all native — Turnstile is optional. The user
          // picks per form which combination they want.
          // ────────────────────────────────────────────────────────

          // 1. Origin allowlist
          const allowed = (form as { allowedOrigins?: string[] | null })
            .allowedOrigins;
          if (!requestMatchesAllowlist(originHeader, refererHeader, allowed)) {
            this.logger.warn(
              `Form ${formId}: origin "${originHeader ?? '<none>'}" / referer "${refererHeader ?? '<none>'}" not in allowlist (${(allowed ?? []).join(',')}) — rejecting.`,
            );
            throw new HttpException(
              {
                message: 'Origin not permitted',
                errors: { origin: 'This domain is not authorized to submit' },
              },
              HttpStatus.FORBIDDEN,
            );
          }

          // 2. Per-IP rate limit
          const rateLimit = (form as { rateLimitPerMinute?: number | null })
            .rateLimitPerMinute;
          if (
            typeof rateLimit === 'number' &&
            rateLimit > 0 &&
            !this.formRateLimiter.check(formId, requestIp, rateLimit)
          ) {
            this.logger.warn(
              `Form ${formId}: rate limit hit for IP ${requestIp} (limit ${rateLimit}/min).`,
            );
            throw new HttpException(
              {
                message: 'Rate limit exceeded',
                errors: { rateLimit: 'Too many submissions, try again later' },
              },
              HttpStatus.TOO_MANY_REQUESTS,
            );
          }

          // 3. Disposable email blacklist
          if (
            (form as { rejectDisposableEmails?: boolean | null })
              .rejectDisposableEmails === true
          ) {
            const submittedFieldsForEmail = (body.fields ?? {}) as Record<
              string,
              unknown
            >;
            const candidates: string[] = [];
            if (typeof body.submitterEmail === 'string')
              candidates.push(body.submitterEmail);
            if (typeof submittedFieldsForEmail.email === 'string')
              candidates.push(submittedFieldsForEmail.email as string);
            for (const e of candidates) {
              if (isDisposableEmail(e)) {
                this.logger.warn(
                  `Form ${formId}: rejected disposable email ${e}.`,
                );
                throw new HttpException(
                  {
                    message: 'Email not accepted',
                    errors: {
                      email: 'Please use a non-disposable email address',
                    },
                  },
                  HttpStatus.BAD_REQUEST,
                );
              }
            }
          }

          // 4. Form-load token + time-trap
          if (
            (form as { requireFormLoadToken?: boolean | null })
              .requireFormLoadToken === true
          ) {
            const minTime = (form as { minSubmitTimeSeconds?: number | null })
              .minSubmitTimeSeconds;
            const verdict = await this.formLoadTokenService.verify(
              body.formLoadToken,
              workspaceId,
              formId,
              minTime ?? null,
            );
            if (!verdict.valid) {
              this.logger.warn(
                `Form ${formId}: form-load token rejected (${verdict.reason}).`,
              );
              throw new HttpException(
                {
                  message: 'Form-load token check failed',
                  errors: { formLoadToken: `Invalid: ${verdict.reason}` },
                },
                HttpStatus.FORBIDDEN,
              );
            }
          }

          // Bot protection — runs *before* validation / persistence so
          // bot traffic doesn't bloat counters or fire downstream side
          // effects. Two layers, in order:
          //
          // 1. Honeypot: if the form has a honeypotFieldName configured
          //    and the corresponding value in body.fields is a non-empty
          //    string, silently return success (without persisting).
          //    Bots that auto-fill all fields get a 200 and think they
          //    won; we know the field is CSS-hidden on legit pages so
          //    only bots ever populate it.
          // 2. Turnstile: if the form has botProtectionEnabled, verify
          //    body.captchaToken via Cloudflare. Failure → 403, no
          //    submission persisted.
          const honeypotName = (form as { honeypotFieldName?: string | null })
            .honeypotFieldName;
          if (typeof honeypotName === 'string' && honeypotName.trim() !== '') {
            const submittedFields = (body.fields ?? {}) as Record<
              string,
              unknown
            >;
            const honeypotValue = submittedFields[honeypotName];
            if (
              typeof honeypotValue === 'string' &&
              honeypotValue.trim() !== ''
            ) {
              this.logger.warn(
                `Form ${formId}: honeypot trip on field "${honeypotName}" — silently dropping submission.`,
              );
              return {
                submissionId: 'honeypot-rejected',
                personId: null,
              };
            }
          }
          const botProtectionEnabled =
            (form as { botProtectionEnabled?: boolean | null })
              .botProtectionEnabled === true;
          if (botProtectionEnabled) {
            const verdict = await this.turnstileValidator.verify(
              body.captchaToken,
            );
            if (!verdict.success) {
              this.logger.warn(
                `Form ${formId}: Turnstile verify failed (${(verdict.errorCodes ?? []).join(',')}) — rejecting submission.`,
              );
              throw new HttpException(
                {
                  message: 'Bot protection check failed',
                  errors: {
                    captchaToken: 'Invalid or missing Turnstile token',
                  },
                },
                HttpStatus.FORBIDDEN,
              );
            }
          }

          // Server-side field validation
          const fieldsConfig = Array.isArray(form.fieldsConfig)
            ? form.fieldsConfig
            : [];

          const validationErrors = this.formSubmissionService.validateFields(
            fieldsConfig as unknown[],
            body.fields ?? {},
          );

          if (validationErrors.length > 0) {
            throw new HttpException(
              {
                message: 'Validation failed',
                errors: validationErrors,
              },
              HttpStatus.BAD_REQUEST,
            );
          }

          const submissionRepository =
            await this.globalWorkspaceOrmManager.getRepository<FormSubmissionWorkspaceEntity>(
              workspaceId,
              'formSubmission',
              { shouldBypassPermissionChecks: true },
            );

          const submission = await submissionRepository.save({
            data: body.fields ?? {},
            submitterEmail: body.submitterEmail ?? null,
            submitterName: body.submitterName ?? null,
            source: 'DIRECT',
            formId: form.id,
          });

          await formRepository.increment({ id: formId }, 'submissionCount', 1);

          // Send notification email (async, non-blocking)
          this.formSubmissionService
            .sendNotificationEmail(form, body.fields ?? {})
            .catch(() => {});

          // Send confirmation email to submitter (async, non-blocking)
          if (isDefined(body.submitterEmail)) {
            this.formSubmissionService
              .sendConfirmationEmail(form, body.submitterEmail)
              .catch(() => {});
          }

          // Auto-create Person from submission. Convention-based field mapping —
          // any submitted value whose key looks like an email/name/phone/etc. flows
          // into a LeadInput. Gated on the per-form `autoCreatePerson` flag
          // (default true) so a workspace can opt specific forms out of lead
          // auto-creation. The flag was added in PR 30; defaults to true for
          // existing rows so behavior is unchanged unless the user opts out.
          const autoCreatePerson =
            (form as { autoCreatePerson?: boolean | null }).autoCreatePerson ??
            true;
          let personId: string | null = null;
          if (autoCreatePerson) {
            const submissionValues: Record<string, unknown> = {
              ...(body.fields ?? {}),
              ...(body.submitterEmail ? { email: body.submitterEmail } : {}),
              ...(body.submitterName ? { firstName: body.submitterName } : {}),
            };
            const leadInput = mapFieldsToLeadInput(submissionValues);
            if (leadInput) {
              // Per-form tag policy: tags configured on the Form get
              // merged into the new (or existing) Person's tags array.
              const formTags = Array.isArray(
                (form as { tagsToApplyOnSubmission?: string[] | null })
                  .tagsToApplyOnSubmission,
              )
                ? (((form as { tagsToApplyOnSubmission?: string[] | null })
                    .tagsToApplyOnSubmission ?? []) as string[])
                : [];
              try {
                const lead = await this.leadCreationService.findOrCreatePerson(
                  workspaceId,
                  {
                    ...leadInput,
                    source: leadInput.source ?? 'FORM',
                    tags: formTags.length > 0 ? formTags : undefined,
                  },
                );
                personId = lead.personId;
              } catch (error) {
                this.logger.error(
                  `Form ${formId}: lead auto-create failed — ${(error as Error).message}`,
                );
              }
            }
          }

          return {
            success: true,
            submissionId: submission.id,
            personId,
            thankYouMessage: form.thankYouMessage,
            redirectUrl: form.redirectUrl,
          };
        },
        authContext,
      );

    this.logger.log(
      `Form submission received for form ${formId} in workspace ${workspaceId}`,
    );

    return result;
  }

  private async validateWorkspace(workspaceId: string): Promise<void> {
    const workspaceExists = await this.workspaceRepository.existsBy({
      id: workspaceId,
    });

    if (!workspaceExists) {
      throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);
    }
  }
}
