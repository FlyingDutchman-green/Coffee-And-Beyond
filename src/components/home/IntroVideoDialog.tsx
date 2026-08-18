"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSettingsStore, DEFAULT_SETTINGS } from "@/lib/settings-store";
import { useIntroVideoUrl } from "@/lib/use-media";
import { getMediaMetadata, formatBytes } from "@/lib/media-storage";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Loader2,
  Film,
} from "lucide-react";

interface IntroVideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IntroVideoDialog({ isOpen, onClose }: IntroVideoDialogProps) {
  const { settings } = useSettingsStore();
  const introVideo = settings.introVideo || DEFAULT_SETTINGS.introVideo;

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ALWAYS prioritizes IndexedDB "custom_intro_video" over any settings value
  const { videoUrl: videoSrc } = useIntroVideoUrl(
    settings.hero?.videoUrl,
    introVideo.posterUrl || DEFAULT_SETTINGS.introVideo.posterUrl
  );

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.9);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [videoMetaNote, setVideoMetaNote] = useState<string | null>(null);

  // Check metadata for custom video size
  useEffect(() => {
    async function checkMeta() {
      try {
        const meta = await getMediaMetadata("custom_intro_video");
        if (meta?.size) {
          setVideoMetaNote(`Custom HD Showreel (${formatBytes(meta.size)})`);
        } else {
          setVideoMetaNote(null);
        }
      } catch {
        setVideoMetaNote(null);
      }
    }
    checkMeta();

    const handleMediaUpdated = () => checkMeta();
    window.addEventListener("cnb_media_updated", handleMediaUpdated);
    return () => window.removeEventListener("cnb_media_updated", handleMediaUpdated);
  }, []);

  // Autoplay and reset when opened
  useEffect(() => {
    if (!isOpen) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    setCurrentTime(0);

    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = isMuted;
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(() => {
            // If browser blocks unmuted autoplay, mute and retry
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
            setIsLoading(false);
          });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, videoSrc]);

  // Escape key and keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Play error:", err));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      setIsLoading(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity duration-200 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-dialog-title"
    >
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#141413] border border-[#2D2D2A] rounded-2xl shadow-2xl overflow-hidden flex flex-col group animate-in zoom-in-95 duration-200"
      >
        {/* Top Header Bar with Subtle Gradient Overlay */}
        <div className="absolute top-0 inset-x-0 z-30 p-4 sm:p-5 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-accent-warm shadow-xs">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="video-dialog-title"
                  className="font-bold text-sm sm:text-base text-white tracking-tight drop-shadow-sm"
                >
                  Coffee And Beyond Showreel
                </h3>
                {videoMetaNote && (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-accent-warm/20 text-accent-warm border border-accent-warm/30">
                    {videoMetaNote}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/70">
                Pekalongan In-House Roastery &amp; Casual Dining Space Experience
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup video dialog"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 active:scale-95 shadow-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Canvas Container */}
        <div
          onClick={togglePlay}
          className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden cursor-pointer select-none"
        >
          {isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs text-white gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-accent-warm" />
              <span className="text-xs font-mono text-white/80">
                Memuat video showreel...
              </span>
            </div>
          )}

          <video
            key={videoSrc}
            ref={videoRef}
            src={videoSrc || undefined}
            playsInline
            loop
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onWaiting={() => setIsLoading(true)}
            onPlaying={() => setIsLoading(false)}
            className="w-full h-full object-contain"
          />

          {/* Central Play/Pause Flash Overlay Indicator */}
          {!isPlaying && !isLoading && (
            <div className="absolute z-20 w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
              <Play className="w-7 h-7 ml-1 text-accent-warm fill-accent-warm" />
            </div>
          )}
        </div>

        {/* Bottom Custom Playback Controls Bar */}
        <div className="p-3.5 sm:p-4 bg-[#181816] border-t border-[#2D2D2A] space-y-2.5">
          {/* Progress Timeline Slider */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-white/70 w-10 text-right tabular-nums">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Seek timeline"
              className="flex-1 h-1.5 bg-[#333330] rounded-lg appearance-none cursor-pointer accent-accent-warm focus:outline-none"
            />
            <span className="text-[11px] font-mono text-white/70 w-10 text-left tabular-nums">
              {formatTime(duration)}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            {/* Left Controls: Play/Pause, Restart, Volume */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Jeda video" : "Putar video"}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 ml-0.5 text-accent-warm fill-accent-warm" />
                    <span className="hidden sm:inline">Play</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                aria-label="Ulangi dari awal"
                title="Restart Video"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5 pl-1 sm:pl-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Aktifkan suara" : "Matikan suara"}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-white/50" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-accent-warm" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume audio"
                  className="w-16 sm:w-20 h-1 bg-[#333330] rounded appearance-none cursor-pointer accent-accent-warm"
                />
              </div>
            </div>

            {/* Right Controls: Fullscreen & Quality info */}
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-white/50 font-mono">
                <Sparkles className="w-3 h-3 text-accent-warm" />
                <span>1080p • 60 FPS</span>
              </span>

              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label="Toggle layar penuh"
                title="Fullscreen (F)"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntroVideoDialog;
