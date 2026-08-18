"use client";

import React from "react";
import Link from "next/link";
import { useSettingsStore, DEFAULT_SETTINGS } from "@/lib/settings-store";
import { FadeInView } from "@/components/ui/motion";

export function EditorialHeroSection() {
  const { settings } = useSettingsStore();
  const heroEditorial = settings.heroEditorial || DEFAULT_SETTINGS.heroEditorial;

  const badgeText = heroEditorial.badgeText || DEFAULT_SETTINGS.heroEditorial.badgeText;
  const headline = heroEditorial.headline || DEFAULT_SETTINGS.heroEditorial.headline;
  const subheadline =
    heroEditorial.subheadline || DEFAULT_SETTINGS.heroEditorial.subheadline;
  const poster1x1Url =
    heroEditorial.poster1x1Url || DEFAULT_SETTINGS.heroEditorial.poster1x1Url;
  const primaryCtaText =
    heroEditorial.primaryCtaText || DEFAULT_SETTINGS.heroEditorial.primaryCtaText;
  const primaryCtaLink =
    heroEditorial.primaryCtaLink || DEFAULT_SETTINGS.heroEditorial.primaryCtaLink;
  const secondaryCtaText =
    heroEditorial.secondaryCtaText || DEFAULT_SETTINGS.heroEditorial.secondaryCtaText;
  const secondaryCtaLink =
    heroEditorial.secondaryCtaLink || DEFAULT_SETTINGS.heroEditorial.secondaryCtaLink;

  return (
    <section className="relative w-full bg-canvas-primary border-b border-border-subtle overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center py-12 lg:py-20">
          {/* Left Column: Editorial Headline, Subheadline & Dual CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Minimalist Neutral Vision Badge */}
            <FadeInView delay={0.05} direction="up" distance={16}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-canvas-secondary border border-border-subtle text-xs font-semibold uppercase tracking-wider text-[#1E1E1C]">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-warm inline-block animate-pulse" />
                <span>{badgeText}</span>
              </div>
            </FadeInView>

            {/* Primary Editorial Headline */}
            <FadeInView delay={0.15} direction="up" distance={24}>
              <h1 className="text-3xl sm:text-5xl font-sans font-bold text-[#1E1E1C] tracking-tight leading-[1.15]">
                {headline}
              </h1>
            </FadeInView>

            {/* Subheadline Narrative */}
            <FadeInView delay={0.25} direction="up" distance={20}>
              <p className="text-[#777772] text-base sm:text-lg leading-relaxed mt-4 max-w-xl">
                {subheadline}
              </p>
            </FadeInView>

            {/* Dual Action CTAs */}
            <FadeInView delay={0.35} direction="up" distance={16}>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={primaryCtaLink}
                  className="bg-[#1E1E1C] text-white px-6 py-3 rounded-md hover:bg-black transition-all hover:shadow-md active:scale-98 font-medium text-sm inline-flex items-center justify-center shadow-xs"
                >
                  {primaryCtaText}
                </Link>
                <Link
                  href={secondaryCtaLink}
                  className="border border-[#E7E7E3] bg-white text-[#1E1E1C] px-6 py-3 rounded-md hover:bg-[#F7F7F5] transition-all hover:border-[#D0D0CA] active:scale-98 font-medium text-sm flex items-center gap-2 shadow-2xs"
                >
                  {secondaryCtaText}
                </Link>
              </div>
            </FadeInView>
          </div>

          {/* Right Column: 1:1 Aspect Ratio Square Poster */}
          <div className="lg:col-span-5">
            <FadeInView delay={0.2} direction="up" distance={28} duration={0.8}>
              <div className="aspect-square w-full rounded-2xl overflow-hidden border border-[#E7E7E3] shadow-xs relative bg-[#F7F7F5] group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={poster1x1Url}
                  alt="Coffee And Beyond Atmosphere"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
              </div>
            </FadeInView>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EditorialHeroSection;

