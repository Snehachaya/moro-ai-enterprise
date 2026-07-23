# MoroAI Enterprise Production Deployment

## Architecture

- React/Vite/TypeScript frontend on Vercel.
- Supabase Auth, PostgreSQL, Row Level Security, Storage, and Edge Functions.
- Supabase Auth sends signup, verification, recovery, change-email, and invitation messages through a custom SMTP relay.
- SMTP credentials are server secrets. They must never use a `VITE_` prefix or appear in browser code.

The application is provider-neutral. Resend, Brevo, SendGrid, Amazon SES, and any standards-compliant SMTP relay work through the same host, port, username, password, sender address, and sender-name fields.

## 1. Create and link Supabase

1. Create a production project in Supabase.
2. Record the Project URL and publishable/anon key.
3. Install the Supabase CLI and authenticate.
4. Run:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
supabase functions deploy invite-member
```

5. Store `APP_URL=https://moro-ai-enterprise.vercel.app` as an Edge Function secret. `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are supplied by Supabase to deployed functions.

The enterprise migration creates organization ownership, constrained roles, invitations, audit events, soft deletion, role-aware entity policies, and a one-time server-controlled 30-day trial function. Test the migration in staging before production.

## 2. Configure authentication URLs

Open Supabase Dashboard → Authentication → URL Configuration.

- Site URL: `https://moro-ai-enterprise.vercel.app`
- Allowed redirects:
  - `https://moro-ai-enterprise.vercel.app/auth/callback`
  - `https://moro-ai-enterprise.vercel.app/auth/reset-password`
  - `http://localhost:5173/**` for local development

After adding a custom domain, make it the canonical Site URL and add the equivalent callback/reset paths. Keep preview-domain wildcards narrow and separate from production.

## 3. Configure custom SMTP

Open Supabase Dashboard → Authentication → SMTP Settings (the label may appear as Emails/SMTP or Custom SMTP).

1. Enable custom SMTP.
2. Enter sender email and sender name.
3. Enter provider host, port, username, and password.
4. Save and send a test message.
5. Review Authentication → Rate Limits and size limits for expected signup, recovery, and invitation traffic.

Provider notes:

- Resend: simple setup and good developer experience.
- Brevo: suitable for transactional email plus broader messaging needs.
- SendGrid: mature delivery and analytics.
- Amazon SES: lowest high-volume unit cost, but requires more DNS, IAM, reputation, and operations work.
- Generic SMTP: supported when it provides TLS, authenticated relay, and reliable bounce handling.

Use a dedicated transactional subdomain such as `auth.example.com`. Publish SPF and DKIM records supplied by the provider, and a DMARC policy. Disable click/open tracking for authentication messages because rewritten links can break verification tokens. Use separate credentials for marketing mail.

Managed Supabase does not read `SMTP_*` variables from the Vercel frontend. The Dashboard configuration above is what replaces Supabase’s default rate-limited mail service.

## 4. Configure email templates

In Supabase Dashboard → Authentication → Email Templates, review:

- Confirm signup
- Reset password
- Invite user
- Change email

Use Supabase template variables such as `{{ .ConfirmationURL }}`. Keep the copy short, include link-expiry guidance, and provide a support contact. Test valid, expired, already-used, and tampered links.

## 5. Configure Vercel

Import `Snehachaya/moro-ai-enterprise`.

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Production branch: `main`

Add Production and Preview variables separately:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_APP_URL
```

Do not add SMTP passwords or the Supabase service-role key to a Vite variable. Redeploy after changing environment variables.

## 6. Domain and DNS

1. Add the domain in Vercel Project → Settings → Domains.
2. Apply the CNAME/A records Vercel provides.
3. Wait for TLS certificate issuance.
4. Update Supabase Site URL and redirect allow-list.
5. Retest every email flow on the final domain.

## 7. Authentication flow

1. Signup captures a person and organization name.
2. Supabase sends verification through custom SMTP.
3. `/auth/callback` exchanges the PKCE code and handles invalid or expired links.
4. The database trigger creates the organization and owner membership.
5. Owners/admins invite members through the secured Edge Function.
6. Forgot password sends a recovery link to `/auth/reset-password`.
7. Password reset validates the recovery session, changes the password, and signs out existing sessions.
8. Supabase restores and refreshes valid sessions; RLS remains the authorization boundary.

## 8. Security checklist

- [ ] No service-role or SMTP secret appears in the Vite bundle.
- [ ] RLS is enabled on every tenant table.
- [ ] Test two users in two organizations and confirm cross-tenant reads/writes fail.
- [ ] Members cannot alter authoritative roles or ownership fields.
- [ ] A module trial cannot be restarted or extended from the REST API.
- [ ] Edge Functions validate JWT, origin, method, content type, role, and request body.
- [ ] SMTP SPF/DKIM/DMARC pass.
- [ ] Auth rate limits, bounce alerts, and provider spend limits are configured.
- [ ] Database backups/PITR and restore procedures are tested.
- [ ] Dependency audit, logs, alerting, key rotation, rollback, and incident contacts are documented.

Bearer-token APIs are not normally vulnerable to cookie-based CSRF. If cookie authentication is added later, implement SameSite cookies plus CSRF tokens. Edge Functions must still validate the `Origin` header and authorization token.

## 9. Functional test checklist

- Signup, duplicate signup, weak password, and unverified login.
- Verification success, resend, cooldown, expired/used/tampered links.
- Valid and unknown-email login behavior without account enumeration.
- Forgot password for known and unknown addresses with identical UI response.
- Valid, expired, used, and tampered recovery links.
- Local/session-only and remembered login, refresh, multi-tab behavior, token refresh, and logout.
- Organization creation and owner assignment.
- Admin invite, resend, revoke, expired invite, wrong-account acceptance, and replay.
- Owner/admin/member/viewer permissions.
- Cross-organization database and Storage denial tests.
- Trial start once, expiry, and attempts to alter dates directly.
- Desktop, tablet, mobile Safari, and mobile Chrome.
- Deep-link refreshes on Vercel.

## 10. Cost and scaling recommendation

These are planning estimates as of July 2026; confirm current vendor pricing and actual storage/egress before purchase. Assumption: approximately five authentication emails per monthly active user and client-side ML inference.

| Users | Recommended baseline | Approximate monthly planning range |
|---:|---|---:|
| 100 | Vercel Pro, Supabase Pro, SMTP free tier if sufficient | US$50–100 |
| 500 | Vercel Pro, Supabase Pro, monitored transactional SMTP | US$75–150 |
| 1,000 | Same base plus paid SMTP capacity | US$100–200 |
| 5,000 | Usage-monitored database/storage and ~25k emails | US$150–400 |
| 10,000 | Load testing, observability, spend caps, ~50k emails | US$250–750+ |

Vercel Pro and Supabase Pro are the recommended production floor. Resend is the easiest default; SES becomes attractive at high volume when the team can operate DNS, IAM, reputation, bounces, and complaints. Scale based on database load, Storage, egress, function invocations, and mail volume—not user count alone.

## Future improvements

- Generated Supabase TypeScript database types and contract tests.
- Automated RLS/invitation tests in CI against an ephemeral Supabase project.
- Server-side entitlement enforcement for protected model APIs.
- Centralized structured logging, error correlation IDs, and uptime alerts.
- Invitation resend/revoke UI and organization switcher.
- Passkeys/SSO/MFA and enterprise SCIM when customer requirements justify them.
- A secure BFF with HttpOnly cookies if stronger session-at-rest protection is required.
