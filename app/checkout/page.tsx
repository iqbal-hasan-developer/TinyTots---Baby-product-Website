"use client";

import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/cart/OrderSummary";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { MotionDiv } from "@/components/shared/Motion";
import { fadeUp } from "@/lib/animations";

export default function CheckoutPage() {
  const { t } = useLanguage();

  return (
    <div className="flex-1 container-max mx-auto px-4 md:px-6 py-8 md:py-12 bg-brand-surface">
      <MotionDiv className="flex items-center gap-2 mb-6" variants={fadeUp}>
        <Link href="/cart" className="text-brand-text-muted hover:text-brand-primary transition-colors p-2 -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-text">{t("checkout.title")}</h1>
      </MotionDiv>

      <MotionDiv className="flex items-center gap-2 text-sm font-medium text-brand-text-muted mb-8 md:mb-10 px-2 overflow-x-auto whitespace-nowrap hide-scrollbar" variants={fadeUp}>
        <span className="text-brand-text">{t("checkout.cart")}</span>
        <span className="text-brand-outline">/</span>
        <span className="text-brand-primary">{t("checkout.shippingPayment")}</span>
      </MotionDiv>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <MotionDiv className="flex-1" variants={fadeUp}>
          <CheckoutForm />
        </MotionDiv>
        
        <MotionDiv className="w-full lg:w-[400px]" variants={fadeUp}>
          <OrderSummary showPromo={false} showAction={false} />
        </MotionDiv>
      </div>
    </div>
  );
}
