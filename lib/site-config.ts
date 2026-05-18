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
  defaultSeoTitle: "TinyTots BD | Premium Baby Products in Bangladesh",
  defaultSeoDescription: "Shop trusted baby care, diapers, feeding, clothing, toys, and mother care essentials delivered across Bangladesh.",
} as const;

export function formatPrice(amount: number): string {
  return `${siteConfig.currency}${amount}`;
}

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
