import Link from "next/link";
import { Edit, PackagePlus, PackageSearch, Plus, Search, SlidersHorizontal } from "lucide-react";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import ProductStatusButton from "@/components/admin/ProductStatusButton";
import StatusBadge from "@/components/admin/StatusBadge";
import CommerceImage from "@/components/shared/CommerceImage";
import {
  getAdminProducts,
  isProductStockStatusDb,
  productsCatalogSetupMessage,
  type AdminProductFilters,
} from "@/lib/products-db";
import {
  allProductsCategory,
  getProductImage,
  productCategories,
  productStockStatusOptions,
} from "@/lib/products";
import { formatPrice } from "@/lib/site-config";

interface AdminProductsPageProps {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    stockStatus?: string;
    active?: string;
  }>;
}

function formatDate(value?: string): string {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function stockLabel(value?: string): string {
  return value?.replaceAll("-", " ").replaceAll("_", " ") ?? "unknown";
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const params = searchParams ? await searchParams : {};
  const category = productCategories.find((item) => item.id === params.category)?.id;
  const filters: AdminProductFilters = {
    query: params.q?.trim() || undefined,
    category,
    stockStatus: isProductStockStatusDb(params.stockStatus) ? params.stockStatus : undefined,
    active: params.active === "archived" || params.active === "active" ? params.active : undefined,
  };
  let products = [] as Awaited<ReturnType<typeof getAdminProducts>>;
  let setupMessage = "";

  try {
    products = await getAdminProducts(filters);
  } catch (error) {
    setupMessage = error instanceof Error ? error.message : productsCatalogSetupMessage;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-secondary">
            Products
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-brand-text">Catalog management</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66717b]">
            Create, edit, publish, and archive products shown across the public shop.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-primary/90"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add product
        </Link>
      </div>

      <div className="rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-brand-primary" aria-hidden="true" />
          <h3 className="text-base font-bold text-brand-text">Filters</h3>
        </div>
        <form className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]" action="/admin/products">
          <label className="relative">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#79838d]" aria-hidden="true" />
            <input
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search name, SKU, slug"
              className="h-11 w-full rounded-xl border border-[#dfe5eb] bg-[#f8fafc] pl-10 pr-3 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </label>

          <label>
            <span className="sr-only">Category</span>
            <select name="category" defaultValue={filters.category ?? ""} className="h-11 w-full rounded-xl border border-[#dfe5eb] bg-[#f8fafc] px-3 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary">
              <option value="">All categories</option>
              <option value={allProductsCategory.id}>All products</option>
              {productCategories.map((item) => (
                <option key={item.id} value={item.id}>{item.id}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Stock status</span>
            <select name="stockStatus" defaultValue={filters.stockStatus ?? ""} className="h-11 w-full rounded-xl border border-[#dfe5eb] bg-[#f8fafc] px-3 text-sm capitalize text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary">
              <option value="">All stock</option>
              {productStockStatusOptions.map((status) => (
                <option key={status} value={status}>{stockLabel(status)}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Publish status</span>
            <select name="active" defaultValue={filters.active ?? ""} className="h-11 w-full rounded-xl border border-[#dfe5eb] bg-[#f8fafc] px-3 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary">
              <option value="">All visibility</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <button type="submit" className="h-11 rounded-xl bg-brand-primary px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-primary/90">
            Filter
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-[#e3e7ec] bg-white shadow-sm">
        {setupMessage ? (
          <div className="p-5">
            <AdminEmptyState
              icon={PackageSearch}
              title="Catalog setup required"
              message={setupMessage}
            />
          </div>
        ) : products.length === 0 ? (
          <div className="p-5">
            <AdminEmptyState
              icon={PackageSearch}
              title="No matching products"
              message="Create a product or adjust the filters to manage the catalog."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-[#f8fafc] text-xs uppercase tracking-[0.08em] text-[#69737d]">
                <tr>
                  <th className="px-5 py-3 font-bold">Product</th>
                  <th className="px-5 py-3 font-bold">SKU</th>
                  <th className="px-5 py-3 font-bold">Category</th>
                  <th className="px-5 py-3 font-bold">Price</th>
                  <th className="px-5 py-3 font-bold">Images</th>
                  <th className="px-5 py-3 font-bold">Stock</th>
                  <th className="px-5 py-3 font-bold">Featured</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Updated</th>
                  <th className="px-5 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const image = getProductImage(product);
                  return (
                    <tr key={product.id} className="border-t border-[#eef1f4] transition-colors hover:bg-[#fbfcfd]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-[#f8fafc]">
                            {image ? (
                              <CommerceImage src={image} alt={product.name} fill sizes="56px" className="object-cover" />
                            ) : (
                              <PackagePlus className="m-4 h-6 w-6 text-[#8a96a3]" aria-hidden="true" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-brand-text">{product.name}</p>
                            <p className="text-xs text-[#66717b]">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#5f6872]">{product.sku ?? "N/A"}</td>
                      <td className="px-5 py-4 text-[#5f6872]">{product.category}</td>
                      <td className="px-5 py-4 font-bold text-brand-text">{formatPrice(product.price)}</td>
                      <td className="px-5 py-4 text-[#5f6872]">{product.images?.length ?? 0}</td>
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <StatusBadge value={product.stockStatus ?? "in-stock"} label={stockLabel(product.stockStatus)} />
                          {product.trackInventory ? (
                            <p className="text-xs font-medium text-[#66717b]">{product.stockQuantity ?? 0} tracked</p>
                          ) : (
                            <p className="text-xs font-medium text-[#66717b]">Tracking off</p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge value={product.featured ? "verified" : "refunded"} label={product.featured ? "Featured" : "No"} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge value={product.isActive ? "verified" : "cancelled"} label={product.isActive ? "Active" : "Archived"} />
                      </td>
                      <td className="px-5 py-4 text-[#5f6872]">{formatDate(product.updatedAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-[#dfe5eb] bg-white px-3 text-xs font-bold text-brand-text transition-colors hover:border-brand-primary hover:text-brand-primary"
                          >
                            <Edit className="h-3.5 w-3.5" aria-hidden="true" />
                            Edit
                          </Link>
                          <ProductStatusButton productId={product.id} isActive={Boolean(product.isActive)} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
