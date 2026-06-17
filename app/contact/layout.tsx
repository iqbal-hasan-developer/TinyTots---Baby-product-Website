import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${siteConfig.businessName} for baby product support, delivery questions, and store help.`,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: `Contact ${siteConfig.businessName}`,
    description: `Contact ${siteConfig.businessName} for baby product support, delivery questions, and store help.`,
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
