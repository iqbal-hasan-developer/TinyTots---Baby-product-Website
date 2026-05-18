"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { type CartItem as CartItemType, useCartStore } from "@/lib/cart-context";
import { getProductById } from "@/lib/products";
import { useLanguage } from "@/lib/i18n/language-context";
import { formatPrice } from "@/lib/site-config";
import { MotionDiv } from "@/components/shared/Motion";
import { fadeUp, tapScale } from "@/lib/animations";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { language, t } = useLanguage();
  const product = getProductById(item.id);
  const displayName = language === "bn"
    ? product?.nameBn ?? item.nameBn ?? item.name
    : product?.name ?? item.name;
  const cartImage = product?.image ?? product?.images?.[0] ?? item.image ?? "";
  const hasCartImage = Boolean(cartImage) && !cartImage.includes("placeholder");

  return (
    <MotionDiv variants={fadeUp} className="flex gap-4 p-4 bg-white rounded-2xl border border-brand-outline">
      <div className="relative w-24 h-24 bg-brand-surface rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
        {hasCartImage ? (
          <Image
            src={cartImage}
            alt={displayName}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <span className="text-[10px] text-brand-text-muted/50 text-center px-1">IMG</span>
        )}
      </div>

      <div className="flex flex-col flex-grow justify-between">
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-semibold text-brand-text text-sm md:text-base leading-tight">
            {displayName}
          </h3>
          <MotionDiv whileTap={tapScale}>
          <button
            onClick={() => removeItem(item.id)}
            className="text-brand-text-muted hover:text-[#ba1a1a] transition-colors p-1 cursor-pointer"
            aria-label={t("cart.remove")}
          >
            <Trash2 className="w-4 h-4" />
          </button>
          </MotionDiv>
        </div>

        <div className="flex justify-between items-end mt-2">
          <div className="text-brand-text font-bold">
            {formatPrice(item.price)}
          </div>

          <div className="flex items-center bg-brand-surface rounded-full p-1 border border-brand-outline">
            <MotionDiv whileTap={tapScale}>
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-brand-text hover:bg-brand-primary-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
              disabled={item.quantity <= 1}
              aria-label={t("cart.decreaseQuantity")}
            >
              <Minus className="w-3 h-3" />
            </button>
            </MotionDiv>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <MotionDiv whileTap={tapScale}>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-brand-text hover:bg-brand-primary-light transition-colors shadow-sm cursor-pointer"
              aria-label={t("cart.increaseQuantity")}
            >
              <Plus className="w-3 h-3" />
            </button>
            </MotionDiv>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
}
