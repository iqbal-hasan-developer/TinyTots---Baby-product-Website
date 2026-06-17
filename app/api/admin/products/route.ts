import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/admin/auth";
import { getProductMutationFieldErrors } from "@/lib/admin/product-errors";
import { parseProductPayload, type ProductMutationResponse } from "@/lib/admin/product-validation";
import { createAdminProduct, getAdminProducts, productsCatalogSetupMessage } from "@/lib/products-db";

export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdminForApi();

  if (!admin.ok) {
    return admin.response;
  }

  try {
    const products = await getAdminProducts();
    return NextResponse.json({ ok: true, products });
  } catch (error) {
    const message = error instanceof Error ? error.message : productsCatalogSetupMessage;
    return NextResponse.json(
      { ok: false, error: message },
      { status: message === productsCatalogSetupMessage ? 503 : 500 }
    );
  }
}

export async function POST(request: Request) {
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

  const { input, fieldErrors } = parseProductPayload(payload);

  if (!input) {
    return NextResponse.json<ProductMutationResponse>(
      { ok: false, error: "Please fix the product details and try again.", fieldErrors },
      { status: 400 }
    );
  }

  try {
    const product = await createAdminProduct(input);
    return NextResponse.json<ProductMutationResponse>(
      { ok: true, productId: product.id, slug: product.slug },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Product could not be created.";
    return NextResponse.json<ProductMutationResponse>(
      { ok: false, error: message, fieldErrors: getProductMutationFieldErrors(message) },
      { status: message === productsCatalogSetupMessage ? 503 : message.includes("already exists") ? 409 : 500 }
    );
  }
}
