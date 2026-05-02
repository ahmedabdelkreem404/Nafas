# Nafas Production Launch Readiness

This checklist is for staging or production deployment only. Do not place real secrets, payment destinations, or admin passwords in Git.

## 1. Git Baseline

- Deploy from `restored-2026-04-29-2100` or a reviewed release branch merged into it.
- Confirm the deployed commit hash before running migrations.
- Confirm `git status --short` is clean on the deployment checkout.

## 2. Required Environment

Backend:

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://api.your-domain.example`
- `FRONTEND_URL=https://your-domain.example`
- `SANCTUM_STATEFUL_DOMAINS=your-domain.example`
- `SESSION_DOMAIN=.your-domain.example` when using a shared root domain
- `FILESYSTEM_DISK=local`
- `QUEUE_CONNECTION=database` or the intended production queue driver

Frontend:

- `VITE_API_BASE_URL=https://api.your-domain.example/api`
- `VITE_WHATSAPP_URL` set to the real support/order link
- `VITE_VODAFONE_CASH_NUMBER` set on server only
- `VITE_INSTAPAY_HANDLE` set on server only
- `VITE_GA_MEASUREMENT_ID` optional tracking placeholder
- `VITE_META_PIXEL_ID` optional tracking placeholder

## 3. Database

- Take a database backup before migrations.
- Run `php artisan migrate --force` only on the intended deployment database.
- Run `php artisan migrate:status` after migration.
- Confirm no local QA admin users are present in production data.

## 4. Storage

- Payment proofs must remain private on the backend local disk.
- Confirm `storage/app/private` and Laravel storage paths are writable by the app user.
- Confirm admin proof download works only after admin authentication.
- Do not expose payment proof paths via public storage symlinks.

## 5. Admin Access

- Use a strong, unique production admin password.
- Disable or remove any local-only seeded admin account before launch.
- Confirm admin routes reject unauthenticated requests.

## 6. Mail and Notifications

- Configure production SMTP or document the operational fallback.
- Confirm order confirmation messages are delivered, queued, or intentionally handled manually.
- Confirm failed notification delivery does not block checkout.

## 7. Cache and Build

- Backend:
  - `php artisan config:clear`
  - `php artisan route:list`
  - `php artisan test` on staging before production release
- Frontend:
  - Build with production frontend env values.
  - `npm run build`
  - Serve only the generated `dist` output.

## 8. Post-Deploy Smoke

Customer:

- Home
- Shop
- Product detail
- Cart add/update
- COD order
- Vodafone Cash order with reference and proof
- Instapay order with reference and proof
- Coupon submit-time behavior
- Order confirmation payment details

Admin:

- Admin login
- Orders list
- Order detail
- Payment approve/reject
- Proof download
- Status update to confirmed
- Admin notes save

Security:

- Cart responses and `localStorage.nafas_cart` do not expose internal fields.
- Public order responses do not expose internal costs, formulas, suppliers, proof paths, or admin notes.
- Hidden/R&D products do not appear publicly.

## 9. Known Non-Blocking Follow-Up

- Vite currently reports large JavaScript chunks due 3D/media-heavy UI. This is not a limited-launch blocker, but should be handled in a later performance pass with route-level and component-level splitting, asset review, and Lighthouse testing.
