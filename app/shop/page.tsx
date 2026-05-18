"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import SortDropdown, { type SortOption } from "@/components/shared/SortDropdown";
import { products } from "@/lib/products";
import { Search } from "lucide-react";
import { useState, useEffect, Suspense, useMemo } from "react";
import { categoryDisplayNames } from "@/lib/i18n/translations";
import { useLanguage } from "@/lib/i18n/language-context";
import { MotionDiv } from "@/components/shared/Motion";
import { fadeUp, staggerContainer, tapScale } from "@/lib/animations";

const categories = ["All", "Diapers", "Skincare", "Feeding", "Clothing", "Toys", "Mother Care", "Bundle"];
const pageSize = 8;

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category") || "All";
  const qParam = searchParams.get("q") || "";
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(qParam);
  const [sortBy, setSortBy] = useState("recommended");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const { language, t } = useLanguage();

  // Sync category filter when URL search params change (e.g. clicking header nav links)
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setActiveCategory(categoryParam);
      setSearchQuery(qParam);
      setVisibleCount(pageSize);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [categoryParam, qParam]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const searchableText = [
        product.name,
        product.nameBn,
        product.category,
        product.shortDescription,
        product.shortDescriptionBn,
        product.description,
        product.descriptionBn,
      ].join(" ").toLowerCase();
      const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const sortedProducts = useMemo(() => {
    const nextProducts = [...filteredProducts];
    if (sortBy === "price-low") {
      return nextProducts.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-high") {
      return nextProducts.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "rating") {
      return nextProducts.sort((a, b) => b.rating - a.rating);
    }
    return nextProducts;
  }, [filteredProducts, sortBy]);

  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const sortOptions: SortOption[] = [
    { value: "recommended", label: t("shop.sortRecommended") },
    { value: "price-low", label: t("shop.sortPriceLow") },
    { value: "price-high", label: t("shop.sortPriceHigh") },
    { value: "rating", label: t("shop.sortRating") },
  ];

  const updateCategory = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(pageSize);
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    const queryString = params.toString();
    router.push(queryString ? `/shop?${queryString}` : "/shop");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVisibleCount(pageSize);
    const params = new URLSearchParams(searchParams.toString());
    const query = searchQuery.trim();
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    const queryString = params.toString();
    router.push(queryString ? `/shop?${queryString}` : "/shop");
  };

  return (
    <div className="flex-1 min-w-0 container-max mx-auto px-4 md:px-6 py-8 md:py-12 w-full">
      <MotionDiv className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8" variants={fadeUp}>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-text">{t("shop.title")}</h1>
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("shop.search")} 
              className="w-full bg-white border border-brand-outline rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <button type="submit" className="p-2.5 bg-white border border-brand-outline rounded-full text-brand-text hover:bg-brand-surface transition-colors flex items-center justify-center flex-shrink-0" aria-label={t("shop.search")}>
            <Search className="w-5 h-5" />
          </button>
        </form>
      </MotionDiv>

      <MotionDiv className="flex overflow-x-auto pb-4 mb-6 md:mb-8 hide-scrollbar gap-2 w-full" variants={staggerContainer}>
        {categories.map((category) => (
          <MotionDiv key={category} variants={fadeUp} whileTap={tapScale}>
          <button
            onClick={() => updateCategory(category)}
            className={`whitespace-nowrap flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-colors border ${
              activeCategory === category 
                ? 'bg-brand-primary text-white border-brand-primary' 
                : 'bg-white text-brand-text border-brand-outline hover:border-brand-primary hover:text-brand-primary'
            }`}
          >
            {categoryDisplayNames[category]?.[language] ?? category}
          </button>
          </MotionDiv>
        ))}
      </MotionDiv>

      {/* Sort Options */}
      <MotionDiv className="mb-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" variants={fadeUp}>
        <div className="min-w-0 text-sm font-medium text-brand-text-muted">
          {t("shop.showing")} {filteredProducts.length} {t("shop.products")}
        </div>
        <SortDropdown
          value={sortBy}
          options={sortOptions}
          onChange={setSortBy}
          label={t("shop.sortLabel")}
        />
      </MotionDiv>

      <MotionDiv className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" variants={staggerContainer}>
        {visibleProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </MotionDiv>

      {visibleCount < sortedProducts.length && (
        <MotionDiv className="mt-12 flex justify-center" variants={fadeUp}>
          <MotionDiv whileTap={tapScale}>
          <button
            onClick={() => setVisibleCount((count) => count + pageSize)}
            className="h-12 px-8 rounded-full border-2 border-brand-primary text-brand-primary font-semibold hover:bg-brand-primary-light transition-colors cursor-pointer"
          >
            {t("shop.loadMore")}
          </button>
          </MotionDiv>
        </MotionDiv>
      )}

      {sortedProducts.length === 0 && (
        <MotionDiv className="text-center py-20" variants={fadeUp}>
          <p className="text-brand-text-muted text-lg">{t("shop.noProducts")}</p>
        </MotionDiv>
      )}
    </div>
  );
}

export default function ShopPage() {
  const { t } = useLanguage();

  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center py-20">{t("shop.loading")}</div>}>
      <ShopContent />
    </Suspense>
  );
}
