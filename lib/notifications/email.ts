import "server-only";

import { Resend } from "resend";
import type { OrderStatus, PaymentStatus } from "@/lib/orders";
import type { PaymentMethod } from "@/lib/site-config";
import { formatPrice, siteConfig } from "@/lib/site-config";

export interface NotificationOrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  sku?: string | null;
  variantSummary?: string;
}

export interface NotificationOrder {
  id?: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string | null;
  phone?: string | null;
  city?: string | null;
  deliveryZone: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt?: string;
  items: NotificationOrderItem[];
}

export interface EmailNotificationResult {
  ok: boolean;
  sent: boolean;
  skipped?: boolean;
  reason?: string;
}

interface EmailContext {
  baseUrl: string;
}

type EmailEvent =
  | "customer-order-confirmation"
  | "admin-new-order"
  | "customer-order-status-update"
  | "customer-payment-status-update";

const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "Order received",
  confirmed: "Confirmed",
  processing: "Preparing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "Payment pending",
  verified: "Payment verified",
  paid: "Paid",
  failed: "Payment failed",
  refunded: "Refunded",
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  bkash: "bKash",
  nagad: "Nagad",
};

function getEmailConfig(): { apiKey: string; from: string } | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();

  if (!apiKey || !from) return null;
  return { apiKey, from };
}

function getAdminRecipients(): string[] {
  return (process.env.ADMIN_NOTIFICATION_EMAIL ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getAbsoluteUrl(baseUrl: string, path: string): string {
  try {
    return new URL(path, baseUrl).toString();
  } catch {
    return path;
  }
}

function getTrackOrderUrl(order: NotificationOrder, baseUrl: string): string {
  return getAbsoluteUrl(baseUrl, `/track-order?order=${encodeURIComponent(order.orderNumber)}`);
}

function getAdminOrderUrl(order: NotificationOrder, baseUrl: string): string | undefined {
  if (!order.id) return undefined;
  return getAbsoluteUrl(baseUrl, `/admin/orders/${encodeURIComponent(order.id)}`);
}

function safeErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message?: unknown }).message ?? "Unknown email error");
  }
  return "Unknown email error";
}

function logEmailFailure(event: EmailEvent, error: unknown) {
  console.error(`[email] ${event} failed: ${safeErrorMessage(error)}`);
}

function renderEmailShell(title: string, body: string): string {
  return `
    <div style="margin:0;background:#f6f8fb;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#26322b;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e3e7ec;border-radius:18px;overflow:hidden;">
        <div style="padding:24px;background:#e9f7ef;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#456253;">${escapeHtml(siteConfig.businessName)}</p>
          <h1 style="margin:0;font-size:24px;line-height:1.25;color:#26322b;">${escapeHtml(title)}</h1>
        </div>
        <div style="padding:24px;">
          ${body}
          <p style="margin:28px 0 0;font-size:13px;line-height:1.6;color:#66717b;">
            Need help? Contact ${escapeHtml(siteConfig.businessName)} at ${escapeHtml(siteConfig.phone)}.
          </p>
        </div>
      </div>
    </div>
  `;
}

function renderDetails(rows: Array<[string, string]>): string {
  return `
    <table style="width:100%;border-collapse:collapse;margin:18px 0;font-size:14px;">
      <tbody>
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eef1f4;color:#66717b;">${escapeHtml(label)}</td>
                <td style="padding:10px 0;border-bottom:1px solid #eef1f4;text-align:right;font-weight:700;color:#26322b;">${escapeHtml(value)}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderItems(order: NotificationOrder): string {
  return `
    <div style="margin:22px 0;">
      <h2 style="margin:0 0 10px;font-size:16px;color:#26322b;">Order items</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr>
            <th style="padding:10px;border-bottom:1px solid #e3e7ec;text-align:left;color:#66717b;">Item</th>
            <th style="padding:10px;border-bottom:1px solid #e3e7ec;text-align:center;color:#66717b;">Qty</th>
            <th style="padding:10px;border-bottom:1px solid #e3e7ec;text-align:right;color:#66717b;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
                <tr>
                  <td style="padding:12px 10px;border-bottom:1px solid #eef1f4;">
                    <div style="font-weight:700;color:#26322b;">${escapeHtml(item.productName)}</div>
                    ${
                      item.variantSummary
                        ? `<div style="margin-top:3px;font-size:12px;color:#66717b;">${escapeHtml(item.variantSummary)}</div>`
                        : ""
                    }
                  </td>
                  <td style="padding:12px 10px;border-bottom:1px solid #eef1f4;text-align:center;color:#26322b;">${item.quantity}</td>
                  <td style="padding:12px 10px;border-bottom:1px solid #eef1f4;text-align:right;font-weight:700;color:#26322b;">${escapeHtml(formatPrice(item.lineTotal))}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderCta(label: string, href: string): string {
  return `
    <p style="margin:22px 0;">
      <a href="${escapeHtml(href)}" style="display:inline-block;border-radius:12px;background:#456253;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 18px;">
        ${escapeHtml(label)}
      </a>
    </p>
  `;
}

async function sendEmail(
  event: EmailEvent,
  to: string | string[],
  subject: string,
  html: string
): Promise<EmailNotificationResult> {
  const config = getEmailConfig();

  if (!config) {
    return { ok: true, sent: false, skipped: true, reason: "Email provider is not configured." };
  }

  try {
    const resend = new Resend(config.apiKey);
    const { error } = await resend.emails.send({
      from: config.from,
      to,
      subject,
      html,
    });

    if (error) {
      logEmailFailure(event, error);
      return { ok: false, sent: false, reason: "Email provider rejected the message." };
    }

    return { ok: true, sent: true };
  } catch (error) {
    logEmailFailure(event, error);
    return { ok: false, sent: false, reason: "Email delivery failed." };
  }
}

export async function sendCustomerOrderConfirmation(
  order: NotificationOrder,
  context: EmailContext
): Promise<EmailNotificationResult> {
  if (!order.customerEmail) {
    return { ok: true, sent: false, skipped: true, reason: "Customer email was not provided." };
  }

  const trackUrl = getTrackOrderUrl(order, context.baseUrl);
  const body = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#4f5b66;">
      Hi ${escapeHtml(order.customerName.split(/\s+/)[0] || "there")}, we received your order.
    </p>
    ${renderDetails([
      ["Order number", order.orderNumber],
      ["Order status", orderStatusLabels[order.status]],
      ["Payment method", paymentMethodLabels[order.paymentMethod]],
      ["Payment status", paymentStatusLabels[order.paymentStatus]],
    ])}
    ${renderItems(order)}
    ${renderDetails([
      ["Subtotal", formatPrice(order.subtotal)],
      ["Delivery fee", formatPrice(order.deliveryFee)],
      ["Total", formatPrice(order.total)],
    ])}
    ${renderCta("Track this order", trackUrl)}
  `;

  return sendEmail(
    "customer-order-confirmation",
    order.customerEmail,
    `${siteConfig.businessName} order received: ${order.orderNumber}`,
    renderEmailShell("Your order is received", body)
  );
}

export async function sendAdminNewOrderNotification(
  order: NotificationOrder,
  context: EmailContext
): Promise<EmailNotificationResult> {
  const recipients = getAdminRecipients();

  if (recipients.length === 0) {
    return { ok: true, sent: false, skipped: true, reason: "Admin notification email is not configured." };
  }

  const adminUrl = getAdminOrderUrl(order, context.baseUrl);
  const body = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#4f5b66;">
      A new customer order is ready for review.
    </p>
    ${renderDetails([
      ["Order number", order.orderNumber],
      ["Customer", order.customerName],
      ["Phone", order.phone ?? "Not provided"],
      ["City / zone", `${order.city ?? "Not provided"} / ${order.deliveryZone}`],
      ["Payment method", paymentMethodLabels[order.paymentMethod]],
      ["Payment status", paymentStatusLabels[order.paymentStatus]],
      ["Total", formatPrice(order.total)],
    ])}
    ${renderItems(order)}
    ${adminUrl ? renderCta("Open in admin", adminUrl) : ""}
  `;

  return sendEmail(
    "admin-new-order",
    recipients,
    `New order ${order.orderNumber} - ${siteConfig.businessName}`,
    renderEmailShell("New order alert", body)
  );
}

export async function sendCustomerOrderStatusUpdate(
  order: NotificationOrder,
  previousStatus: OrderStatus,
  newStatus: OrderStatus,
  context: EmailContext
): Promise<EmailNotificationResult> {
  if (!order.customerEmail) {
    return { ok: true, sent: false, skipped: true, reason: "Customer email was not provided." };
  }

  const trackUrl = getTrackOrderUrl(order, context.baseUrl);
  const body = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#4f5b66;">
      Your order status has been updated.
    </p>
    ${renderDetails([
      ["Order number", order.orderNumber],
      ["Previous status", orderStatusLabels[previousStatus]],
      ["New status", orderStatusLabels[newStatus]],
    ])}
    ${renderCta("Track this order", trackUrl)}
  `;

  return sendEmail(
    "customer-order-status-update",
    order.customerEmail,
    `Order status updated: ${order.orderNumber}`,
    renderEmailShell("Order status updated", body)
  );
}

export async function sendCustomerPaymentStatusUpdate(
  order: NotificationOrder,
  previousPaymentStatus: PaymentStatus,
  newPaymentStatus: PaymentStatus,
  context: EmailContext
): Promise<EmailNotificationResult> {
  if (!order.customerEmail) {
    return { ok: true, sent: false, skipped: true, reason: "Customer email was not provided." };
  }

  const trackUrl = getTrackOrderUrl(order, context.baseUrl);
  const body = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#4f5b66;">
      Your payment status has been updated.
    </p>
    ${renderDetails([
      ["Order number", order.orderNumber],
      ["Payment method", paymentMethodLabels[order.paymentMethod]],
      ["Previous payment status", paymentStatusLabels[previousPaymentStatus]],
      ["New payment status", paymentStatusLabels[newPaymentStatus]],
    ])}
    ${renderCta("Track this order", trackUrl)}
  `;

  return sendEmail(
    "customer-payment-status-update",
    order.customerEmail,
    `Payment status updated: ${order.orderNumber}`,
    renderEmailShell("Payment status updated", body)
  );
}

export async function sendOrderCreatedNotifications(
  order: NotificationOrder,
  context: EmailContext
): Promise<EmailNotificationResult[]> {
  return Promise.all([
    sendCustomerOrderConfirmation(order, context),
    sendAdminNewOrderNotification(order, context),
  ]);
}
