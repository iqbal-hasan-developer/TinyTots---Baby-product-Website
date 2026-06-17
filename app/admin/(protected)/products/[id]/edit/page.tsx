import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, PackageSearch } from "lucide-react";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import ProductForm from "@/components/admin/ProductForm";
import StatusBadge from "@/components/admin/StatusBadge";
import { getAdminProductById, productsCatalogSetupMessage } from "@/lib/products-db";

interface EditAdminProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAdminProductPage({ params }: EditAdminProductPageProps) {
  const { id } = await params;
  let product = null;
  let setupMessage = "";

  try {
    product = await getAdminProductById(id);
  } catch (error) {
    setupMessage = error instanceof Error ? error.message : productsCatalogSetupMessage;
  }

  if (setupMessage) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
          <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-primary/80">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to products
          </Link>
        </div>

        <div className="rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
          <AdminEmptyState
            icon={PackageSearch}
            title="Catalog setup required"
            message={setupMessage}
          />
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-primary/80">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to products
        </Link>
        <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-secondary">
              Edit product
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal text-brand-text">{product.name}</h2>
            <p className="mt-2 text-sm text-[#66717b]">{product.slug}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={product.isActive ? "verified" : "cancelled"} label={product.isActive ? "Active" : "Archived"} />
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-[#dfe5eb] bg-white px-3 text-xs font-bold text-brand-text transition-colors hover:border-brand-primary hover:text-brand-primary"
              target="_blank"
            >
              View public
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <ProductForm mode="edit" product={product} />
    </div>
  );
}
