"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export default function QuantitySelector({ quantity, setQuantity }: QuantitySelectorProps) {
  return (
    <div className="flex items-center bg-brand-surface rounded-full p-1 border border-brand-outline w-fit">
      <button
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-brand-text hover:bg-brand-primary-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4 cursor-pointer" />
      </button>
      <span className="w-12 text-center text-base font-semibold">{quantity}</span>
      <button
        onClick={() => setQuantity(quantity + 1)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-brand-text hover:bg-brand-primary-light transition-colors shadow-sm"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4 cursor-pointer" />
      </button>
    </div>
  );
}