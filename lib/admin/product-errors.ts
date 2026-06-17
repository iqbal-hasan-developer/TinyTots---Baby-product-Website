import type { ProductFieldErrors } from "@/lib/admin/product-validation";

export function getProductMutationFieldErrors(message: string): ProductFieldErrors {
  if (message.includes("slug")) {
    return {
      slug: message,
    };
  }

  if (message.includes("SKU")) {
    return {
      sku: message,
    };
  }

  return {
    form: message,
  };
}
