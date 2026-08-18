"use client";

import React from "react";
import { useSettingsStore, DEFAULT_SETTINGS } from "@/lib/settings-store";
import { FadeInView } from "@/components/ui/motion";

export function SpaceExperienceSection() {
  const { settings } = useSettingsStore();
  const spaceVibe = settings.spaceVibe || DEFAULT_SETTINGS.spaceVibe;

  const badgeText = spaceVibe.badgeText || DEFAULT_SETTINGS.spaceVibe.badgeText;
  const headline = spaceVibe.headline || DEFAULT_SETTINGS.spaceVibe.headline;
  const storyParagraph1 =
    spaceVibe.storyParagraph1 || DEFAULT_SETTINGS.spaceVibe.storyParagraph1;
  const storyParagraph2 =
    spaceVibe.storyParagraph2 || DEFAULT_SETTINGS.spaceVibe.storyParagraph2;
  const quoteText = spaceVibe.quoteText || DEFAULT_SETTINGS.spaceVibe.quoteText;
  const quoteAuthor =
    spaceVibe.quoteAuthor || DEFAULT_SETTINGS.spaceVibe.quoteAuthor;
  const image1Url =
    spaceVibe.image1Url || DEFAULT_SETTINGS.spaceVibe.image1Url;
  const image2Url =
    spaceVibe.image2Url || DEFAULT_SETTINGS.spaceVibe.image2Url;
  const image3Url =
    spaceVibe.image3Url || DEFAULT_SETTINGS.spaceVibe.image3Url;
  const highlights =
    spaceVibe.highlights || DEFAULT_SETTINGS.spaceVibe.highlights;

  return (
    <section
      id="space"
      className="w-full bg-canvas-primary border-b border-border-subtle py-16 lg:py-24 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Kolom Kiri: Editorial Storytelling, Pull-Quote, dan Sub-Highlights */}
          <div className="lg:col-span-6 space-y-6">
            {/* Pill Eyebrow Badge */}
            <FadeInView delay={0.05} direction="up" distance={16}>
              <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-[#777772]">
                <span className="w-6 h-[1px] bg-accent-warm" />
                <span>{badgeText}</span>
              </div>
            </FadeInView>

            {/* Judul Headline Utama */}
            <FadeInView delay={0.15} direction="up" distance={20}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-[#1E1E1C] leading-[1.2] tracking-tight">
                {headline}
              </h2>
            </FadeInView>

            {/* Paragraf Narasi Editorial */}
            <FadeInView delay={0.25} direction="up" distance={16}>
              <div className="text-[#777772] text-sm sm:text-base leading-relaxed space-y-4">
                <p>{storyParagraph1}</p>
                <p>{storyParagraph2}</p>
              </div>
            </FadeInView>

            {/* Pull-Quote Box dengan Garis Aksen Vertikal */}
            <FadeInView delay={0.35} direction="up" distance={16}>
              <div className="border-l-2 border-[#1E1E1C] pl-5 py-3.5 my-6 bg-[#F7F7F5]/80 rounded-r-lg shadow-2xs">
                <blockquote className="font-sans font-medium text-base sm:text-lg text-[#1E1E1C] leading-relaxed">
                  &ldquo;{quoteText}&rdquo;
                </blockquote>
                <span className="text-xs font-mono uppercase tracking-widest text-[#777772] mt-2 block">
                  — {quoteAuthor}
                </span>
              </div>
            </FadeInView>

            {/* Sub-Highlights List Minimalis */}
            {highlights && highlights.length > 0 && (
              <FadeInView delay={0.45} direction="up" distance={16}>
                <div className="space-y-3 pt-4 border-t border-border-subtle">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-warm mt-2 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-[#1E1E1C] tracking-wide uppercase">
                          {item.label}
                        </p>
                        <p className="text-xs text-[#777772] mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeInView>
            )}
          </div>

          {/* Kolom Kanan: Bento Collage 3 Foto Estetis */}
          <div className="lg:col-span-6">
            <div className="space-y-4">
              {/* Baris Atas: 2 Foto Vertikal (4:5 Aspect) */}
              <div className="grid grid-cols-2 gap-4">
                {/* Foto 1 (Kiri Atas): Spot Seduh / Nook */}
                <FadeInView delay={0.2} direction="up" distance={20} duration={0.7}>
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-[#E7E7E3] shadow-xs relative bg-[#F7F7F5] group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image1Url}
                      alt="Space Interior Nook"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    />
                  </div>
                </FadeInView>

                {/* Foto 2 (Kanan Atas): Detail Gelas / Barista */}
                <FadeInView delay={0.3} direction="up" distance={20} duration={0.7}>
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-[#E7E7E3] shadow-xs relative bg-[#F7F7F5] group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image2Url}
                      alt="Artisanal Coffee Detail"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    />
                  </div>
                </FadeInView>
              </div>

              {/* Baris Bawah: 1 Foto Lebar Horizontal (16:9 / 21:9 Aspect) */}
              <FadeInView delay={0.4} direction="up" distance={24} duration={0.8}>
                <div className="aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden border border-[#E7E7E3] shadow-xs relative bg-[#F7F7F5] group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image3Url}
                    alt="Cafe Architecture & Seating Atmosphere"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                  />
                </div>
              </FadeInView>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SpaceExperienceSection;

