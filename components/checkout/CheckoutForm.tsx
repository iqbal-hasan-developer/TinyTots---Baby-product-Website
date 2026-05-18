"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-context";
import { CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { formatPrice, siteConfig } from "@/lib/site-config";

export default function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [deliveryMethod, setDeliveryMethod] = useState("inside");
  const clearCart = useCartStore((state) => state.clearCart);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { language, t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate order placement
    setTimeout(() => {
      setIsSubmitted(true);
      clearCart();
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-brand-outline text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-brand-primary-light text-brand-primary rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-brand-text mb-2">{t("checkout.orderConfirmed")}</h2>
        <p className="text-brand-text-muted mb-8 max-w-md">
          {t("checkout.successDesc")}
        </p>
        <Link 
          href="/"
          className="inline-flex justify-center items-center h-12 px-8 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-colors"
        >
          {t("cart.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Details */}
      <div className="bg-white rounded-2xl p-6 border border-brand-outline">
        <h3 className="font-bold text-lg text-brand-text mb-4">{t("checkout.shipping")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">{t("checkout.fullName")}</label>
            <input required type="text" className="w-full bg-brand-surface border border-brand-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder={t("checkout.namePlaceholder")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text">{t("checkout.phone")}</label>
            <input required type="tel" className="w-full bg-brand-surface border border-brand-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder={t("checkout.phonePlaceholder")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-brand-text">{t("checkout.address")}</label>
            <textarea required rows={3} className="w-full bg-brand-surface border border-brand-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder={t("checkout.addressPlaceholder")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-brand-text">{t("checkout.city")}</label>
            <input required type="text" className="w-full bg-brand-surface border border-brand-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder={t("checkout.cityPlaceholder")} />
          </div>
        </div>
      </div>

      {/* Delivery Method */}
      <div className="bg-white rounded-2xl p-6 border border-brand-outline">
        <h3 className="font-bold text-lg text-brand-text mb-4">{t("checkout.deliveryMethod")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className={`cursor-pointer rounded-xl border-2 p-4 flex items-start gap-3 transition-colors ${deliveryMethod === 'inside' ? 'border-brand-primary bg-brand-primary-light/30' : 'border-brand-outline hover:border-brand-primary/50'}`}>
            <input type="radio" name="delivery" value="inside" checked={deliveryMethod === 'inside'} onChange={(e) => setDeliveryMethod(e.target.value)} className="mt-1" />
            <div>
              <div className="font-semibold text-brand-text">{t("checkout.insideDhaka")}</div>
              <div className="text-sm text-brand-text-muted">
                {language === "bn" ? "১-২ দিনে ডেলিভারি" : "Delivery in 1-2 days"} ({formatPrice(siteConfig.deliveryInsideDhaka)})
              </div>
            </div>
          </label>
          <label className={`cursor-pointer rounded-xl border-2 p-4 flex items-start gap-3 transition-colors ${deliveryMethod === 'outside' ? 'border-brand-primary bg-brand-primary-light/30' : 'border-brand-outline hover:border-brand-primary/50'}`}>
            <input type="radio" name="delivery" value="outside" checked={deliveryMethod === 'outside'} onChange={(e) => setDeliveryMethod(e.target.value)} className="mt-1" />
            <div>
              <div className="font-semibold text-brand-text">{t("checkout.outsideDhaka")}</div>
              <div className="text-sm text-brand-text-muted">
                {language === "bn" ? "৩-৫ দিনে ডেলিভারি" : "Delivery in 3-5 days"} ({formatPrice(siteConfig.deliveryOutsideDhaka)})
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-2xl p-6 border border-brand-outline">
        <h3 className="font-bold text-lg text-brand-text mb-4">{t("checkout.paymentMethod")}</h3>
        <div className="space-y-3">
          <label className={`cursor-pointer rounded-xl border-2 p-4 flex items-center justify-between transition-colors ${paymentMethod === 'cod' ? 'border-brand-primary bg-brand-primary-light/30' : 'border-brand-outline hover:border-brand-primary/50'}`}>
            <div className="flex items-center gap-3">
              <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span className="font-semibold text-brand-text">{t("checkout.cod")}</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-brand-surface rounded text-brand-text-muted">{t("checkout.payAtDoorstep")}</span>
          </label>
          <label className={`cursor-pointer rounded-xl border-2 p-4 flex items-center justify-between transition-colors ${paymentMethod === 'bkash' ? 'border-brand-primary bg-brand-primary-light/30' : 'border-brand-outline hover:border-brand-primary/50'}`}>
            <div className="flex items-center gap-3">
              <input type="radio" name="payment" value="bkash" checked={paymentMethod === 'bkash'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span className="font-semibold text-brand-text">{t("checkout.bkash")}</span>
            </div>
          </label>
          <label className={`cursor-pointer rounded-xl border-2 p-4 flex items-center justify-between transition-colors ${paymentMethod === 'nagad' ? 'border-brand-primary bg-brand-primary-light/30' : 'border-brand-outline hover:border-brand-primary/50'}`}>
            <div className="flex items-center gap-3">
              <input type="radio" name="payment" value="nagad" checked={paymentMethod === 'nagad'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span className="font-semibold text-brand-text">{t("checkout.nagad")}</span>
            </div>
          </label>
        </div>
      </div>

      <div className="pt-4 flex items-center gap-2 justify-center text-sm text-brand-text-muted">
        <Lock className="w-4 h-4" />
        <span>{t("checkout.secure")}</span>
      </div>

      <button type="submit" className="w-full h-14 rounded-xl bg-brand-primary text-white font-semibold text-lg hover:bg-brand-primary/90 transition-colors shadow-md">
        {t("checkout.confirm")}
      </button>
    </form>
  );
}
