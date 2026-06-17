import "server-only";

import type { ProductVariantSelection } from "@/lib/products";
import { getProductVariantSummary } from "@/lib/products";
import type { OrderStatus, PaymentStatus } from "@/lib/orders";
import type { PaymentMethod } from "@/lib/site-config";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export interface TrackOrderInput {
  orderNumber: string;
  phone: string;
}

export interface TrackOrderFieldErrors {
  orderNumber?: string;
  phone?: string;
}

export interface TrackedOrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  variantSummary?: string;
}

export interface TrackedOrder {
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  customerFirstName?: string;
  city?: string;
  deliveryZone: string;
  items: TrackedOrderItem[];
}

export type TrackOrderResponse =
  | {
      ok: true;
      order: TrackedOrder;
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: TrackOrderFieldErrors;
    };

interface OrderItemRow {
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  selected_variants: ProductVariantSelection[] | null;
}

interface OrderTrackingRow {
  order_number: string;
  customer_name: string | null;
  phone: string;
  city: string | null;
  delivery_zone: string;
  delivery_fee: number;
  payment_method: PaymentMethod;
  subtotal: number;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  created_at: string;
  order_items: OrderItemRow[];
}

const trackingSelect =
  "order_number, customer_name, phone, city, delivery_zone, delivery_fee, payment_method, subtotal, total, status, payment_status, created_at, order_items(product_name, quantity, unit_price, line_total, selected_variants)";

export function normalizeOrderNumber(value: string): string {
  return value.trim().toUpperCase();
}

export function normalizePhoneForMatch(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("00880")) {
    return `0${digits.slice(5)}`;
  }

  if (digits.startsWith("880")) {
    return `0${digits.slice(3)}`;
  }

  return digits;
}

function getFirstName(value: string | null): string | undefined {
  const firstName = value?.trim().split(/\s+/)[0];
  return firstName || undefined;
}

function phonesMatch(savedPhone: string, submittedPhone: string): boolean {
  const saved = normalizePhoneForMatch(savedPhone);
  const submitted = normalizePhoneForMatch(submittedPhone);

  if (!saved || !submitted) return false;
  return saved === submitted;
}

function mapTrackedOrder(row: OrderTrackingRow): TrackedOrder {
  return {
    orderNumber: row.order_number,
    status: row.status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee,
    total: row.total,
    createdAt: row.created_at,
    customerFirstName: getFirstName(row.customer_name),
    city: row.city ?? undefined,
    deliveryZone: row.delivery_zone,
    items: (row.order_items ?? []).map((item) => {
      const variantSummary = getProductVariantSummary(item.selected_variants ?? []);

      return {
        productName: item.product_name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        lineTotal: item.line_total,
        variantSummary: variantSummary || undefined,
      };
    }),
  };
}

export async function getTrackedOrder(input: TrackOrderInput): Promise<TrackedOrder | null> {
  const orderNumber = normalizeOrderNumber(input.orderNumber);
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(trackingSelect)
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error) {
    throw new Error("Order tracking lookup failed.");
  }

  if (!data) {
    return null;
  }

  const order = data as OrderTrackingRow;

  if (!phonesMatch(order.phone, input.phone)) {
    return null;
  }

  return mapTrackedOrder(order);
}
