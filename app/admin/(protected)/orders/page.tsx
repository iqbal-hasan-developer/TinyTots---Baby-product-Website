import Link from "next/link";
import { Eye, PackageSearch, Search, SlidersHorizontal } from "lucide-react";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import { OrderStatusBadge, PaymentMethodBadge, PaymentStatusBadge } from "@/components/admin/StatusBadge";
import {
  adminPaymentMethodOptions,
  getAdminOrders,
  isAdminPaymentMethod,
  isOrderStatus,
  isPaymentStatus,
} from "@/lib/admin/orders";
import { orderStatusOptions, paymentStatusOptions } from "@/lib/orders";
import { formatPrice } from "@/lib/site-config";

interface AdminOrdersPageProps {
  searchParams?: Promise<{
    q?: string;
    status?: string;
    paymentStatus?: string;
    paymentMethod?: string;
  }>;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function label(value: string): string {
  return value.replaceAll("-", " ");
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = searchParams ? await searchParams : {};
  const filters = {
    query: params.q?.trim() || undefined,
    status: isOrderStatus(params.status) ? params.status : undefined,
    paymentStatus: isPaymentStatus(params.paymentStatus) ? params.paymentStatus : undefined,
    paymentMethod: isAdminPaymentMethod(params.paymentMethod) ? params.paymentMethod : undefined,
  };
  const orders = await getAdminOrders(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-secondary">
            Orders
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-brand-text">Manage customer orders</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66717b]">
            Search, filter, inspect, and update saved checkout orders.
          </p>
        </div>
        <div className="rounded-full border border-[#dfe5eb] bg-white px-4 py-2 text-sm font-bold text-[#4f5b66] shadow-sm">
          {orders.length} visible
        </div>
      </div>

      <div className="rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-brand-primary" aria-hidden="true" />
          <h3 className="text-base font-bold text-brand-text">Filters</h3>
        </div>
        <form className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]" action="/admin/orders">
          <label className="relative">
            <span className="sr-only">Search by order, phone, or customer</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#79838d]" aria-hidden="true" />
            <input
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search order, phone, customer"
              className="h-11 w-full rounded-xl border border-[#dfe5eb] bg-[#f8fafc] pl-10 pr-3 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </label>

          <label>
            <span className="sr-only">Order status</span>
            <select
              name="status"
              defaultValue={filters.status ?? ""}
              className="h-11 w-full rounded-xl border border-[#dfe5eb] bg-[#f8fafc] px-3 text-sm capitalize text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">All statuses</option>
              {orderStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {label(option)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Payment status</span>
            <select
              name="paymentStatus"
              defaultValue={filters.paymentStatus ?? ""}
              className="h-11 w-full rounded-xl border border-[#dfe5eb] bg-[#f8fafc] px-3 text-sm capitalize text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">All payment statuses</option>
              {paymentStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {label(option)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Payment method</span>
            <select
              name="paymentMethod"
              defaultValue={filters.paymentMethod ?? ""}
              className="h-11 w-full rounded-xl border border-[#dfe5eb] bg-[#f8fafc] px-3 text-sm uppercase text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">All methods</option>
              {adminPaymentMethodOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="h-11 rounded-xl bg-brand-primary px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-primary/90"
          >
            Filter
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-[#e3e7ec] bg-white shadow-sm">
        {orders.length === 0 ? (
          <div className="p-5">
            <AdminEmptyState
              icon={PackageSearch}
              title="No matching orders"
              message="Adjust the search or filters to find saved customer orders."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-[#f8fafc] text-xs uppercase tracking-[0.08em] text-[#69737d]">
                <tr>
                  <th className="px-5 py-3 font-bold">Order</th>
                  <th className="px-5 py-3 font-bold">Customer</th>
                  <th className="px-5 py-3 font-bold">Phone</th>
                  <th className="px-5 py-3 font-bold">Method</th>
                  <th className="px-5 py-3 font-bold">Payment</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Total</th>
                  <th className="px-5 py-3 font-bold">Created</th>
                  <th className="px-5 py-3 font-bold">View</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-[#eef1f4] transition-colors hover:bg-[#fbfcfd]">
                    <td className="px-5 py-4 font-bold text-brand-text">{order.order_number}</td>
                    <td className="px-5 py-4 text-[#5f6872]">{order.customer_name}</td>
                    <td className="px-5 py-4 text-[#5f6872]">{order.phone}</td>
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
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#dfe5eb] bg-white text-brand-text transition-colors hover:border-brand-primary hover:text-brand-primary"
                        aria-label={`View order ${order.order_number}`}
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </td>
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
