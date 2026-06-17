import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/admin/auth";
import { getProductMutationFieldErrors } from "@/lib/admin/product-errors";
import { parseProductPayload, type ProductMutationResponse } from "@/lib/admin/product-validation";
import {
  getAdminProductById,
  productsCatalogSetupMessage,
  setAdminProductActive,
  updateAdminProduct,
} from "@/lib/products-db";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function GET(_request: Request, context: RouteContext) {
  const admin = await requireAdminForApi();

  if (!admin.ok) {
    return admin.response;
  }

  const { id } = await context.params;
  let product = null;
  try {
    product = await getAdminProductById(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : productsCatalogSetupMessage;
    return NextResponse.json({ ok: false, error: message }, { status: message === productsCatalogSetupMessage ? 503 : 500 });
  }

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, product });
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
    return NextResponse.json<ProductMutationResponse>(
      { ok: false, error: "Invalid product request.", fieldErrors: { form: "Invalid product request." } },
      { status: 400 }
    );
  }

  const { id } = await context.params;

  if (isRecord(payload) && typeof payload.isActive === "boolean" && Object.keys(payload).length === 1) {
    try {
      const product = await setAdminProductActive(id, payload.isActive);
      return NextResponse.json<ProductMutationResponse>({ ok: true, productId: product.id, slug: product.slug });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Product status could not be updated.";
      return NextResponse.json<ProductMutationResponse>(
        { ok: false, error: message, fieldErrors: { form: message } },
        { status: message === productsCatalogSetupMessage ? 503 : 500 }
      );
    }
  }

  const { input, fieldErrors } = parseProductPayload(payload);

  if (!input) {
    return NextResponse.json<ProductMutationResponse>(
      { ok: false, error: "Please fix the product details and try again.", fieldErrors },
      { status: 400 }
    );
  }

  try {
    const product = await updateAdminProduct(id, input);
    return NextResponse.json<ProductMutationResponse>({ ok: true, productId: product.id, slug: product.slug });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Product could not be updated.";
    return NextResponse.json<ProductMutationResponse>(
      { ok: false, error: message, fieldErrors: getProductMutationFieldErrors(message) },
      { status: message === productsCatalogSetupMessage ? 503 : message.includes("already exists") ? 409 : 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdminForApi();

  if (!admin.ok) {
    return admin.response;
  }

  try {
    const { id } = await context.params;
    const product = await setAdminProductActive(id, false);
    return NextResponse.json<ProductMutationResponse>({ ok: true, productId: product.id, slug: product.slug });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Product could not be archived.";
    return NextResponse.json<ProductMutationResponse>(
      { ok: false, error: message, fieldErrors: { form: message } },
      { status: message === productsCatalogSetupMessage ? 503 : 500 }
    );
  }
}
