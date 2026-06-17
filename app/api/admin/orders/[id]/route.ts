import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/admin/auth";
import {
  type AdminOrder,
  type AdminOrderWithItems,
  getAdminOrderById,
  isOrderStatus,
  isPaymentStatus,
  updateAdminOrderStatuses,
} from "@/lib/admin/orders";
import {
  sendCustomerOrderStatusUpdate,
  sendCustomerPaymentStatusUpdate,
  type NotificationOrder,
} from "@/lib/notifications/email";
import { getProductVariantSummary } from "@/lib/products";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getRequestBaseUrl(request: Request): string {
  return new URL(request.url).origin;
}

function toNotificationOrder(order: AdminOrderWithItems): NotificationOrder {
  return {
    id: order.id,
    orderNumber: order.order_number,
    customerName: order.customer_name,
    customerEmail: order.email,
    phone: order.phone,
    city: order.city,
    deliveryZone: order.delivery_zone,
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    status: order.status,
    subtotal: order.subtotal,
    deliveryFee: order.delivery_fee,
    total: order.total,
    createdAt: order.created_at,
    items: order.order_items.map((item) => ({
      productName: item.product_name,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      lineTotal: item.line_total,
      sku: item.sku,
      variantSummary: getProductVariantSummary(item.selected_variants ?? []) || undefined,
    })),
  };
}

export async function GET(_request: Request, context: RouteContext) {
  const admin = await requireAdminForApi();

  if (!admin.ok) {
    return admin.response;
  }

  const { id } = await context.params;
  const order = await getAdminOrderById(id);

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, order });
}

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await requireAdminForApi();

  if (!admin.ok) {
    return admin.response;
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid update request." }, { status: 400 });
  }

  if (!isRecord(payload)) {
    return NextResponse.json({ error: "Invalid update request." }, { status: 400 });
  }

  const updates: Partial<Pick<AdminOrder, "status" | "payment_status">> = {};

  if ("status" in payload) {
    if (!isOrderStatus(payload.status)) {
      return NextResponse.json({ error: "Choose a valid order status." }, { status: 400 });
    }
    updates.status = payload.status;
  }

  if ("paymentStatus" in payload) {
    if (!isPaymentStatus(payload.paymentStatus)) {
      return NextResponse.json({ error: "Choose a valid payment status." }, { status: 400 });
    }
    updates.payment_status = payload.paymentStatus;
  }

  if (!updates.status && !updates.payment_status) {
    return NextResponse.json({ error: "Choose a status to update." }, { status: 400 });
  }

  try {
    const { id } = await context.params;
    const previousOrder = await getAdminOrderById(id);

    if (!previousOrder) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const order = await updateAdminOrderStatuses(id, updates);
    const updatedOrderForEmail: AdminOrderWithItems = {
      ...previousOrder,
      ...order,
      order_items: previousOrder.order_items,
    };
    const notificationOrder = toNotificationOrder(updatedOrderForEmail);
    const baseUrl = getRequestBaseUrl(request);
    const emailTasks = [];

    if (updates.status && previousOrder.status !== order.status) {
      emailTasks.push(
        sendCustomerOrderStatusUpdate(notificationOrder, previousOrder.status, order.status, { baseUrl })
      );
    }

    if (updates.payment_status && previousOrder.payment_status !== order.payment_status) {
      emailTasks.push(
        sendCustomerPaymentStatusUpdate(
          notificationOrder,
          previousOrder.payment_status,
          order.payment_status,
          { baseUrl }
        )
      );
    }

    await Promise.all(emailTasks);

    return NextResponse.json({ ok: true, order });
  } catch {
    return NextResponse.json({ error: "Order status could not be updated." }, { status: 500 });
  }
}
