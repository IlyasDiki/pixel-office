create extension if not exists pg_cron;

select cron.schedule(
  'auto-checkout-malam',
  '0 13 * * *',   -- 13:00 UTC = 20:00 WIB
  $$ update public.attendance set checked_out_at = now() where checked_out_at is null $$
);