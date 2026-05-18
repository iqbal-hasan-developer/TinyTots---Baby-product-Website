import { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `My Account | ${siteConfig.businessName}`,
  description: `Sign in to manage your ${siteConfig.businessName} orders, preferences, and delivery details.`,
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
