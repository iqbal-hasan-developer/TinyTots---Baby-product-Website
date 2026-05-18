"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-context";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/language-context";
import LanguageToggle from "@/components/shared/LanguageToggle";
import logo from "@/public/Logo.png";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export default function Header() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  // Close menu and search on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Close menu on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <header className="sticky top-0 z-60 bg-brand-primary-light border-b border-brand-outline">
      <div className="container-max mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center md:gap-4">
          <button 
            className="md:hidden text-brand-text p-2 -ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? t("misc.closeMenu") : t("misc.openMenu")}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="w-28 h-14 flex items-center justify-center">
          <Link 
            href="/"
            className="flex min-w-0 items-center"
          >
            <div className="flex w-24 h-24 lg:w-28 lg:h-28 items-center justify-center">
              <img src={logo.src} alt="Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-medium text-brand-text">
          <Link href="/" className="hover:text-brand-primary transition-colors">{t("nav.home")}</Link>
          <Link href="/shop" className="hover:text-brand-primary transition-colors">{t("nav.shop")}</Link>
          <Link href="/shop?category=Diapers" className="hover:text-brand-primary transition-colors">{t("nav.diapers")}</Link>
          <Link href="/shop?category=Skincare" className="hover:text-brand-primary transition-colors">{t("nav.skincare")}</Link>
          <Link href="/shop?category=Feeding" className="hover:text-brand-primary transition-colors">{t("nav.feeding")}</Link>
          <Link href="/blog" className="hover:text-brand-primary transition-colors">{t("nav.blog")}</Link>
          <Link href="/contact" className="hover:text-brand-primary transition-colors">{t("nav.contact")}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LanguageToggle />
          </div>
          <button 
            className="hidden md:flex text-brand-text hover:text-brand-primary transition-colors p-2 cursor-pointer"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (!isSearchOpen) {
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }
            }}
            aria-label={isSearchOpen ? t("misc.closeSearch") : t("misc.openSearch")}
          >
            {isSearchOpen ? <X className="w-6 h-6" /> : <Search className="w-6 h-6" />}
          </button>
          <Link href="/cart" className="relative text-brand-text hover:text-brand-primary transition-colors p-2">
            <ShoppingBag className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#ffecb3] text-brand-text text-[10px] font-bold flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
          <Link href="/account" className="hidden md:flex text-brand-text hover:text-brand-primary transition-colors p-2">
            <User className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Desktop Search Bar */}
      {isSearchOpen && (
        <div className="hidden md:block border-t border-brand-outline bg-white">
          <div className="container-max mx-auto px-4 md:px-6 py-3">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const query = searchQuery.trim();
                if (query) {
                  router.push(`/shop?q=${encodeURIComponent(query)}`);
                  setIsSearchOpen(false);
                }
              }}
              className="relative max-w-2xl mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full h-12 bg-brand-surface border border-brand-outline rounded-full pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-shadow"
              />
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
      {isMenuOpen && (
        <>
          <motion.div
            className="md:hidden fixed inset-0 top-16 bg-brand-text/20 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
          <motion.div
            className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-brand-outline shadow-lg z-50 flex flex-col p-4 max-h-[calc(100vh-4rem)] overflow-y-auto"
            initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <div className="flex justify-center mb-4">
              <LanguageToggle />
            </div>
            <nav className="flex flex-col space-y-3 font-medium text-brand-text">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 bg-brand-surface rounded-xl hover:bg-brand-primary-light hover:text-brand-primary transition-colors">{t("nav.home")}</Link>
              <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 bg-brand-surface rounded-xl hover:bg-brand-primary-light hover:text-brand-primary transition-colors">{t("nav.shopAll")}</Link>
              <Link href="/shop?category=Diapers" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 bg-brand-surface rounded-xl hover:bg-brand-primary-light hover:text-brand-primary transition-colors">{t("nav.diapers")}</Link>
              <Link href="/shop?category=Skincare" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 bg-brand-surface rounded-xl hover:bg-brand-primary-light hover:text-brand-primary transition-colors">{t("nav.skincare")}</Link>
              <Link href="/shop?category=Feeding" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 bg-brand-surface rounded-xl hover:bg-brand-primary-light hover:text-brand-primary transition-colors">{t("nav.feeding")}</Link>
              <Link href="/shop?category=Bundle" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 bg-[#ffeee8]/50 rounded-xl hover:bg-[#ffeee8] text-[#ba1a1a] transition-colors">{t("nav.offers")}</Link>
              <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 bg-brand-surface rounded-xl hover:bg-brand-primary-light hover:text-brand-primary transition-colors">{t("nav.blog")}</Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 bg-brand-surface rounded-xl hover:bg-brand-primary-light hover:text-brand-primary transition-colors">{t("nav.contact")}</Link>
            </nav>
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </header>
  );
}
