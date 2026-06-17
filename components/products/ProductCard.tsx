"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import {
  getCategoryById,
  getCompareAtPrice,
  getProductImage,
  hasProductVariants,
  isProductAvailableForPurchase,
  type Product,
} from "@/lib/products";
import { useCartStore } from "@/lib/cart-context";
import { useCartToast } from "@/components/shared/ToastProvider";
import CommerceImage from "@/components/shared/CommerceImage";
import { useLanguage } from "@/lib/i18n/language-context";
import { formatPrice } from "@/lib/site-config";
import { MotionDiv } from "@/components/shared/Motion";
import { cardHover, fadeUp, tapScale } from "@/lib/animations";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const { showCartToast } = useCartToast();
  const { language, t } = useLanguage();
  const displayName = language === "bn" ? product.nameBn : product.name;
  const category = getCategoryById(product.category);
  const displayCategory = category ? t(category.labelKey) : product.category;
  const displayBadge = language === "bn" ? product.badgeBn ?? product.badge : product.badge;
  const productImage = getProductImage(product);
  const compareAtPrice = getCompareAtPrice(product);
  const hasProductImage = Boolean(productImage) && !productImage.includes("placeholder");
  const requiresVariantSelection = hasProductVariants(product);
  const isAvailable = isProductAvailableForPurchase(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hasHydrated) return;
    if (!isAvailable) return;

    if (requiresVariantSelection) {
      router.push(`/products/${product.slug}`);
      return;
    }

    addItem({
      id: product.id,
      lineId: product.id,
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      nameBn: product.nameBn,
      price: product.price,
      image: productImage,
    });
    showCartToast(displayName);
  };

  return (
    <MotionDiv variants={fadeUp} whileHover={cardHover} className="h-full">
    <Link href={`/products/${product.slug}`} className="group flex flex-col bg-white rounded-2xl p-3 border border-brand-outline hover:border-brand-primary-light transition-all shadow-sm hover:shadow-[0_8px_24px_rgba(85,97,88,0.08)] relative">
      {product.badge && (
        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#ffeee8] text-[#ba1a1a] rounded-full">
          {displayBadge}
        </div>
      )}

      <div className="aspect-square bg-brand-surface rounded-xl overflow-hidden mb-4 relative flex items-center justify-center">
        {hasProductImage ? (
          <CommerceImage
            src={productImage}
            alt={displayName}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-brand-text-muted/30 text-xs">{t("product.image")}: {productImage.split("/").pop()}</div>
        )}
      </div>

      <div className="flex flex-col flex-grow">
        <div className="text-xs text-brand-text-muted mb-1 font-medium">{displayCategory}</div>
        <h3 className="font-semibold text-brand-text leading-tight mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
          {displayName}
        </h3>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <div className="text-lg font-bold text-brand-text">{formatPrice(product.price)}</div>
            {compareAtPrice && (
              <div className="text-xs text-brand-text-muted line-through">{formatPrice(compareAtPrice)}</div>
            )}
          </div>

          <MotionDiv whileTap={tapScale}>
          <button
            onClick={handleAddToCart}
            disabled={!hasHydrated || !isAvailable}
            className="w-10 h-10 rounded-full bg-brand-primary-light text-brand-primary flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={requiresVariantSelection ? "Select options" : t("product.addToCart")}
          >
            <Plus className="w-5 h-5" />
          </button>
          </MotionDiv>
        </div>
      </div>
    </Link>
    </MotionDiv>
  );
}
