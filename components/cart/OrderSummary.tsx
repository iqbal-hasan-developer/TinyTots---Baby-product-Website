"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { type DeliveryZone, formatPrice, getDeliveryFee } from "@/lib/site-config";
import { MotionDiv } from "@/components/shared/Motion";
import { fadeUp, tapScale } from "@/lib/animations";

interface OrderSummaryProps {
  buttonText?: string;
  buttonHref?: string;
  showPromo?: boolean;
  showAction?: boolean;
  deliveryZone?: DeliveryZone;
}

export default function OrderSummary({ 
  buttonText, 
  buttonHref = "/checkout",
  showPromo = true,
  showAction = true,
  deliveryZone = "inside",
}: OrderSummaryProps) {
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const { t } = useLanguage();
  const [promoNotice, setPromoNotice] = useState("");
  
  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee(deliveryZone, subtotal);
  const total = subtotal + deliveryFee;
  const ctaText = buttonText || (buttonHref ? t("cart.checkout") : t("checkout.confirm"));

  if (items.length === 0) return null;

  return (
    <MotionDiv variants={fadeUp} className="bg-brand-surface rounded-2xl p-6 border border-brand-outline sticky top-24">
      <h3 className="font-bold text-lg text-brand-text mb-6">{t("cart.orderSummary")}</h3>
      
      {showPromo && (
        <>
          <div className={`flex gap-2 ${promoNotice ? "mb-2" : "mb-6"}`}>
            <label htmlFor="cart-promo-code" className="sr-only">{t("cart.promoCode")}</label>
            <input
              id="cart-promo-code"
              type="text"
              placeholder={t("cart.promoCode")}
              className="min-w-0 flex-grow bg-white border border-brand-outline rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setPromoNotice("Promo codes will be connected in a later phase.")}
              className="bg-brand-text text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-brand-text/90 transition-colors cursor-pointer"
            >
              {t("cart.apply")}
            </button>
          </div>
          {promoNotice && (
            <p className="mb-6 text-xs font-medium text-brand-text-muted" role="status">
              {promoNotice}
            </p>
          )}
        </>
      )}
      
      <div className="space-y-4 text-sm mb-6 pb-6 border-b border-brand-outline">
        <div className="flex justify-between text-brand-text-muted">
          <span>{t("cart.subtotal")} ({items.length} {t("cart.items")})</span>
          <span className="font-medium text-brand-text">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-brand-text-muted">
          <span>{t("cart.deliveryFee")}</span>
          <span className="font-medium text-brand-text">{formatPrice(deliveryFee)}</span>
        </div>
      </div>
      
      <div className="flex justify-between font-bold text-lg text-brand-text mb-6">
        <span>{t("cart.total")}</span>
        <span className="text-brand-primary">{formatPrice(total)}</span>
      </div>
      
      {showAction && buttonHref ? (
        <MotionDiv whileTap={tapScale}>
        <Link 
          href={buttonHref}
          className="w-full flex justify-center items-center h-14 rounded-xl bg-brand-primary text-white font-semibold text-lg hover:bg-brand-primary/90 transition-colors shadow-md"
        >
          {ctaText}
        </Link>
        </MotionDiv>
      ) : showAction ? (
        <MotionDiv whileTap={tapScale}>
        <button type="button" className="w-full flex justify-center items-center h-14 rounded-xl bg-brand-primary text-white font-semibold text-lg hover:bg-brand-primary/90 transition-colors shadow-md">
          {ctaText}
        </button>
        </MotionDiv>
      ) : null}
    </MotionDiv>
  );
}
