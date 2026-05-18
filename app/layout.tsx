import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";

import ToastProvider from "@/components/shared/ToastProvider";
import LanguageProvider from "@/lib/i18n/language-context";
import { siteConfig } from "@/lib/site-config";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.defaultSeoTitle,
  description: siteConfig.defaultSeoDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-brand-surface overflow-x-hidden">
        <LanguageProvider>
          <ToastProvider>
            <Header />
            <main className="flex-1 flex flex-col w-full min-w-0 pb-24 md:pb-0">
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
            <FloatingWhatsApp />
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
