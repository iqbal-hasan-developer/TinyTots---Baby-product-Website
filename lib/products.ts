export interface Product {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  category: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  badgeBn?: string;
  rating: number;
  stock: string;
  stockBn: string;
  image: string;
  images?: string[];
  shortDescription: string;
  shortDescriptionBn: string;
  description: string;
  descriptionBn: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Organic Cotton Newborn Sleepsuit",
    nameBn: "অরগ্যানিক কটন নবজাতক স্লিপস্যুট",
    slug: "organic-cotton-sleepsuit",
    category: "Clothing",
    price: 1250,
    oldPrice: 1450,
    badge: "15% OFF",
    badgeBn: "১৫% ছাড়",
    rating: 4.8,
    stock: "In Stock",
    stockBn: "স্টকে আছে",
    image: "/products/Organic Cotton Newborn Sleepsuit.png",
    images: [
      "/products/Organic Cotton Newborn Sleepsuit.png",
      "/products/Organic Cotton Newborn Sleepsuit2.png",
      "/products/Organic Cotton Newborn Sleepsuit3.png",
    ],
    shortDescription: "Soft breathable cotton sleepsuit for newborn comfort in Bangladesh weather.",
    shortDescriptionBn: "বাংলাদেশের আবহাওয়ায় নবজাতকের আরামের জন্য নরম ও বাতাস চলাচলযোগ্য কটন স্লিপস্যুট।",
    description: "Made with soft organic cotton, this newborn sleepsuit keeps your baby comfortable during naps, night sleep, and daily wear. The gentle fabric is suitable for sensitive skin and easy for parents to change.",
    descriptionBn: "নরম অরগ্যানিক কটনে তৈরি এই নবজাতক স্লিপস্যুট ঘুম, রাতের ব্যবহার এবং প্রতিদিনের পরার জন্য আরামদায়ক। কোমল কাপড় সংবেদনশীল ত্বকের জন্য উপযোগী এবং বাবা-মায়ের জন্য বদলানো সহজ।",
  },
  {
    id: "2",
    name: "Gentle Baby Moisturizing Lotion",
    nameBn: "জেন্টল বেবি ময়েশ্চারাইজিং লোশন",
    slug: "gentle-baby-lotion",
    category: "Skincare",
    price: 650,
    oldPrice: 850,
    badge: "New",
    badgeBn: "নতুন",
    rating: 4.9,
    stock: "In Stock",
    stockBn: "স্টকে আছে",
    image: "/products/Gentle-baby-moisturizing-lotion.png",
    images: [
      "/products/Gentle-baby-moisturizing-lotion.png",
      "/products/Gentle-baby-moisturizing-lotion2.png",
      "/products/Gentle-baby-moisturizing-lotion3.png",
    ],
    shortDescription: "Daily baby lotion for soft, hydrated skin after bath time.",
    shortDescriptionBn: "গোসলের পর শিশুর ত্বক নরম ও আর্দ্র রাখতে প্রতিদিনের বেবি লোশন।",
    description: "A lightweight moisturizing lotion for everyday baby skincare. It absorbs quickly, feels gentle on delicate skin, and is a practical choice for hot and humid months.",
    descriptionBn: "প্রতিদিনের বেবি স্কিনকেয়ারের জন্য হালকা ময়েশ্চারাইজিং লোশন। এটি দ্রুত শোষিত হয়, কোমল ত্বকে আরামদায়ক লাগে এবং গরম ও আর্দ্র আবহাওয়ায় ব্যবহারযোগ্য।",
  },
  {
    id: "3",
    name: "PremiumComfort Diaper Pack - Small",
    nameBn: "প্রিমিয়ামকমফোর্ট ডায়াপার প্যাক - স্মল",
    slug: "premium-comfort-diaper-small",
    category: "Diapers",
    price: 1250,
    oldPrice: 1450,
    badge: "Best Seller",
    badgeBn: "বেস্ট সেলার",
    rating: 4.7,
    stock: "In Stock",
    stockBn: "স্টকে আছে",
    image: "/products/PremiumComfort-Diaper-Pack-Small.png",
    images: [
      "/products/PremiumComfort-Diaper-Pack-Small2.png",
      "/products/PremiumComfort-Diaper-Pack-Small3.png",
      "/products/PremiumComfort-Diaper-Pack-Small4.png",
    ],
    shortDescription: "Ultra-absorbent diapers for babies weighing 3-8 kg.",
    shortDescriptionBn: "৩-৮ কেজি ওজনের শিশুর জন্য আল্ট্রা-অ্যাবজরবেন্ট ডায়াপার।",
    description: "Designed for day and night use, this diaper pack helps keep babies dry and comfortable for longer. The small size is suitable for babies weighing 3-8 kg.",
    descriptionBn: "দিন ও রাতের ব্যবহারের জন্য তৈরি এই ডায়াপার শিশুকে দীর্ঘ সময় শুকনো ও আরামদায়ক রাখতে সাহায্য করে। স্মল সাইজ ৩-৮ কেজি ওজনের শিশুর জন্য উপযোগী।",
  },
  {
    id: "4",
    name: "Organic Oat Baby Wipes - 80 pcs",
    nameBn: "অরগ্যানিক ওট বেবি ওয়াইপস - ৮০ পিস",
    slug: "organic-oat-baby-wipes",
    category: "Diapers",
    price: 450,
    oldPrice: 550,
    badge: "Organic",
    badgeBn: "অরগ্যানিক",
    rating: 4.6,
    stock: "In Stock",
    stockBn: "স্টকে আছে",
    image: "/products/Organic-Oat-Baby-Wipes-80 pcs.png",
    shortDescription: "Fragrance-free wipes for diaper changes, hands, and face.",
    shortDescriptionBn: "ডায়াপার পরিবর্তন, হাত ও মুখ পরিষ্কারের জন্য সুগন্ধিমুক্ত ওয়াইপস।",
    description: "These organic oat baby wipes are gentle enough for sensitive skin and useful for diaper changes, travel, and quick cleanups at home.",
    descriptionBn: "অরগ্যানিক ওট বেবি ওয়াইপস সংবেদনশীল ত্বকের জন্য কোমল এবং ডায়াপার পরিবর্তন, বাইরে যাওয়া ও ঘরে দ্রুত পরিষ্কারের জন্য ব্যবহারযোগ্য।",
  },
  {
    id: "5",
    name: "Natural Wooden Teether Ring",
    nameBn: "ন্যাচারাল উডেন টিদার রিং",
    slug: "natural-wooden-teether",
    category: "Toys",
    price: 450,
    oldPrice: 520,
    badge: "Safe",
    badgeBn: "নিরাপদ",
    rating: 4.9,
    stock: "In Stock",
    stockBn: "স্টকে আছে",
    image: "/products/Natural-Wooden-Teether-Ring.png",
    images: [
      "/products/Natural-Wooden-Teether-Ring.png",
      "/products/Natural-Wooden-Teether-Ring1.png",
      "/products/Natural-Wooden-Teether-Ring2.png",
    ],
    shortDescription: "Chemical-free teether for soothing sore gums during teething.",
    shortDescriptionBn: "দাঁত ওঠার সময় মাড়ির অস্বস্তি কমাতে কেমিক্যাল-ফ্রি টিদার।",
    description: "A simple wooden teether ring made for little hands to hold easily. It helps soothe gums during teething and fits naturally into a baby essentials kit.",
    descriptionBn: "ছোট হাতে সহজে ধরার জন্য তৈরি সহজ উডেন টিদার রিং। দাঁত ওঠার সময় মাড়ির অস্বস্তি কমাতে সাহায্য করে এবং বেবি এসেনশিয়ালস কিটে সহজে মানিয়ে যায়।",
  },
  {
    id: "6",
    name: "Stainless Steel Feeding Bottle",
    nameBn: "BPA-ফ্রি স্টেইনলেস স্টিল ফিডিং বোতল",
    slug: "stainless-steel-feeding-bottle",
    category: "Feeding",
    price: 850,
    oldPrice: 990,
    badge: "Popular",
    badgeBn: "জনপ্রিয়",
    rating: 4.8,
    stock: "In Stock",
    stockBn: "স্টকে আছে",
    image: "/products/BPA-Free-Stainless-Steel-Feeding-Bottle.png",
    shortDescription: "Durable feeding bottle for safe everyday use.",
    shortDescriptionBn: "নিরাপদ প্রতিদিনের ব্যবহারের জন্য টেকসই ফিডিং বোতল।",
    description: "This BPA-free stainless steel feeding bottle is durable, easy to clean, and convenient for daily feeding routines at home or while travelling.",
    descriptionBn: "BPA-ফ্রি স্টেইনলেস স্টিল ফিডিং বোতল টেকসই, পরিষ্কার করা সহজ এবং বাসা বা ভ্রমণে প্রতিদিনের ফিডিং রুটিনের জন্য সুবিধাজনক।",
  },
  {
    id: "7",
    name: "Newborn Starter Essentials Pack",
    nameBn: "নবজাতক স্টার্টার এসেনশিয়ালস প্যাক",
    slug: "newborn-starter-pack",
    category: "Bundle",
    price: 2100,
    oldPrice: 2600,
    badge: "Bundle",
    badgeBn: "বান্ডেল",
    rating: 4.9,
    stock: "In Stock",
    stockBn: "স্টকে আছে",
    image: "/products/Newborn-Starter-Essentials-Pack.png",
    shortDescription: "Curated starter bundle for a newborn's first weeks.",
    shortDescriptionBn: "নবজাতকের প্রথম কয়েক সপ্তাহের জন্য বাছাই করা স্টার্টার বান্ডেল।",
    description: "A practical bundle for new parents, including everyday newborn essentials for changing, feeding, and gentle care. It also works well as a baby shower gift.",
    descriptionBn: "নতুন বাবা-মায়ের জন্য ব্যবহারিক বান্ডেল, যেখানে পরিবর্তন, ফিডিং এবং কোমল যত্নের জন্য প্রতিদিনের নবজাতক পণ্য রয়েছে। বেবি শাওয়ার উপহার হিসেবেও উপযোগী।",
  },
  {
    id: "8",
    name: "Mother Care Recovery Essentials Box",
    nameBn: "মাদার কেয়ার রিকভারি এসেনশিয়ালস বক্স",
    slug: "mother-care-essentials-box",
    category: "Mother Care",
    price: 1600,
    oldPrice: 1900,
    badge: "New",
    badgeBn: "নতুন",
    rating: 4.7,
    stock: "In Stock",
    stockBn: "স্টকে আছে",
    image: "/products/Mother-Care-Recovery-Essentials-Box.png",
    shortDescription: "Self-care essentials for new mothers after delivery.",
    shortDescriptionBn: "ডেলিভারির পর নতুন মায়েদের জন্য সেলফ-কেয়ার এসেনশিয়ালস।",
    description: "A thoughtful care box for new mothers with comfort-focused essentials for the early postpartum days. It is designed to support rest, recovery, and daily self-care.",
    descriptionBn: "প্রসব-পরবর্তী প্রথম দিকের দিনগুলোর জন্য নতুন মায়েদের আরামকেন্দ্রিক এসেনশিয়ালসসহ যত্নের বক্স। বিশ্রাম, রিকভারি এবং প্রতিদিনের সেলফ-কেয়ারে সহায়তার জন্য তৈরি।",
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}
