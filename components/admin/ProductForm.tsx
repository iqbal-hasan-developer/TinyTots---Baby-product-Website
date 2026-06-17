"use client";

import { type ChangeEvent, type FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import CommerceImage from "@/components/shared/CommerceImage";
import {
  productCategories,
  productStockStatusOptions,
  slugifyIdentifier,
  type Product,
  type ProductStockStatusDb,
  type ProductVariant,
} from "@/lib/products";

type ProductFieldErrors = Partial<Record<
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

type ProductMutationResponse =
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

type UploadImagesResponse =
  | {
      ok: true;
      images: Array<{
        path: string;
        url: string;
      }>;
    }
  | {
      ok: false;
      error: string;
    };

interface ProductFormValues {
  nameEn: string;
  nameBn: string;
  slug: string;
  sku: string;
  category: string;
  price: string;
  oldPrice: string;
  badge: string;
  shortDescriptionEn: string;
  shortDescriptionBn: string;
  descriptionEn: string;
  descriptionBn: string;
  images: string;
  tags: string;
  featured: boolean;
  stockStatus: ProductStockStatusDb;
  trackInventory: boolean;
  stockQuantity: string;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  sortOrder: string;
}

interface VariantValueFormValue {
  id: string;
  label: string;
  priceAdjustment: string;
  skuSuffix: string;
}

interface VariantGroupFormValue {
  id: string;
  name: string;
  values: VariantValueFormValue[];
}

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product;
}

function toDbStockStatus(value?: string): ProductStockStatusDb {
  if (value === "low-stock") return "low_stock";
  if (value === "out-of-stock") return "out_of_stock";
  if (value === "preorder") return "preorder";
  return "in_stock";
}

function parseImageList(value: string): string[] {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinImageList(images: string[]): string {
  return images.join("\n");
}

function toInitialValues(product?: Product): ProductFormValues {
  return {
    nameEn: product?.name ?? "",
    nameBn: product?.nameBn ?? "",
    slug: product?.slug ?? "",
    sku: product?.sku ?? "",
    category: product?.category ?? productCategories[0].id,
    price: product ? String(product.price) : "",
    oldPrice: product?.oldPrice ? String(product.oldPrice) : "",
    badge: product?.badge ?? "",
    shortDescriptionEn: product?.shortDescription ?? "",
    shortDescriptionBn: product?.shortDescriptionBn ?? "",
    descriptionEn: product?.description ?? "",
    descriptionBn: product?.descriptionBn ?? "",
    images: product?.images?.join("\n") ?? "",
    tags: product?.tags?.join(", ") ?? "",
    featured: Boolean(product?.featured),
    stockStatus: toDbStockStatus(product?.stockStatus),
    trackInventory: Boolean(product?.trackInventory),
    stockQuantity: String(product?.stockQuantity ?? 0),
    isActive: product?.isActive ?? true,
    seoTitle: product?.seo?.title ?? "",
    seoDescription: product?.seo?.description ?? "",
    sortOrder: product?.sortOrder ? String(product.sortOrder) : "0",
  };
}

function toVariantGroups(product?: Product): VariantGroupFormValue[] {
  return (product?.variants ?? []).map((group) => ({
    id: group.id,
    name: group.name,
    values: group.values.map((value) => ({
      id: value.id,
      label: value.label,
      priceAdjustment:
        typeof value.priceAdjustment === "number"
          ? String(value.priceAdjustment)
          : "",
      skuSuffix: value.skuSuffix ?? "",
    })),
  }));
}

function labelStockStatus(value: string): string {
  return value.replaceAll("_", " ");
}

function slugifyProductName(value: string): string {
  return slugifyIdentifier(value);
}

function normalizeVariantGroups(groups: VariantGroupFormValue[]): ProductVariant[] {
  return groups
    .map((group) => ({
      id: slugifyIdentifier(group.id || group.name),
      name: group.name.trim(),
      values: group.values
        .map((value) => {
          const label = value.label.trim();
          const optionId = slugifyIdentifier(value.id || label);
          const priceAdjustment =
            value.priceAdjustment.trim().length > 0
              ? Number(value.priceAdjustment)
              : undefined;

          if (!label || !optionId) return null;

          return {
            id: optionId,
            label,
            priceAdjustment:
              priceAdjustment !== undefined && Number.isFinite(priceAdjustment)
                ? priceAdjustment
                : undefined,
            skuSuffix: value.skuSuffix.trim() || undefined,
          };
        })
        .filter((value): value is NonNullable<typeof value> => Boolean(value)),
    }))
    .filter((group) => group.name && group.values.length > 0);
}

function createEmptyVariantGroup(): VariantGroupFormValue {
  return {
    id: "",
    name: "",
    values: [{ id: "", label: "", priceAdjustment: "", skuSuffix: "" }],
  };
}

export default function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(() => toInitialValues(product));
  const [variantGroups, setVariantGroups] = useState<VariantGroupFormValue[]>(() => toVariantGroups(product));
  const [hasManualSlug, setHasManualSlug] = useState(Boolean(product?.slug));
  const [fieldErrors, setFieldErrors] = useState<ProductFieldErrors>({});
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const isEdit = mode === "edit";

  const endpoint = isEdit && product ? `/api/admin/products/${product.id}` : "/api/admin/products";

  const imageList = useMemo(() => parseImageList(values.images), [values.images]);

  const payload = useMemo(
    () => ({
      ...values,
      price: values.price,
      oldPrice: values.oldPrice,
      images: imageList,
      tags: values.tags,
      sortOrder: values.sortOrder,
      variants: normalizeVariantGroups(variantGroups),
    }),
    [imageList, values, variantGroups]
  );

  const updateValue = <Key extends keyof ProductFormValues>(key: Key, value: ProductFormValues[Key]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key as keyof ProductFieldErrors]) return current;
      const next = { ...current };
      delete next[key as keyof ProductFieldErrors];
      return next;
    });
  };

  const updateImages = (nextImages: string[]) => {
    updateValue("images", joinImageList(nextImages));
  };

  const updateVariantGroup = (
    groupIndex: number,
    updater: (group: VariantGroupFormValue) => VariantGroupFormValue
  ) => {
    setVariantGroups((current) =>
      current.map((group, index) => (index === groupIndex ? updater(group) : group))
    );
    setFieldErrors((current) => {
      if (!current.variants) return current;
      const next = { ...current };
      delete next.variants;
      return next;
    });
  };

  const handleNameChange = (value: string) => {
    setValues((current) => ({
      ...current,
      nameEn: value,
      slug: hasManualSlug ? current.slug : slugifyProductName(value),
    }));
  };

  const validateClient = (): boolean => {
    const nextErrors: ProductFieldErrors = {};

    if (!values.nameEn.trim()) nextErrors.nameEn = "Product name is required.";
    if (!values.slug.trim()) nextErrors.slug = "Product slug is required.";
    if (!values.price.trim() || Number(values.price) < 0) {
      nextErrors.price = "Enter a valid price.";
    }
    if (!values.stockQuantity.trim() || Number(values.stockQuantity) < 0) {
      nextErrors.stockQuantity = "Enter a valid stock quantity.";
    }

    const normalizedVariants = normalizeVariantGroups(variantGroups);
    if (variantGroups.length > 0 && normalizedVariants.length !== variantGroups.length) {
      nextErrors.variants = "Each variant group needs a name and at least one option.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setFieldErrors({});

    if (!validateClient()) return;

    setIsSaving(true);
    try {
      const response = await fetch(endpoint, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as ProductMutationResponse | null;

      if (!response.ok || !result?.ok) {
        setFieldErrors(
          result && !result.ok
            ? result.fieldErrors ?? { form: result.error }
            : { form: "Product could not be saved." }
        );
        return;
      }

      if (isEdit) {
        setMessage("Product updated.");
        router.refresh();
        return;
      }

      router.replace(`/admin/products/${result.productId}/edit`);
      router.refresh();
    } catch {
      setFieldErrors({ form: "Product could not be saved. Check your connection and try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setFieldErrors((current) => {
      if (!current.images && !current.form) return current;
      const next = { ...current };
      delete next.images;
      delete next.form;
      return next;
    });

    setIsUploadingImages(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/admin/products/images", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json().catch(() => null)) as UploadImagesResponse | null;

      if (!response.ok || !result?.ok) {
        setFieldErrors({
          images:
            result && !result.ok
              ? result.error
              : "Images could not be uploaded. Please try again.",
        });
        return;
      }

      updateImages([...imageList, ...result.images.map((image) => image.url)]);
    } catch {
      setFieldErrors({
        images: "Images could not be uploaded. Check your connection and try again.",
      });
    } finally {
      event.target.value = "";
      setIsUploadingImages(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {fieldErrors.form && (
        <div
          className="rounded-xl border border-[#ba1a1a]/30 bg-[#ffeee8] px-4 py-3 text-sm font-bold text-[#8a1a1a]"
          role="alert"
        >
          {fieldErrors.form}
        </div>
      )}
      {message && (
        <div
          className="rounded-xl border border-brand-primary/30 bg-brand-primary-light px-4 py-3 text-sm font-bold text-brand-primary"
          role="status"
        >
          {message}
        </div>
      )}

      <section className="rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary-light text-brand-primary">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-brand-text">Product basics</h2>
            <p className="text-sm text-[#66717b]">
              Set the product identity, category, pricing, publish state, and stock behavior.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Product name English" id="product-name-en" error={fieldErrors.nameEn}>
            <input
              id="product-name-en"
              value={values.nameEn}
              onChange={(event) => handleNameChange(event.target.value)}
              className="admin-input"
              required
            />
          </Field>
          <Field label="Product name Bangla" id="product-name-bn">
            <input
              id="product-name-bn"
              value={values.nameBn}
              onChange={(event) => updateValue("nameBn", event.target.value)}
              className="admin-input"
            />
          </Field>
          <Field label="Slug" id="product-slug" error={fieldErrors.slug}>
            <input
              id="product-slug"
              value={values.slug}
              onChange={(event) => {
                setHasManualSlug(true);
                updateValue("slug", slugifyProductName(event.target.value));
              }}
              className="admin-input"
              required
            />
          </Field>
          <Field label="SKU" id="product-sku" error={fieldErrors.sku}>
            <input
              id="product-sku"
              value={values.sku}
              onChange={(event) => updateValue("sku", event.target.value)}
              className="admin-input"
            />
          </Field>
          <Field label="Category" id="product-category" error={fieldErrors.category}>
            <select
              id="product-category"
              value={values.category}
              onChange={(event) => updateValue("category", event.target.value)}
              className="admin-input"
            >
              {productCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.id}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Stock status" id="product-stock-status" error={fieldErrors.stockStatus}>
            <select
              id="product-stock-status"
              value={values.stockStatus}
              onChange={(event) =>
                updateValue("stockStatus", event.target.value as ProductStockStatusDb)
              }
              className="admin-input capitalize"
            >
              {productStockStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {labelStockStatus(status)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Price" id="product-price" error={fieldErrors.price}>
            <input
              id="product-price"
              type="number"
              min="0"
              value={values.price}
              onChange={(event) => updateValue("price", event.target.value)}
              className="admin-input"
              required
            />
          </Field>
          <Field label="Old price" id="product-old-price" error={fieldErrors.oldPrice}>
            <input
              id="product-old-price"
              type="number"
              min="0"
              value={values.oldPrice}
              onChange={(event) => updateValue("oldPrice", event.target.value)}
              className="admin-input"
            />
          </Field>
          <Field label="Badge" id="product-badge">
            <input
              id="product-badge"
              value={values.badge}
              onChange={(event) => updateValue("badge", event.target.value)}
              className="admin-input"
            />
          </Field>
          <Field label="Sort order" id="product-sort-order">
            <input
              id="product-sort-order"
              type="number"
              value={values.sortOrder}
              onChange={(event) => updateValue("sortOrder", event.target.value)}
              className="admin-input"
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl border border-[#dfe5eb] bg-[#f8fafc] px-4 py-3 text-sm font-bold text-brand-text">
            <input
              type="checkbox"
              checked={values.trackInventory}
              onChange={(event) => updateValue("trackInventory", event.target.checked)}
            />
            Track inventory quantity
          </label>
          <Field
            label="Stock quantity"
            id="product-stock-quantity"
            error={fieldErrors.stockQuantity}
            hint={values.trackInventory ? "Used for stock enforcement during checkout." : "Saved for reference. Inventory tracking is currently off."}
          >
            <input
              id="product-stock-quantity"
              type="number"
              min="0"
              value={values.stockQuantity}
              onChange={(event) => updateValue("stockQuantity", event.target.value)}
              className="admin-input"
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="flex items-center gap-3 rounded-xl border border-[#dfe5eb] bg-[#f8fafc] px-4 py-3 text-sm font-bold text-brand-text">
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(event) => updateValue("featured", event.target.checked)}
            />
            Featured
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-[#dfe5eb] bg-[#f8fafc] px-4 py-3 text-sm font-bold text-brand-text">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(event) => updateValue("isActive", event.target.checked)}
            />
            Active / published
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-brand-text">Descriptions</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Short description English" id="product-short-en">
            <textarea
              id="product-short-en"
              rows={3}
              value={values.shortDescriptionEn}
              onChange={(event) => updateValue("shortDescriptionEn", event.target.value)}
              className="admin-input"
            />
          </Field>
          <Field label="Short description Bangla" id="product-short-bn">
            <textarea
              id="product-short-bn"
              rows={3}
              value={values.shortDescriptionBn}
              onChange={(event) => updateValue("shortDescriptionBn", event.target.value)}
              className="admin-input"
            />
          </Field>
          <Field label="Description English" id="product-description-en">
            <textarea
              id="product-description-en"
              rows={6}
              value={values.descriptionEn}
              onChange={(event) => updateValue("descriptionEn", event.target.value)}
              className="admin-input"
            />
          </Field>
          <Field label="Description Bangla" id="product-description-bn">
            <textarea
              id="product-description-bn"
              rows={6}
              value={values.descriptionBn}
              onChange={(event) => updateValue("descriptionBn", event.target.value)}
              className="admin-input"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-brand-text">Product images</h2>
            <p className="text-sm text-[#66717b]">
              Upload JPG, PNG, or WebP images to Supabase Storage, or keep using manual paths if you prefer.
            </p>
          </div>
          <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#dfe5eb] bg-white px-4 text-sm font-bold text-brand-text transition-colors hover:border-brand-primary hover:text-brand-primary">
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            {isUploadingImages ? "Uploading..." : "Upload images"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={handleUploadImages}
              disabled={isUploadingImages}
            />
          </label>
        </div>

        <div className="mt-5 space-y-4">
          {imageList.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {imageList.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="overflow-hidden rounded-2xl border border-[#e3e7ec] bg-[#f8fafc]"
                >
                  <div className="relative aspect-square">
                    <CommerceImage
                      src={image}
                      alt={`Product image ${index + 1}`}
                      fill
                      sizes="(min-width: 1280px) 240px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="line-clamp-2 break-all text-xs font-medium text-[#66717b]">{image}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="inline-flex h-9 items-center justify-center gap-1 rounded-xl border border-[#dfe5eb] bg-white px-3 text-xs font-bold text-brand-text transition-colors hover:border-brand-primary hover:text-brand-primary disabled:opacity-50"
                        onClick={() =>
                          updateImages(
                            imageList.map((item, imageIndex) => {
                              if (imageIndex === index - 1) return image;
                              if (imageIndex === index) return imageList[index - 1];
                              return item;
                            })
                          )
                        }
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                        Main
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-9 items-center justify-center gap-1 rounded-xl border border-[#dfe5eb] bg-white px-3 text-xs font-bold text-brand-text transition-colors hover:border-brand-primary hover:text-brand-primary disabled:opacity-50"
                        onClick={() =>
                          updateImages(
                            imageList.map((item, imageIndex) => {
                              if (imageIndex === index + 1) return image;
                              if (imageIndex === index) return imageList[index + 1];
                              return item;
                            })
                          )
                        }
                        disabled={index === imageList.length - 1}
                      >
                        <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                        Down
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-9 items-center justify-center gap-1 rounded-xl border border-[#f0d0d0] bg-white px-3 text-xs font-bold text-[#8a1a1a] transition-colors hover:border-[#ba1a1a] hover:text-[#ba1a1a]"
                        onClick={() => updateImages(imageList.filter((_, imageIndex) => imageIndex !== index))}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#dfe5eb] bg-[#f8fafc] px-4 py-10 text-center text-sm font-medium text-[#66717b]">
              Upload product images or add manual paths below.
            </div>
          )}

          <Field
            label="Image URLs / paths"
            id="product-images"
            error={fieldErrors.images}
            hint="One URL or /products/path per line. The first image becomes the main product image."
          >
            <textarea
              id="product-images"
              rows={5}
              value={values.images}
              onChange={(event) => updateValue("images", event.target.value)}
              className="admin-input"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-brand-text">Variants</h2>
            <p className="text-sm text-[#66717b]">
              Add simple option groups like size, color, pack, or weight. Price adjustments are optional.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setVariantGroups((current) => [...current, createEmptyVariantGroup()])}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#dfe5eb] bg-white px-4 text-sm font-bold text-brand-text transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add variant group
          </button>
        </div>

        {fieldErrors.variants && (
          <p className="mt-3 text-sm font-bold text-[#8a1a1a]" role="alert">
            {fieldErrors.variants}
          </p>
        )}

        <div className="mt-5 space-y-4">
          {variantGroups.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#dfe5eb] bg-[#f8fafc] px-4 py-10 text-center text-sm font-medium text-[#66717b]">
              No variant groups yet.
            </div>
          ) : (
            variantGroups.map((group, groupIndex) => (
              <div key={`${group.id}-${groupIndex}`} className="rounded-2xl border border-[#e3e7ec] bg-[#fbfcfd] p-4">
                <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
                  <Field label="Group name" id={`variant-group-name-${groupIndex}`}>
                    <input
                      id={`variant-group-name-${groupIndex}`}
                      value={group.name}
                      onChange={(event) =>
                        updateVariantGroup(groupIndex, (current) => ({
                          ...current,
                          name: event.target.value,
                          id: current.id || slugifyIdentifier(event.target.value),
                        }))
                      }
                      className="admin-input"
                    />
                  </Field>
                  <Field label="Group id" id={`variant-group-id-${groupIndex}`}>
                    <input
                      id={`variant-group-id-${groupIndex}`}
                      value={group.id}
                      onChange={(event) =>
                        updateVariantGroup(groupIndex, (current) => ({
                          ...current,
                          id: slugifyIdentifier(event.target.value),
                        }))
                      }
                      className="admin-input"
                    />
                  </Field>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() =>
                        setVariantGroups((current) =>
                          current.filter((_, index) => index !== groupIndex)
                        )
                      }
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#f0d0d0] bg-white px-4 text-sm font-bold text-[#8a1a1a] transition-colors hover:border-[#ba1a1a]"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Remove group
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {group.values.map((value, valueIndex) => (
                    <div
                      key={`${value.id}-${valueIndex}`}
                      className="grid gap-3 rounded-2xl border border-[#e3e7ec] bg-white p-3 md:grid-cols-[1.1fr_180px_180px_auto]"
                    >
                      <Field label="Option label" id={`variant-label-${groupIndex}-${valueIndex}`}>
                        <input
                          id={`variant-label-${groupIndex}-${valueIndex}`}
                          value={value.label}
                          onChange={(event) =>
                            updateVariantGroup(groupIndex, (current) => ({
                              ...current,
                              values: current.values.map((item, index) =>
                                index === valueIndex
                                  ? {
                                      ...item,
                                      label: event.target.value,
                                      id: item.id || slugifyIdentifier(event.target.value),
                                    }
                                  : item
                              ),
                            }))
                          }
                          className="admin-input"
                        />
                      </Field>
                      <Field label="Price adjustment" id={`variant-price-${groupIndex}-${valueIndex}`}>
                        <input
                          id={`variant-price-${groupIndex}-${valueIndex}`}
                          type="number"
                          value={value.priceAdjustment}
                          onChange={(event) =>
                            updateVariantGroup(groupIndex, (current) => ({
                              ...current,
                              values: current.values.map((item, index) =>
                                index === valueIndex
                                  ? { ...item, priceAdjustment: event.target.value }
                                  : item
                              ),
                            }))
                          }
                          className="admin-input"
                          placeholder="0"
                        />
                      </Field>
                      <Field label="SKU suffix" id={`variant-sku-${groupIndex}-${valueIndex}`}>
                        <input
                          id={`variant-sku-${groupIndex}-${valueIndex}`}
                          value={value.skuSuffix}
                          onChange={(event) =>
                            updateVariantGroup(groupIndex, (current) => ({
                              ...current,
                              values: current.values.map((item, index) =>
                                index === valueIndex
                                  ? { ...item, skuSuffix: event.target.value.toUpperCase() }
                                  : item
                              ),
                            }))
                          }
                          className="admin-input"
                        />
                      </Field>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() =>
                            updateVariantGroup(groupIndex, (current) => ({
                              ...current,
                              values: current.values.filter((_, index) => index !== valueIndex),
                            }))
                          }
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#f0d0d0] bg-white px-4 text-sm font-bold text-[#8a1a1a] transition-colors hover:border-[#ba1a1a]"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    updateVariantGroup(groupIndex, (current) => ({
                      ...current,
                      values: [
                        ...current.values,
                        { id: "", label: "", priceAdjustment: "", skuSuffix: "" },
                      ],
                    }))
                  }
                  className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dfe5eb] bg-white px-4 text-sm font-bold text-brand-text transition-colors hover:border-brand-primary hover:text-brand-primary"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add option
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-brand-text">SEO and tags</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Tags" id="product-tags" hint="Comma-separated tags.">
            <textarea
              id="product-tags"
              rows={5}
              value={values.tags}
              onChange={(event) => updateValue("tags", event.target.value)}
              className="admin-input"
            />
          </Field>
          <Field label="SEO description" id="product-seo-description">
            <textarea
              id="product-seo-description"
              rows={5}
              value={values.seoDescription}
              onChange={(event) => updateValue("seoDescription", event.target.value)}
              className="admin-input"
            />
          </Field>
          <Field label="SEO title" id="product-seo-title">
            <input
              id="product-seo-title"
              value={values.seoTitle}
              onChange={(event) => updateValue("seoTitle", event.target.value)}
              className="admin-input"
            />
          </Field>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="submit"
          disabled={isSaving || isUploadingImages}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {isSaving ? "Saving..." : isEdit ? "Save product" : "Create product"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  error,
  hint,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-bold text-brand-text">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs font-medium text-[#66717b]">{hint}</p>}
      {error && (
        <p className="text-sm font-bold text-[#8a1a1a]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
