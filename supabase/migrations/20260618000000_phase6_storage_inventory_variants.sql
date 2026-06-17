alter table public.products
  add column if not exists track_inventory boolean not null default false;

alter table public.products
  add column if not exists stock_quantity integer not null default 0;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_stock_quantity_check'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_stock_quantity_check
      check (stock_quantity >= 0);
  end if;
end $$;

create index if not exists products_inventory_idx
  on public.products (track_inventory, stock_quantity);

alter table public.order_items
  add column if not exists selected_variants jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'order_items_selected_variants_array_check'
      and conrelid = 'public.order_items'::regclass
  ) then
    alter table public.order_items
      add constraint order_items_selected_variants_array_check
      check (jsonb_typeof(selected_variants) = 'array');
  end if;
end $$;

create index if not exists order_items_selected_variants_gin_idx
  on public.order_items
  using gin (selected_variants);

update public.products
set variants = '[
  {
    "id": "size",
    "name": "Size",
    "values": [
      { "id": "newborn", "label": "Newborn", "skuSuffix": "NB" },
      { "id": "0-3-months", "label": "0-3 months", "skuSuffix": "03" }
    ]
  }
]'::jsonb
where slug = 'organic-cotton-sleepsuit';

update public.products
set variants = '[
  {
    "id": "pack-size",
    "name": "Pack size",
    "values": [
      { "id": "small", "label": "Small (3-8 kg)" }
    ]
  }
]'::jsonb
where slug = 'premium-comfort-diaper-small';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects
for select
to public
using (bucket_id = 'product-images');

create or replace function public.create_order_with_inventory(
  order_payload jsonb,
  items_payload jsonb
)
returns table (
  id uuid,
  order_number text,
  subtotal integer,
  delivery_fee integer,
  total integer,
  payment_method text,
  status text,
  payment_status text
)
language plpgsql
as $$
declare
  new_order_id uuid;
  item jsonb;
  current_product public.products%rowtype;
  item_product_id uuid;
  item_qty integer;
  next_stock_quantity integer;
begin
  insert into public.orders (
    order_number,
    customer_name,
    phone,
    email,
    address,
    city,
    delivery_zone,
    delivery_fee,
    payment_method,
    subtotal,
    total,
    status,
    payment_status,
    notes
  )
  values (
    order_payload->>'order_number',
    order_payload->>'customer_name',
    order_payload->>'phone',
    nullif(order_payload->>'email', ''),
    order_payload->>'address',
    nullif(order_payload->>'city', ''),
    order_payload->>'delivery_zone',
    (order_payload->>'delivery_fee')::integer,
    order_payload->>'payment_method',
    (order_payload->>'subtotal')::integer,
    (order_payload->>'total')::integer,
    order_payload->>'status',
    order_payload->>'payment_status',
    nullif(order_payload->>'notes', '')
  )
  returning orders.id into new_order_id;

  for item in
    select value
    from jsonb_array_elements(items_payload)
  loop
    item_product_id := (item->>'product_id')::uuid;
    item_qty := (item->>'quantity')::integer;

    if item_qty is null or item_qty <= 0 then
      raise exception 'Invalid item quantity.';
    end if;

    select *
    into current_product
    from public.products
    where products.id = item_product_id
    for update;

    if not found or not current_product.is_active then
      raise exception 'One or more products are no longer available.';
    end if;

    if current_product.stock_status = 'out_of_stock' then
      raise exception 'One or more products are out of stock.';
    end if;

    if current_product.track_inventory then
      if current_product.stock_quantity < item_qty then
        raise exception 'Requested quantity exceeds available stock.';
      end if;

      next_stock_quantity := current_product.stock_quantity - item_qty;

      update public.products
      set
        stock_quantity = next_stock_quantity,
        stock_status = case
          when current_product.stock_status = 'preorder' then current_product.stock_status
          when next_stock_quantity <= 0 then 'out_of_stock'
          when next_stock_quantity <= 5 then 'low_stock'
          else 'in_stock'
        end
      where products.id = current_product.id;
    end if;

    insert into public.order_items (
      order_id,
      product_id,
      product_slug,
      sku,
      product_name,
      quantity,
      unit_price,
      line_total,
      selected_variants
    )
    values (
      new_order_id,
      item->>'product_id',
      nullif(item->>'product_slug', ''),
      nullif(item->>'sku', ''),
      item->>'product_name',
      item_qty,
      (item->>'unit_price')::integer,
      (item->>'line_total')::integer,
      coalesce(item->'selected_variants', '[]'::jsonb)
    );
  end loop;

  return query
  select
    orders.id,
    orders.order_number,
    orders.subtotal,
    orders.delivery_fee,
    orders.total,
    orders.payment_method,
    orders.status,
    orders.payment_status
  from public.orders
  where orders.id = new_order_id;
end;
$$;

revoke all on function public.create_order_with_inventory(jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.create_order_with_inventory(jsonb, jsonb) to service_role;

comment on function public.create_order_with_inventory(jsonb, jsonb) is
  'Creates an order, writes its order_items, and decrements tracked inventory inside a single database transaction. It is called only by the protected Next.js order route through the Supabase service role client.';
