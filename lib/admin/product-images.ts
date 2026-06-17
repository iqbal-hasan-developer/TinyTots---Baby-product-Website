import "server-only";

import { randomUUID } from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export const productImagesBucket = "product-images";
export const maxProductImageBytes = 5 * 1024 * 1024;
export const allowedProductImageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

function getSafeExtension(file: File): string {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function sanitizeFileBaseName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export interface UploadedProductImage {
  path: string;
  publicUrl: string;
}

export async function uploadAdminProductImages(files: File[]): Promise<UploadedProductImage[]> {
  if (files.length === 0) {
    throw new Error("Choose at least one image to upload.");
  }

  const supabase = getSupabaseAdminClient();
  const uploads: UploadedProductImage[] = [];

  for (const file of files) {
    if (!allowedProductImageMimeTypes.includes(file.type as (typeof allowedProductImageMimeTypes)[number])) {
      throw new Error("Upload a JPG, PNG, or WebP image.");
    }

    if (file.size > maxProductImageBytes) {
      throw new Error("Each image must be 5MB or smaller.");
    }

    const extension = getSafeExtension(file);
    const baseName = sanitizeFileBaseName(file.name) || "product-image";
    const path = `products/${new Date().toISOString().slice(0, 10)}/${baseName}-${randomUUID()}.${extension}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { error } = await supabase.storage
      .from(productImagesBucket)
      .upload(path, bytes, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error("Image upload failed. Please try again.");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(productImagesBucket).getPublicUrl(path);

    uploads.push({
      path,
      publicUrl,
    });
  }

  return uploads;
}
