"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { type Language, type TranslationKey, getTranslation } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  // Load saved language from localStorage on mount
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const saved = localStorage.getItem("tinytots-lang") as Language | null;
      if (saved === "bn" || saved === "en") {
        setLanguageState(saved);
      }
      setMounted(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("tinytots-lang", lang);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "bn" ? "bn" : "en";
  }, [language]);

  const t = useCallback(
    (key: TranslationKey) => getTranslation(key, language),
    [language]
  );

  // Prevent hydration mismatch by rendering children only after mount
  // But we still render immediately with "en" defaults to avoid flash
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: "en", setLanguage, t: (key) => getTranslation(key, "en") }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
