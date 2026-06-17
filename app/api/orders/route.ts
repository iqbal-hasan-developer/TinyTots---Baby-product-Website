import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  getProductVariantSummary,
  getProductPriceForSelections,
  getProductSkuForSelections,
  isProductAvailableForPurchase,
  resolveProductVariantSelections,
  type Product,
  type ProductVariantSelection,
  type ProductVariantSelectionInput,
} from "@/lib/products";
import { getTrustedActiveProductsForOrder } from "@/lib/products-db";
import {
  type CreateOrderInput,
  type CreateOrderResponse,
  type OrderItemInsert,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/orders";
import { sendOrderCreatedNotifications, type NotificationOrder } from "@/lib/notifications/email";
import { type DeliveryZone, type PaymentMethod, getDeliveryFee, paymentMethods } from "@/lib/site-config";
import { getSupabaseAdminClient, isSupabaseConfigError } from "@/lib/supabase/server";

export const runtime = "nodejs";

type FieldErrors = NonNullable<Extract<CreateOrderResponse, { ok: false }>["fieldErrors"]>;

interface PreparedItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  sku?: string;
  selectedVariants: ProductVariantSelection[];
}

interface PersistedOrderRecord {
  id: string;
  order_number: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  status: OrderStatus;
  payment_status: PaymentStatus;
}

const enabledPaymentMethodIds = paymentMethods
  .filter((method) => method.enabled)
  .map((method) => method.id);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDeliveryZone(value: unknown): value is DeliveryZone {
  return value === "inside" || value === "outside";
}

function isPaymentMethod(value: unknown): value is PaymentMethod {
  return typeof value === "string" && enabledPaymentMethodIds.includes(value as PaymentMethod);
}

function isVariantSelectionInput(value: unknown): value is ProductVariantSelectionInput {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    typeof (value as { groupId?: unknown }).groupId === "string" &&
    typeof (value as { optionId?: unknown }).optionId === "string"
  );
}

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `TTBD-${date}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function getRequestBaseUrl(request: Request): string {
  return new URL(request.url).origin;
}

function buildNotificationOrder(
  order: PersistedOrderRecord,
  input: CreateOrderInput,
  preparedItems: PreparedItem[]
): NotificationOrder {
  return {
    id: order.id,
    orderNumber: order.order_number,
    customerName: input.customer.name,
    customerEmail: input.customer.email ?? null,
    phone: input.customer.phone,
    city: input.customer.city ?? null,
    deliveryZone: input.deliveryZone,
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    status: order.status,
    subtotal: order.subtotal,
    deliveryFee: order.delivery_fee,
    total: order.total,
    items: preparedItems.map(({ product, quantity, unitPrice, sku, selectedVariants }) => ({
      productName: product.name,
      quantity,
      unitPrice,
      lineTotal: unitPrice * quantity,
      sku,
      variantSummary: getProductVariantSummary(selectedVariants) || undefined,
    })),
  };
}

function isInventoryRpcMissingError(error: { code?: string | null; message?: string | null }): boolean {
  return (
    error.code === "42883" ||
    error.code === "PGRST202" ||
    String(error.message ?? "").includes("create_order_with_inventory")
  );
}

function validateCheckoutInput(payload: unknown): {
  input?: CreateOrderInput;
  fieldErrors: FieldErrors;
} {
  const fieldErrors: FieldErrors = {};

  if (!isRecord(payload)) {
    return {
      fieldErrors: {
        cart: "Invalid checkout request.",
      },
    };
  }

  const customer = isRecord(payload.customer) ? payload.customer : {};
  const name = typeof customer.name === "string" ? customer.name.trim() : "";
  const phone = typeof customer.phone === "string" ? customer.phone.trim() : "";
  const email = typeof customer.email === "string" ? customer.email.trim() : "";
  const address = typeof customer.address === "string" ? customer.address.trim() : "";
  const city = typeof customer.city === "string" ? customer.city.trim() : "";
  const notes = typeof payload.notes === "string" ? payload.notes.trim() : "";
  const deliveryZone = payload.deliveryZone;
  const paymentMethod = payload.paymentMethod;
  const items = Array.isArray(payload.items) ? payload.items : [];

  if (!name) fieldErrors.name = "Full name is required.";
  if (!phone) {
    fieldErrors.phone = "Phone number is required.";
  } else if (!/^\+?\d{7,15}$/.test(phone.replace(/[\s()-]/g, ""))) {
    fieldErrors.phone = "Enter a valid phone number.";
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }
  if (!address) fieldErrors.address = "Full address is required.";
  if (!isDeliveryZone(deliveryZone)) fieldErrors.deliveryZone = "Choose a valid delivery method.";
  if (!isPaymentMethod(paymentMethod)) fieldErrors.paymentMethod = "Choose a valid payment method.";
  if (items.length === 0) fieldErrors.cart = "Add at least one product to your cart before checkout.";

  const normalizedItems = items
    .filter(isRecord)
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : "",
      slug: typeof item.slug === "string" ? item.slug : undefined,
      sku: typeof item.sku === "string" ? item.sku : undefined,
      quantity: typeof item.quantity === "number" ? item.quantity : Number(item.quantity),
      selectedVariants: Array.isArray(item.selectedVariants)
        ? item.selectedVariants.filter(isVariantSelectionInput)
        : undefined,
    }));

  if (
    normalizedItems.length !== items.length ||
    normalizedItems.some((item) => !item.id || !Number.isInteger(item.quantity) || item.quantity <= 0)
  ) {
    fieldErrors.cart = "Your cart has an invalid item. Please refresh and try again.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  return {
    input: {
      customer: {
        name,
        phone,
        email: email || undefined,
        address,
        city: city || undefined,
      },
      deliveryZone: deliveryZone as DeliveryZone,
      paymentMethod: paymentMethod as PaymentMethod,
      items: normalizedItems,
      notes: notes || undefined,
    },
    fieldErrors,
  };
}

async function prepareOrderItems(input: CreateOrderInput): Promise<{
  preparedItems?: PreparedItem[];
  fieldErrors: FieldErrors;
}> {
  const fieldErrors: FieldErrors = {};
  const itemMap = new Map<string, PreparedItem>();
  const productQuantityMap = new Map<string, number>();
  const trustedProducts = await getTrustedActiveProductsForOrder(input.items);

  for (const item of input.items) {
    const product = trustedProducts.find((candidate) =>
      candidate.id === item.id ||
      (item.slug && candidate.slug === item.slug) ||
      (item.sku && candidate.sku === item.sku)
    );

    if (!product) {
      fieldErrors.cart = "One or more products are no longer available.";
      continue;
    }

    if (!isProductAvailableForPurchase(product)) {
      fieldErrors.cart = `${product.name} is currently out of stock.`;
      continue;
    }

    const selectedVariants = resolveProductVariantSelections(product, item.selectedVariants);
    const variantKey = selectedVariants
      .map((selection) => `${selection.groupId}:${selection.optionId}`)
      .join("|");
    const lineKey = `${product.id}__${variantKey}`;
    const requestedQuantity = item.quantity;

    const unitPrice = getProductPriceForSelections(product, selectedVariants);
    const sku = getProductSkuForSelections(product, selectedVariants) ?? product.sku;
    const existing = itemMap.get(lineKey);
    const combinedQuantity = (existing?.quantity ?? 0) + requestedQuantity;
    const totalRequestedForProduct =
      (productQuantityMap.get(product.id) ?? 0) + requestedQuantity;

    if (product.trackInventory && totalRequestedForProduct > (product.stockQuantity ?? 0)) {
      fieldErrors.cart = `${product.name} does not have enough stock for this quantity.`;
      continue;
    }

    productQuantityMap.set(product.id, totalRequestedForProduct);
    itemMap.set(lineKey, {
      product,
      quantity: combinedQuantity,
      unitPrice,
      sku,
      selectedVariants,
    });
  }

  const preparedItems = [...itemMap.values()];

  if (preparedItems.length === 0 && !fieldErrors.cart) {
    fieldErrors.cart = "Add at least one product to your cart before checkout.";
  }

  return Object.keys(fieldErrors).length > 0
    ? { fieldErrors }
    : { preparedItems, fieldErrors };
}

async function insertOrderWithoutInventory(
  supabase: ReturnType<typeof getSupabaseAdminClient>,
  input: CreateOrderInput,
  preparedItems: PreparedItem[],
  orderNumber: string,
  subtotal: number,
  deliveryFee: number,
  total: number,
  status: OrderStatus,
  paymentStatus: PaymentStatus
): Promise<PersistedOrderRecord | null> {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_name: input.customer.name,
      phone: input.customer.phone,
      email: input.customer.email ?? null,
      address: input.customer.address,
      city: input.customer.city ?? null,
      delivery_zone: input.deliveryZone,
      delivery_fee: deliveryFee,
      payment_method: input.paymentMethod,
      subtotal,
      total,
      status,
      payment_status: paymentStatus,
      notes: input.notes ?? null,
    })
    .select("id, order_number, subtotal, delivery_fee, total, payment_method, status, payment_status")
    .single();

  if (orderError || !order) {
    return null;
  }

  const orderItems = preparedItems.map(({ product, quantity, unitPrice, sku }) => ({
    order_id: order.id,
    product_id: product.id,
    product_slug: product.slug ?? null,
    sku: sku ?? null,
    product_name: product.name,
    quantity,
    unit_price: unitPrice,
    line_total: unitPrice * quantity,
  }));

  const { error: itemError } = await supabase.from("order_items").insert(orderItems);

  if (itemError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return null;
  }

  return order as PersistedOrderRecord;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json<CreateOrderResponse>(
      { ok: false, error: "Invalid checkout request.", fieldErrors: { cart: "Invalid checkout request." } },
      { status: 400 }
    );
  }

  const { input, fieldErrors } = validateCheckoutInput(payload);

  if (!input) {
    return NextResponse.json<CreateOrderResponse>(
      { ok: false, error: "Please fix the checkout details and try again.", fieldErrors },
      { status: 400 }
    );
  }

  try {
    const prepared = await prepareOrderItems(input);

    if (!prepared.preparedItems) {
      return NextResponse.json<CreateOrderResponse>(
        { ok: false, error: "Please fix your cart and try again.", fieldErrors: prepared.fieldErrors },
        { status: 400 }
      );
    }

    const subtotal = prepared.preparedItems.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    );
    const deliveryFee = getDeliveryFee(input.deliveryZone, subtotal);
    const total = subtotal + deliveryFee;
    const status: OrderStatus = "pending";
    const paymentStatus: PaymentStatus = "pending";
    const orderNumber = generateOrderNumber();

    const supabase = getSupabaseAdminClient();
    const orderItems: OrderItemInsert[] = prepared.preparedItems.map(({ product, quantity, unitPrice, sku, selectedVariants }) => ({
      order_id: "",
      product_id: product.id,
      product_slug: product.slug ?? null,
      sku: sku ?? null,
      product_name: product.name,
      quantity,
      unit_price: unitPrice,
      line_total: unitPrice * quantity,
      selected_variants: selectedVariants,
    }));

    const { data: createdOrders, error: createOrderError } = await supabase.rpc(
      "create_order_with_inventory",
      {
        order_payload: {
          order_number: orderNumber,
          customer_name: input.customer.name,
          phone: input.customer.phone,
          email: input.customer.email ?? null,
          address: input.customer.address,
          city: input.customer.city ?? null,
          delivery_zone: input.deliveryZone,
          delivery_fee: deliveryFee,
          payment_method: input.paymentMethod,
          subtotal,
          total,
          status,
          payment_status: paymentStatus,
          notes: input.notes ?? null,
        },
        items_payload: orderItems.map((item) => ({
          product_id: item.product_id,
          product_slug: item.product_slug,
          sku: item.sku,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_total: item.line_total,
          selected_variants: item.selected_variants ?? [],
        })),
      }
    );

    if (createOrderError && isInventoryRpcMissingError(createOrderError)) {
      const fallbackOrder = await insertOrderWithoutInventory(
        supabase,
        input,
        prepared.preparedItems,
        orderNumber,
        subtotal,
        deliveryFee,
        total,
        status,
        paymentStatus
      );

      if (!fallbackOrder) {
        return NextResponse.json<CreateOrderResponse>(
          { ok: false, error: "Order could not be saved. Please try again." },
          { status: 500 }
        );
      }

      await sendOrderCreatedNotifications(
        buildNotificationOrder(fallbackOrder, input, prepared.preparedItems),
        { baseUrl: getRequestBaseUrl(request) }
      );

      return NextResponse.json<CreateOrderResponse>(
        {
          ok: true,
          order: {
            id: fallbackOrder.id,
            orderNumber: fallbackOrder.order_number,
            subtotal: fallbackOrder.subtotal,
            deliveryFee: fallbackOrder.delivery_fee,
            total: fallbackOrder.total,
            paymentMethod: fallbackOrder.payment_method,
            status: fallbackOrder.status,
            paymentStatus: fallbackOrder.payment_status,
            itemCount: prepared.preparedItems.reduce((count, item) => count + item.quantity, 0),
          },
        },
        { status: 201 }
      );
    }

    if (createOrderError || !Array.isArray(createdOrders) || createdOrders.length === 0) {
      const message = createOrderError?.message ?? "";
      const cartError =
        message.includes("out of stock")
          ? "One or more products are out of stock."
          : message.includes("enough stock")
            ? "Requested quantity exceeds available stock."
            : message.includes("no longer available")
              ? "One or more products are no longer available."
              : undefined;

      return NextResponse.json<CreateOrderResponse>(
        { ok: false, error: cartError ?? "Order could not be saved. Please try again.", fieldErrors: cartError ? { cart: cartError } : undefined },
        { status: cartError ? 400 : 500 }
      );
    }

    const [order] = createdOrders;
    await sendOrderCreatedNotifications(
      buildNotificationOrder(order as PersistedOrderRecord, input, prepared.preparedItems),
      { baseUrl: getRequestBaseUrl(request) }
    );

    return NextResponse.json<CreateOrderResponse>(
      {
        ok: true,
        order: {
          id: order.id,
          orderNumber: order.order_number,
          subtotal: order.subtotal,
          deliveryFee: order.delivery_fee,
          total: order.total,
          paymentMethod: order.payment_method,
          status: order.status,
          paymentStatus: order.payment_status,
          itemCount: prepared.preparedItems.reduce((count, item) => count + item.quantity, 0),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (isSupabaseConfigError(error)) {
      return NextResponse.json<CreateOrderResponse>(
        {
          ok: false,
          error:
            "Order saving is not configured yet. Add the Supabase environment variables and try again.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json<CreateOrderResponse>(
      { ok: false, error: "Order could not be saved. Please try again." },
      { status: 500 }
    );
  }
}
