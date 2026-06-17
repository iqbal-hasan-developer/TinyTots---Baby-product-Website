"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { getCategoryHref } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";
import Image from "next/image";
import { MotionDiv } from "@/components/shared/Motion";
import { fadeUp, softScale, staggerContainer, tapScale } from "@/lib/animations";

export default function HeroSection() {
  const { language, t } = useLanguage();
  const bundlesHref = getCategoryHref("Bundle");

  return (
    <section className="relative overflow-hidden bg-brand-surface py-12 md:py-20 lg:py-24">
      {/* Soft premium gradient background elements */}
<div className="absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(167,220,198,0.45)_0%,rgba(167,220,198,0.22)_38%,transparent_72%)] blur-2xl" />

<div className="absolute top-1/3 -left-32 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(244,210,224,0.42)_0%,rgba(244,210,224,0.18)_42%,transparent_74%)] blur-2xl" />

<div className="absolute -bottom-36 right-1/4 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(244,226,169,0.38)_0%,rgba(244,226,169,0.16)_40%,transparent_76%)] blur-2xl" />

<div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.72)_0%,rgba(247,242,234,0.62)_45%,rgba(232,246,241,0.55)_100%)]" />

      <div className="container-max mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-5 items-center">
          <MotionDiv
            className="flex flex-col items-start space-y-6 md:space-y-8 max-w-xl mx-auto md:mx-0 text-center md:text-left"
            variants={staggerContainer}
          >
            <MotionDiv variants={fadeUp} className="w-full">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-brand-text leading-tight">
              {t("hero.title")}{" "}
              <span className="text-brand-primary">
                {t("hero.titleHighlight")}
              </span>
            </h1>
            </MotionDiv>
            <MotionDiv variants={fadeUp}>
            <p className="text-lg md:text-xl text-brand-text-muted leading-relaxed">
              {language === "bn" ? t("hero.subtitle") : siteConfig.tagline}
            </p>
            </MotionDiv>
            <MotionDiv variants={fadeUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <MotionDiv whileTap={tapScale}>
              <Link
                href="/shop"
                className="inline-flex justify-center items-center h-14 px-12 rounded-full bg-brand-primary text-white font-semibold text-lg hover:bg-brand-primary/90 transition-colors shadow-[0_8px_20px_rgba(85,97,88,0.2)]"
              >
                {t("hero.shopNow")}
              </Link>
              </MotionDiv>
              <MotionDiv whileTap={tapScale}>
              <Link
                href={bundlesHref}
                className="inline-flex justify-center items-center h-14 px-8 rounded-full border-2 border-brand-primary text-brand-primary font-semibold text-lg hover:bg-brand-primary-light transition-colors"
              >
                {t("hero.viewBundles")}
              </Link>
              </MotionDiv>
            </MotionDiv>

            <MotionDiv variants={fadeUp} className="pt-6 border-t border-brand-outline w-full grid-cols-2 gap-4 hidden sm:grid sm:grid-cols-4">
              <MotionDiv variants={fadeUp} className="text-center md:text-left">
                <div className="font-bold text-brand-primary text-xl">100%</div>
                <div className="text-xs text-brand-text-muted uppercase tracking-wider">
                  {t("hero.genuine")}
                </div>
              </MotionDiv>
              <MotionDiv variants={fadeUp} className="text-center md:text-left">
                <div className="font-bold text-brand-primary text-xl">24h</div>
                <div className="text-xs text-brand-text-muted uppercase tracking-wider">
                  {t("hero.delivery")}
                </div>
              </MotionDiv>
              <MotionDiv variants={fadeUp} className="text-center md:text-left">
                <div className="font-bold text-brand-primary text-xl">COD</div>
                <div className="text-xs text-brand-text-muted uppercase tracking-wider">
                  {t("hero.codLabel")}
                </div>
              </MotionDiv>
              <MotionDiv variants={fadeUp} className="text-center md:text-left">
                <div className="font-bold text-brand-primary text-xl">
                  4.9/5
                </div>
                <div className="text-xs text-brand-text-muted uppercase tracking-wider">
                  {t("hero.rating")}
                </div>
              </MotionDiv>
            </MotionDiv>
          </MotionDiv>

          <MotionDiv
            variants={softScale}
            className="relative aspect-square md:aspect-4/3 rounded-[3rem] overflow-hidden bg-brand-primary-light/50 border border-brand-outline/50 shadow-2xl shadow-brand-primary/10 mx-auto w-full max-w-160"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary-light to-[#f4e2a9]/50 mix-blend-multiply" />
            <Image
              src={siteConfig.heroImage}
              alt="Mother holding her baby with care for TinyTots BD"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover md:object-contain object-center"
            />
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
