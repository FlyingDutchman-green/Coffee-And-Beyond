"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSettingsStore, DEFAULT_SETTINGS } from "@/lib/settings-store";
import { useIntroVideoUrl } from "@/lib/use-media";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

const MIXKIT_FALLBACK =
  "https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-machine-brewing-coffee-42456-large.mp4";

export function IntroVideoBanner() {
  const { settings } = useSettingsStore();
  const introVideo = settings.introVideo || DEFAULT_SETTINGS.introVideo;

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ALWAYS prioritize IndexedDB custom_intro_video over any settings URL
  // This handles the case where localStorage still has old mixkit/placeholder URL
  const resolvedVideoUrl = useIntroVideoUrl(
    settings.hero?.videoUrl,
    MIXKIT_FALLBACK
  );

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Safely attempt autoplay upon mount or videoUrl changes
  useEffect(() => {
    if (!introVideo?.isEnabled) return;

    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay policy prevented immediate playback without gesture
          setIsPlaying(false);
        });
    }
  }, [introVideo?.isEnabled, resolvedVideoUrl]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if (!introVideo?.isEnabled) {
    return null;
  }

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Video playback error:", err);
        });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const posterSrc =
    introVideo.posterUrl || DEFAULT_SETTINGS.introVideo.posterUrl;

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#121211] overflow-hidden select-none border-b border-border-subtle group"
    >
      {/* Pure video — no text overlay */}
      <div className="relative w-full aspect-video max-h-[540px] sm:max-h-[500px] lg:max-h-[540px] overflow-hidden bg-charcoal">
        <video
          ref={videoRef}
          src={resolvedVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
          className="w-full h-full object-cover"
        />

        {/* Floating Controls — Bottom Right */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center gap-2 bg-black/55 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-lg">
          {/* Play / Pause */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause ambient video" : "Play ambient video"}
            title={isPlaying ? "Pause Video" : "Play Video"}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-white/10"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>

          {/* Mute / Unmute */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-white/10"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-white/80" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-accent-warm animate-pulse" />
            )}
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen Video"}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen (F)"}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-white/10"
          >
            {isFullscreen ? (
              <Minimize className="w-3.5 h-3.5 text-white/90" />
            ) : (
              <Maximize className="w-3.5 h-3.5 text-white/90" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default IntroVideoBanner;
