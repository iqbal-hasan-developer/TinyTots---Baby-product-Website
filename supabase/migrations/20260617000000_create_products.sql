create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  slug text unique not null,
  name_en text not null,
  name_bn text,
  short_description_en text,
  short_description_bn text,
  description_en text,
  description_bn text,
  category text not null,
  price integer not null,
  old_price integer,
  badge text,
  featured boolean not null default false,
  stock_status text not null default 'in_stock',
  images jsonb not null default '[]'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  variants jsonb not null default '[]'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_price_check check (price >= 0),
  constraint products_old_price_check check (old_price is null or old_price >= 0),
  constraint products_stock_status_check check (stock_status in ('in_stock', 'low_stock', 'out_of_stock', 'preorder')),
  constraint products_images_array_check check (jsonb_typeof(images) = 'array'),
  constraint products_tags_array_check check (jsonb_typeof(tags) = 'array'),
  constraint products_variants_array_check check (jsonb_typeof(variants) = 'array'),
  constraint products_seo_object_check check (jsonb_typeof(seo) = 'object')
);

create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_featured_idx on public.products (featured);
create index if not exists products_is_active_idx on public.products (is_active);
create index if not exists products_created_at_idx on public.products (created_at desc);

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

alter table public.products enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
to anon, authenticated
using (is_active = true);

comment on table public.products is
  'Products are publicly readable only when active. Product writes are performed by protected Next.js admin routes using the Supabase service-role client after admin allowlist verification.';

insert into public.products (
  id,
  sku,
  slug,
  name_en,
  short_description_en,
  description_en,
  category,
  price,
  old_price,
  badge,
  featured,
  stock_status,
  images,
  tags,
  variants,
  seo,
  is_active,
  sort_order
) values
  (
    '11111111-1111-4111-8111-111111111111',
    'TT-CL-SLEEP-001',
    'organic-cotton-sleepsuit',
    'Organic Cotton Newborn Sleepsuit',
    'Soft breathable cotton sleepsuit for newborn comfort in Bangladesh weather.',
    'Made with soft organic cotton, this newborn sleepsuit keeps your baby comfortable during naps, night sleep, and daily wear. The gentle fabric is suitable for sensitive skin and easy for parents to change.',
    'Clothing',
    1250,
    1450,
    '15% OFF',
    true,
    'in_stock',
    '["/products/Organic Cotton Newborn Sleepsuit.png", "/products/Organic Cotton Newborn Sleepsuit2.png", "/products/Organic Cotton Newborn Sleepsuit3.png"]'::jsonb,
    '["newborn", "clothing", "organic cotton", "sleepwear"]'::jsonb,
    '[{"id":"newborn","name":"Newborn","sku":"TT-CL-SLEEP-001-NB","stockStatus":"in-stock"},{"id":"0-3-months","name":"0-3 months","sku":"TT-CL-SLEEP-001-03","stockStatus":"in-stock"}]'::jsonb,
    '{"title":"Organic Cotton Newborn Sleepsuit | TinyTots BD","description":"Soft organic cotton newborn sleepsuit for comfortable daily baby wear in Bangladesh."}'::jsonb,
    true,
    10
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'TT-SKIN-LOT-002',
    'gentle-baby-lotion',
    'Gentle Baby Moisturizing Lotion',
    'Daily baby lotion for soft, hydrated skin after bath time.',
    'A lightweight moisturizing lotion for everyday baby skincare. It absorbs quickly, feels gentle on delicate skin, and is a practical choice for hot and humid months.',
    'Skincare',
    650,
    850,
    'New',
    true,
    'in_stock',
    '["/products/Gentle-baby-moisturizing-lotion.png", "/products/Gentle-baby-moisturizing-lotion2.png", "/products/Gentle-baby-moisturizing-lotion3.png"]'::jsonb,
    '["skincare", "lotion", "bath time", "sensitive skin"]'::jsonb,
    '[]'::jsonb,
    '{"title":"Gentle Baby Moisturizing Lotion | TinyTots BD","description":"Daily baby lotion for soft, hydrated skin after bath time."}'::jsonb,
    true,
    20
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'TT-DIA-PREM-S',
    'premium-comfort-diaper-small',
    'PremiumComfort Diaper Pack - Small',
    'Ultra-absorbent diapers for babies weighing 3-8 kg.',
    'Designed for day and night use, this diaper pack helps keep babies dry and comfortable for longer. The small size is suitable for babies weighing 3-8 kg.',
    'Diapers',
    1250,
    1450,
    'Best Seller',
    true,
    'in_stock',
    '["/products/PremiumComfort-Diaper-Pack-Small.png", "/products/PremiumComfort-Diaper-Pack-Small2.png", "/products/PremiumComfort-Diaper-Pack-Small3.png", "/products/PremiumComfort-Diaper-Pack-Small4.png"]'::jsonb,
    '["diapers", "small", "3-8kg", "best seller"]'::jsonb,
    '[{"id":"small","name":"Small (3-8 kg)","sku":"TT-DIA-PREM-S","stockStatus":"in-stock"}]'::jsonb,
    '{"title":"PremiumComfort Diaper Pack Small | TinyTots BD","description":"Ultra-absorbent small diaper pack for babies weighing 3-8 kg."}'::jsonb,
    true,
    30
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'TT-DIA-WIPES-080',
    'organic-oat-baby-wipes',
    'Organic Oat Baby Wipes - 80 pcs',
    'Fragrance-free wipes for diaper changes, hands, and face.',
    'These organic oat baby wipes are gentle enough for sensitive skin and useful for diaper changes, travel, and quick cleanups at home.',
    'Diapers',
    450,
    550,
    'Organic',
    false,
    'in_stock',
    '["/products/Organic-Oat-Baby-Wipes-80 pcs.png"]'::jsonb,
    '["wipes", "diapers", "organic oat", "fragrance free"]'::jsonb,
    '[]'::jsonb,
    '{"title":"Organic Oat Baby Wipes 80 pcs | TinyTots BD","description":"Fragrance-free baby wipes for diaper changes, hands, face, and travel."}'::jsonb,
    true,
    40
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'TT-TOY-TEETHER-005',
    'natural-wooden-teether',
    'Natural Wooden Teether Ring',
    'Chemical-free teether for soothing sore gums during teething.',
    'A simple wooden teether ring made for little hands to hold easily. It helps soothe gums during teething and fits naturally into a baby essentials kit.',
    'Toys',
    450,
    520,
    'Safe',
    true,
    'in_stock',
    '["/products/Natural-Wooden-Teether-Ring.png", "/products/Natural-Wooden-Teether-Ring1.png", "/products/Natural-Wooden-Teether-Ring2.png"]'::jsonb,
    '["toys", "teether", "wooden", "safe"]'::jsonb,
    '[]'::jsonb,
    '{"title":"Natural Wooden Teether Ring | TinyTots BD","description":"Chemical-free wooden baby teether for soothing sore gums."}'::jsonb,
    true,
    50
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    'TT-FEED-BOTTLE-006',
    'stainless-steel-feeding-bottle',
    'Stainless Steel Feeding Bottle',
    'Durable feeding bottle for safe everyday use.',
    'This BPA-free stainless steel feeding bottle is durable, easy to clean, and convenient for daily feeding routines at home or while travelling.',
    'Feeding',
    850,
    990,
    'Popular',
    true,
    'in_stock',
    '["/products/BPA-Free-Stainless-Steel-Feeding-Bottle.png"]'::jsonb,
    '["feeding", "bottle", "bpa free", "travel"]'::jsonb,
    '[]'::jsonb,
    '{"title":"Stainless Steel Feeding Bottle | TinyTots BD","description":"Durable BPA-free feeding bottle for safe everyday baby feeding."}'::jsonb,
    true,
    60
  ),
  (
    '77777777-7777-4777-8777-777777777777',
    'TT-BUN-STARTER-007',
    'newborn-starter-pack',
    'Newborn Starter Essentials Pack',
    'Curated starter bundle for a newborn''s first weeks.',
    'A practical bundle for new parents, including everyday newborn essentials for changing, feeding, and gentle care. It also works well as a baby shower gift.',
    'Bundle',
    2100,
    2600,
    'Bundle',
    true,
    'in_stock',
    '["/products/Newborn-Starter-Essentials-Pack.png"]'::jsonb,
    '["bundle", "newborn", "gift", "starter pack"]'::jsonb,
    '[]'::jsonb,
    '{"title":"Newborn Starter Essentials Pack | TinyTots BD","description":"Curated newborn essentials bundle for new parents and baby shower gifting."}'::jsonb,
    true,
    70
  ),
  (
    '88888888-8888-4888-8888-888888888888',
    'TT-MOM-RECOVERY-008',
    'mother-care-essentials-box',
    'Mother Care Recovery Essentials Box',
    'Self-care essentials for new mothers after delivery.',
    'A thoughtful care box for new mothers with comfort-focused essentials for the early postpartum days. It is designed to support rest, recovery, and daily self-care.',
    'Mother Care',
    1600,
    1900,
    'New',
    true,
    'in_stock',
    '["/products/Mother-Care-Recovery-Essentials-Box.png"]'::jsonb,
    '["mother care", "postpartum", "recovery", "gift"]'::jsonb,
    '[]'::jsonb,
    '{"title":"Mother Care Recovery Essentials Box | TinyTots BD","description":"Comfort-focused recovery essentials box for new mothers after delivery."}'::jsonb,
    true,
    80
  )
on conflict (slug) do update set
  sku = excluded.sku,
  name_en = excluded.name_en,
  short_description_en = excluded.short_description_en,
  description_en = excluded.description_en,
  category = excluded.category,
  price = excluded.price,
  old_price = excluded.old_price,
  badge = excluded.badge,
  featured = excluded.featured,
  stock_status = excluded.stock_status,
  images = excluded.images,
  tags = excluded.tags,
  variants = excluded.variants,
  seo = excluded.seo,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;
