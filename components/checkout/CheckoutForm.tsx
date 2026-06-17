"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-context";
import { CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { type CreatedOrderResult, type CreateOrderResponse, toCheckoutOrderItems } from "@/lib/orders";
import { type DeliveryZone, type PaymentMethod, formatPrice, paymentMethods, siteConfig } from "@/lib/site-config";

interface CheckoutFields {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}

interface CheckoutSuccessOrder extends CreatedOrderResult {
  paymentLabel: string;
}

interface CheckoutFormProps {
  deliveryMethod: DeliveryZone;
  onDeliveryMethodChange: (method: DeliveryZone) => void;
  onSubmitted?: () => void;
}

const initialFields: CheckoutFields = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
};

const enabledPaymentMethods = paymentMethods.filter((method) => method.enabled);

export default function CheckoutForm({
  deliveryMethod,
  onDeliveryMethodChange,
  onSubmitted,
}: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [formValues, setFormValues] = useState<CheckoutFields>(initialFields);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFields | "cart" | "payment" | "form", string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<CheckoutSuccessOrder | null>(null);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const { language, t } = useLanguage();

  const paymentLabels = enabledPaymentMethods.reduce((labels, method) => {
    labels[method.id] = t(method.labelKey);
    return labels;
  }, {} as Record<PaymentMethod, string>);
  const isBn = language === "bn";
  const requiredMessage = (label: string) => isBn ? `${label} প্রয়োজন` : `${label} is required`;
  const phoneError = isBn ? "সঠিক ফোন নম্বর দিন" : "Enter a valid phone number";
  const emailError = "Enter a valid email address";
  const paymentError = requiredMessage(t("checkout.paymentMethod"));
  const emptyCartError = isBn
    ? "চেকআউট করার আগে কার্টে পণ্য যোগ করুন।"
    : "Add at least one product to your cart before checkout.";

  const validate = () => {
    const nextErrors: Partial<Record<keyof CheckoutFields | "cart" | "payment" | "form", string>> = {};

    if (items.length === 0) {
      nextErrors.cart = emptyCartError;
    }

    if (!formValues.name.trim()) {
      nextErrors.name = requiredMessage(t("checkout.fullName"));
    }

    const normalizedPhone = formValues.phone.replace(/[\s()-]/g, "");
    if (!normalizedPhone) {
      nextErrors.phone = requiredMessage(t("checkout.phone"));
    } else if (!/^\+?\d{7,15}$/.test(normalizedPhone)) {
      nextErrors.phone = phoneError;
    }

    if (formValues.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) {
      nextErrors.email = emailError;
    }

    if (!formValues.address.trim()) {
      nextErrors.address = requiredMessage(t("checkout.address"));
    }

    if (!formValues.city.trim()) {
      nextErrors.city = requiredMessage(t("checkout.city"));
    }

    if (!enabledPaymentMethods.some((method) => method.id === paymentMethod)) {
      nextErrors.payment = paymentError;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFieldChange = (field: keyof CheckoutFields, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setErrors((current) => {
      if (!current.payment) return current;
      const nextErrors = { ...current };
      delete nextErrors.payment;
      return nextErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            name: formValues.name,
            phone: formValues.phone,
            email: formValues.email.trim() || undefined,
            address: formValues.address,
            city: formValues.city,
          },
          deliveryZone: deliveryMethod,
          paymentMethod,
          items: toCheckoutOrderItems(items),
        }),
      });

      const result = (await response.json().catch(() => null)) as CreateOrderResponse | null;

      if (!response.ok || !result?.ok) {
        const fieldErrors = result && !result.ok ? result.fieldErrors : undefined;
        setErrors((current) => ({
          ...current,
          name: fieldErrors?.name ?? current.name,
          phone: fieldErrors?.phone ?? current.phone,
          email: fieldErrors?.email ?? current.email,
          address: fieldErrors?.address ?? current.address,
          city: fieldErrors?.city ?? current.city,
          cart: fieldErrors?.cart ?? current.cart,
          payment: fieldErrors?.paymentMethod ?? current.payment,
          form: result && !result.ok ? result.error : "Order could not be saved. Please try again.",
        }));
        return;
      }

      setCreatedOrder({
        ...result.order,
        paymentLabel: paymentLabels[result.order.paymentMethod] ?? result.order.paymentMethod,
      });
      onSubmitted?.();
      setIsSubmitted(true);
      clearCart();
    } catch {
      setErrors((current) => ({
        ...current,
        form: "Order could not be saved. Please check your connection and try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
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
        {createdOrder && (
          <div className="mb-8 w-full max-w-md rounded-xl border border-brand-outline bg-brand-surface p-4 text-left text-sm text-brand-text-muted">
            <div className="flex justify-between gap-4 border-b border-brand-outline pb-3">
              <span>Order Number</span>
              <span className="font-semibold text-brand-text">{createdOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-brand-outline py-3">
              <span>{t("checkout.paymentMethod")}</span>
              <span className="font-semibold text-brand-text">{createdOrder.paymentLabel}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-brand-outline py-3">
              <span>{t("cart.total")}</span>
              <span className="font-semibold text-brand-text">{formatPrice(createdOrder.total)}</span>
            </div>
            <div className="flex justify-between gap-4 pt-3">
              <span>Status</span>
              <span className="font-semibold capitalize text-brand-text">{createdOrder.status}</span>
            </div>
          </div>
        )}
        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          {createdOrder && (
            <Link
              href={`/track-order?order=${encodeURIComponent(createdOrder.orderNumber)}`}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-brand-primary px-6 font-semibold text-white transition-colors hover:bg-brand-primary/90"
            >
              Track this order
            </Link>
          )}
          <Link
            href="/"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-brand-outline bg-white px-6 font-semibold text-brand-text transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            {t("cart.continueShopping")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {errors.form && (
        <div className="rounded-xl border border-[#ba1a1a]/30 bg-[#ffeee8] px-4 py-3 text-sm font-medium text-[#8a1a1a]" role="alert">
          {errors.form}
        </div>
      )}

      {errors.cart && (
        <div className="rounded-xl border border-[#ba1a1a]/30 bg-[#ffeee8] px-4 py-3 text-sm font-medium text-[#8a1a1a]" role="alert">
          {errors.cart}
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-brand-outline">
        <h3 className="font-bold text-lg text-brand-text mb-4">{t("checkout.shipping")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="checkout-name" className="text-sm font-medium text-brand-text">{t("checkout.fullName")}</label>
            <input
              id="checkout-name"
              required
              type="text"
              value={formValues.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "checkout-name-error" : undefined}
              className="w-full bg-brand-surface border border-brand-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder={t("checkout.namePlaceholder")}
            />
            {errors.name && <p id="checkout-name-error" className="text-sm font-medium text-[#ba1a1a]" role="alert">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="checkout-phone" className="text-sm font-medium text-brand-text">{t("checkout.phone")}</label>
            <input
              id="checkout-phone"
              required
              type="tel"
              value={formValues.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "checkout-phone-error" : undefined}
              className="w-full bg-brand-surface border border-brand-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder={t("checkout.phonePlaceholder")}
            />
            {errors.phone && <p id="checkout-phone-error" className="text-sm font-medium text-[#ba1a1a]" role="alert">{errors.phone}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="checkout-email" className="text-sm font-medium text-brand-text">
              Email address <span className="text-brand-text-muted">(optional)</span>
            </label>
            <input
              id="checkout-email"
              type="email"
              value={formValues.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "checkout-email-error" : undefined}
              className="w-full bg-brand-surface border border-brand-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="you@example.com"
            />
            {errors.email && <p id="checkout-email-error" className="text-sm font-medium text-[#ba1a1a]" role="alert">{errors.email}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="checkout-address" className="text-sm font-medium text-brand-text">{t("checkout.address")}</label>
            <textarea
              id="checkout-address"
              required
              rows={3}
              value={formValues.address}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? "checkout-address-error" : undefined}
              className="w-full bg-brand-surface border border-brand-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder={t("checkout.addressPlaceholder")}
            />
            {errors.address && <p id="checkout-address-error" className="text-sm font-medium text-[#ba1a1a]" role="alert">{errors.address}</p>}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="checkout-city" className="text-sm font-medium text-brand-text">{t("checkout.city")}</label>
            <input
              id="checkout-city"
              required
              type="text"
              value={formValues.city}
              onChange={(e) => handleFieldChange("city", e.target.value)}
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? "checkout-city-error" : undefined}
              className="w-full bg-brand-surface border border-brand-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder={t("checkout.cityPlaceholder")}
            />
            {errors.city && <p id="checkout-city-error" className="text-sm font-medium text-[#ba1a1a]" role="alert">{errors.city}</p>}
          </div>
        </div>
      </div>

      <fieldset className="bg-white rounded-2xl p-6 border border-brand-outline">
        <legend className="font-bold text-lg text-brand-text mb-4">{t("checkout.deliveryMethod")}</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label htmlFor="delivery-inside" className={`cursor-pointer rounded-xl border-2 p-4 flex items-start gap-3 transition-colors ${deliveryMethod === "inside" ? "border-brand-primary bg-brand-primary-light/30" : "border-brand-outline hover:border-brand-primary/50"}`}>
            <input
              id="delivery-inside"
              type="radio"
              name="delivery"
              value="inside"
              checked={deliveryMethod === "inside"}
              onChange={() => onDeliveryMethodChange("inside")}
              className="mt-1"
            />
            <span>
              <span className="block font-semibold text-brand-text">{t("checkout.insideDhaka")}</span>
              <span className="block text-sm text-brand-text-muted">
                {language === "bn" ? "১-২ দিনে ডেলিভারি" : "Delivery in 1-2 days"} ({formatPrice(siteConfig.deliveryInsideDhaka)})
              </span>
            </span>
          </label>

          <label htmlFor="delivery-outside" className={`cursor-pointer rounded-xl border-2 p-4 flex items-start gap-3 transition-colors ${deliveryMethod === "outside" ? "border-brand-primary bg-brand-primary-light/30" : "border-brand-outline hover:border-brand-primary/50"}`}>
            <input
              id="delivery-outside"
              type="radio"
              name="delivery"
              value="outside"
              checked={deliveryMethod === "outside"}
              onChange={() => onDeliveryMethodChange("outside")}
              className="mt-1"
            />
            <span>
              <span className="block font-semibold text-brand-text">{t("checkout.outsideDhaka")}</span>
              <span className="block text-sm text-brand-text-muted">
                {language === "bn" ? "৩-৫ দিনে ডেলিভারি" : "Delivery in 3-5 days"} ({formatPrice(siteConfig.deliveryOutsideDhaka)})
              </span>
            </span>
          </label>
        </div>
      </fieldset>

      <fieldset
        className="bg-white rounded-2xl p-6 border border-brand-outline"
        aria-describedby={errors.payment ? "checkout-payment-error" : undefined}
      >
        <legend className="font-bold text-lg text-brand-text mb-4">{t("checkout.paymentMethod")}</legend>
        <div className="space-y-3">
          {enabledPaymentMethods.map((method) => (
            <label
              key={method.id}
              htmlFor={`payment-${method.id}`}
              className={`cursor-pointer rounded-xl border-2 p-4 flex items-center justify-between gap-3 transition-colors ${
                paymentMethod === method.id
                  ? "border-brand-primary bg-brand-primary-light/30"
                  : "border-brand-outline hover:border-brand-primary/50"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  id={`payment-${method.id}`}
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={() => handlePaymentMethodChange(method.id)}
                />
                <span className="font-semibold text-brand-text">{paymentLabels[method.id]}</span>
              </span>
              {method.helperKey && (
                <span className="text-xs font-medium px-2 py-1 bg-brand-surface rounded text-brand-text-muted">
                  {t(method.helperKey)}
                </span>
              )}
            </label>
          ))}
        </div>
        {errors.payment && (
          <p id="checkout-payment-error" className="mt-3 text-sm font-medium text-[#ba1a1a]" role="alert">
            {errors.payment}
          </p>
        )}
      </fieldset>

      <div className="pt-4 flex items-center gap-2 justify-center text-sm text-brand-text-muted">
        <Lock className="w-4 h-4" />
        <span>{t("checkout.secure")}</span>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 rounded-xl bg-brand-primary text-white font-semibold text-lg hover:bg-brand-primary/90 transition-colors shadow-md disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (isBn ? "অর্ডার যাচাই হচ্ছে..." : "Confirming...") : t("checkout.confirm")}
      </button>
    </form>
  );
}
