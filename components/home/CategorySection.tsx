"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { getCategoryHref, productCategories } from "@/lib/products";
import { useLanguage } from "@/lib/i18n/language-context";
import { Baby, Shirt, Milk, Sparkles, Heart, Gamepad2, Package } from "lucide-react";
import { MotionDiv, MotionSection } from "@/components/shared/Motion";
import { cardHover, fadeUp, staggerContainer } from "@/lib/animations";

const iconClassName = "md:w-16 md:h-16 w-12 h-12 text-brand-primary";

function CategoryIcon({ icon }: { icon: string }) {
  if (icon === "baby") return <Baby className={iconClassName} />;
  if (icon === "sparkles") return <Sparkles className={iconClassName} />;
  if (icon === "milk") return <Milk className={iconClassName} />;
  if (icon === "shirt") return <Shirt className={iconClassName} />;
  if (icon === "gamepad") return <Gamepad2 className={iconClassName} />;
  if (icon === "heart") return <Heart className={iconClassName} />;
  return <Package className={iconClassName} />;
}

export default function CategorySection() {
  const { t } = useLanguage();
  const homepageCategories = productCategories.filter((category) => category.showOnHomepage);

  return (
    <MotionSection className="py-12 md:py-16 bg-white border-y border-brand-outline">
      <div className="container-max mx-auto px-4 md:px-6">
        <MotionDiv className="flex items-center justify-between mb-8" variants={fadeUp}>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-text">{t("section.shopByCategory")}</h2>
        </MotionDiv>
        
        <MotionDiv className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8" variants={staggerContainer}>
          {homepageCategories.map((category) => (
            <MotionDiv key={category.id} variants={fadeUp} whileHover={cardHover}>
            <Link
              href={getCategoryHref(category.id)}
              className="flex flex-col items-center gap-3 group"
            >
              <div className={cn(
                "w-full aspect-square rounded-full flex items-center justify-center transition-transform group-hover:scale-105 border border-transparent group-hover:border-brand-outline shadow-sm",
                category.colorClass
              )}>
                <CategoryIcon icon={category.icon} />
              </div>
              <span className="text-sm font-medium text-brand-text text-center group-hover:text-brand-primary transition-colors">
                {t(category.labelKey)}
              </span>
            </Link>
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>
    </MotionSection>
  );
}
