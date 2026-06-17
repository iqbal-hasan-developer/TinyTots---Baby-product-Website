import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import { getPublicProductBySlug, getRelatedPublicProducts } from "@/lib/products-db";
import { getProductImage, getProductSeoMetadata } from "@/lib/products";
import { getSiteUrl, siteConfig } from "@/lib/site-config";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function toAbsoluteImageUrl(image: string): string {
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${getSiteUrl()}${image.startsWith("/") ? image : `/${image}`}`;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found | TinyTots BD",
    };
  }

  const seo = getProductSeoMetadata(product);
  const productImage = getProductImage(product);
  const productUrl = `/products/${product.slug}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      url: productUrl,
      images: productImage
        ? [
            {
              url: productImage,
              alt: product.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: productImage ? [productImage] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedPublicProducts(product);
  const productImage = getProductImage(product);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    sku: product.sku,
    image: productImage ? [toAbsoluteImageUrl(productImage)] : undefined,
    brand: {
      "@type": "Brand",
      name: siteConfig.businessName,
    },
    offers: {
      "@type": "Offer",
      url: `${getSiteUrl()}/products/${product.slug}`,
      priceCurrency: "BDT",
      price: product.price,
      availability: product.stockStatus === "out-of-stock"
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
