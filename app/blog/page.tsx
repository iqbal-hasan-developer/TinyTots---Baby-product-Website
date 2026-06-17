"use client";

import { useState } from "react";
import { blogPosts } from "@/lib/blog";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { MotionArticle, MotionDiv } from "@/components/shared/Motion";
import { cardHover, fadeUp, staggerContainer } from "@/lib/animations";

export default function BlogPage() {
  const { language, t } = useLanguage();
  const [comingSoonPostId, setComingSoonPostId] = useState<string | null>(null);

  return (
    <div className="flex-1 bg-brand-surface pb-16">
      <MotionDiv className="bg-brand-primary-light/30 py-16 md:py-24 border-b border-brand-outline text-center px-4" variants={fadeUp}>
        <h1 className="text-3xl md:text-5xl font-bold text-brand-text mb-4">{t("blog.pageTitle")}</h1>
        <p className="text-brand-text-muted text-lg max-w-2xl mx-auto">
          {t("blog.pageSubtitle")}
        </p>
      </MotionDiv>

      <div className="container-max mx-auto px-4 md:px-6 py-12 md:py-16">
        <MotionDiv className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerContainer}>
          {blogPosts.map((post) => {
            const category = language === "bn" ? post.categoryBn : post.category;
            const title = language === "bn" ? post.titleBn : post.title;
            return (
              <MotionArticle key={post.id} variants={fadeUp} whileHover={cardHover} className="bg-white rounded-[2rem] overflow-hidden border border-brand-outline hover:border-brand-primary/50 transition-colors shadow-sm hover:shadow-md group flex flex-col">
                <div className="aspect-[16/10] bg-brand-surface relative overflow-hidden flex items-center justify-center">
                  <Image
                    src={post.image}
                    alt={title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary rounded-full">
                    {category}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs text-brand-text-muted mb-4 font-medium">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <h2 className="text-xl font-bold text-brand-text mb-3 leading-snug group-hover:text-brand-primary transition-colors">
                    {title}
                  </h2>
                  <p className="text-brand-text-muted text-sm leading-relaxed mb-6 flex-grow">
                    {language === "bn" ? post.excerptBn : post.excerpt}
                  </p>
                  <button
                    type="button"
                    onClick={() => setComingSoonPostId(post.id)}
                    className="inline-flex items-center gap-2 text-brand-primary font-bold hover:underline mt-auto w-fit cursor-pointer"
                  >
                    {t("blog.readArticle")} <ArrowRight className="w-4 h-4" />
                  </button>
                  {comingSoonPostId === post.id && (
                    <p className="mt-3 text-sm font-medium text-brand-text-muted" role="status">
                      Full article pages are coming soon.
                    </p>
                  )}
                </div>
              </MotionArticle>
            );
          })}
        </MotionDiv>
      </div>
    </div>
  );
}
