import Link from "next/link";
import { ArrowRight, Clock, CreditCard, PackageCheck, PackagePlus, ReceiptText, TrendingUp } from "lucide-react";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { OrderStatusBadge, PaymentMethodBadge, PaymentStatusBadge } from "@/components/admin/StatusBadge";
import { getAdminOrderSummary } from "@/lib/admin/orders";
import { formatPrice } from "@/lib/site-config";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminDashboardPage() {
  const summary = await getAdminOrderSummary();

  const cards = [
    {
      label: "Total orders",
      value: summary.totalOrders,
      helper: "All saved customer orders",
      icon: ReceiptText,
      tone: "ink" as const,
    },
    {
      label: "Pending orders",
      value: summary.pendingOrders,
      helper: "Orders still waiting for action",
      icon: Clock,
      tone: "gold" as const,
    },
    {
      label: "Pending manual payments",
      value: summary.pendingManualPayments,
      helper: "bKash/Nagad payments to verify",
      icon: CreditCard,
      tone: "rose" as const,
    },
    {
      label: "Total sales",
      value: formatPrice(summary.totalSales),
      helper: "Based on saved order totals",
      icon: TrendingUp,
      tone: "green" as const,
    },
    {
      label: "Active products",
      value: summary.activeProducts,
      helper: "Currently visible in the public catalog",
      icon: PackagePlus,
      tone: "ink" as const,
    },
    {
      label: "Out of stock",
      value: summary.outOfStockProducts,
      helper: "Products needing restock or archive review",
      icon: PackageCheck,
      tone: "gold" as const,
    },
    {
      label: "Low stock",
      value: summary.lowStockProducts,
      helper: "Tracked products that are running low",
      icon: PackagePlus,
      tone: "rose" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-secondary">
            Dashboard
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-brand-text">Order overview</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66717b]">
            Monitor new orders, manual payment review, and recent customer activity from one owner workspace.
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-primary/90"
        >
          View orders
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-7">
        {cards.map((card) => (
          <AdminStatCard
            key={card.label}
            label={card.label}
            value={card.value}
            helper={card.helper}
            icon={card.icon}
            tone={card.tone}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-[#e3e7ec] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-[#eef1f4] p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary-light text-brand-primary">
              <PackageCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-brand-text">Recent orders</h3>
              <p className="text-sm text-[#66717b]">Latest customer submissions from Supabase.</p>
            </div>
          </div>
          <Link href="/admin/orders" className="text-sm font-bold text-brand-primary hover:text-brand-primary/80">
            View all
          </Link>
        </div>

        {summary.recentOrders.length === 0 ? (
          <div className="p-5">
            <AdminEmptyState
              icon={PackageCheck}
              title="No orders yet"
              message="Saved checkout orders will appear here as soon as customers place them."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-[#f8fafc] text-xs uppercase tracking-[0.08em] text-[#69737d]">
                <tr>
                  <th className="px-5 py-3 font-bold">Order</th>
                  <th className="px-5 py-3 font-bold">Customer</th>
                  <th className="px-5 py-3 font-bold">Method</th>
                  <th className="px-5 py-3 font-bold">Payment</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Total</th>
                  <th className="px-5 py-3 font-bold">Created</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-[#eef1f4] transition-colors hover:bg-[#fbfcfd]">
                    <td className="px-5 py-4 font-bold text-brand-text">
                      <Link href={`/admin/orders/${order.id}`} className="hover:text-brand-primary">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-[#5f6872]">{order.customer_name}</td>
                    <td className="px-5 py-4">
                      <PaymentMethodBadge value={order.payment_method} />
                    </td>
                    <td className="px-5 py-4">
                      <PaymentStatusBadge value={order.payment_status} />
                    </td>
                    <td className="px-5 py-4">
                      <OrderStatusBadge value={order.status} />
                    </td>
                    <td className="px-5 py-4 font-bold text-brand-text">{formatPrice(order.total)}</td>
                    <td className="px-5 py-4 text-[#5f6872]">{formatDate(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
