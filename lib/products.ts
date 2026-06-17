import type { TranslationKey } from "@/lib/i18n/translations";

export const productCategories = [
  {
    id: "Diapers",
    slug: "diapers",
    labelKey: "cat.diapers",
    description: "Diapers, wipes, and changing essentials.",
    colorClass: "bg-brand-primary-light",
    icon: "baby",
    featured: true,
    showOnHomepage: true,
  },
  {
    id: "Skincare",
    slug: "skincare",
    labelKey: "cat.skincare",
    description: "Gentle care products for delicate baby skin.",
    colorClass: "bg-[#ffeee8]",
    icon: "sparkles",
    featured: true,
    showOnHomepage: true,
  },
  {
    id: "Feeding",
    slug: "feeding",
    labelKey: "cat.feeding",
    description: "Bottles, feeding tools, and everyday meal support.",
    colorClass: "bg-[#f4e2a9]",
    icon: "milk",
    featured: true,
    showOnHomepage: true,
  },
  {
    id: "Clothing",
    slug: "clothing",
    labelKey: "cat.clothing",
    description: "Soft newborn and baby clothing.",
    colorClass: "bg-[#e8f0fe]",
    icon: "shirt",
    featured: true,
    showOnHomepage: true,
  },
  {
    id: "Toys",
    slug: "toys",
    labelKey: "cat.toys",
    description: "Safe toys and teethers for early development.",
    colorClass: "bg-[#fce8e8]",
    icon: "gamepad",
    featured: true,
    showOnHomepage: true,
  },
  {
    id: "Mother Care",
    slug: "mother-care",
    labelKey: "cat.motherCare",
    description: "Care essentials for new and expecting mothers.",
    colorClass: "bg-[#f3e8fc]",
    icon: "heart",
    featured: true,
    showOnHomepage: true,
  },
  {
    id: "Bundle",
    slug: "bundle",
    labelKey: "cat.bundle",
    description: "Curated product bundles and offers.",
    colorClass: "bg-[#ffeee8]",
    icon: "package",
    featured: false,
    showOnHomepage: false,
  },
] as const satisfies ReadonlyArray<{
  id: string;
  slug: string;
  labelKey: TranslationKey;
  description: string;
  colorClass: string;
  icon: string;
  featured: boolean;
  showOnHomepage: boolean;
}>;

export type ProductCategoryId = (typeof productCategories)[number]["id"];
export type ProductCategoryFilterId = ProductCategoryId | "All";
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock" | "preorder";
export type ProductStockStatusDb = "in_stock" | "low_stock" | "out_of_stock" | "preorder";

export const productStockStatusOptions = [
  "in_stock",
  "low_stock",
  "out_of_stock",
  "preorder",
] as const satisfies readonly ProductStockStatusDb[];

export interface ProductVariantValue {
  id: string;
  label: string;
  priceAdjustment?: number;
  skuSuffix?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  values: ProductVariantValue[];
}

export interface ProductSeo {
  title?: string;
  description?: string;
}

export interface ProductVariantSelectionInput {
  groupId: string;
  optionId: string;
}

export interface ProductVariantSelection extends ProductVariantSelectionInput {
  groupName: string;
  optionLabel: string;
  priceAdjustment?: number;
  skuSuffix?: string;
}

export const allProductsCategory = {
  id: "All",
  slug: "all",
  labelKey: "cat.all",
} as const satisfies {
  id: "All";
  slug: string;
  labelKey: TranslationKey;
};

export const productCategoryFilters = [allProductsCategory, ...productCategories] as const;

export interface Product {
  id: string;
  sku?: string;
  name: string;
  nameBn: string;
  slug: string;
  category: ProductCategoryId;
  price: number;
  oldPrice?: number;
  compareAtPrice?: number;
  badge?: string;
  badgeBn?: string;
  rating: number;
  featured?: boolean;
  stock: string;
  stockBn: string;
  stockStatus?: StockStatus;
  image: string;
  images?: string[];
  tags?: string[];
  variants?: ProductVariant[];
  trackInventory?: boolean;
  stockQuantity?: number;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  shortDescription: string;
  shortDescriptionBn: string;
  description: string;
  descriptionBn: string;
  seo?: ProductSeo;
}

export const products: Product[] = [
  {
    id: "1",
    sku: "TT-CL-SLEEP-001",
    name: "Organic Cotton Newborn Sleepsuit",
    nameBn: "অরগ্যানিক কটন নবজাতক স্লিপস্যুট",
    slug: "organic-cotton-sleepsuit",
    category: "Clothing",
    price: 1250,
    oldPrice: 1450,
    compareAtPrice: 1450,
    badge: "15% OFF",
    badgeBn: "১৫% ছাড়",
    rating: 4.8,
    featured: true,
    stock: "In Stock",
    stockBn: "স্টকে আছে",
    stockStatus: "in-stock",
    image: "/products/Organic Cotton Newborn Sleepsuit.png",
    images: [
      "/products/Organic Cotton Newborn Sleepsuit.png",
      "/products/Organic Cotton Newborn Sleepsuit2.png",
      "/products/Organic Cotton Newborn Sleepsuit3.png",
    ],
    tags: ["newborn", "clothing", "organic cotton", "sleepwear"],
    variants: [
      {
        id: "size",
        name: "Size",
        values: [
          { id: "newborn", label: "Newborn", skuSuffix: "NB" },
          { id: "0-3-months", label: "0-3 months", skuSuffix: "03" },
        ],
      },
    ],
    shortDescription: "Soft breathable cotton sleepsuit for newborn comfort in Bangladesh weather.",
    shortDescriptionBn: "বাংলাদেশের আবহাওয়ায় নবজাতকের আরামের জন্য নরম ও বাতাস চলাচলযোগ্য কটন স্লিপস্যুট।",
    description: "Made with soft organic cotton, this newborn sleepsuit keeps your baby comfortable during naps, night sleep, and daily wear. The gentle fabric is suitable for sensitive skin and easy for parents to change.",
    seo: {
      title: "Organic Cotton Newborn Sleepsuit | TinyTots BD",
      description: "Soft organic cotton newborn sleepsuit for comfortable daily baby wear in Bangladesh.",
    },
    descriptionBn: "নরম অরগ্যানিক কটনে তৈরি এই নবজাতক স্লিপস্যুট ঘুম, রাতের ব্যবহার এবং প্রতিদিনের পরার জন্য আরামদায়ক। কোমল কাপড় সংবেদনশীল ত্বকের জন্য উপযোগী এবং বাবা-মায়ের জন্য বদলানো সহজ।",
  },
  {
    id: "2",
    sku: "TT-SKIN-LOT-002",
    name: "Gentle Baby Moisturizing Lotion",
    nameBn: "জেন্টল বেবি ময়েশ্চারাইজিং লোশন",
    slug: "gentle-baby-lotion",
    category: "Skincare",
    price: 650,
    oldPrice: 850,
    compareAtPrice: 850,
    badge: "New",
    badgeBn: "নতুন",
    rating: 4.9,
    featured: true,
    stock: "In Stock",
    stockBn: "স্টকে আছে",
    stockStatus: "in-stock",
    image: "/products/Gentle-baby-moisturizing-lotion.png",
    images: [
      "/products/Gentle-baby-moisturizing-lotion.png",
      "/products/Gentle-baby-moisturizing-lotion2.png",
      "/products/Gentle-baby-moisturizing-lotion3.png",
    ],
    tags: ["skincare", "lotion", "bath time", "sensitive skin"],
    shortDescription: "Daily baby lotion for soft, hydrated skin after bath time.",
    shortDescriptionBn: "গোসলের পর শিশুর ত্বক নরম ও আর্দ্র রাখতে প্রতিদিনের বেবি লোশন।",
    description: "A lightweight moisturizing lotion for everyday baby skincare. It absorbs quickly, feels gentle on delicate skin, and is a practical choice for hot and humid months.",
    seo: {
      title: "Gentle Baby Moisturizing Lotion | TinyTots BD",
      description: "Daily baby lotion for soft, hydrated skin after bath time.",
    },
    descriptionBn: "প্রতিদিনের বেবি স্কিনকেয়ারের জন্য হালকা ময়েশ্চারাইজিং লোশন। এটি দ্রুত শোষিত হয়, কোমল ত্বকে আরামদায়ক লাগে এবং গরম ও আর্দ্র আবহাওয়ায় ব্যবহারযোগ্য।",
  },
  {
    id: "3",
    sku: "TT-DIA-PREM-S",
    name: "PremiumComfort Diaper Pack - Small",
    nameBn: "প্রিমিয়ামকমফোর্ট ডায়াপার প্যাক - স্মল",
    slug: "premium-comfort-diaper-small",
    category: "Diapers",
    price: 1250,
    oldPrice: 1450,
    compareAtPrice: 1450,
    badge: "Best Seller",
    badgeBn: "বেস্ট সেলার",
    rating: 4.7,
    featured: true,
    stock: "In Stock",
    stockBn: "স্টকে আছে",
    stockStatus: "in-stock",
    image: "/products/PremiumComfort-Diaper-Pack-Small.png",
    images: [
      "/products/PremiumComfort-Diaper-Pack-Small2.png",
      "/products/PremiumComfort-Diaper-Pack-Small3.png",
      "/products/PremiumComfort-Diaper-Pack-Small4.png",
    ],
    tags: ["diapers", "small", "3-8kg", "best seller"],
    variants: [
      {
        id: "pack-size",
        name: "Pack size",
        values: [{ id: "small", label: "Small (3-8 kg)" }],
      },
    ],
    shortDescription: "Ultra-absorbent diapers for babies weighing 3-8 kg.",
    shortDescriptionBn: "৩-৮ কেজি ওজনের শিশুর জন্য আল্ট্রা-অ্যাবজরবেন্ট ডায়াপার।",
    description: "Designed for day and night use, this diaper pack helps keep babies dry and comfortable for longer. The small size is suitable for babies weighing 3-8 kg.",
    seo: {
      title: "PremiumComfort Diaper Pack Small | TinyTots BD",
      description: "Ultra-absorbent small diaper pack for babies weighing 3-8 kg.",
    },
    descriptionBn: "দিন ও রাতের ব্যবহারের জন্য তৈরি এই ডায়াপার শিশুকে দীর্ঘ সময় শুকনো ও আরামদায়ক রাখতে সাহায্য করে। স্মল সাইজ ৩-৮ কেজি ওজনের শিশুর জন্য উপযোগী।",
  },
  {
    id: "4",
    sku: "TT-DIA-WIPES-080",
    name: "Organic Oat Baby Wipes - 80 pcs",
    nameBn: "অরগ্যানিক ওট বেবি ওয়াইপস - ৮০ পিস",
    slug: "organic-oat-baby-wipes",
    category: "Diapers",
    price: 450,
    oldPrice: 550,
    compareAtPrice: 550,
    badge: "Organic",
    badgeBn: "অরগ্যানিক",
    rating: 4.6,
    featured: false,
    stock: "In Stock",
    stockBn: "স্টকে আছে",
    stockStatus: "in-stock",
    image: "/products/Organic-Oat-Baby-Wipes-80 pcs.png",
    tags: ["wipes", "diapers", "organic oat", "fragrance free"],
    shortDescription: "Fragrance-free wipes for diaper changes, hands, and face.",
    shortDescriptionBn: "ডায়াপার পরিবর্তন, হাত ও মুখ পরিষ্কারের জন্য সুগন্ধিমুক্ত ওয়াইপস।",
    description: "These organic oat baby wipes are gentle enough for sensitive skin and useful for diaper changes, travel, and quick cleanups at home.",
    seo: {
      title: "Organic Oat Baby Wipes 80 pcs | TinyTots BD",
      description: "Fragrance-free baby wipes for diaper changes, hands, face, and travel.",
    },
    descriptionBn: "অরগ্যানিক ওট বেবি ওয়াইপস সংবেদনশীল ত্বকের জন্য কোমল এবং ডায়াপার পরিবর্তন, বাইরে যাওয়া ও ঘরে দ্রুত পরিষ্কারের জন্য ব্যবহারযোগ্য।",
  },
  {
    id: "5",
    sku: "TT-TOY-TEETHER-005",
    name: "Natural Wooden Teether Ring",
    nameBn: "ন্যাচারাল উডেন টিদার রিং",
    slug: "natural-wooden-teether",
    category: "Toys",
    price: 450,
    oldPrice: 520,
    compareAtPrice: 520,
    badge: "Safe",
    badgeBn: "নিরাপদ",
    rating: 4.9,
    featured: true,
    stock: "In Stock",
    stockBn: "স্টকে আছে",
    stockStatus: "in-stock",
    image: "/products/Natural-Wooden-Teether-Ring.png",
    images: [
      "/products/Natural-Wooden-Teether-Ring.png",
      "/products/Natural-Wooden-Teether-Ring1.png",
      "/products/Natural-Wooden-Teether-Ring2.png",
    ],
    tags: ["toys", "teether", "wooden", "safe"],
    shortDescription: "Chemical-free teether for soothing sore gums during teething.",
    shortDescriptionBn: "দাঁত ওঠার সময় মাড়ির অস্বস্তি কমাতে কেমিক্যাল-ফ্রি টিদার।",
    description: "A simple wooden teether ring made for little hands to hold easily. It helps soothe gums during teething and fits naturally into a baby essentials kit.",
    seo: {
      title: "Natural Wooden Teether Ring | TinyTots BD",
      description: "Chemical-free wooden baby teether for soothing sore gums.",
    },
    descriptionBn: "ছোট হাতে সহজে ধরার জন্য তৈরি সহজ উডেন টিদার রিং। দাঁত ওঠার সময় মাড়ির অস্বস্তি কমাতে সাহায্য করে এবং বেবি এসেনশিয়ালস কিটে সহজে মানিয়ে যায়।",
  },
  {
    id: "6",
    sku: "TT-FEED-BOTTLE-006",
    name: "Stainless Steel Feeding Bottle",
    nameBn: "BPA-ফ্রি স্টেইনলেস স্টিল ফিডিং বোতল",
    slug: "stainless-steel-feeding-bottle",
    category: "Feeding",
    price: 850,
    oldPrice: 990,
    compareAtPrice: 990,
    badge: "Popular",
    badgeBn: "জনপ্রিয়",
    rating: 4.8,
    featured: true,
    stock: "In Stock",
    stockBn: "স্টকে আছে",
    stockStatus: "in-stock",
    image: "/products/BPA-Free-Stainless-Steel-Feeding-Bottle.png",
    tags: ["feeding", "bottle", "bpa free", "travel"],
    shortDescription: "Durable feeding bottle for safe everyday use.",
    shortDescriptionBn: "নিরাপদ প্রতিদিনের ব্যবহারের জন্য টেকসই ফিডিং বোতল।",
    description: "This BPA-free stainless steel feeding bottle is durable, easy to clean, and convenient for daily feeding routines at home or while travelling.",
    seo: {
      title: "Stainless Steel Feeding Bottle | TinyTots BD",
      description: "Durable BPA-free feeding bottle for safe everyday baby feeding.",
    },
    descriptionBn: "BPA-ফ্রি স্টেইনলেস স্টিল ফিডিং বোতল টেকসই, পরিষ্কার করা সহজ এবং বাসা বা ভ্রমণে প্রতিদিনের ফিডিং রুটিনের জন্য সুবিধাজনক।",
  },
  {
    id: "7",
    sku: "TT-BUN-STARTER-007",
    name: "Newborn Starter Essentials Pack",
    nameBn: "নবজাতক স্টার্টার এসেনশিয়ালস প্যাক",
    slug: "newborn-starter-pack",
    category: "Bundle",
    price: 2100,
    oldPrice: 2600,
    compareAtPrice: 2600,
    badge: "Bundle",
    badgeBn: "বান্ডেল",
    rating: 4.9,
    featured: true,
    stock: "In Stock",
    stockBn: "স্টকে আছে",
    stockStatus: "in-stock",
    image: "/products/Newborn-Starter-Essentials-Pack.png",
    tags: ["bundle", "newborn", "gift", "starter pack"],
    shortDescription: "Curated starter bundle for a newborn's first weeks.",
    shortDescriptionBn: "নবজাতকের প্রথম কয়েক সপ্তাহের জন্য বাছাই করা স্টার্টার বান্ডেল।",
    description: "A practical bundle for new parents, including everyday newborn essentials for changing, feeding, and gentle care. It also works well as a baby shower gift.",
    seo: {
      title: "Newborn Starter Essentials Pack | TinyTots BD",
      description: "Curated newborn essentials bundle for new parents and baby shower gifting.",
    },
    descriptionBn: "নতুন বাবা-মায়ের জন্য ব্যবহারিক বান্ডেল, যেখানে পরিবর্তন, ফিডিং এবং কোমল যত্নের জন্য প্রতিদিনের নবজাতক পণ্য রয়েছে। বেবি শাওয়ার উপহার হিসেবেও উপযোগী।",
  },
  {
    id: "8",
    sku: "TT-MOM-RECOVERY-008",
    name: "Mother Care Recovery Essentials Box",
    nameBn: "মাদার কেয়ার রিকভারি এসেনশিয়ালস বক্স",
    slug: "mother-care-essentials-box",
    category: "Mother Care",
    price: 1600,
    oldPrice: 1900,
    compareAtPrice: 1900,
    badge: "New",
    badgeBn: "নতুন",
    rating: 4.7,
    featured: true,
    stock: "In Stock",
    stockBn: "স্টকে আছে",
    stockStatus: "in-stock",
    image: "/products/Mother-Care-Recovery-Essentials-Box.png",
    tags: ["mother care", "postpartum", "recovery", "gift"],
    shortDescription: "Self-care essentials for new mothers after delivery.",
    shortDescriptionBn: "ডেলিভারির পর নতুন মায়েদের জন্য সেলফ-কেয়ার এসেনশিয়ালস।",
    description: "A thoughtful care box for new mothers with comfort-focused essentials for the early postpartum days. It is designed to support rest, recovery, and daily self-care.",
    seo: {
      title: "Mother Care Recovery Essentials Box | TinyTots BD",
      description: "Comfort-focused recovery essentials box for new mothers after delivery.",
    },
    descriptionBn: "প্রসব-পরবর্তী প্রথম দিকের দিনগুলোর জন্য নতুন মায়েদের আরামকেন্দ্রিক এসেনশিয়ালসসহ যত্নের বক্স। বিশ্রাম, রিকভারি এবং প্রতিদিনের সেলফ-কেয়ারে সহায়তার জন্য তৈরি।",
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getCategoryById(categoryId: string): (typeof productCategories)[number] | undefined {
  return productCategories.find((category) => category.id === categoryId);
}

export function getCategoryBySlug(slug: string): (typeof productCategories)[number] | undefined {
  return productCategories.find((category) => category.slug === slug);
}

export function getCategoryFromParam(param: string | null | undefined): ProductCategoryFilterId {
  if (!param || param === allProductsCategory.id || param === allProductsCategory.slug) {
    return allProductsCategory.id;
  }

  const normalizedParam = param.trim().toLowerCase();
  const category = productCategories.find((item) =>
    item.id.toLowerCase() === normalizedParam || item.slug === normalizedParam
  );

  return category?.id ?? allProductsCategory.id;
}

export function getCategoryHref(categoryId: ProductCategoryId): string {
  const category = getCategoryById(categoryId);
  return category ? `/shop?category=${category.slug}` : "/shop";
}

export function getProductImages(product: Product): string[] {
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];
  return images.filter(Boolean);
}

export function getProductImage(product: Product): string {
  return getProductImages(product)[0] ?? product.image ?? "";
}

export function getCompareAtPrice(product: Product): number | undefined {
  return product.compareAtPrice ?? product.oldPrice;
}

export function slugifyIdentifier(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function hasProductVariants(product: Product): boolean {
  return Boolean(product.variants?.some((group) => group.values.length > 0));
}

export function resolveProductVariantSelections(
  product: Product,
  selections?: ProductVariantSelectionInput[]
): ProductVariantSelection[] {
  if (!product.variants?.length) return [];

  const resolvedSelections = product.variants
    .map((group) => {
      const requested = selections?.find((selection) => selection.groupId === group.id);
      const option =
        group.values.find((value) => value.id === requested?.optionId) ??
        group.values[0];

      if (!option) return null;

      return {
        groupId: group.id,
        optionId: option.id,
        groupName: group.name,
        optionLabel: option.label,
        priceAdjustment: option.priceAdjustment,
        skuSuffix: option.skuSuffix,
      };
    })
    .filter(Boolean) as ProductVariantSelection[];

  return resolvedSelections;
}

export function getProductVariantSummary(
  selections?: readonly ProductVariantSelection[]
): string {
  if (!selections?.length) return "";
  return selections
    .map((selection) => `${selection.groupName}: ${selection.optionLabel}`)
    .join(", ");
}

export function getProductPriceForSelections(
  product: Product,
  selections?: ProductVariantSelectionInput[] | ProductVariantSelection[]
): number {
  const resolvedSelections = resolveProductVariantSelections(product, selections);
  const adjustment = resolvedSelections.reduce(
    (sum, selection) => sum + (selection.priceAdjustment ?? 0),
    0
  );
  return product.price + adjustment;
}

export function getProductSkuForSelections(
  product: Product,
  selections?: ProductVariantSelectionInput[] | ProductVariantSelection[]
): string | undefined {
  const suffixes = resolveProductVariantSelections(product, selections)
    .map((selection) => selection.skuSuffix?.trim())
    .filter((value): value is string => Boolean(value));

  if (!product.sku) {
    return suffixes.length ? suffixes.join("-") : undefined;
  }

  return suffixes.length ? `${product.sku}-${suffixes.join("-")}` : product.sku;
}

export function getEffectiveProductStockStatus(product: Product): StockStatus {
  if (product.trackInventory && (product.stockQuantity ?? 0) <= 0) {
    return "out-of-stock";
  }

  return product.stockStatus ?? "in-stock";
}

export function isProductAvailableForPurchase(product: Product): boolean {
  return getEffectiveProductStockStatus(product) !== "out-of-stock";
}

export function getFeaturedProducts(limit?: number): Product[] {
  const featuredProducts = products.filter((product) => product.featured);
  return typeof limit === "number" ? featuredProducts.slice(0, limit) : featuredProducts;
}

export function getProductsByCategory(categoryId: ProductCategoryId, limit?: number): Product[] {
  const categoryProducts = products.filter((product) => product.category === categoryId);
  return typeof limit === "number" ? categoryProducts.slice(0, limit) : categoryProducts;
}

export function getProductsByCategoryIds(categoryIds: readonly ProductCategoryId[], limit?: number): Product[] {
  const categoryProducts = products.filter((product) => categoryIds.includes(product.category));
  return typeof limit === "number" ? categoryProducts.slice(0, limit) : categoryProducts;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    (candidate) => candidate.id !== product.id && candidate.category === product.category
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const fallbackProducts = products.filter(
    (candidate) => candidate.id !== product.id && candidate.category !== product.category
  );

  return [...sameCategory, ...fallbackProducts].slice(0, limit);
}

export function getProductSearchText(product: Product): string {
  return [
    product.id,
    product.sku,
    product.name,
    product.nameBn,
    product.category,
    product.shortDescription,
    product.shortDescriptionBn,
    product.description,
    product.descriptionBn,
    product.badge,
    product.badgeBn,
    ...(product.tags ?? []),
    ...(product.variants?.flatMap((variant) => [
      variant.name,
      ...variant.values.map((value) => `${value.label} ${value.skuSuffix ?? ""}`),
    ]) ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function getProductSeoMetadata(product: Product): Required<ProductSeo> {
  return {
    title: product.seo?.title ?? `${product.name} | TinyTots BD`,
    description: product.seo?.description ?? product.shortDescription,
  };
}
