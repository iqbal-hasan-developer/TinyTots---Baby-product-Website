import { NextResponse } from "next/server";
import { requireAdminForApi } from "@/lib/admin/auth";
import { uploadAdminProductImages } from "@/lib/admin/product-images";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const admin = await requireAdminForApi();

  if (!admin.ok) {
    return admin.response;
  }

  try {
    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (files.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Choose at least one image to upload." },
        { status: 400 }
      );
    }

    const images = await uploadAdminProductImages(files);
    return NextResponse.json({
      ok: true,
      images: images.map((image) => ({
        path: image.path,
        url: image.publicUrl,
      })),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Image upload failed. Please try again.";
    const status =
      message.includes("Choose at least one image") ||
      message.includes("Upload a JPG") ||
      message.includes("5MB or smaller")
        ? 400
        : 500;

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
