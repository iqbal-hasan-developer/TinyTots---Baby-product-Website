create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  city text,
  delivery_zone text not null,
  delivery_fee integer not null,
  payment_method text not null,
  subtotal integer not null,
  total integer not null,
  status text not null default 'pending',
  payment_status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_delivery_zone_check check (delivery_zone in ('inside', 'outside')),
  constraint orders_delivery_fee_check check (delivery_fee >= 0),
  constraint orders_payment_method_check check (payment_method in ('cod', 'bkash', 'nagad')),
  constraint orders_subtotal_check check (subtotal >= 0),
  constraint orders_total_check check (total >= 0),
  constraint orders_status_check check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  constraint orders_payment_status_check check (payment_status in ('pending', 'paid', 'failed', 'refunded'))
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  product_slug text,
  sku text,
  product_name text not null,
  quantity integer not null,
  unit_price integer not null,
  line_total integer not null,
  created_at timestamptz not null default now(),
  constraint order_items_quantity_check check (quantity > 0),
  constraint order_items_unit_price_check check (unit_price >= 0),
  constraint order_items_line_total_check check (line_total >= 0)
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

comment on table public.orders is
  'Customer orders created only by the Next.js server route using the Supabase service role key. No public read or insert policies are defined.';

comment on table public.order_items is
  'Line items for orders. Access is intentionally server-side only until an admin/order-management phase adds protected policies.';
