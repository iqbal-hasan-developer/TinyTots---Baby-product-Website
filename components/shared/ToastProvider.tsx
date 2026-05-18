"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

interface Toast {
  id: number;
  productName: string;
}

interface ToastContextType {
  showCartToast: (productName: string) => void;
}

const ToastContext = createContext<ToastContextType>({ showCartToast: () => {} });

export function useCartToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const showCartToast = useCallback((productName: string) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev.slice(-2), { id, productName }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showCartToast }}>
      {children}
      <ToastUI toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastUI({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="fixed z-[200] bottom-28 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-96 flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      role="status"
    >
      <AnimatePresence initial={false}>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          className="pointer-events-auto bg-white border border-brand-outline rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-4 flex items-start gap-3"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <div className="p-2 bg-brand-primary-light rounded-full flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-brand-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-brand-text text-sm">{t("toast.addedToCart")}</p>
            <p className="text-brand-text-muted text-xs mt-0.5 line-clamp-1">
              {toast.productName} {t("toast.addedDesc")}
            </p>
            <Link
              href="/cart"
              className="inline-block mt-2 text-xs font-semibold text-brand-primary hover:underline"
            >
              {t("cart.viewCart")} →
            </Link>
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="p-1 text-brand-text-muted hover:text-brand-text transition-colors flex-shrink-0 cursor-pointer"
            aria-label={t("misc.closeNotification")}
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      ))}
      </AnimatePresence>
    </div>
  );
}
