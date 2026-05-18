export type Language = "en" | "bn";

const translations = {
  // ===== NAVIGATION =====
  "nav.home": { en: "Home", bn: "হোম" },
  "nav.shop": { en: "Shop", bn: "শপ" },
  "nav.shopAll": { en: "Shop All", bn: "সব দেখুন" },
  "nav.diapers": { en: "Diapers", bn: "ডায়াপার" },
  "nav.skincare": { en: "Skincare", bn: "স্কিনকেয়ার" },
  "nav.feeding": { en: "Feeding", bn: "ফিডিং" },
  "nav.offers": { en: "Offers & Bundles", bn: "অফার ও বান্ডেল" },
  "nav.blog": { en: "Blog", bn: "ব্লগ" },
  "nav.contact": { en: "Contact", bn: "যোগাযোগ" },
  "nav.account": { en: "Account", bn: "অ্যাকাউন্ট" },
  "nav.cart": { en: "Cart", bn: "কার্ট" },

  // ===== HERO =====
  "hero.title": { en: "Because Your Baby Deserves the", bn: "কারণ আপনার শিশুর জন্য সেরাটাই" },
  "hero.titleHighlight": { en: "Best", bn: "প্রাপ্য" },
  "hero.subtitle": {
    en: "Gentle baby care, feeding, and newborn essentials delivered with care.",
    bn: "বাংলাদেশজুড়ে যত্নসহকারে পৌঁছে যাচ্ছে প্রিমিয়াম বেবি কেয়ার, ফিডিং ও নবজাতকের প্রয়োজনীয় পণ্য।",
  },
  "hero.shopNow": { en: "Shop Now", bn: "এখনই কিনুন" },
  "hero.viewBundles": { en: "View Bundles", bn: "বান্ডেল দেখুন" },
  "hero.genuine": { en: "Genuine", bn: "অরিজিনাল" },
  "hero.delivery": { en: "Delivery", bn: "ডেলিভারি" },
  "hero.cod": { en: "COD", bn: "সিওডি" },
  "hero.codLabel": { en: "Available", bn: "আছে" },
  "hero.rating": { en: "Rating", bn: "রেটিং" },

  // ===== CATEGORIES =====
  "cat.all": { en: "All", bn: "সব" },
  "cat.diapers": { en: "Diapers", bn: "ডায়াপার" },
  "cat.skincare": { en: "Skincare", bn: "স্কিনকেয়ার" },
  "cat.feeding": { en: "Feeding", bn: "ফিডিং" },
  "cat.clothing": { en: "Clothing", bn: "পোশাক" },
  "cat.toys": { en: "Toys", bn: "খেলনা" },
  "cat.motherCare": { en: "Mother Care", bn: "মাদার কেয়ার" },
  "cat.bundle": { en: "Bundle", bn: "বান্ডেল" },

  // ===== SECTION TITLES =====
  "section.shopByCategory": { en: "Shop by Category", bn: "ক্যাটাগরি অনুযায়ী কিনুন" },
  "section.popularEssentials": { en: "Popular Essentials", bn: "জনপ্রিয় বেবি এসেনশিয়ালস" },
  "section.curatedNewborns": { en: "Curated for Newborns", bn: "নবজাতকের জন্য বাছাই করা" },
  "section.viewAll": { en: "View All", bn: "সব দেখুন" },
  "section.shopNewborn": { en: "Shop Newborn", bn: "নবজাতকের পণ্য" },
  "section.youMayAlsoLike": { en: "You May Also Like", bn: "আপনার পছন্দ হতে পারে" },

  // ===== SHOP PAGE =====
  "shop.title": { en: "Shop Essentials", bn: "এসেনশিয়ালস কিনুন" },
  "shop.search": { en: "Search products...", bn: "পণ্য খুঁজুন..." },
  "shop.showing": { en: "Showing", bn: "দেখাচ্ছে" },
  "shop.products": { en: "products", bn: "টি পণ্য" },
  "shop.sortBy": { en: "Sort by: Recommended", bn: "সাজান: প্রস্তাবিত" },
  "shop.sortLabel": { en: "Sort products", bn: "পণ্য সাজান" },
  "shop.sortRecommended": { en: "Recommended", bn: "সাজানো" },
  "shop.sortPriceLow": { en: "Price: Low to High", bn: "দাম কম থেকে বেশি" },
  "shop.sortPriceHigh": { en: "Price: High to Low", bn: "দাম বেশি থেকে কম" },
  "shop.sortRating": { en: "Top Rated", bn: "বেশি রেটেড" },
  "shop.loadMore": { en: "Load More", bn: "আরো দেখুন" },
  "shop.noProducts": { en: "No products found.", bn: "কোনো পণ্য পাওয়া যায়নি।" },
  "shop.loading": { en: "Loading...", bn: "লোড হচ্ছে..." },

  // ===== PRODUCT DETAIL =====
  "product.addToCart": { en: "Add to Cart", bn: "কার্টে যোগ করুন" },
  "product.orderWhatsApp": { en: "Order on WhatsApp", bn: "হোয়াটসঅ্যাপে অর্ডার করুন" },
  "product.quantity": { en: "Quantity", bn: "পরিমাণ" },
  "product.description": { en: "Product Description", bn: "পণ্যের বিবরণ" },
  "product.deliveryInfo": { en: "Delivery Information", bn: "ডেলিভারি তথ্য" },
  "product.returnPolicy": { en: "Return Policy", bn: "রিটার্ন পলিসি" },
  "product.inStock": { en: "In Stock", bn: "স্টকে আছে" },
  "product.fastDelivery": { en: "Fast Nationwide Delivery", bn: "দ্রুত দেশব্যাপী ডেলিভারি" },
  "product.authentic": { en: "100% Authentic Product", bn: "১০০% অরিজিনাল পণ্য" },
  "product.deliveryDesc": {
    en: "Inside Dhaka and outside Dhaka delivery options are available. Cash on delivery available.",
    bn: "ঢাকার ভিতরে ও বাইরে ডেলিভারি অপশন রয়েছে। ক্যাশ অন ডেলিভারি আছে।",
  },
  "product.returnDesc": {
    en: "We offer a 3-day hassle-free return policy if the product is defective or not as described.",
    bn: "পণ্যে ত্রুটি থাকলে বা বিবরণের সাথে না মিললে ৩ দিনের মধ্যে ঝামেলামুক্ত রিটার্ন।",
  },
  "product.descContent": {
    en: "Detailed description of the premium materials, safety standards, and usage instructions for the product.",
    bn: "প্রিমিয়াম উপকরণ, নিরাপত্তা মান এবং ব্যবহারের বিস্তারিত বিবরণ।",
  },
  "product.mainImage": { en: "Main Product Image", bn: "প্রধান পণ্যের ছবি" },
  "product.image": { en: "Image", bn: "ছবি" },
  "product.thumb": { en: "Thumb", bn: "থাম্ব" },

  // ===== CART =====
  "cart.title": { en: "Shopping Cart", bn: "শপিং কার্ট" },
  "cart.empty": { en: "Your Cart is Empty", bn: "আপনার কার্ট খালি" },
  "cart.emptyDesc": {
    en: "Looks like you haven\u0027t added anything to your cart yet. Discover our premium baby essentials.",
    bn: "আপনি এখনো কার্টে কিছু যোগ করেননি। আমাদের প্রিমিয়াম বেবি এসেনশিয়ালস দেখুন।",
  },
  "cart.continueShopping": { en: "Continue Shopping", bn: "কেনাকাটা চালিয়ে যান" },
  "cart.startShopping": { en: "Start Shopping", bn: "কেনাকাটা শুরু করুন" },
  "cart.remove": { en: "Remove", bn: "রিমুভ" },
  "cart.promoCode": { en: "Promo code", bn: "প্রোমো কোড" },
  "cart.apply": { en: "Apply", bn: "প্রয়োগ করুন" },
  "cart.orderSummary": { en: "Order Summary", bn: "অর্ডার সারাংশ" },
  "cart.subtotal": { en: "Subtotal", bn: "সাবটোটাল" },
  "cart.deliveryFee": { en: "Delivery Fee", bn: "ডেলিভারি ফি" },
  "cart.total": { en: "Total", bn: "মোট" },
  "cart.checkout": { en: "Proceed to Checkout", bn: "চেকআউটে যান" },
  "cart.viewCart": { en: "View Cart", bn: "কার্ট দেখুন" },
  "cart.items": { en: "items", bn: "টি পণ্য" },
  "cart.decreaseQuantity": { en: "Decrease quantity", bn: "পরিমাণ কমান" },
  "cart.increaseQuantity": { en: "Increase quantity", bn: "পরিমাণ বাড়ান" },

  // ===== CHECKOUT =====
  "checkout.title": { en: "Checkout", bn: "চেকআউট" },
  "checkout.cart": { en: "Cart", bn: "কার্ট" },
  "checkout.shippingPayment": { en: "Shipping & Payment", bn: "শিপিং ও পেমেন্ট" },
  "checkout.shipping": { en: "Shipping Details", bn: "শিপিং তথ্য" },
  "checkout.fullName": { en: "Full Name", bn: "পূর্ণ নাম" },
  "checkout.phone": { en: "Phone Number", bn: "ফোন নম্বর" },
  "checkout.address": { en: "Full Address", bn: "সম্পূর্ণ ঠিকানা" },
  "checkout.city": { en: "City / District", bn: "শহর / জেলা" },
  "checkout.deliveryMethod": { en: "Delivery Method", bn: "ডেলিভারি পদ্ধতি" },
  "checkout.insideDhaka": { en: "Inside Dhaka", bn: "ঢাকার ভিতরে" },
  "checkout.outsideDhaka": { en: "Outside Dhaka", bn: "ঢাকার বাইরে" },
  "checkout.paymentMethod": { en: "Payment Method", bn: "পেমেন্ট পদ্ধতি" },
  "checkout.cod": { en: "Cash on Delivery", bn: "ক্যাশ অন ডেলিভারি" },
  "checkout.bkash": { en: "bKash", bn: "বিকাশ" },
  "checkout.nagad": { en: "Nagad", bn: "নগদ" },
  "checkout.confirm": { en: "Confirm Order", bn: "অর্ডার কনফার্ম করুন" },
  "checkout.secure": { en: "100% secure checkout", bn: "১০০% নিরাপদ চেকআউট" },
  "checkout.orderConfirmed": { en: "Order Confirmed!", bn: "অর্ডার কনফার্ম হয়েছে!" },
  "checkout.success": { en: "Order Placed Successfully!", bn: "অর্ডার সফলভাবে সম্পন্ন হয়েছে!" },
  "checkout.successDesc": {
    en: "Thank you for shopping with us. We have received your order and will process it shortly.",
    bn: "আমাদের কাছ থেকে কেনাকাটা করার জন্য ধন্যবাদ। আমরা আপনার অর্ডার পেয়েছি এবং শীঘ্রই প্রসেস করব।",
  },
  "checkout.namePlaceholder": { en: "Enter your full name", bn: "আপনার পূর্ণ নাম লিখুন" },
  "checkout.phonePlaceholder": { en: "e.g. 01700000000", bn: "যেমন ০১৭০০০০০০০০" },
  "checkout.addressPlaceholder": { en: "House/Flat No, Street, Area", bn: "বাসা/ফ্ল্যাট নম্বর, রাস্তা, এলাকা" },
  "checkout.cityPlaceholder": { en: "e.g. Dhaka", bn: "যেমন ঢাকা" },
  "checkout.insideDhakaDesc": { en: "Standard inside Dhaka delivery", bn: "ঢাকার ভিতরে স্ট্যান্ডার্ড ডেলিভারি" },
  "checkout.outsideDhakaDesc": { en: "Standard outside Dhaka delivery", bn: "ঢাকার বাইরে স্ট্যান্ডার্ড ডেলিভারি" },
  "checkout.payAtDoorstep": { en: "Pay at doorstep", bn: "ডেলিভারির সময় পেমেন্ট" },

  // ===== CONTACT =====
  "contact.title": { en: "We\u0027re Here to Help", bn: "আমরা আপনার সাহায্যে আছি" },
  "contact.subtitle": {
    en: "Have a question about a product or your order? Our team is always ready to assist you.",
    bn: "পণ্য বা অর্ডার নিয়ে কোনো প্রশ্ন? আমাদের টিম সবসময় আপনাকে সাহায্য করতে প্রস্তুত।",
  },
  "contact.whatsapp": { en: "WhatsApp Support", bn: "হোয়াটসঅ্যাপ সাপোর্ট" },
  "contact.whatsappUs": { en: "WhatsApp Us", bn: "হোয়াটসঅ্যাপে লিখুন" },
  "contact.fastSupport": { en: "Fastest way to get support", bn: "সাপোর্ট পাওয়ার দ্রুততম উপায়" },
  "contact.call": { en: "Call Now", bn: "কল করুন" },
  "contact.callUs": { en: "Call Us", bn: "আমাদের কল করুন" },
  "contact.hours": { en: "Sat-Thu, 9am - 8pm", bn: "শনি-বৃহস্পতি, সকাল ৯টা - রাত ৮টা" },
  "contact.email": { en: "Email Us", bn: "ইমেইল করুন" },
  "contact.emailUs": { en: "Email Us", bn: "আমাদের ইমেইল করুন" },
  "contact.generalInquiries": { en: "For general inquiries", bn: "সাধারণ জিজ্ঞাসার জন্য" },
  "contact.storeAddress": { en: "Store Address", bn: "স্টোর ঠিকানা" },
  "contact.sendMessage": { en: "Send us a message", bn: "আমাদের মেসেজ করুন" },
  "contact.fullName": { en: "Full Name", bn: "পূর্ণ নাম" },
  "contact.emailAddress": { en: "Email Address", bn: "ইমেইল ঠিকানা" },
  "contact.subject": { en: "Subject", bn: "বিষয়" },
  "contact.message": { en: "Message", bn: "মেসেজ" },
  "contact.send": { en: "Send Message", bn: "মেসেজ পাঠান" },
  "contact.namePlaceholder": { en: "Enter your full name", bn: "আপনার পূর্ণ নাম লিখুন" },
  "contact.emailPlaceholder": { en: "Enter your email", bn: "আপনার ইমেইল লিখুন" },
  "contact.subjectPlaceholder": { en: "How can we help you?", bn: "আমরা কিভাবে সাহায্য করতে পারি?" },
  "contact.messagePlaceholder": { en: "Write your message here...", bn: "এখানে আপনার মেসেজ লিখুন..." },
  "contact.messageSent": {
    en: "Message sent! We will get back to you soon.",
    bn: "মেসেজ পাঠানো হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
  },

  // ===== ACCOUNT =====
  "account.title": { en: "My Account", bn: "আমার অ্যাকাউন্ট" },
  "account.subtitle": {
    en: "Sign in to manage your orders, saved addresses, and baby product preferences.",
    bn: "আপনার অর্ডার, ডেলিভারি ঠিকানা এবং বেবি প্রোডাক্ট পছন্দ ম্যানেজ করতে সাইন ইন করুন।",
  },
  "account.welcomeBack": { en: "Welcome Back", bn: "স্বাগতম" },
  "account.emailOrPhone": { en: "Email or Phone Number", bn: "ইমেইল বা ফোন নম্বর" },
  "account.password": { en: "Password", bn: "পাসওয়ার্ড" },
  "account.emailPlaceholder": { en: "e.g. 017XXXXXXXX or user@example.com", bn: "যেমন ০১৭XXXXXXXX বা user@example.com" },
  "account.passwordPlaceholder": { en: "Enter your password", bn: "আপনার পাসওয়ার্ড লিখুন" },
  "account.forgotPassword": { en: "Forgot password?", bn: "পাসওয়ার্ড ভুলে গেছেন?" },
  "account.signIn": { en: "Sign In", bn: "সাইন ইন" },
  "account.orContinueWith": { en: "Or continue with", bn: "অথবা দিয়ে চালিয়ে যান" },
  "account.google": { en: "Google", bn: "গুগল" },
  "account.noAccount": { en: "Don\u0027t have an account?", bn: "অ্যাকাউন্ট নেই?" },
  "account.createAccount": { en: "Create Account", bn: "অ্যাকাউন্ট তৈরি করুন" },
  "account.whyCreate": { en: "Why create an account?", bn: "কেন অ্যাকাউন্ট তৈরি করবেন?" },
  "account.loginSoon": {
    en: "Account login will be connected soon.",
    bn: "অ্যাকাউন্ট লগইন শীঘ্রই যুক্ত করা হবে।",
  },
  "account.trackOrders": { en: "Track your orders", bn: "আপনার অর্ডার ট্র্যাক করুন" },
  "account.trackOrdersDesc": {
    en: "Get real-time updates on your baby essentials delivery.",
    bn: "আপনার বেবি এসেনশিয়ালস ডেলিভারির রিয়েল-টাইম আপডেট পান।",
  },
  "account.saveAddresses": { en: "Save delivery addresses", bn: "ডেলিভারি ঠিকানা সেভ করুন" },
  "account.saveAddressesDesc": {
    en: "Checkout faster with your saved home or office addresses.",
    bn: "সেভ করা ঠিকানা দিয়ে দ্রুত চেকআউট করুন।",
  },
  "account.reorder": { en: "Reorder faster", bn: "দ্রুত পুনরায় অর্ডার করুন" },
  "account.reorderDesc": {
    en: "Quickly reorder your baby\u0027s favorite products with one tap.",
    bn: "এক ট্যাপে আপনার শিশুর পছন্দের পণ্য আবার অর্ডার করুন।",
  },
  "account.specialOffers": { en: "Get special baby care offers", bn: "বেবি কেয়ার স্পেশাল অফার পান" },
  "account.specialOffersDesc": {
    en: "Receive exclusive discounts on diapers and skincare.",
    bn: "ডায়াপার ও স্কিনকেয়ারে এক্সক্লুসিভ ডিসকাউন্ট পান।",
  },

  // ===== BLOG =====
  "blog.title": { en: "Parenting Tips & Guides", bn: "প্যারেন্টিং টিপস ও গাইড" },
  "blog.pageTitle": { en: "Parenting Guide", bn: "প্যারেন্টিং গাইড" },
  "blog.subtitle": {
    en: "Expert advice and helpful guides for new and expecting parents.",
    bn: "নতুন ও হবু বাবা-মায়ের জন্য বিশেষজ্ঞ পরামর্শ ও সহায়ক গাইড।",
  },
  "blog.pageSubtitle": {
    en: "Helpful tips, expert advice, and genuine stories to support you on your beautiful journey of parenthood.",
    bn: "প্যারেন্টহুডের সুন্দর যাত্রায় সহায়তার জন্য দরকারি টিপস, বিশেষজ্ঞ পরামর্শ ও বাস্তব অভিজ্ঞতা।",
  },
  "blog.readMore": { en: "Read More", bn: "আরো পড়ুন" },
  "blog.readArticle": { en: "Read Article", bn: "আর্টিকেল পড়ুন" },
  "blog.image": { en: "Blog Image", bn: "ব্লগ ছবি" },
  "blog.minRead": { en: "min read", bn: "মিনিট পড়া" },

  // ===== FOOTER =====
  "footer.tagline": {
    en: "Because your baby deserves the best. Gentle baby care essentials delivered with care.",
    bn: "কারণ আপনার শিশুর জন্য সেরাটাই প্রাপ্য। বাংলাদেশজুড়ে যত্নসহকারে প্রিমিয়াম বেবি কেয়ার ও ফিডিং পণ্য।",
  },
  "footer.quickLinks": { en: "Quick Links", bn: "দ্রুত লিংক" },
  "footer.support": { en: "Support", bn: "সাপোর্ট" },
  "footer.customerCare": { en: "Customer Care", bn: "কাস্টমার কেয়ার" },
  "footer.parentingBlog": { en: "Parenting Blog", bn: "প্যারেন্টিং ব্লগ" },
  "footer.contactUs": { en: "Contact Us", bn: "যোগাযোগ করুন" },
  "footer.trackOrder": { en: "Track Order", bn: "অর্ডার ট্র্যাক করুন" },
  "footer.shippingPolicy": { en: "Shipping Policy", bn: "শিপিং পলিসি" },
  "footer.returnPolicy": { en: "Return Policy", bn: "রিটার্ন পলিসি" },
  "footer.returns": { en: "Returns & Exchange", bn: "রিটার্ন ও এক্সচেঞ্জ" },
  "footer.faq": { en: "FAQ", bn: "সচরাচর জিজ্ঞাস্য" },
  "footer.faqs": { en: "FAQs", bn: "প্রশ্নোত্তর" },
  "footer.privacy": { en: "Privacy Policy", bn: "প্রাইভেসি পলিসি" },
  "footer.rights": { en: "All rights reserved.", bn: "সর্বস্বত্ব সংরক্ষিত।" },
  "footer.genuine": { en: "100% Genuine", bn: "১০০% অরিজিনাল" },
  "footer.safeForBaby": { en: "Safe for your baby", bn: "আপনার শিশুর জন্য নিরাপদ" },
  "footer.genuineProducts": { en: "Genuine Products", bn: "অরিজিনাল পণ্য" },
  "footer.genuineDesc": { en: "100% authentic guarantee", bn: "১০০% অরিজিনাল গ্যারান্টি" },
  "footer.fastDelivery": { en: "Fast Delivery", bn: "দ্রুত ডেলিভারি" },
  "footer.fastDeliveryDesc": { en: "Across Bangladesh", bn: "সারা বাংলাদেশে" },
  "footer.easyReturns": { en: "Easy Returns", bn: "সহজ রিটার্ন" },
  "footer.easyReturnsDesc": { en: "No questions asked", bn: "কোনো প্রশ্ন ছাড়াই" },

  // ===== TOAST =====
  "toast.addedToCart": { en: "Added to cart", bn: "কার্টে যোগ হয়েছে" },
  "toast.addedDesc": { en: "has been added to your cart.", bn: "আপনার কার্টে যোগ হয়েছে।" },

  // ===== SEARCH =====
  "search.placeholder": {
    en: "Search for diapers, skincare, feeding essentials...",
    bn: "ডায়াপার, স্কিনকেয়ার, ফিডিং এসেনশিয়ালস খুঁজুন...",
  },

  // ===== MISC =====
  "misc.openMenu": { en: "Open menu", bn: "মেনু খুলুন" },
  "misc.closeMenu": { en: "Close menu", bn: "মেনু বন্ধ করুন" },
  "misc.openSearch": { en: "Open search", bn: "সার্চ খুলুন" },
  "misc.closeSearch": { en: "Close search", bn: "সার্চ বন্ধ করুন" },
  "misc.closeNotification": { en: "Close notification", bn: "নোটিফিকেশন বন্ধ করুন" },
  "misc.whatsappChat": { en: "Chat with us", bn: "আমাদের সাথে চ্যাট করুন" },
  "misc.whatsappMessage": {
    en: "I want to order baby products",
    bn: "আমি বেবি পণ্য অর্ডার করতে চাই",
  },
} as const;

export type TranslationKey = keyof typeof translations;

export function getTranslation(key: TranslationKey, lang: Language): string {
  const entry = translations[key];
  return entry?.[lang] ?? entry?.en ?? key;
}

// Category display name mapping (internal key → display)
export const categoryDisplayNames: Record<string, { en: string; bn: string }> = {
  All: { en: "All", bn: "সব" },
  Diapers: { en: "Diapers", bn: "ডায়াপার" },
  Skincare: { en: "Skincare", bn: "স্কিনকেয়ার" },
  Feeding: { en: "Feeding", bn: "ফিডিং" },
  Clothing: { en: "Clothing", bn: "পোশাক" },
  Toys: { en: "Toys", bn: "খেলনা" },
  "Mother Care": { en: "Mother Care", bn: "মাদার কেয়ার" },
  Bundle: { en: "Bundle", bn: "বান্ডেল" },
};

export default translations;
