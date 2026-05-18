"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { categoryDisplayNames } from "@/lib/i18n/translations";
import { useLanguage } from "@/lib/i18n/language-context";
import { Baby, Shirt, Milk, Sparkles, Heart, Gamepad2 } from "lucide-react";
import { MotionDiv, MotionSection } from "@/components/shared/Motion";
import { cardHover, fadeUp, staggerContainer } from "@/lib/animations";

const categories = [
  { name: "Diapers", href: "/shop?category=Diapers", color: "bg-brand-primary-light" },
  { name: "Skincare", href: "/shop?category=Skincare", color: "bg-[#ffeee8]" },
  { name: "Feeding", href: "/shop?category=Feeding", color: "bg-[#f4e2a9]" },
  { name: "Clothing", href: "/shop?category=Clothing", color: "bg-[#e8f0fe]" },
  { name: "Toys", href: "/shop?category=Toys", color: "bg-[#fce8e8]" },
  { name: "Mother Care", href: "/shop?category=Mother+Care", color: "bg-[#f3e8fc]" },
];

export default function CategorySection() {
  const { language, t } = useLanguage();

  return (
    <MotionSection className="py-12 md:py-16 bg-white border-y border-brand-outline">
      <div className="container-max mx-auto px-4 md:px-6">
        <MotionDiv className="flex items-center justify-between mb-8" variants={fadeUp}>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-text">{t("section.shopByCategory")}</h2>
        </MotionDiv>
        
        <MotionDiv className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8" variants={staggerContainer}>
          {categories.map((category) => (
            <MotionDiv key={category.name} variants={fadeUp} whileHover={cardHover}>
            <Link
              href={category.href}
              className="flex flex-col items-center gap-3 group"
            >
              <div className={cn(
                "w-full aspect-square rounded-full flex items-center justify-center transition-transform group-hover:scale-105 border border-transparent group-hover:border-brand-outline shadow-sm",
                category.color
              )}>
                {/* Category Icon Placeholder */}
                  {category.name === "Diapers" && <Baby className="md:w-16 md:h-16 w-12 h-12 text-brand-primary" />}
                  {category.name === "Skincare" && <Sparkles className="md:w-16 md:h-16 w-12 h-12 text-brand-primary" />}
                  {category.name === "Feeding" && <Milk className="md:w-16 md:h-16 w-12 h-12 text-brand-primary" />}
                  {category.name === "Clothing" && <Shirt className="md:w-16 md:h-16 w-12 h-12 text-brand-primary" />}
                  {category.name === "Toys" && <Gamepad2 className="md:w-16 md:h-16 w-12 h-12 text-brand-primary" />}
                  {category.name === "Mother Care" && <Heart className="md:w-16 md:h-16 w-12 h-12 text-brand-primary" />}
              </div>
              <span className="text-sm font-medium text-brand-text text-center group-hover:text-brand-primary transition-colors">
                {categoryDisplayNames[category.name]?.[language] ?? category.name}
              </span>
            </Link>
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>
    </MotionSection>
  );
}
