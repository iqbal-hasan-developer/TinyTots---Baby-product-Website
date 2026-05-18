"use client";

import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { getWhatsAppUrl, siteConfig } from "@/lib/site-config";

export default function FloatingWhatsApp() {
  const { t } = useLanguage();
  const defaultMessage = `${t("misc.whatsappMessage")} - ${siteConfig.businessName}`;
  const whatsappUrl = getWhatsAppUrl(defaultMessage);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 p-4 bg-[#25D366] text-white rounded-full shadow-[0_8px_20px_rgba(37,211,102,0.3)] hover:scale-110 transition-transform flex items-center justify-center"
      aria-label={t("misc.whatsappChat")}
    >
      <MessageCircle className="w-8 h-8 fill-white" />
    </a>
  );
}
