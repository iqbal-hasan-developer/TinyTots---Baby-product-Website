import { NextResponse } from "next/server";
import {
  getTrackedOrder,
  normalizeOrderNumber,
  normalizePhoneForMatch,
  type TrackOrderResponse,
} from "@/lib/order-tracking";
import { isSupabaseConfigError } from "@/lib/supabase/server";

export const runtime = "nodejs";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json<TrackOrderResponse>(
      {
        ok: false,
        error: "Invalid tracking request.",
        fieldErrors: { orderNumber: "Enter a valid order number.", phone: "Enter the phone number used at checkout." },
      },
      { status: 400 }
    );
  }

  const orderNumber = isRecord(payload) && typeof payload.orderNumber === "string"
    ? normalizeOrderNumber(payload.orderNumber)
    : "";
  const phone = isRecord(payload) && typeof payload.phone === "string"
    ? payload.phone.trim()
    : "";
  const fieldErrors: NonNullable<Extract<TrackOrderResponse, { ok: false }>["fieldErrors"]> = {};

  if (!orderNumber) {
    fieldErrors.orderNumber = "Order number is required.";
  }

  if (!phone) {
    fieldErrors.phone = "Phone number is required.";
  } else if (normalizePhoneForMatch(phone).length < 7) {
    fieldErrors.phone = "Enter a valid phone number.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json<TrackOrderResponse>(
      { ok: false, error: "Please enter your order number and phone number.", fieldErrors },
      { status: 400 }
    );
  }

  try {
    const order = await getTrackedOrder({ orderNumber, phone });

    if (!order) {
      return NextResponse.json<TrackOrderResponse>(
        { ok: false, error: "We could not find an order with those details." },
        { status: 404 }
      );
    }

    return NextResponse.json<TrackOrderResponse>({ ok: true, order });
  } catch (error) {
    if (isSupabaseConfigError(error)) {
      return NextResponse.json<TrackOrderResponse>(
        { ok: false, error: "Order tracking is not configured yet." },
        { status: 503 }
      );
    }

    return NextResponse.json<TrackOrderResponse>(
      { ok: false, error: "Order tracking is unavailable right now. Please try again later." },
      { status: 500 }
    );
  }
}
