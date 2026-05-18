"use client";

import { useLanguage } from "@/lib/i18n/language-context";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-brand-surface border border-brand-outline rounded-full p-0.5 text-xs font-semibold">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
          language === "en"
            ? "bg-brand-primary text-white"
            : "text-brand-text-muted hover:text-brand-text"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("bn")}
        className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
          language === "bn"
            ? "bg-brand-primary text-white"
            : "text-brand-text-muted hover:text-brand-text"
        }`}
        aria-label="বাংলায় পরিবর্তন করুন"
      >
        বাংলা
      </button>
    </div>
  );
}
