import { connection } from "next/server";
import type { Metadata } from "next";
import ShopClient from "@/components/shop/ShopClient";
import { getPublicProducts } from "@/lib/products-db";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Shop Baby Products",
  description: siteConfig.defaultSeoDescription,
  alternates: {
    canonical: "/shop",
  },
};

export default async function ShopPage() {
  await connection();
  const products = await getPublicProducts();
  return <ShopClient products={products} />;
}
