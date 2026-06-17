"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import SortDropdown, { type SortOption } from "@/components/shared/SortDropdown";
import {
  allProductsCategory,
  getCategoryById,
  getCategoryFromParam,
  getProductSearchText,
  productCategoryFilters,
  type Product,
  type ProductCategoryFilterId,
} from "@/lib/products";
import { useLanguage } from "@/lib/i18n/language-context";
import { MotionDiv } from "@/components/shared/Motion";
import { fadeUp, staggerContainer, tapScale } from "@/lib/animations";

const pageSize = 8;

interface ShopClientProps {
  products: Product[];
}

function ShopContent({ products }: ShopClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");
  const qParam = searchParams.get("q") || "";
  const [activeCategory, setActiveCategory] = useState<ProductCategoryFilterId>(() => getCategoryFromParam(categoryParam));
  const [searchQuery, setSearchQuery] = useState(qParam);
  const [sortBy, setSortBy] = useState("recommended");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const { t } = useLanguage();

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setActiveCategory(getCategoryFromParam(categoryParam));
      setSearchQuery(qParam);
      setVisibleCount(pageSize);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [categoryParam, qParam]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === allProductsCategory.id || product.category === activeCategory;
      const searchableText = getProductSearchText(product);
      const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, products, searchQuery]);

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

  const updateCategory = (category: ProductCategoryFilterId) => {
    setActiveCategory(category);
    setVisibleCount(pageSize);
    const params = new URLSearchParams(searchParams.toString());
    if (category === allProductsCategory.id) {
      params.delete("category");
    } else {
      params.set("category", getCategoryById(category)?.slug ?? category);
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
        {productCategoryFilters.map((category) => (
          <MotionDiv key={category.id} variants={fadeUp} whileTap={tapScale}>
            <button
              onClick={() => updateCategory(category.id)}
              className={`whitespace-nowrap flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-colors border ${
                activeCategory === category.id
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-white text-brand-text border-brand-outline hover:border-brand-primary hover:text-brand-primary"
              }`}
            >
              {t(category.labelKey)}
            </button>
          </MotionDiv>
        ))}
      </MotionDiv>

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
        {visibleProducts.map((product) => (
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

export default function ShopClient({ products }: ShopClientProps) {
  const { t } = useLanguage();

  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center py-20">{t("shop.loading")}</div>}>
      <ShopContent products={products} />
    </Suspense>
  );
}
