"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSettingsStore, DEFAULT_SETTINGS } from "@/lib/settings-store";
import { useIntroVideoUrl } from "@/lib/use-media";
import { IntroVideoDialog } from "@/components/home/IntroVideoDialog";
import { Play, Pause, Volume2, VolumeX, ArrowRight, QrCode } from "lucide-react";

/**
 * CinematicHeroSection — full-bleed video/image hero with editorial overlay.
 * NOTE: This component is NOT currently rendered by page.tsx (IntroVideoBanner +
 * EditorialHeroSection are used instead). It is kept here for future use.
 */
export function CinematicHeroSection() {
  const { settings } = useSettingsStore();
  const hero = settings.hero || DEFAULT_SETTINGS.hero;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Always prioritizes IndexedDB "custom_intro_video" over settings/localStorage
  const { videoUrl: resolvedVideoUrl } = useIntroVideoUrl(
    settings.hero?.videoUrl,
    hero.posterUrl || DEFAULT_SETTINGS.hero.posterUrl
  );

  // KEY FIX: load() + play() whenever resolvedVideoUrl changes
  useEffect(() => {
    if (hero.mode !== "video") return;
    if (!resolvedVideoUrl || !videoRef.current) return;

    const vid = videoRef.current;
    vid.muted = true;
    vid.load();
    vid
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [resolvedVideoUrl, hero.mode]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.warn("Video playback error:", e));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  const isVideoMode = hero.mode === "video";

  return (
    <>
      <section className="relative w-full min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-[#121211] border-b border-border-subtle select-none">
        {/* Background Layer */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {isVideoMode ? (
            resolvedVideoUrl ? (
              /* key={resolvedVideoUrl} forces DOM remount when URL changes (SSR → IndexedDB blob) */
              <video
                key={resolvedVideoUrl}
                ref={videoRef}
                src={resolvedVideoUrl}
                autoPlay
                muted
                loop
                playsInline
                poster={hero.posterUrl || DEFAULT_SETTINGS.hero.posterUrl}
                className="w-full h-full object-cover select-none pointer-events-none scale-105 transition-transform duration-1000"
              />
            ) : (
              /* Show poster while IndexedDB resolves */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hero.posterUrl || DEFAULT_SETTINGS.hero.posterUrl}
                alt={hero.headline}
                className="w-full h-full object-cover select-none pointer-events-none scale-105"
              />
            )
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.posterUrl || DEFAULT_SETTINGS.hero.posterUrl}
              alt={hero.headline}
              className="w-full h-full object-cover select-none pointer-events-none scale-105 transition-transform duration-1000"
            />
          )}

          {/* Gradient overlays for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35 pointer-events-none" />
          <div className="absolute inset-0 bg-[#1E1E1C]/25 mix-blend-multiply pointer-events-none" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 flex flex-col justify-between">
          <div className="max-w-3xl space-y-6 sm:space-y-8">
            {/* Established Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent-warm inline-block animate-pulse" />
              <span>{hero.badgeText || "ESTABLISHED 2015 • PEKALONGAN"}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold text-white tracking-tight leading-[1.12] drop-shadow-md">
              {hero.headline || "Crafted with Passion, Brewed with Precision."}
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base lg:text-lg text-white/85 font-sans leading-relaxed max-w-2xl drop-shadow-xs font-light">
              {hero.subheadline ||
                "Destinasi specialty coffee dan casual dining di Pekalongan. Menyajikan kopi sangrai mandiri, hidangan Nusantara & Western, serta ruang hangat untuk berkumpul dan bekerja."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-white text-[#1E1E1C] font-semibold text-sm hover:bg-[#F7F7F5] transition-all shadow-md active:scale-98"
              >
                <span>Explore Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/order"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md border border-white/40 bg-black/25 text-white font-semibold text-sm backdrop-blur-md hover:bg-white/15 hover:border-white/60 transition-all shadow-sm active:scale-98"
              >
                <QrCode className="w-4 h-4 text-accent-warm" />
                <span>Order at Table &rarr;</span>
              </Link>
            </div>

            {/* Micro Feature Indicators */}
            <div className="pt-6 sm:pt-8 border-t border-white/15 grid grid-cols-3 gap-3 sm:gap-6 max-w-xl text-left text-white text-xs">
              <div className="space-y-0.5">
                <p className="font-semibold text-white/95">100% Arabica</p>
                <p className="text-[11px] text-white/70">Ethical Direct Trade</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-semibold text-white/95">High-Speed WiFi</p>
                <p className="text-[11px] text-white/70">AC + USB-C at Every Seat</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-semibold text-white/95">QR Table Service</p>
                <p className="text-[11px] text-white/70">Instant Mobile Ordering</p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Controls — Bottom Right */}
        {isVideoMode && resolvedVideoUrl && (
          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 flex items-center gap-2 bg-black/45 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-lg">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause cinematic video" : "Play cinematic video"}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-white/10"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-white/10"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-white/80" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-accent-warm animate-pulse" />
              )}
            </button>
          </div>
        )}
      </section>

      {/* Showreel Dialog */}
      <IntroVideoDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
}

export default CinematicHeroSection;
