import "server-only";

import {
  productCategories,
  productStockStatusOptions,
  type ProductCategoryId,
  type ProductStockStatusDb,
  type ProductVariant,
  slugifyIdentifier,
} from "@/lib/products";
import type { ProductInput } from "@/lib/products-db";

export type ProductFieldErrors = Partial<Record<
  | "nameEn"
  | "slug"
  | "sku"
  | "category"
  | "price"
  | "oldPrice"
  | "stockStatus"
  | "stockQuantity"
  | "images"
  | "variants"
  | "form",
  string
>>;

export type ProductMutationResponse =
  | {
      ok: true;
      productId: string;
      slug: string;
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: ProductFieldErrors;
    };

const categoryIds = productCategories.map((category) => category.id);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toBoolean(value: unknown): boolean {
  return value === true || value === "true" || value === "on";
}

function toOptionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function toRequiredNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value !== "string") return [];

  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function slugifyProductName(value: string): string {
  return slugifyIdentifier(value);
}

function parseVariants(value: unknown): ProductVariant[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const parsedGroups = value
    .map((group) => {
      if (typeof group !== "object" || group === null || Array.isArray(group)) return null;

      const record = group as Record<string, unknown>;
      const name = toString(record.name);
      const id = slugifyIdentifier(toString(record.id) || name);
      const values = Array.isArray(record.values)
        ? record.values
            .map((option) => {
              if (typeof option !== "object" || option === null || Array.isArray(option)) return null;
              const optionRecord = option as Record<string, unknown>;
              const label = toString(optionRecord.label) || toString(optionRecord.name);
              const optionId = slugifyIdentifier(toString(optionRecord.id) || label);
              const priceAdjustment = toOptionalNumber(optionRecord.priceAdjustment ?? optionRecord.price_adjustment);
              const skuSuffix = toString(optionRecord.skuSuffix ?? optionRecord.sku_suffix);

              if (!label || !optionId) return null;

              return {
                id: optionId,
                label,
                priceAdjustment:
                  priceAdjustment !== undefined && Number.isFinite(priceAdjustment)
                    ? priceAdjustment
                    : undefined,
                skuSuffix: skuSuffix || undefined,
              };
            })
            .filter((option): option is NonNullable<typeof option> => Boolean(option))
        : [];

      if (!name || !id || values.length === 0) return null;

      return {
        id,
        name,
        values,
      };
    })
    .filter(Boolean) as ProductVariant[];

  return parsedGroups;
}

export function parseProductPayload(payload: unknown): {
  input?: ProductInput;
  fieldErrors: ProductFieldErrors;
} {
  const fieldErrors: ProductFieldErrors = {};

  if (!isRecord(payload)) {
    return {
      fieldErrors: {
        form: "Invalid product request.",
      },
    };
  }

  const nameEn = toString(payload.nameEn);
  const slug = toString(payload.slug) || slugifyProductName(nameEn);
  const category = toString(payload.category);
  const stockStatus = toString(payload.stockStatus);
  const price = Number(payload.price);
  const oldPrice = toOptionalNumber(payload.oldPrice);
  const trackInventory = toBoolean(payload.trackInventory);
  const stockQuantity = toRequiredNumber(payload.stockQuantity);
  const images = toStringArray(payload.images);
  const tags = toStringArray(payload.tags);
  const rawVariants = Array.isArray(payload.variants) ? payload.variants : undefined;
  const variants = parseVariants(payload.variants) ?? [];

  if (!nameEn) fieldErrors.nameEn = "Product name is required.";
  if (!slug) fieldErrors.slug = "Product slug is required.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fieldErrors.slug = "Use lowercase letters, numbers, and hyphens only.";
  }
  if (!categoryIds.includes(category as ProductCategoryId)) {
    fieldErrors.category = "Choose a valid category.";
  }
  if (!Number.isFinite(price) || price < 0) {
    fieldErrors.price = "Enter a valid price.";
  }
  if (oldPrice !== undefined && (!Number.isFinite(oldPrice) || oldPrice < 0)) {
    fieldErrors.oldPrice = "Enter a valid old price.";
  }
  if (!productStockStatusOptions.includes(stockStatus as ProductStockStatusDb)) {
    fieldErrors.stockStatus = "Choose a valid stock status.";
  }
  if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
    fieldErrors.stockQuantity = "Enter a valid stock quantity.";
  }
  if (images.some((image) => !image.startsWith("/") && !/^https?:\/\//.test(image))) {
    fieldErrors.images = "Images must be site paths starting with / or full http(s) URLs.";
  }
  if (rawVariants && rawVariants.length > 0 && variants.length !== rawVariants.length) {
    fieldErrors.variants = "Each variant group needs at least one option.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  return {
    input: {
      sku: toString(payload.sku) || undefined,
      slug,
      nameEn,
      nameBn: toString(payload.nameBn) || undefined,
      shortDescriptionEn: toString(payload.shortDescriptionEn) || undefined,
      shortDescriptionBn: toString(payload.shortDescriptionBn) || undefined,
      descriptionEn: toString(payload.descriptionEn) || undefined,
      descriptionBn: toString(payload.descriptionBn) || undefined,
      category: category as ProductCategoryId,
      price,
      oldPrice,
      badge: toString(payload.badge) || undefined,
      featured: toBoolean(payload.featured),
      stockStatus: stockStatus as ProductStockStatusDb,
      trackInventory,
      stockQuantity,
      images,
      tags,
      variants,
      seoTitle: toString(payload.seoTitle) || undefined,
      seoDescription: toString(payload.seoDescription) || undefined,
      isActive: toBoolean(payload.isActive),
      sortOrder: toOptionalNumber(payload.sortOrder) ?? 0,
    },
    fieldErrors,
  };
}
