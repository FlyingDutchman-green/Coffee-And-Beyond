"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSettingsStore, DEFAULT_SETTINGS } from "@/lib/settings-store";
import { useIntroVideoUrl } from "@/lib/use-media";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

export function IntroVideoBanner() {
  const { settings } = useSettingsStore();
  const introVideo = settings.introVideo || DEFAULT_SETTINGS.introVideo;

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // useIntroVideoUrl ALWAYS prioritizes IndexedDB "custom_intro_video" over any
  // settings/localStorage value. Initial videoUrl is "" (empty) so that on the
  // first render the <video> has no src. Once useEffect resolves IndexedDB, the
  // videoUrl changes and React remounts the <video> via key={videoUrl}.
  const { videoUrl, posterUrl } = useIntroVideoUrl(
    settings.hero?.videoUrl,
    introVideo.posterUrl || DEFAULT_SETTINGS.introVideo.posterUrl
  );

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // KEY FIX: whenever videoUrl changes (e.g. SSR empty → IndexedDB blob URL),
  // call videoRef.current.load() so the browser reloads the media stream.
  // React's key={videoUrl} on <video> will remount the DOM node, but we also
  // call load() + play() defensively in case React batches the update.
  useEffect(() => {
    if (!introVideo?.isEnabled) return;
    if (!videoUrl || !videoRef.current) return;

    const vid = videoRef.current;
    vid.muted = true;
    // load() resets the media element and starts fetching the new src
    vid.load();
    vid
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [videoUrl, introVideo?.isEnabled]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (!introVideo?.isEnabled) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Video playback error:", err));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#121211] overflow-hidden select-none border-b border-border-subtle group"
    >
      <div className="relative w-full aspect-video max-h-[540px] sm:max-h-[500px] lg:max-h-[540px] overflow-hidden bg-charcoal">
        {/*
          key={videoUrl} is CRITICAL:
          - Forces React to unmount + remount the <video> DOM node whenever
            videoUrl changes (e.g. "" → blob:// after IndexedDB resolves).
          - Without key, React only patches the src attribute; browsers do NOT
            reload the media stream on attribute-only updates.
          - Combined with the load() + play() in useEffect above, this
            guarantees the custom IndexedDB video always plays on the public page.
        */}
        {videoUrl ? (
          <video
            key={videoUrl}
            ref={videoRef}
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            poster={posterUrl}
            className="w-full h-full object-cover"
          />
        ) : (
          /* Show poster image while IndexedDB is being resolved (avoids flash of wrong video) */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterUrl}
            alt="Coffee And Beyond — Loading Video"
            className="w-full h-full object-cover"
          />
        )}

        {/* Floating Controls — Bottom Right */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center gap-2 bg-black/55 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
