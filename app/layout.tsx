import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/layout/AppChrome";
import ToastProvider from "@/components/shared/ToastProvider";
import LanguageProvider from "@/lib/i18n/language-context";
import { getSiteUrl, siteConfig } from "@/lib/site-config";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteConfig.defaultSeoTitle,
    template: `%s | ${siteConfig.businessName}`,
  },
  description: siteConfig.defaultSeoDescription,
  applicationName: siteConfig.businessName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.defaultSeoTitle,
    description: siteConfig.defaultSeoDescription,
    siteName: siteConfig.businessName,
    type: "website",
    locale: "en_BD",
    url: "/",
    images: [
      {
        url: siteConfig.heroImage,
        width: 1200,
        height: 900,
        alt: siteConfig.businessName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultSeoTitle,
    description: siteConfig.defaultSeoDescription,
    images: [siteConfig.heroImage],
  },
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
            <AppChrome>{children}</AppChrome>
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
