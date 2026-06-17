import type { CartItem } from "@/lib/cart-context";
import type { ProductVariantSelection, ProductVariantSelectionInput } from "@/lib/products";
import type { DeliveryZone, PaymentMethod } from "@/lib/site-config";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "verified" | "paid" | "failed" | "refunded";

export const orderStatusOptions = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const satisfies readonly OrderStatus[];

export const paymentStatusOptions = [
  "pending",
  "verified",
  "paid",
  "failed",
  "refunded",
] as const satisfies readonly PaymentStatus[];

export interface CheckoutCustomerInput {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
}

export interface CheckoutOrderItemInput {
  id: string;
  slug?: string;
  sku?: string;
  quantity: number;
  selectedVariants?: ProductVariantSelectionInput[];
}

export interface CreateOrderInput {
  customer: CheckoutCustomerInput;
  deliveryZone: DeliveryZone;
  paymentMethod: PaymentMethod;
  items: CheckoutOrderItemInput[];
  notes?: string;
}

export interface OrderItemInsert {
  order_id: string;
  product_id: string;
  product_slug: string | null;
  sku: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  selected_variants?: ProductVariantSelection[];
}

export interface CreatedOrderResult {
  id: string;
  orderNumber: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  itemCount: number;
}

export type CreateOrderResponse =
  | {
      ok: true;
      order: CreatedOrderResult;
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<keyof CheckoutCustomerInput | "cart" | "deliveryZone" | "paymentMethod", string>>;
    };

export function toCheckoutOrderItems(items: CartItem[]): CheckoutOrderItemInput[] {
  return items.map((item) => ({
    id: item.id,
    slug: item.slug,
    sku: item.sku,
    quantity: item.quantity,
    selectedVariants: item.selectedVariants?.map((selection) => ({
      groupId: selection.groupId,
      optionId: selection.optionId,
    })),
  }));
}
