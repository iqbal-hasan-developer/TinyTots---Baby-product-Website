"use client";

import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { getWhatsAppUrl, siteConfig } from "@/lib/site-config";
import { MotionDiv } from "@/components/shared/Motion";
import { cardHover, fadeUp, staggerContainer, tapScale } from "@/lib/animations";

export default function ContactPage() {
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t("contact.messageSent"));
  };
  const phoneHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`;

  return (
    <div className="flex-1 container-max mx-auto px-4 md:px-6 py-12 md:py-16">
      <MotionDiv className="text-center max-w-2xl mx-auto mb-16" variants={fadeUp}>
        <h1 className="text-3xl md:text-5xl font-bold text-brand-text mb-4">{t("contact.title")}</h1>
        <p className="text-brand-text-muted text-lg">
          {t("contact.subtitle")}
        </p>
      </MotionDiv>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
        {/* Contact Info Cards */}
        <MotionDiv className="lg:col-span-1 space-y-6" variants={staggerContainer}>
          <MotionDiv variants={fadeUp} whileHover={cardHover} className="bg-brand-primary-light/30 rounded-2xl p-6 border border-brand-outline flex items-start gap-4">
            <div className="p-3 bg-white rounded-full text-brand-primary shrink-0 shadow-sm">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-brand-text text-lg mb-1">{t("contact.whatsappUs")}</h3>
              <p className="text-brand-text-muted text-sm mb-3">{t("contact.fastSupport")}</p>
              <a href={getWhatsAppUrl(`Hi ${siteConfig.businessName}, I need help with baby products.`)} target="_blank" rel="noopener noreferrer" className="text-brand-primary font-bold hover:underline">
                {siteConfig.phone}
              </a>
            </div>
          </MotionDiv>

          <MotionDiv variants={fadeUp} whileHover={cardHover} className="bg-white rounded-2xl p-6 border border-brand-outline flex items-start gap-4 shadow-sm">
            <div className="p-3 bg-brand-surface rounded-full text-brand-text shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-brand-text text-lg mb-1">{t("contact.callUs")}</h3>
              <p className="text-brand-text-muted text-sm mb-3">{t("contact.hours")}</p>
              <a href={phoneHref} className="text-brand-text font-bold hover:text-brand-primary transition-colors">
                {siteConfig.phone}
              </a>
            </div>
          </MotionDiv>

          <MotionDiv variants={fadeUp} whileHover={cardHover} className="bg-white rounded-2xl p-6 border border-brand-outline flex items-start gap-4 shadow-sm">
            <div className="p-3 bg-brand-surface rounded-full text-brand-text shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-brand-text text-lg mb-1">{t("contact.emailUs")}</h3>
              <p className="text-brand-text-muted text-sm mb-3">{t("contact.generalInquiries")}</p>
              <a href={`mailto:${siteConfig.email}`} className="text-brand-text font-bold hover:text-brand-primary transition-colors">
                {siteConfig.email}
              </a>
            </div>
          </MotionDiv>

          <MotionDiv variants={fadeUp} whileHover={cardHover} className="bg-white rounded-2xl p-6 border border-brand-outline flex items-start gap-4 shadow-sm">
            <div className="p-3 bg-brand-surface rounded-full text-brand-text shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-brand-text text-lg mb-1">{t("contact.storeAddress")}</h3>
              <p className="text-brand-text-muted text-sm leading-relaxed">{siteConfig.address}</p>
            </div>
          </MotionDiv>
        </MotionDiv>

        {/* Contact Form */}
        <MotionDiv variants={fadeUp} className="lg:col-span-2 bg-white rounded-[2rem] p-8 md:p-10 border border-brand-outline shadow-sm">
          <h2 className="text-2xl font-bold text-brand-text mb-6">{t("contact.sendMessage")}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-text">{t("contact.fullName")}</label>
                <input required type="text" className="w-full bg-brand-surface border border-brand-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder={t("contact.namePlaceholder")} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-text">{t("contact.emailAddress")}</label>
                <input required type="email" className="w-full bg-brand-surface border border-brand-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder={t("contact.emailPlaceholder")} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-text">{t("contact.subject")}</label>
              <input required type="text" className="w-full bg-brand-surface border border-brand-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder={t("contact.subjectPlaceholder")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-text">{t("contact.message")}</label>
              <textarea required rows={5} className="w-full bg-brand-surface border border-brand-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder={t("contact.messagePlaceholder")}></textarea>
            </div>
            <MotionDiv whileTap={tapScale} className="w-full md:w-auto">
            <button type="submit" className="h-14 px-8 rounded-xl bg-brand-text text-white font-semibold text-lg hover:bg-brand-text/90 transition-colors w-full md:w-auto cursor-pointer">
              {t("contact.send")}
            </button>
            </MotionDiv>
          </form>
        </MotionDiv>
      </div>
    </div>
  );
}
