import "server-only";

import {
  getEffectiveProductStockStatus,
  slugifyIdentifier,
  type Product,
  type ProductCategoryId,
  type ProductSeo,
  type ProductStockStatusDb,
  type ProductVariant,
  type ProductVariantValue,
  type StockStatus,
  productStockStatusOptions,
  products as demoProducts,
} from "@/lib/products";
import {
  getSupabaseAdminClient,
  getSupabasePublicClient,
  isSupabasePublicConfigError,
} from "@/lib/supabase/server";

export interface ProductRow {
  id: string;
  sku: string | null;
  slug: string;
  name_en: string;
  name_bn: string | null;
  short_description_en: string | null;
  short_description_bn: string | null;
  description_en: string | null;
  description_bn: string | null;
  category: string;
  price: number;
  old_price: number | null;
  badge: string | null;
  featured: boolean;
  stock_status: ProductStockStatusDb;
  track_inventory: boolean;
  stock_quantity: number;
  images: unknown;
  tags: unknown;
  variants: unknown;
  seo: unknown;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AdminProductFilters {
  query?: string;
  category?: ProductCategoryId;
  stockStatus?: ProductStockStatusDb;
  active?: "active" | "archived";
}

export interface ProductInput {
  sku?: string;
  slug: string;
  nameEn: string;
  nameBn?: string;
  shortDescriptionEn?: string;
  shortDescriptionBn?: string;
  descriptionEn?: string;
  descriptionBn?: string;
  category: ProductCategoryId;
  price: number;
  oldPrice?: number;
  badge?: string;
  featured: boolean;
  stockStatus: ProductStockStatusDb;
  trackInventory: boolean;
  stockQuantity: number;
  images: string[];
  tags: string[];
  variants?: ProductVariant[];
  seoTitle?: string;
  seoDescription?: string;
  isActive: boolean;
  sortOrder?: number;
}

const productSelect =
  "id, sku, slug, name_en, name_bn, short_description_en, short_description_bn, description_en, description_bn, category, price, old_price, badge, featured, stock_status, track_inventory, stock_quantity, images, tags, variants, seo, is_active, sort_order, created_at, updated_at";

export const productsCatalogSetupMessage =
  "Supabase product catalog is missing the latest schema. Apply the Phase 6 products migration, then refresh the admin catalog.";

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
}

function normalizeVariantValues(value: unknown): ProductVariantValue[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") {
        const label = item.trim();
        return label ? { id: slugifyIdentifier(label), label } : null;
      }

      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        return null;
      }

      const record = item as Record<string, unknown>;
      const label =
        typeof record.label === "string"
          ? record.label.trim()
          : typeof record.name === "string"
            ? record.name.trim()
            : "";

      if (!label) return null;

      const idSource =
        typeof record.id === "string" && record.id.trim().length > 0
          ? record.id
          : label;
      const priceAdjustment =
        typeof record.priceAdjustment === "number"
          ? record.priceAdjustment
          : typeof record.price_adjustment === "number"
            ? record.price_adjustment
            : undefined;
      const skuSuffix =
        typeof record.skuSuffix === "string"
          ? record.skuSuffix.trim()
          : typeof record.sku_suffix === "string"
            ? record.sku_suffix.trim()
            : undefined;

      return {
        id: slugifyIdentifier(idSource),
        label,
        priceAdjustment,
        skuSuffix: skuSuffix || undefined,
      };
    })
    .filter((item): item is ProductVariantValue => Boolean(item));
}

function normalizeVariants(value: unknown): ProductVariant[] {
  if (!Array.isArray(value)) return [];

  const records = value.filter(
    (item): item is Record<string, unknown> =>
      typeof item === "object" && item !== null && !Array.isArray(item)
  );

  const groupedVariants = records
    .map((item) => {
      const name = typeof item.name === "string" ? item.name.trim() : "";
      const idSource =
        typeof item.id === "string" && item.id.trim().length > 0 ? item.id : name;
      const variantValues = normalizeVariantValues(item.values);

      if (!name || !variantValues.length) return null;

      return {
        id: slugifyIdentifier(idSource),
        name,
        values: variantValues,
      };
    })
    .filter((item): item is ProductVariant => Boolean(item));

  if (groupedVariants.length > 0) {
    return groupedVariants;
  }

  const legacyValues = records
    .map((item) => {
      const label = typeof item.name === "string" ? item.name.trim() : "";
      if (!label) return null;

      return {
        id: slugifyIdentifier(typeof item.id === "string" ? item.id : label),
        label,
      };
    })
    .filter((item): item is ProductVariantValue => Boolean(item));

  return legacyValues.length > 0
    ? [
        {
          id: "options",
          name: "Options",
          values: legacyValues,
        },
      ]
    : [];
}

function normalizeSeo(value: unknown): ProductSeo {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
  const record = value as Record<string, unknown>;
  return {
    title: typeof record.title === "string" ? record.title : undefined,
    description: typeof record.description === "string" ? record.description : undefined,
  };
}

export function dbStockToUiStock(value: unknown): StockStatus | undefined {
  if (value === "in_stock" || value === "in-stock") return "in-stock";
  if (value === "low_stock" || value === "low-stock") return "low-stock";
  if (value === "out_of_stock" || value === "out-of-stock") return "out-of-stock";
  if (value === "preorder") return "preorder";
  return undefined;
}

function uiStockLabel(value: StockStatus): string {
  if (value === "low-stock") return "Low Stock";
  if (value === "out-of-stock") return "Out of Stock";
  if (value === "preorder") return "Preorder";
  return "In Stock";
}

function resolveEffectiveStockStatus(
  stockStatus: StockStatus,
  trackInventory: boolean,
  stockQuantity: number
): StockStatus {
  return getEffectiveProductStockStatus({
    id: "",
    name: "",
    nameBn: "",
    slug: "",
    category: demoProducts[0]?.category ?? "Diapers",
    price: 0,
    rating: 0,
    stock: "",
    stockBn: "",
    image: "",
    shortDescription: "",
    shortDescriptionBn: "",
    description: "",
    descriptionBn: "",
    stockStatus,
    trackInventory,
    stockQuantity,
  });
}

export function mapProductRow(row: ProductRow): Product {
  const demoMatch = demoProducts.find((product) => product.slug === row.slug);
  const images = normalizeStringArray(row.images);
  const tags = normalizeStringArray(row.tags);
  const baseStockStatus = dbStockToUiStock(row.stock_status) ?? "in-stock";
  const name = row.name_en;
  const shortDescription = row.short_description_en ?? "";
  const description = row.description_en ?? shortDescription;
  const trackInventory = Boolean(row.track_inventory);
  const stockQuantity = Number.isFinite(row.stock_quantity) ? row.stock_quantity : 0;
  const stockStatus = resolveEffectiveStockStatus(baseStockStatus, trackInventory, stockQuantity);

  return {
    id: row.id,
    sku: row.sku ?? undefined,
    name,
    nameBn: row.name_bn ?? demoMatch?.nameBn ?? name,
    slug: row.slug,
    category: row.category as ProductCategoryId,
    price: row.price,
    oldPrice: row.old_price ?? undefined,
    compareAtPrice: row.old_price ?? undefined,
    badge: row.badge ?? undefined,
    badgeBn: demoMatch?.badgeBn,
    rating: demoMatch?.rating ?? 4.8,
    featured: row.featured,
    stock: uiStockLabel(stockStatus),
    stockBn: demoMatch?.stockBn ?? uiStockLabel(stockStatus),
    stockStatus,
    trackInventory,
    stockQuantity,
    image: images[0] ?? "",
    images,
    tags,
    variants: normalizeVariants(row.variants),
    shortDescription,
    shortDescriptionBn: row.short_description_bn ?? demoMatch?.shortDescriptionBn ?? shortDescription,
    description,
    descriptionBn: row.description_bn ?? demoMatch?.descriptionBn ?? description,
    seo: normalizeSeo(row.seo),
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function fallbackProducts(limit?: number): Product[] {
  const activeProducts = demoProducts.map((product, index) => ({
    ...product,
    isActive: true,
    sortOrder: (index + 1) * 10,
  }));
  return typeof limit === "number" ? activeProducts.slice(0, limit) : activeProducts;
}

function shouldUsePublicFallback(error: unknown): boolean {
  if (isSupabasePublicConfigError(error)) return true;
  if (isProductsTableMissingError(error)) return true;
  if (isProductsSchemaMismatchError(error)) return true;
  return false;
}

export function isProductsTableMissingError(error: unknown): boolean {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: unknown }).code;
    return code === "42P01" || code === "PGRST205";
  }
  return false;
}

export function isProductsSchemaMismatchError(error: unknown): boolean {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: unknown }).code;
    return code === "42703" || code === "PGRST204";
  }
  return false;
}

function sanitizeSearchTerm(value: string): string {
  return value.replace(/[%_,]/g, "").trim();
}

export async function getPublicProducts(): Promise<Product[]> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("products")
      .select(productSelect)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map((row) => mapProductRow(row as ProductRow));
  } catch (error) {
    if (shouldUsePublicFallback(error)) return fallbackProducts();
    throw new Error("Products could not be loaded.");
  }
}

export async function getFeaturedPublicProducts(limit?: number): Promise<Product[]> {
  const products = (await getPublicProducts()).filter((product) => product.featured);
  return typeof limit === "number" ? products.slice(0, limit) : products;
}

export async function getPublicProductsByCategoryIds(
  categoryIds: readonly ProductCategoryId[],
  limit?: number
): Promise<Product[]> {
  const products = (await getPublicProducts()).filter((product) => categoryIds.includes(product.category));
  return typeof limit === "number" ? products.slice(0, limit) : products;
}

export async function getPublicProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = getSupabasePublicClient();
    const { data, error } = await supabase
      .from("products")
      .select(productSelect)
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw error;
    return data ? mapProductRow(data as ProductRow) : null;
  } catch (error) {
    if (shouldUsePublicFallback(error)) {
      return fallbackProducts().find((product) => product.slug === slug) ?? null;
    }
    throw new Error("Product could not be loaded.");
  }
}

export async function getRelatedPublicProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await getPublicProducts();
  const sameCategory = products.filter(
    (candidate) => candidate.id !== product.id && candidate.category === product.category
  );
  const fallback = products.filter(
    (candidate) => candidate.id !== product.id && candidate.category !== product.category
  );
  return [...sameCategory, ...fallback].slice(0, limit);
}

export async function getTrustedActiveProductsForOrder(items: Array<{ id: string; slug?: string; sku?: string }>): Promise<Product[]> {
  const ids = [...new Set(items.map((item) => item.id).filter(Boolean))];
  const slugs = [...new Set(items.map((item) => item.slug).filter((value): value is string => Boolean(value)))];
  const skus = [...new Set(items.map((item) => item.sku).filter((value): value is string => Boolean(value)))];

  try {
    const supabase = getSupabaseAdminClient();
    const queries = [
      ids.length
        ? supabase.from("products").select(productSelect).eq("is_active", true).in("id", ids)
        : Promise.resolve({ data: [], error: null }),
      slugs.length
        ? supabase.from("products").select(productSelect).eq("is_active", true).in("slug", slugs)
        : Promise.resolve({ data: [], error: null }),
      skus.length
        ? supabase.from("products").select(productSelect).eq("is_active", true).in("sku", skus)
        : Promise.resolve({ data: [], error: null }),
    ] as const;

    const results = await Promise.all(queries);
    const firstError = results.find((result) => result.error)?.error;

    if (firstError) {
      if (isProductsTableMissingError(firstError) || isProductsSchemaMismatchError(firstError)) {
        return fallbackProducts().filter((product) => {
          return ids.includes(product.id) || slugs.includes(product.slug) || (product.sku ? skus.includes(product.sku) : false);
        });
      }

      throw new Error("Products could not be verified.");
    }

    const merged = new Map<string, Product>();
    results.flatMap((result) => result.data ?? []).forEach((row) => {
      const product = mapProductRow(row as ProductRow);
      merged.set(product.id, product);
    });

    return [...merged.values()];
  } catch (error) {
    if (isProductsTableMissingError(error) || isProductsSchemaMismatchError(error)) {
      return fallbackProducts().filter((product) => {
        return ids.includes(product.id) || slugs.includes(product.slug) || (product.sku ? skus.includes(product.sku) : false);
      });
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Products could not be verified.");
  }
}

export async function getAdminProducts(filters: AdminProductFilters = {}): Promise<Product[]> {
  const supabase = getSupabaseAdminClient();
  let query = supabase.from("products").select(productSelect);

  if (filters.category) {
    query = query.eq("category", filters.category);
  }
  if (filters.stockStatus) {
    query = query.eq("stock_status", filters.stockStatus);
  }
  if (filters.active === "active") {
    query = query.eq("is_active", true);
  }
  if (filters.active === "archived") {
    query = query.eq("is_active", false);
  }
  if (filters.query) {
    const searchTerm = sanitizeSearchTerm(filters.query);
    if (searchTerm) {
      query = query.or(`name_en.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%,slug.ilike.%${searchTerm}%`);
    }
  }

  const { data, error } = await query
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false })
    .limit(200);

  if (error) {
    if (isProductsTableMissingError(error) || isProductsSchemaMismatchError(error)) {
      throw new Error(productsCatalogSetupMessage);
    }
    throw new Error("Admin products could not be loaded.");
  }
  return (data ?? []).map((row) => mapProductRow(row as ProductRow));
}

export async function getAdminProductById(id: string): Promise<Product | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("products").select(productSelect).eq("id", id).maybeSingle();

  if (error) {
    if (isProductsTableMissingError(error) || isProductsSchemaMismatchError(error)) {
      throw new Error(productsCatalogSetupMessage);
    }
    throw new Error("Admin product could not be loaded.");
  }
  return data ? mapProductRow(data as ProductRow) : null;
}

function productInputToRow(input: ProductInput) {
  return {
    sku: input.sku || null,
    slug: input.slug,
    name_en: input.nameEn,
    name_bn: input.nameBn || null,
    short_description_en: input.shortDescriptionEn || null,
    short_description_bn: input.shortDescriptionBn || null,
    description_en: input.descriptionEn || null,
    description_bn: input.descriptionBn || null,
    category: input.category,
    price: input.price,
    old_price: input.oldPrice ?? null,
    badge: input.badge || null,
    featured: input.featured,
    stock_status: input.stockStatus,
    track_inventory: input.trackInventory,
    stock_quantity: input.stockQuantity,
    images: input.images,
    tags: input.tags,
    variants: input.variants ?? [],
    seo: {
      title: input.seoTitle || undefined,
      description: input.seoDescription || undefined,
    },
    is_active: input.isActive,
    sort_order: input.sortOrder ?? 0,
  };
}

function getDuplicateProductMessage(error: { constraint?: string | null; details?: string | null }): string | null {
  if (error.constraint === "products_slug_key" || error.details?.includes("(slug)=")) {
    return "A product with this slug already exists.";
  }

  if (error.constraint === "products_sku_key" || error.details?.includes("(sku)=")) {
    return "A product with this SKU already exists.";
  }

  return null;
}

export async function createAdminProduct(input: ProductInput): Promise<Product> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .insert(productInputToRow(input))
    .select(productSelect)
    .single();

  if (error) {
    if (isProductsTableMissingError(error) || isProductsSchemaMismatchError(error)) {
      throw new Error(productsCatalogSetupMessage);
    }
    if (error.code === "23505") {
      throw new Error(getDuplicateProductMessage(error) ?? "A product with this slug or SKU already exists.");
    }
    throw new Error("Product could not be created.");
  }

  return mapProductRow(data as ProductRow);
}

export async function updateAdminProduct(id: string, input: ProductInput): Promise<Product> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .update(productInputToRow(input))
    .eq("id", id)
    .select(productSelect)
    .single();

  if (error) {
    if (isProductsTableMissingError(error) || isProductsSchemaMismatchError(error)) {
      throw new Error(productsCatalogSetupMessage);
    }
    if (error.code === "23505") {
      throw new Error(getDuplicateProductMessage(error) ?? "A product with this slug or SKU already exists.");
    }
    throw new Error("Product could not be updated.");
  }

  return mapProductRow(data as ProductRow);
}

export async function setAdminProductActive(id: string, isActive: boolean): Promise<Product> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id)
    .select(productSelect)
    .single();

  if (error) {
    if (isProductsTableMissingError(error) || isProductsSchemaMismatchError(error)) {
      throw new Error(productsCatalogSetupMessage);
    }
    throw new Error(isActive ? "Product could not be published." : "Product could not be archived.");
  }
  return mapProductRow(data as ProductRow);
}

export async function getAdminProductSummary(): Promise<{
  activeProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
}> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, stock_status, track_inventory, stock_quantity")
    .eq("is_active", true);

  if (error) {
    const fallback = fallbackProducts();
    return {
      activeProducts: fallback.length,
      outOfStockProducts: fallback.filter((product) => getEffectiveProductStockStatus(product) === "out-of-stock").length,
      lowStockProducts: fallback.filter((product) => getEffectiveProductStockStatus(product) === "low-stock").length,
    };
  }

  const products = (data ?? []).map((row) => ({
    trackInventory: Boolean(row.track_inventory),
    stockQuantity: Number.isFinite(row.stock_quantity) ? row.stock_quantity : 0,
    stockStatus: dbStockToUiStock(row.stock_status) ?? "in-stock",
  }));

  return {
    activeProducts: data?.length ?? 0,
    outOfStockProducts: products.filter(
      (product) =>
        resolveEffectiveStockStatus(
          product.stockStatus,
          product.trackInventory,
          product.stockQuantity
        ) === "out-of-stock"
    ).length,
    lowStockProducts: products.filter(
      (product) =>
        resolveEffectiveStockStatus(
          product.stockStatus,
          product.trackInventory,
          product.stockQuantity
        ) === "low-stock"
    ).length,
  };
}

export function isProductStockStatusDb(value: unknown): value is ProductStockStatusDb {
  return typeof value === "string" && productStockStatusOptions.includes(value as ProductStockStatusDb);
}
