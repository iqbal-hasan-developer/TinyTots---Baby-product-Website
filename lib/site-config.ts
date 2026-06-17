import type { ProductCategoryId } from "@/lib/products";
import type { TranslationKey } from "@/lib/i18n/translations";

export const siteConfig = {
  businessName: "TinyTots BD",
  tagline: "Premium baby care, feeding, and newborn essentials delivered with care across Bangladesh.",
  phone: "+880 1700 123456",
  heroImage: "/Hero-img.png",
  logo: "/logo.png",
  whatsappNumber: "8801700123456",
  email: "hello@tinytotsbd.com",
  address: "House 24, Road 7, Dhanmondi, Dhaka 1209",
  facebookUrl: "https://facebook.com/tinytotsbd",
  instagramUrl: "https://instagram.com/tinytotsbd",
  currency: "৳",
  deliveryInsideDhaka: 60,
  deliveryOutsideDhaka: 120,
  homepage: {
    popularProductLimit: 4,
    newbornProductLimit: 4,
    newbornCategoryIds: ["Diapers", "Mother Care", "Clothing"] satisfies readonly ProductCategoryId[],
  },
  defaultSeoTitle: "TinyTots BD | Premium Baby Products in Bangladesh",
  defaultSeoDescription: "Shop trusted baby care, diapers, feeding, clothing, toys, and mother care essentials delivered across Bangladesh.",
} as const;

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export type DeliveryZone = "inside" | "outside";

export const paymentMethods = [
  {
    id: "cod",
    labelKey: "checkout.cod",
    helperKey: "checkout.payAtDoorstep",
    enabled: true,
  },
  {
    id: "bkash",
    labelKey: "checkout.bkash",
    helperKey: undefined,
    enabled: true,
  },
  {
    id: "nagad",
    labelKey: "checkout.nagad",
    helperKey: undefined,
    enabled: true,
  },
] as const satisfies ReadonlyArray<{
  id: string;
  labelKey: TranslationKey;
  helperKey?: TranslationKey;
  enabled: boolean;
}>;

export type PaymentMethod = (typeof paymentMethods)[number]["id"];

export function getDeliveryFee(zone: DeliveryZone, subtotal: number): number {
  if (subtotal <= 0) return 0;
  return zone === "outside"
    ? siteConfig.deliveryOutsideDhaka
    : siteConfig.deliveryInsideDhaka;
}

export function formatPrice(amount: number): string {
  return `${siteConfig.currency}${amount}`;
}

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
