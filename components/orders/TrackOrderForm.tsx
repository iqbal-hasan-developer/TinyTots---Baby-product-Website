"use client";

import { type FormEvent, useMemo, useState } from "react";
import { ClipboardList, Loader2, PackageCheck, Search, ShieldCheck } from "lucide-react";
import StatusBadge, { PaymentMethodBadge } from "@/components/admin/StatusBadge";
import type { OrderStatus, PaymentStatus } from "@/lib/orders";
import type { TrackOrderResponse, TrackedOrder } from "@/lib/order-tracking";
import { formatPrice } from "@/lib/site-config";

interface TrackOrderFormProps {
  initialOrderNumber?: string;
}

const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "Order received",
  confirmed: "Confirmed",
  processing: "Preparing",
  shipped: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const orderStatusMessages: Record<OrderStatus, string> = {
  pending: "We have received your order and the store team will review it soon.",
  confirmed: "Your order has been confirmed by the store team.",
  processing: "Your items are being prepared for delivery.",
  shipped: "Your order has left the store and is on the way.",
  delivered: "Your order has been delivered.",
  cancelled: "This order was cancelled. Contact the store if you need help.",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "Payment pending",
  verified: "Payment verified",
  paid: "Paid",
  failed: "Payment failed",
  refunded: "Refunded",
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function normalizeOrderNumber(value: string): string {
  return value.trim().toUpperCase();
}

export default function TrackOrderForm({ initialOrderNumber = "" }: TrackOrderFormProps) {
  const [orderNumber, setOrderNumber] = useState(() => normalizeOrderNumber(initialOrderNumber));
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ orderNumber?: string; phone?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const statusMessage = useMemo(
    () => order ? orderStatusMessages[order.status] : "",
    [order]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setOrder(null);

    const nextFieldErrors: { orderNumber?: string; phone?: string } = {};
    const normalizedOrderNumber = normalizeOrderNumber(orderNumber);

    if (!normalizedOrderNumber) {
      nextFieldErrors.orderNumber = "Order number is required.";
    }

    if (!phone.trim()) {
      nextFieldErrors.phone = "Phone number is required.";
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber: normalizedOrderNumber,
          phone,
        }),
      });
      const result = (await response.json().catch(() => null)) as TrackOrderResponse | null;

      if (!response.ok || !result?.ok) {
        setFieldErrors(result && !result.ok ? result.fieldErrors ?? {} : {});
        setError(result && !result.ok ? result.error : "We could not find an order with those details.");
        return;
      }

      setOrder(result.order);
      setOrderNumber(result.order.orderNumber);
    } catch {
      setError("Order tracking is unavailable right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]">
      <section className="rounded-2xl border border-brand-outline bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-primary-light text-brand-primary">
            <ClipboardList className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-brand-text">Enter order details</h2>
            <p className="mt-1 text-sm leading-6 text-brand-text-muted">
              Use the order number from checkout and the phone number used to place the order.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="track-order-number" className="text-sm font-bold text-brand-text">
              Order number
            </label>
            <input
              id="track-order-number"
              value={orderNumber}
              onChange={(event) => {
                setOrderNumber(normalizeOrderNumber(event.target.value));
                setFieldErrors((current) => ({ ...current, orderNumber: undefined }));
              }}
              placeholder="TTBD-YYYYMMDD-XXXXXXXX"
              aria-invalid={Boolean(fieldErrors.orderNumber)}
              aria-describedby={fieldErrors.orderNumber ? "track-order-number-error" : undefined}
              className="w-full rounded-xl border border-brand-outline bg-brand-surface px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            {fieldErrors.orderNumber && (
              <p id="track-order-number-error" className="text-sm font-bold text-[#8a1a1a]" role="alert">
                {fieldErrors.orderNumber}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="track-phone" className="text-sm font-bold text-brand-text">
              Phone number
            </label>
            <input
              id="track-phone"
              type="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setFieldErrors((current) => ({ ...current, phone: undefined }));
              }}
              placeholder="+880 1XXXXXXXXX"
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={fieldErrors.phone ? "track-phone-error" : undefined}
              className="w-full rounded-xl border border-brand-outline bg-brand-surface px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            {fieldErrors.phone && (
              <p id="track-phone-error" className="text-sm font-bold text-[#8a1a1a]" role="alert">
                {fieldErrors.phone}
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-xl border border-[#ba1a1a]/30 bg-[#ffeee8] px-4 py-3 text-sm font-bold text-[#8a1a1a]" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Search className="h-4 w-4" aria-hidden="true" />
            )}
            {isLoading ? "Checking..." : "Track order"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-brand-outline bg-white p-5 shadow-sm md:p-6">
        {order ? (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-3 border-b border-brand-outline pb-5 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-brand-secondary">
                  {order.orderNumber}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-brand-text">
                  {orderStatusLabels[order.status]}
                </h2>
                <p className="mt-2 text-sm leading-6 text-brand-text-muted">{statusMessage}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={order.status} label={orderStatusLabels[order.status]} />
                <StatusBadge value={order.paymentStatus} label={paymentStatusLabels[order.paymentStatus]} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoTile label="Placed" value={formatDate(order.createdAt)} />
              <InfoTile label="Payment method" value={<PaymentMethodBadge value={order.paymentMethod} />} />
              <InfoTile label="Delivery zone" value={order.deliveryZone} />
              <InfoTile label="City" value={order.city ?? "Not provided"} />
            </div>

            <div>
              <h3 className="text-base font-bold text-brand-text">Items</h3>
              <div className="mt-3 divide-y divide-brand-outline rounded-xl border border-brand-outline">
                {order.items.map((item, index) => (
                  <div key={`${item.productName}-${index}`} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-brand-text">{item.productName}</p>
                        {item.variantSummary && (
                          <p className="mt-1 text-xs font-medium text-brand-text-muted">{item.variantSummary}</p>
                        )}
                        <p className="mt-1 text-xs font-medium text-brand-text-muted">Qty {item.quantity}</p>
                      </div>
                      <p className="font-bold text-brand-text">{formatPrice(item.lineTotal)}</p>
                    </div>
                    <p className="mt-2 text-xs text-brand-text-muted">Unit price {formatPrice(item.unitPrice)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-brand-surface p-4">
              <div className="flex justify-between gap-4 border-b border-brand-outline pb-3 text-sm">
                <span className="text-brand-text-muted">Subtotal</span>
                <span className="font-bold text-brand-text">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-brand-outline py-3 text-sm">
                <span className="text-brand-text-muted">Delivery fee</span>
                <span className="font-bold text-brand-text">{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between gap-4 pt-3">
                <span className="font-bold text-brand-text">Total</span>
                <span className="font-bold text-brand-text">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary-light text-brand-primary">
              <PackageCheck className="h-8 w-8" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-brand-text">Your order status will appear here</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-brand-text-muted">
              Tracking is private. We only show results when the order number and checkout phone number match.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-surface px-4 py-2 text-xs font-bold text-brand-text-muted">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Full address and contact details stay hidden
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function InfoTile({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-brand-outline bg-brand-surface p-4">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand-text-muted">{label}</p>
      <div className="mt-2 text-sm font-bold capitalize text-brand-text">{value}</div>
    </div>
  );
}
