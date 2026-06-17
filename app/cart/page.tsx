"use client";

import { useCartStore } from "@/lib/cart-context";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { MotionDiv } from "@/components/shared/Motion";
import { fadeUp, staggerContainer, tapScale } from "@/lib/animations";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const { t } = useLanguage();

  if (!hasHydrated) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-brand-text-muted">
        {t("shop.loading")}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <MotionDiv className="flex-1 container-max mx-auto px-4 md:px-6 py-16 flex flex-col items-center justify-center text-center" variants={fadeUp}>
        <div className="w-24 h-24 bg-brand-surface rounded-full flex items-center justify-center mb-6 text-brand-text-muted">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-text mb-4">{t("cart.empty")}</h1>
        <p className="text-brand-text-muted mb-8 max-w-md">
          {t("cart.emptyDesc")}
        </p>
        <MotionDiv whileTap={tapScale}>
        <Link 
          href="/shop"
          className="inline-flex justify-center items-center h-12 px-8 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-colors"
        >
          {t("cart.startShopping")}
        </Link>
        </MotionDiv>
      </MotionDiv>
    );
  }

  return (
    <div className="flex-1 container-max mx-auto px-4 md:px-6 py-8 md:py-12">
      <MotionDiv className="flex items-center gap-2 mb-8" variants={fadeUp}>
        <Link href="/shop" className="text-brand-text-muted hover:text-brand-primary transition-colors p-2 -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-text">{t("cart.title")}</h1>
      </MotionDiv>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <MotionDiv className="flex-1 space-y-4" variants={staggerContainer}>
          {items.map((item) => (
            <CartItem key={item.lineId ?? item.id} item={item} />
          ))}
        </MotionDiv>
        
        <MotionDiv className="w-full lg:w-[400px]" variants={fadeUp}>
          <OrderSummary />
        </MotionDiv>
      </div>
    </div>
  );
}
