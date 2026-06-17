"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import ProductCard from "@/components/products/ProductCard";
import { useLanguage } from "@/lib/i18n/language-context";
import type { Product } from "@/lib/products";
import { MotionDiv, MotionSection } from "@/components/shared/Motion";
import { fadeUp, staggerContainer, tapScale } from "@/lib/animations";

interface HomeContentProps {
  popularProducts: Product[];
  newbornEssentials: Product[];
}

export default function HomeContent({
  popularProducts,
  newbornEssentials,
}: HomeContentProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <CategorySection />

      <MotionSection className="py-16 md:py-24 bg-brand-surface">
        <div className="container-max mx-auto px-4 md:px-6">
          <MotionDiv className="flex items-center justify-between mb-8" variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-text">{t("section.popularEssentials")}</h2>
            <MotionDiv whileTap={tapScale}>
              <Link href="/shop" className="text-brand-primary font-medium flex items-center gap-1 hover:underline">
                {t("section.viewAll")} <ArrowRight className="w-4 h-4" />
              </Link>
            </MotionDiv>
          </MotionDiv>

          <MotionDiv className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" variants={staggerContainer}>
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </MotionDiv>
        </div>
      </MotionSection>

      <MotionSection className="py-16 md:py-24 bg-white border-t border-brand-outline">
        <div className="container-max mx-auto px-4 md:px-6">
          <MotionDiv className="flex items-center justify-between mb-8" variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-text">{t("section.curatedNewborns")}</h2>
            <MotionDiv whileTap={tapScale}>
              <Link href="/shop" className="text-brand-primary font-medium flex items-center gap-1 hover:underline">
                {t("section.shopNewborn")} <ArrowRight className="w-4 h-4" />
              </Link>
            </MotionDiv>
          </MotionDiv>

          <MotionDiv className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" variants={staggerContainer}>
            {newbornEssentials.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </MotionDiv>
        </div>
      </MotionSection>
    </div>
  );
}
