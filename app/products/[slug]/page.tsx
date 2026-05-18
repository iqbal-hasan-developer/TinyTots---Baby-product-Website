"use client";

import { useState } from "react";
import { getProductBySlug, products } from "@/lib/products";
import { notFound } from "next/navigation";
import { useCartStore } from "@/lib/cart-context";
import QuantitySelector from "@/components/shared/QuantitySelector";
import { MessageCircle, Star, Truck, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import ProductCard from "@/components/products/ProductCard";
import { useCartToast } from "@/components/shared/ToastProvider";
import { categoryDisplayNames } from "@/lib/i18n/translations";
import { useLanguage } from "@/lib/i18n/language-context";
import { formatPrice, getWhatsAppUrl, siteConfig } from "@/lib/site-config";
import { MotionDiv } from "@/components/shared/Motion";
import { fadeUp, softScale, staggerContainer, tapScale } from "@/lib/animations";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const product = getProductBySlug(resolvedParams.slug);
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState("description");
  const { showCartToast } = useCartToast();
  const { language, t } = useLanguage();

  if (!product) {
    notFound();
  }

  const displayName = language === "bn" ? product.nameBn : product.name;
  const displayCategory = categoryDisplayNames[product.category]?.[language] ?? product.category;
  const displayBadge = language === "bn" ? product.badgeBn ?? product.badge : product.badge;
  const displayStock = language === "bn" ? product.stockBn : product.stock;
  const displayDescription = language === "bn" ? product.descriptionBn : product.description;
  const productImages = (product.images?.length ? product.images : product.image ? [product.image] : []).filter(Boolean);
  const mainImage = productImages[selectedImage] ?? product.image ?? "";
  const hasProductImages = productImages.some((image) => !image.includes("placeholder"));
  const deliveryDescription = language === "bn"
    ? `ঢাকার ভিতরে: ১-২ দিন (${formatPrice(siteConfig.deliveryInsideDhaka)})। ঢাকার বাইরে: ৩-৫ দিন (${formatPrice(siteConfig.deliveryOutsideDhaka)})। ক্যাশ অন ডেলিভারি আছে।`
    : `Inside Dhaka: 1-2 days (${formatPrice(siteConfig.deliveryInsideDhaka)}). Outside Dhaka: 3-5 days (${formatPrice(siteConfig.deliveryOutsideDhaka)}). Cash on delivery available.`;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        nameBn: product.nameBn,
        price: product.price,
        image: mainImage,
      });
    }
    showCartToast(displayName);
  };

  const whatsappMsg = `Hi ${siteConfig.businessName}, I want to order ${quantity}x ${displayName} (${formatPrice(product.price)}).`;
  const whatsappUrl = getWhatsAppUrl(whatsappMsg);

  return (
    <div className="flex-1 container-max mx-auto px-4 md:px-6 py-8 md:py-12">
      <MotionDiv className="text-sm font-medium text-brand-text-muted mb-6 flex gap-2" variants={fadeUp}>
        <Link href="/" className="hover:text-brand-primary">{t("nav.home")}</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-brand-primary">{displayCategory}</Link>
        <span>/</span>
        <span className="text-brand-text line-clamp-1">{displayName}</span>
      </MotionDiv>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-16">
        {/* Product Gallery (simplified) */}
        <MotionDiv className="space-y-4" variants={softScale}>
          <div className="aspect-square bg-brand-surface rounded-[2rem] border border-brand-outline flex items-center justify-center relative overflow-hidden">
             {product.badge && (
               <div className="absolute top-6 left-6 z-10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#ffeee8] text-[#ba1a1a] rounded-full">
                 {displayBadge}
               </div>
             )}
             {hasProductImages ? (
               <Image
                 src={mainImage}
                 alt={displayName}
                 fill
                 priority
                 sizes="(min-width: 768px) 50vw, 100vw"
                 className="object-cover"
               />
             ) : (
               <span className="text-brand-text-muted">{t("product.mainImage")}</span>
             )}
          </div>
          <MotionDiv className="grid grid-cols-4 gap-4" variants={staggerContainer}>
            {hasProductImages ? (
              productImages.map((image, index) => (
                <MotionDiv key={image} variants={fadeUp} whileTap={tapScale}>
                <button
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-brand-surface rounded-xl border flex items-center justify-center cursor-pointer overflow-hidden transition-colors ${
                    selectedImage === index ? "border-brand-primary" : "border-brand-outline hover:border-brand-primary"
                  }`}
                  aria-label={`${t("product.thumb")} ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${displayName} ${index + 1}`}
                    width={120}
                    height={120}
                    className="h-full w-full object-cover"
                  />
                </button>
                </MotionDiv>
              ))
            ) : (
              [1, 2, 3, 4].map((i) => (
                <MotionDiv key={i} variants={fadeUp} className="aspect-square bg-brand-surface rounded-xl border border-brand-outline flex items-center justify-center cursor-pointer hover:border-brand-primary transition-colors">
                  <span className="text-xs text-brand-text-muted/50">{t("product.thumb")} {i}</span>
                </MotionDiv>
              ))
            )}
          </MotionDiv>
        </MotionDiv>

        {/* Product Info */}
        <MotionDiv className="flex flex-col" variants={staggerContainer}>
          <MotionDiv variants={fadeUp}>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text mb-2 leading-tight">
            {displayName}
          </h1>
          </MotionDiv>
          
          <MotionDiv className="flex items-center gap-4 mb-6" variants={fadeUp}>
            <div className="flex items-center text-[#f59e0b]">
              <Star className="w-5 h-5 fill-current" />
              <span className="ml-1 font-bold text-brand-text">{product.rating}</span>
            </div>
            <div className="text-brand-text-muted text-sm">
              <span className="text-[#25D366] font-medium">{displayStock}</span>
            </div>
          </MotionDiv>

          <MotionDiv className="flex items-end gap-3 mb-8" variants={fadeUp}>
            <div className="text-3xl font-bold text-brand-primary">{formatPrice(product.price)}</div>
            {product.oldPrice && (
              <div className="text-lg text-brand-text-muted line-through mb-1">{formatPrice(product.oldPrice)}</div>
            )}
          </MotionDiv>

          <MotionDiv variants={fadeUp}>
          <p className="text-brand-text-muted leading-relaxed mb-8">
            {displayDescription}
          </p>
          </MotionDiv>

          <MotionDiv className="mb-8 space-y-4" variants={fadeUp}>
            <div className="font-semibold text-brand-text">{t("product.quantity")}</div>
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          </MotionDiv>

          <MotionDiv className="flex flex-col sm:flex-row gap-4 mb-8" variants={fadeUp}>
            <MotionDiv whileTap={tapScale} className="flex-1">
            <button 
              onClick={handleAddToCart}
              className="w-full h-14 rounded-xl bg-brand-primary text-white font-semibold text-lg hover:bg-brand-primary/90 transition-colors shadow-md cursor-pointer"
            >
              {t("product.addToCart")}
            </button>
            </MotionDiv>
            <MotionDiv whileTap={tapScale} className="flex-1">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-14 rounded-xl border-2 border-[#25D366] text-[#25D366] flex items-center justify-center gap-2 font-semibold text-lg hover:bg-[#25D366] hover:text-white transition-colors"
            >
              <MessageCircle className="w-5 h-5" /> {t("product.orderWhatsApp")}
            </a>
            </MotionDiv>
          </MotionDiv>

          {/* Trust indicators */}
          <MotionDiv className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y border-brand-outline mb-8" variants={fadeUp}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-secondary-light/50 rounded-full text-brand-secondary">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-brand-text">{t("product.fastDelivery")}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary-light/50 rounded-full text-brand-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-brand-text">{t("product.authentic")}</span>
            </div>
          </MotionDiv>

          {/* Accordions */}
          <MotionDiv className="space-y-4" variants={staggerContainer}>
            {[
              { id: "description", title: t("product.description"), content: displayDescription },
              { id: "delivery", title: t("product.deliveryInfo"), content: deliveryDescription },
              { id: "returns", title: t("product.returnPolicy"), content: t("product.returnDesc") }
            ].map((acc) => (
              <MotionDiv key={acc.id} variants={fadeUp} className="border border-brand-outline rounded-xl overflow-hidden">
                <button 
                  onClick={() => setOpenAccordion(openAccordion === acc.id ? "" : acc.id)}
                  className="w-full flex items-center justify-between p-4 bg-brand-surface font-semibold text-brand-text text-left cursor-pointer"
                >
                  {acc.title}
                  {openAccordion === acc.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {openAccordion === acc.id && (
                  <div className="p-4 bg-white text-brand-text-muted text-sm leading-relaxed border-t border-brand-outline">
                    {acc.content}
                  </div>
                )}
              </MotionDiv>
            ))}
          </MotionDiv>
        </MotionDiv>
      </div>

      {/* Related Products Section */}
      <MotionDiv className="mt-16 pt-12 border-t border-brand-outline" variants={fadeUp}>
        <h2 className="text-2xl font-bold text-brand-text mb-8">{t("section.youMayAlsoLike")}</h2>
        <MotionDiv className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" variants={staggerContainer}>
          {products
            .filter((p) => p.id !== product.id && p.category === product.category)
            .slice(0, 4)
            .map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          {/* Fallback if no related products in the same category */}
          {products.filter((p) => p.id !== product.id && p.category === product.category).length === 0 && 
            products.filter((p) => p.id !== product.id).slice(0, 4).map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))
          }
        </MotionDiv>
      </MotionDiv>
    </div>
  );
}
