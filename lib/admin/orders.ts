import "server-only";

import type { ProductVariantSelection } from "@/lib/products";
import {
  orderStatusOptions,
  paymentStatusOptions,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/orders";
import { type PaymentMethod, paymentMethods } from "@/lib/site-config";
import { getAdminProductSummary } from "@/lib/products-db";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export const adminPaymentMethodOptions = paymentMethods
  .filter((method) => method.enabled)
  .map((method) => method.id);

export interface AdminOrder {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string | null;
  delivery_zone: string;
  delivery_fee: number;
  payment_method: PaymentMethod;
  subtotal: number;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_slug: string | null;
  sku: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  selected_variants: ProductVariantSelection[];
  created_at: string;
}

export interface AdminOrderWithItems extends AdminOrder {
  order_items: AdminOrderItem[];
}

export interface AdminOrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  query?: string;
}

export interface AdminOrderSummary {
  totalOrders: number;
  pendingOrders: number;
  pendingManualPayments: number;
  totalSales: number;
  activeProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  recentOrders: AdminOrder[];
}

const orderSelect =
  "id, order_number, customer_name, phone, email, address, city, delivery_zone, delivery_fee, payment_method, subtotal, total, status, payment_status, notes, created_at, updated_at";

function sanitizeSearchTerm(value: string): string {
  return value.replace(/[%_,]/g, "").trim();
}

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && orderStatusOptions.includes(value as OrderStatus);
}

export function isPaymentStatus(value: unknown): value is PaymentStatus {
  return typeof value === "string" && paymentStatusOptions.includes(value as PaymentStatus);
}

export function isAdminPaymentMethod(value: unknown): value is PaymentMethod {
  return typeof value === "string" && adminPaymentMethodOptions.includes(value as PaymentMethod);
}

export async function getAdminOrderSummary(): Promise<AdminOrderSummary> {
  const supabase = getSupabaseAdminClient();
  const productSummaryPromise = getAdminProductSummary();

  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: pendingManualPayments },
    { data: salesRows, error: salesError },
    { data: recentOrders, error },
  ] =
    await Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("payment_status", "pending")
        .in("payment_method", ["bkash", "nagad"]),
      supabase.from("orders").select("total"),
      supabase.from("orders").select(orderSelect).order("created_at", { ascending: false }).limit(5),
    ]);

  if (error || salesError) {
    throw new Error("Admin order summary could not be loaded.");
  }

  const productSummary = await productSummaryPromise;

  return {
    totalOrders: totalOrders ?? 0,
    pendingOrders: pendingOrders ?? 0,
    pendingManualPayments: pendingManualPayments ?? 0,
    totalSales: (salesRows ?? []).reduce((sum, order) => sum + Number(order.total ?? 0), 0),
    activeProducts: productSummary.activeProducts,
    outOfStockProducts: productSummary.outOfStockProducts,
    lowStockProducts: productSummary.lowStockProducts,
    recentOrders: (recentOrders ?? []) as AdminOrder[],
  };
}

export async function getAdminOrders(filters: AdminOrderFilters = {}): Promise<AdminOrder[]> {
  const supabase = getSupabaseAdminClient();
  let query = supabase.from("orders").select(orderSelect);

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.paymentStatus) {
    query = query.eq("payment_status", filters.paymentStatus);
  }

  if (filters.paymentMethod) {
    query = query.eq("payment_method", filters.paymentMethod);
  }

  const searchTerm = filters.query ? sanitizeSearchTerm(filters.query) : "";
  if (searchTerm) {
    query = query.or(`order_number.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,customer_name.ilike.%${searchTerm}%`);
  }

  const { data, error } = await query.order("created_at", { ascending: false }).limit(100);

  if (error) {
    throw new Error("Admin orders could not be loaded.");
  }

  return (data ?? []) as AdminOrder[];
}

export async function getAdminOrderById(id: string): Promise<AdminOrderWithItems | null> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`${orderSelect}, order_items(*)`)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error("Admin order detail could not be loaded.");
  }

  return data as AdminOrderWithItems;
}

export async function updateAdminOrderStatuses(
  id: string,
  updates: Partial<Pick<AdminOrder, "status" | "payment_status">>
): Promise<AdminOrder> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select(orderSelect)
    .single();

  if (error || !data) {
    throw new Error("Order status could not be updated.");
  }

  return data as AdminOrder;
}
