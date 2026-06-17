import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Parenting Blog",
  description: "Baby care, parenting, feeding, and newborn tips from TinyTots BD.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `Parenting Blog | ${siteConfig.businessName}`,
    description: "Baby care, parenting, feeding, and newborn tips from TinyTots BD.",
    url: "/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
