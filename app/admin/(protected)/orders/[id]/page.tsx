import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CreditCard, MapPin, ReceiptText, UserRound } from "lucide-react";
import OrderStatusForm from "@/components/admin/OrderStatusForm";
import { OrderStatusBadge, PaymentMethodBadge, PaymentStatusBadge } from "@/components/admin/StatusBadge";
import { getAdminOrderById } from "@/lib/admin/orders";
import { getProductVariantSummary } from "@/lib/products";
import { formatPrice } from "@/lib/site-config";

interface AdminOrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-primary/80"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to orders
        </Link>
        <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-secondary">
              Order detail
            </p>
            <h2 className="mt-2 break-words text-2xl font-bold tracking-normal text-brand-text sm:text-3xl">
              {order.order_number}
            </h2>
            <p className="mt-2 text-sm text-[#66717b]">Created {formatDate(order.created_at)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <OrderStatusBadge value={order.status} />
            <PaymentStatusBadge value={order.payment_status} />
          </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="min-w-0 rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary-light text-brand-primary">
                  <UserRound className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-brand-text">Customer</h3>
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-bold text-brand-text">Name</dt>
                  <dd className="mt-1 break-words text-[#66717b]">{order.customer_name}</dd>
                </div>
                <div>
                  <dt className="font-bold text-brand-text">Phone</dt>
                  <dd className="mt-1 break-words text-[#66717b]">{order.phone}</dd>
                </div>
                {order.email && (
                  <div>
                    <dt className="font-bold text-brand-text">Email</dt>
                    <dd className="mt-1 break-all text-[#66717b]">{order.email}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="min-w-0 rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef1f5] text-[#384552]">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-brand-text">Delivery</h3>
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-bold text-brand-text">Zone</dt>
                  <dd className="mt-1 capitalize text-[#66717b]">{order.delivery_zone}</dd>
                </div>
                <div>
                  <dt className="font-bold text-brand-text">Address</dt>
                  <dd className="mt-1 break-words text-[#66717b]">{order.address}</dd>
                </div>
                {order.city && (
                  <div>
                    <dt className="font-bold text-brand-text">City</dt>
                    <dd className="mt-1 break-words text-[#66717b]">{order.city}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-[#e3e7ec] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#eef1f4] p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-secondary-light text-brand-secondary">
                <ReceiptText className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-brand-text">Order items</h3>
                <p className="text-sm text-[#66717b]">{order.order_items.length} line item(s)</p>
              </div>
            </div>

            <div className="divide-y divide-[#eef1f4] md:hidden">
              {order.order_items.map((item) => {
                const variantSummary = getProductVariantSummary(item.selected_variants);
                return (
                  <div key={item.id} className="p-5">
                    <p className="break-words font-bold text-brand-text">{item.product_name}</p>
                    {variantSummary && (
                      <p className="mt-1 break-words text-xs font-medium text-[#66717b]">
                        {variantSummary}
                      </p>
                    )}
                    <dl className="mt-4 grid gap-3 text-sm">
                      <div className="flex flex-col gap-1">
                        <dt className="text-[#66717b]">SKU</dt>
                        <dd className="break-all font-bold text-brand-text">{item.sku ?? "N/A"}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <dt className="text-[#66717b]">Qty</dt>
                          <dd className="mt-1 font-bold text-brand-text">{item.quantity}</dd>
                        </div>
                        <div>
                          <dt className="text-[#66717b]">Unit</dt>
                          <dd className="mt-1 font-bold text-brand-text">{formatPrice(item.unit_price)}</dd>
                        </div>
                        <div>
                          <dt className="text-[#66717b]">Total</dt>
                          <dd className="mt-1 font-bold text-brand-text">{formatPrice(item.line_total)}</dd>
                        </div>
                      </div>
                    </dl>
                  </div>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-[#f8fafc] text-xs uppercase tracking-[0.08em] text-[#69737d]">
                  <tr>
                    <th className="px-5 py-3 font-bold">Product</th>
                    <th className="px-5 py-3 font-bold">SKU</th>
                    <th className="px-5 py-3 font-bold">Qty</th>
                    <th className="px-5 py-3 font-bold">Unit</th>
                    <th className="px-5 py-3 font-bold">Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items.map((item) => {
                    const variantSummary = getProductVariantSummary(item.selected_variants);
                    return (
                      <tr key={item.id} className="border-t border-[#eef1f4]">
                        <td className="px-5 py-4">
                          <p className="break-words font-bold text-brand-text">{item.product_name}</p>
                          {variantSummary && (
                            <p className="mt-1 break-words text-xs font-medium text-[#66717b]">{variantSummary}</p>
                          )}
                        </td>
                        <td className="px-5 py-4 break-all text-[#66717b]">{item.sku ?? "N/A"}</td>
                        <td className="px-5 py-4 text-[#66717b]">{item.quantity}</td>
                        <td className="px-5 py-4 text-[#66717b]">{formatPrice(item.unit_price)}</td>
                        <td className="px-5 py-4 font-bold text-brand-text">{formatPrice(item.line_total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-5">
          <OrderStatusForm
            orderId={order.id}
            currentStatus={order.status}
            currentPaymentStatus={order.payment_status}
          />

          <div className="rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0edff] text-[#5742a6]">
                <CreditCard className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-bold text-brand-text">Payment summary</h3>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-[#66717b]">Payment method</dt>
                <dd className="min-w-0">
                  <PaymentMethodBadge value={order.payment_method} />
                </dd>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-[#66717b]">Payment status</dt>
                <dd className="min-w-0">
                  <PaymentStatusBadge value={order.payment_status} />
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-[#eef1f4] pt-3">
                <dt className="text-[#66717b]">Subtotal</dt>
                <dd className="font-bold text-brand-text">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#66717b]">Delivery fee</dt>
                <dd className="font-bold text-brand-text">{formatPrice(order.delivery_fee)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-[#eef1f4] pt-3 text-base">
                <dt className="font-bold text-brand-text">Total</dt>
                <dd className="font-bold text-brand-text">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </div>

          {order.notes && (
            <div className="rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-brand-text">Notes</h3>
              <p className="mt-3 break-words text-sm leading-6 text-[#66717b]">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
