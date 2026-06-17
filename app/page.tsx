import { connection } from "next/server";
import HomeContent from "@/components/home/HomeContent";
import { getFeaturedPublicProducts, getPublicProductsByCategoryIds } from "@/lib/products-db";
import { getSiteUrl, siteConfig } from "@/lib/site-config";

export default async function Home() {
  await connection();
  const [popularProducts, newbornEssentials] = await Promise.all([
    getFeaturedPublicProducts(siteConfig.homepage.popularProductLimit),
    getPublicProductsByCategoryIds(
    siteConfig.homepage.newbornCategoryIds,
    siteConfig.homepage.newbornProductLimit
    ),
  ]);
  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: siteConfig.businessName,
    description: siteConfig.defaultSeoDescription,
    url: getSiteUrl(),
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: siteConfig.address,
    sameAs: [siteConfig.facebookUrl, siteConfig.instagramUrl],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />
      <HomeContent
        popularProducts={popularProducts}
        newbornEssentials={newbornEssentials}
      />
    </>
  );
}
