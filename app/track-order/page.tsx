import { Truck } from "lucide-react";
import TrackOrderForm from "@/components/orders/TrackOrderForm";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: `Track Your Order | ${siteConfig.businessName}`,
  description: "Check your TinyTots BD order status with your order number and checkout phone number.",
};

interface TrackOrderPageProps {
  searchParams?: Promise<{
    order?: string;
  }>;
}

export default async function TrackOrderPage({ searchParams }: TrackOrderPageProps) {
  const params = searchParams ? await searchParams : {};

  return (
    <main className="flex-1 bg-brand-surface">
      <section className="container-max mx-auto px-4 py-10 md:px-6 md:py-14">
        <div className="mb-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-secondary ring-1 ring-brand-outline">
            <Truck className="h-4 w-4" aria-hidden="true" />
            Order tracking
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-normal text-brand-text md:text-4xl">
            Track Your Order
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-brand-text-muted md:text-base">
            Enter your order number and checkout phone number to see the latest safe customer-facing status.
          </p>
        </div>

        <TrackOrderForm initialOrderNumber={params.order} />
      </section>
    </main>
  );
}
