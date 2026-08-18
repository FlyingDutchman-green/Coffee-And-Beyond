"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSettingsStore, DEFAULT_SETTINGS } from "@/lib/settings-store";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export function IntroVideoBanner() {
  const { settings } = useSettingsStore();
  const introVideo = settings.introVideo || DEFAULT_SETTINGS.introVideo;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

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
  }, [introVideo?.isEnabled, introVideo?.videoUrl]);

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

  const videoSrc = introVideo.videoUrl || DEFAULT_SETTINGS.introVideo.videoUrl;
  const posterSrc = introVideo.posterUrl || DEFAULT_SETTINGS.introVideo.posterUrl;

  return (
    <section className="relative w-full bg-[#121211] overflow-hidden select-none border-b border-border-subtle">
      {/* 100% Pure Clean Video Container without text overlay */}
      <div className="relative w-full aspect-video max-h-[540px] sm:max-h-[500px] lg:max-h-[540px] overflow-hidden bg-charcoal">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
          className="w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Minimalist Floating Controls in Bottom Right Corner */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-lg">
          {/* Play / Pause Toggle */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause ambient video" : "Play ambient video"}
            title={isPlaying ? "Pause Video" : "Play Video"}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-white/10"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>

          {/* Mute / Unmute Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-white/10"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-white/80" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-accent-warm animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default IntroVideoBanner;
