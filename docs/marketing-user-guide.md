# Geraci CRM — Marketing User Guide

This guide covers the marketing-automation features added on top of Twenty CRM in the Geraci fork. It assumes you're an admin/user who has access to the workspace at `https://geracillp.crm.geracillp.com`.

---

## 1. Mental model: the 5 objects you'll touch

| Object | What it is | When you create one |
|---|---|---|
| **Campaign** *(MarketingCampaign)* | A container/folder that groups marketing assets together for combined reporting. **Doesn't send anything itself.** | When you start a marketing initiative (e.g. "Q2 Lender Outreach", "March Webinar Promotion"). |
| **Email** *(internally `campaign`)* | A single bulk-send marketing email — one-shot or scheduled. | When you want to send a specific message to a recipient list. |
| **Sequence** | A multi-step drip cadence. Each enrolled person gets the steps relative to their enrollment date. | When you want a nurture flow that fires automatically as people sign up. |
| **Form** | A web form you can embed on any site to capture leads. Submissions auto-create Person records. | When you need a lead-capture form (webinar signup, contact form, content gate). |
| **Person** | A contact record. Built into Twenty. | Manually, via form submission, via inbound webhook, or via import. |

**Mental shortcut:** Campaign = container. Email/Sequence/Form = the things that actually do work. Person = who you're talking to.

---

## 2. How they relate

```
┌────────────────────────────────────┐
│   Campaign (MarketingCampaign)     │  ← reports total opens/clicks/etc.
│   "Q2 Lender Outreach"             │
└──┬──────────┬──────────┬───────────┘
   │          │          │
   ▼          ▼          ▼
 Email     Sequence    Form
 (×3)        (×1)      (×1)
   │          │          │
   ▼          ▼          ▼
 Person   Person     Person
 (recipients) (enrollees) (submitters)
```

- One Campaign holds many Emails / Sequences / Forms (one-to-many — each asset belongs to ONE Campaign at a time)
- Stats roll up automatically (cron every 10 min) so the Campaign shows totals across all attached assets

---

## 3. Common workflows

### A. Send a one-off marketing email

You don't strictly need a Campaign for this — but it's recommended for reporting.

1. **Sidebar → Email → + New Email**
2. Fill in: `name`, `subject`, `bodyHtml` (use `{{ contact.firstName }}` etc. for personalization)
3. Set `fromEmail` and `fromName` *(or leave blank to inherit from Campaign)*
4. *(Optional)* Set `marketingCampaign` to link to a Campaign for rolled-up reporting
5. Add recipients via the **Recipients** tab → either MANUAL (pick people) or SAVED_VIEW (apply a People view filter)
6. Either:
   - **Send now**: status → SENDING, fires immediately via the email queue
   - **Schedule**: set `scheduledDate`, status → SCHEDULED. The `cron:campaign:schedule-send` cron picks it up at the scheduled time.
7. Status auto-progresses: `SCHEDULED → SENDING → SENT`. Watch open/click counts populate as the SendGrid webhook fires.

### B. Multi-touch campaign with calendar-scheduled emails

Use this for fixed-date sends where the same audience gets a sequence of emails.

1. Create a **Campaign** (e.g. "Q2 Webinar Promotion"), set `defaultFromEmail` to your verified sender
2. Create **3 Emails**, each linked to that Campaign:
   - Email 1: `scheduledDate = 2026-03-01 10:00`
   - Email 2: `scheduledDate = 2026-03-04 10:00`
   - Email 3: `scheduledDate = 2026-03-07 10:00`
3. Add the same recipients to each
4. Set each to `status = SCHEDULED`
5. The cron fires each one at its scheduled time. The Campaign rolls up totals.

### C. Drip nurture sequence (relative to enrollment)

Use this when you want each person to get the steps *relative to when they enter the flow* — e.g. "after they fill the contact form."

1. Create a **Sequence**: name, `status = ACTIVE`, link to a Campaign, optional `fromEmail` override
2. Create **SequenceStep records** linked to the Sequence:

| Field | Step 1 (immediate) | Step 2 (3 days later) | Step 3 (7 days after start) |
|---|---|---|---|
| `stepOrder` | 0 | 1 | 2 |
| `type` | EMAIL | EMAIL | EMAIL |
| `delayDays` | 0 | 3 | 3 *(relative to step 1)* |
| `subject` | "Welcome!" | "Following up..." | "Last call" |
| `bodyHtml` | … | … | … |

3. Enroll people by creating **SequenceEnrollment** records (link a Person to the Sequence). Or programmatically via the `SequenceEnrollmentService`.
4. The `cron:sequence:advance` cron runs every 5 min. For each ACTIVE enrollment, it checks: has `lastStepAt + delayDays` elapsed? If yes → fire next step.
5. Bounces and unsubscribes auto-pause the enrollment. Currently no auto-stop on reply (planned later).

**`delayDays` semantics:** the wait *before* that step. Step 0's delay is from enrollment time; step N's delay (N>0) is from when step N-1 fired.

### D. Web form lead capture

Captures submissions from your own embedded forms.

1. **Sidebar → Forms → + New Form**
2. Use the drag-and-drop builder to add fields (TEXT, EMAIL, NUMBER, SELECT, etc.)
3. **Critical for lead capture:** name an EMAIL field something like `email` (not `EmailAddress` etc.) — see field mapping rules in §5
4. Optionally set: thank-you message, redirect URL, notification email, confirmation email
5. Set `status = PUBLISHED`
6. **Embed it** on any external site:
   ```html
   <iframe src="https://crm.geracillp.com/forms/<workspaceId>/<formId>" 
           width="100%" height="600" frameborder="0"></iframe>
   ```
   You can grab the embed snippet from the form's detail page.
7. **What happens on submit:**
   - A `FormSubmission` record is created
   - **A `Person` record is auto-created** (or the existing one matched by email is reused) — convention-based field mapping
   - Notification email sent (if configured)
   - Confirmation email sent to submitter (if configured)

### E. External lead capture (Wufoo, Typeform, Zapier, your custom site)

For pushing leads from anywhere outside Twenty.

```bash
curl -X POST https://crm.geracillp.com/inbound/leads \
  -H "Authorization: Bearer <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "(555) 123-4567",
    "jobTitle": "VP Lending",
    "city": "Austin",
    "linkedinUrl": "https://linkedin.com/in/janedoe",
    "source": "website-contact-form"
  }'
```

Response:
```json
{ "success": true, "personId": "<uuid>", "created": true }
```

`created: false` means the email matched an existing Person (you got that one back instead of creating a duplicate).

**Field mapping is convention-based** — the body keys can be flexible (`Email`/`email_address`/`primary_email` all work, same for first/last name, phone, etc.). See §5.

**Get an API key:** Settings → Developers → API Keys → Create. Use as `Authorization: Bearer <key>`.

---

## 4. Sender management — critical for compliance

### Verified domains in SendGrid (do this first, before anything sends)

For SendGrid to allow you to send from any address on a domain:

1. SendGrid dashboard → **Sender Authentication → Authenticate Your Domain**
2. Add your domain (e.g. `geracillp.com`)
3. SendGrid gives you DNS records (SPF, DKIM, DMARC alignment)
4. Add those records to your DNS provider
5. Wait for SendGrid to verify (DNS propagation can take hours)
6. Repeat for each sending domain

**Without verified domains, sends fail at the SendGrid API level no matter what you set in CRM.**

### Sender inheritance chain

When sending an Email or Sequence step, the from address is resolved in this order:

```
1. Asset's own fromEmail / fromName       (per-Email or per-Sequence override)
   ↓ if empty
2. Parent Campaign's defaultFromEmail / defaultFromName    (brand-level inheritance)
   ↓ if empty
3. SEQUENCE_FROM_EMAIL / SEQUENCE_FROM_NAME env var       (sequences only — last-resort)
   ↓ if empty
4. SendGrid will reject the send
```

### 4-domain setup (your scenario)

The cleanest pattern: **one Campaign per brand**, each with its own `defaultFromEmail`:

| Campaign | defaultFromEmail | defaultFromName |
|---|---|---|
| Geraci LLP — General | marketing@geracillp.com | Geraci LLP |
| Geraci Conferences | events@geraciconferences.com | Geraci Conferences |
| *(brand 3)* | … | … |
| *(brand 4)* | … | … |

Then drag any Email/Sequence into the right Campaign — sender is automatic. Override per-asset only when one specific email needs a different sender.

### Unsubscribe links (CAN-SPAM compliance)

Every Sequence email automatically gets:
- An unsubscribe link in the body (auto-appended footer if you don't include `{{ unsubscribe_link }}` yourself)
- `List-Unsubscribe` and `List-Unsubscribe-Post` headers (RFC 8058 — required by Gmail/Yahoo bulk-sender rules)

When a recipient clicks the link, their SequenceEnrollment is set to `PAUSED` (won't receive further sequence emails). Hard bounces auto-set status to `BOUNCED`.

**Note:** sequence-driven unsubscribes don't auto-add the address to the global suppression list yet — they only stop the specific sequence. Future improvement.

---

## 5. Field-mapping conventions for lead capture

When a form submission or webhook payload comes in, fields with these names get auto-mapped to the Person record. Matching is **case-insensitive** and ignores spaces/underscores/hyphens.

| Person field | Accepted source-field names |
|---|---|
| `emails.primaryEmail` | email, emailaddress, primaryemail, workemail |
| `name.firstName` | firstname, givenname, fname |
| `name.lastName` | lastname, surname, familyname, lname |
| `phones.primaryPhoneNumber` | phone, phonenumber, primaryphone, mobile, mobilephone, cellphone *(normalized to E.164)* |
| `jobTitle` | jobtitle, title, role, position |
| `city` | city, town |
| `linkedinLink` | linkedin, linkedinurl, linkedinlink, linkedinprofile |
| `xLink` | twitter, twitterhandle, twitterusername, xhandle, xusername |

So `"First Name"`, `"first_name"`, `"firstName"`, `"FNAME"` all map to `name.firstName`. **Email is required** — if no email field is present, the lead is silently skipped.

Phones are normalized: `(555) 123-4567` → `+15551234567`. If the format can't be parsed cleanly, the phone is dropped (the lead still saves without it).

---

## 6. Marketing Analytics

### MarketingCampaign aggregate fields (auto-populated)

These update every 10 minutes via the `cron:marketing-campaign:stats` cron, summing values from related Emails / Forms / Sequences:

| Field | Sum of |
|---|---|
| `emailsSent` | `Email.sentCount` for all attached Emails |
| `emailsOpened` | `Email.openCount` |
| `emailsClicked` | `Email.clickCount` |
| `emailsBounced` | `Email.bounceCount` |
| `emailsUnsubscribed` | `Email.unsubscribeCount` |
| `formSubmissions` | `Form.submissionCount` |
| `sequenceEnrollments` | `Sequence.enrollmentCount` |

### Marketing Analytics dashboard

A dashboard called "Marketing Analytics" is seeded but starts empty. To add charts:

1. **Sidebar → Dashboards → Marketing Analytics**
2. Click **+ Add widget** — pick Bar/Line/Pie chart type
3. Configure source = `Email` or `MarketingCampaign`, metric = whichever counter (sentCount, openCount, etc.), groupBy = whatever dimension you want
4. Save

Useful starter widgets:
- Bar chart: total `emailsSent` per `marketingCampaign` (last 30 days)
- Line chart: `emailsSent` per day across all Email records
- Pie chart: distribution of `emailsBounced` reasons (if you populate them)
- Funnel: `emailsSent → emailsOpened → emailsClicked` over a date range

---

## 7. Operations

### Required environment variables

Set these in the Railway dashboard for the twenty-crm service:

| Variable | Purpose | Example |
|---|---|---|
| `SENDGRID_API_KEY` | SendGrid API access for sending | `SG.xxxxx` |
| `SENDGRID_WEBHOOK_VERIFICATION_KEY` | Verifies inbound bounce/open/click events from SendGrid | *(from SendGrid event settings)* |
| `SERVER_URL` | Used to generate unsubscribe URLs in email footers | `https://crm.geracillp.com` |
| `SEQUENCE_FROM_EMAIL` | Last-resort sender if neither Sequence nor Campaign has one | `noreply@geracillp.com` |
| `SEQUENCE_FROM_NAME` | Last-resort sender display name | `Geraci LLP` |
| `CAMPAIGN_UNSUBSCRIBE_HMAC_SECRET` | Signs unsubscribe URLs (any random string, just keep it stable) | *(random 32+ chars)* |

### Cron schedule

These auto-register on every Railway deploy via `cron:register:all`:

| Cron | Pattern | What it does |
|---|---|---|
| `CampaignScheduleSend` | `*/5 * * * *` | Every 5 min, finds Email records with status=SCHEDULED whose scheduledDate has passed, enqueues them for sending |
| `SequenceAdvance` | `*/5 * * * *` | Every 5 min, finds active SequenceEnrollments whose next step is due, enqueues them for execution |
| `MarketingCampaignStats` | `*/10 * * * *` | Every 10 min, recomputes aggregate counts on every MarketingCampaign by summing related Email/Form/Sequence stats |

### SendGrid webhook setup (for tracking opens/clicks/bounces)

1. SendGrid → **Settings → Mail Settings → Event Webhook**
2. Set **HTTP POST URL** to `https://crm.geracillp.com/campaign-webhooks/sendgrid`
3. Enable: Delivered, Open, Click, Bounce, Spam Report, Unsubscribe
4. Copy the **Verification Key** to the `SENDGRID_WEBHOOK_VERIFICATION_KEY` env var
5. Save

Without this, sends still go out but you won't see open/click/bounce stats populate.

### Manually re-register a cron (rarely needed)

Crons persist in Redis across deploys. You only need to re-register if Redis is wiped. Open Railway shell on the twenty-crm service and run:

```bash
node dist/command/command cron:campaign:schedule-send
node dist/command/command cron:sequence:advance
node dist/command/command cron:marketing-campaign:stats
```

---

## 8. Troubleshooting

### "My scheduled email didn't send"

Check in order:
1. Is the Email's status `SCHEDULED` (not `DRAFT`)?
2. Is `scheduledDate` in the past?
3. Are there recipients with `status = PENDING`?
4. Look at Railway logs for `Starting CampaignScheduleSendCronJob` — confirms the cron is firing
5. SendGrid env vars set?
6. SendGrid sender domain verified?

### "My form submission didn't create a Person"

1. Does the form have a field whose name matches the email convention (e.g. `email`)? See §5
2. Was the field actually filled in by the submitter?
3. If yes to both, check Railway logs for `Form ${formId}: lead auto-create failed` — there'll be an error message
4. The FormSubmission still saves even if Person creation fails — check the Form Submissions tab for the raw data

### "Stats aren't updating on my Campaign"

1. Wait 10 minutes — the cron runs every 10 min
2. Check Railway logs for `Starting MarketingCampaignStatsCronJob` and `Recomputed stats for N MarketingCampaign(s)`
3. Make sure your Emails/Forms/Sequences actually have their `marketingCampaign` field set to point to the Campaign
4. Verify the underlying counts on the assets themselves — if `Email.sentCount` is 0, the Campaign's `emailsSent` will also be 0

### "My sequence didn't advance"

1. Is the Sequence's status `ACTIVE`?
2. Is the SequenceEnrollment's status `ACTIVE`?
3. Has `delayDays` actually elapsed since `lastStepAt` (or `enrolledAt` for step 0)?
4. Does the SequenceStep at `currentStepIndex` actually exist?
5. If `type=EMAIL`, does the enrolled Person have a primary email?
6. Check Railway logs for `Starting SequenceAdvanceCronJob` — confirms the cron is firing
7. Look for log lines about your specific enrollment ID

### "Inbound webhook returns 401"

API key issue:
1. Confirm Settings → Developers → API Keys shows your key as active (not revoked, not expired)
2. Header format: `Authorization: Bearer <key>` — note the space after `Bearer`
3. Key shouldn't have trailing whitespace

### "Inbound webhook returns 400 'must include an email field'"

Your payload doesn't have a recognized email field. See §5 for accepted field names. Easiest fix: send `{"email": "..."}` literally.

---

## 9. Known limitations / future work

- **No custom Sequence cadence editor UI yet** — you create Sequence + SequenceStep records via Twenty's standard record-edit forms. Functional but less polished than HubSpot's drag-reorder cadence builder.
- **MarketingCampaign uses MANY_TO_ONE relations**, not true many-to-many. Each Email/Form/Sequence belongs to exactly one Campaign. HubSpot allows one asset under multiple Campaigns; we don't yet.
- **Reverse relation field on MarketingCampaign is named `email` (singular)** instead of `emails`. Cosmetic — doesn't affect functionality but the field label may look odd in the UI.
- **No rolled-up stats panel as a custom widget** on the Campaign detail — the aggregate fields show up as standard fields in the right-side panel.
- **Marketing Analytics dashboard is empty** — you add widgets manually via the dashboard UI. Could ship pre-built widgets later.
- **Sequences don't auto-stop on reply** — only on bounce or unsubscribe. Reply detection would require message-stream integration.
- **Sequence-driven unsubscribes don't add to the global campaign suppression list** — they only stop that one sequence. Future cleanup.
- **No per-form "auto-create Person on submit" toggle** — currently always-on if the form has an email field. To opt out, omit the email field from the form (then submissions become FormSubmissions only).
- **Drip Campaign entity exists but is workflow-driven**, not exposed in this guide. Use Sequences for most multi-step flows.

---

## 10. Where to ask for help

- **The codebase:** all marketing modules live under `packages/twenty-server/src/modules/` — `campaign/`, `sales-sequence/`, `marketing-campaign/`, `lead/`, `form/`
- **Memory files** at `C:\Users\afger\.claude\projects\c--Users-afger-twenty-crm\memory\` document deploy quirks, Twenty API gotchas, and the phase 1 build history
