"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import {
  orderStatusOptions,
  paymentStatusOptions,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/orders";

interface OrderStatusFormProps {
  orderId: string;
  currentStatus: OrderStatus;
  currentPaymentStatus: PaymentStatus;
}

function toLabel(value: string): string {
  return value.replaceAll("-", " ");
}

export default function OrderStatusForm({
  orderId,
  currentStatus,
  currentPaymentStatus,
}: OrderStatusFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(currentPaymentStatus);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          paymentStatus,
        }),
      });

      const result = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setError(result?.error ?? "Order status could not be updated.");
        return;
      }

      setMessage("Order status updated.");
      router.refresh();
    } catch {
      setError("Order status could not be updated. Check your connection and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-w-0 rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary-light text-brand-primary">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-brand-text">Admin actions</h2>
          <p className="mt-1 text-sm leading-6 text-[#66717b]">
            Update fulfillment and manual payment review status.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-[#ba1a1a]/30 bg-[#ffeee8] px-4 py-3 text-sm font-medium text-[#8a1a1a]" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-brand-primary/30 bg-brand-primary-light px-4 py-3 text-sm font-bold text-brand-primary" role="status">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          <span className="min-w-0 break-words">{message}</span>
        </div>
      )}

      <div className="mt-5 grid gap-4">
        <div className="space-y-2">
          <label htmlFor="admin-order-status" className="text-sm font-bold text-brand-text">
            Order status
          </label>
          <select
            id="admin-order-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as OrderStatus)}
            className="h-11 w-full rounded-xl border border-[#dfe5eb] bg-[#f8fafc] px-3 text-sm capitalize text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {orderStatusOptions.map((option) => (
              <option key={option} value={option}>
                {toLabel(option)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="admin-payment-status" className="text-sm font-bold text-brand-text">
            Payment status
          </label>
          <select
            id="admin-payment-status"
            value={paymentStatus}
            onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)}
            className="h-11 w-full rounded-xl border border-[#dfe5eb] bg-[#f8fafc] px-3 text-sm capitalize text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {paymentStatusOptions.map((option) => (
              <option key={option} value={option}>
                {toLabel(option)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-brand-primary px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSaving ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
