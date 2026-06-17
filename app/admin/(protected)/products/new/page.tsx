import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";

export default function NewAdminProductPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-primary/80">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to products
        </Link>
        <div className="mt-5">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-secondary">
            New product
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-brand-text">Create catalog product</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66717b]">
            Add a product to Supabase. Active products appear on the public shop after saving.
          </p>
        </div>
      </div>

      <ProductForm mode="create" />
    </div>
  );
}
