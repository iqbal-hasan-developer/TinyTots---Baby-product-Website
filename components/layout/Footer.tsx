"use client";

import Link from "next/link";
import { ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { getWhatsAppUrl, siteConfig } from "@/lib/site-config";

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-brand-surface pt-12 pb-24 md:pb-12 border-t border-brand-outline">
      <div className="container-max mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Trust badges */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-primary-light/50">
            <div className="p-3 bg-white rounded-full text-brand-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-brand-text">{t("footer.genuine")}</h4>
              <p className="text-xs text-brand-text-muted">{t("footer.safeForBaby")}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#f4e2a9]/50">
            <div className="p-3 bg-white rounded-full text-[#6b5e31]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-brand-text">{t("footer.fastDelivery")}</h4>
              <p className="text-xs text-brand-text-muted">{t("footer.fastDeliveryDesc")}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#ffeee8]/50">
            <div className="p-3 bg-white rounded-full text-[#685c57]">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-brand-text">{t("footer.easyReturns")}</h4>
              <p className="text-xs text-brand-text-muted">{t("footer.easyReturnsDesc")}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-center items-center md:items-start md:text-start">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-bold text-2xl text-brand-primary tracking-tight mb-4 inline-block">
              {siteConfig.businessName}
            </Link>
            <p className="text-brand-text-muted text-sm max-w-sm mb-6">
              {language === "bn" ? t("footer.tagline") : siteConfig.tagline}
            </p>
            <div className="space-y-1 text-sm text-brand-text-muted mb-6">
              <p>{siteConfig.phone}</p>
              <p>{siteConfig.email}</p>
              <p>{siteConfig.address}</p>
            </div>
            <div className="flex gap-4 items-center justify-center md:justify-start">
              <a href={siteConfig.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-brand-outline rounded-full text-brand-text hover:bg-brand-primary hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-brand-outline rounded-full text-brand-text hover:bg-brand-primary hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href={getWhatsAppUrl(`Hi ${siteConfig.businessName}, I want to know more about your baby products.`)} target="_blank" rel="noopener noreferrer" className="p-2 bg-brand-outline rounded-full text-brand-text hover:bg-brand-primary hover:text-white transition-colors" aria-label="WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-brand-text mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2 text-sm text-brand-text-muted">
              <li><Link href="/shop" className="hover:text-brand-primary transition-colors">{t("nav.shopAll")}</Link></li>
              <li><Link href="/shop?category=Diapers" className="hover:text-brand-primary transition-colors">{t("nav.diapers")}</Link></li>
              <li><Link href="/blog" className="hover:text-brand-primary transition-colors">{t("footer.parentingBlog")}</Link></li>
              <li><Link href="/contact" className="hover:text-brand-primary transition-colors">{t("footer.contactUs")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-text mb-4">{t("footer.customerCare")}</h4>
            <ul className="space-y-2 text-sm text-brand-text-muted">
              <li><a href="#" className="hover:text-brand-primary transition-colors">{t("footer.trackOrder")}</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">{t("footer.shippingPolicy")}</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">{t("footer.returnPolicy")}</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">{t("footer.faqs")}</a></li>
            </ul>
          </div>
        </div>

        <div className="text-center text-xs text-brand-text-muted border-t border-brand-outline pt-6">
          &copy; {new Date().getFullYear()} {siteConfig.businessName}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
