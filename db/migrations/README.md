# Database migrations

Idempotent SQL migrations for Supabase (PostgreSQL). Run in numeric order.

## Prerequisites

- `auth.users` exists (Supabase Auth).
- Baseline project tables like `public.payments` from `supabase-payments-migration.sql` if you are extending an existing deployment.

## Apply with Supabase CLI

```bash
supabase db push
# or run a single file against the linked project:
supabase db execute --file db/migrations/001_create_user_profiles_and_roles.sql
supabase db execute --file db/migrations/002_payments_bookings_transfers.sql
```

## Apply with psql

```bash
psql "$DATABASE_URL" -f db/migrations/001_create_user_profiles_and_roles.sql
psql "$DATABASE_URL" -f db/migrations/002_payments_bookings_transfers.sql
```

Use the connection string from Supabase: **Project Settings → Database → Connection string → URI**.

## Local verification

After migrations, confirm tables and columns in the Supabase SQL editor:

```sql
select column_name, data_type, column_default
from information_schema.columns
where table_schema = 'public' and table_name in ('user_profiles', 'payments', 'transfer_bookings')
order by table_name, ordinal_position;
```

## Local API checks (after configuring env and migrations)

1. Run the backend: `npm run dev:server`
2. **Health:** open `GET http://localhost:3001/api/health` — with valid env, `supabaseClientReady` should be `true`.
3. **Supabase unset:** remove `SUPABASE_URL` / `VITE_SUPABASE_URL` — `supabaseEnvPresent` becomes `false`; routes that require a database return HTTP 503 with a clear JSON message.
4. **Transfer booking (POST JSON):** POST to `/api/book-transfer` with `pickupDate`, `routeFrom`, `routeTo`, `vehicleName`, `fullName`, `email` (see `server/server.js` for full body).
5. Authenticated booking routes need `Authorization: Bearer` with a Supabase access token. Admin actions use `user_metadata.role === 'admin'` or a matching row in `public.user_profiles`.

## Notes / risks

- Older RLS policies in `supabase-bookings-only.sql` may still reference `email LIKE '%admin%'`; tighten those separately to use `user_profiles.role` or JWT claims.
- Paymob: if your merchant integration only supports EGP/USD, set `PAYMOB_CURRENCY` in env to match (`SAR` is the default intended for USD→SAR flow).
