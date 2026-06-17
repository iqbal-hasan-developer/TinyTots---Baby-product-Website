alter table public.orders
  drop constraint if exists orders_payment_status_check;

alter table public.orders
  add constraint orders_payment_status_check
  check (payment_status in ('pending', 'verified', 'paid', 'failed', 'refunded'));

comment on constraint orders_payment_status_check on public.orders is
  'Allows admins to mark manual bKash/Nagad payments as verified. Orders remain protected by RLS and server-side service-role access.';
