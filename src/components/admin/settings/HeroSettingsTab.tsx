"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import {
  IntroVideoSettings,
  HeroEditorialSettings,
  DEFAULT_SETTINGS,
  useSettingsStore,
} from "@/lib/settings-store";
import {
  validateImageFile,
  readFileAsDataURL,
  getCroppedImg1x1,
} from "@/lib/image-utils";
import {
  saveMediaFile,
  saveImageDataUrl,
  getMediaUrl,
  getMediaMetadata,
  deleteMediaFile,
  resolveMediaUrl,
  formatBytes,
} from "@/lib/media-storage";
import { useMediaUrl } from "@/lib/use-media";
import {
  Film,
  Image as ImageIcon,
  Sparkles,
  Play,
  Volume2,
  RotateCcw,
  Check,
  Video,
  UploadCloud,
  AlertCircle,
  Eye,
  EyeOff,
  Crop,
  X,
  Trash2,
  ZoomIn,
  ZoomOut,
  Loader2,
  Layers,
  Database,
  CheckCircle2,
} from "lucide-react";

interface HeroSettingsTabProps {
  introVideo: IntroVideoSettings;
  heroEditorial: HeroEditorialSettings;
  onChangeIntroVideo: (partial: Partial<IntroVideoSettings>) => void;
  onChangeHeroEditorial: (partial: Partial<HeroEditorialSettings>) => void;
}

const PRESET_VIDEOS = [
  {
    name: "Barista Espresso Craft",
    url: "https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-machine-brewing-coffee-42456-large.mp4",
  },
  {
    name: "Pour-Over Slow Bar",
    url: "https://assets.mixkit.co/videos/preview/mixkit-barista-making-a-drip-coffee-42457-large.mp4",
  },
  {
    name: "Latte Art Steaming",
    url: "https://assets.mixkit.co/videos/preview/mixkit-serving-coffee-with-latte-art-42458-large.mp4",
  },
];

const PRESET_POSTERS = [
  {
    name: "Artisanal Warm Interior",
    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1600&auto=format&fit=crop",
  },
  {
    name: "Minimalist Coffee Counter",
    url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1600&auto=format&fit=crop",
  },
  {
    name: "Morning Slow Bar Daylight",
    url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1600&auto=format&fit=crop",
  },
];

const PRESET_1X1_PHOTOS = [
  {
    name: "Artisanal Cup Focus",
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Steamed Latte Art",
    url: "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Pekalongan Sunlit Table",
    url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop",
  },
];

export function HeroSettingsTab({
  introVideo,
  heroEditorial,
  onChangeIntroVideo,
  onChangeHeroEditorial,
}: HeroSettingsTabProps) {
  // Access updateSettings to sync hero.videoUrl when custom video is uploaded
  const { updateSettings } = useSettingsStore();

  // Video upload state & IndexedDB integration
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoUploading, setIsVideoUploading] = useState<boolean>(false);
  const [storedVideoMeta, setStoredVideoMeta] = useState<{
    name?: string;
    size: number;
  } | null>(null);
  const [resolvedVideoPreviewUrl, setResolvedVideoPreviewUrl] = useState<string>(
    introVideo.videoUrl || DEFAULT_SETTINGS.introVideo.videoUrl
  );

  // 1:1 Poster Crop State
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [selectedPhotoSrc, setSelectedPhotoSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState<boolean>(false);

  // Reactively resolve poster URL (whether data URL, https URL, or indexeddb:// pointer)
  const resolvedPosterPreviewUrl = useMediaUrl(
    heroEditorial.poster1x1Url,
    DEFAULT_SETTINGS.heroEditorial.poster1x1Url
  );

  // Synchronize IndexedDB Video state on mount and updates
  const checkStoredVideo = useCallback(async () => {
    try {
      const meta = await getMediaMetadata("custom_intro_video");
      if (meta) {
        setStoredVideoMeta({ name: meta.name, size: meta.size });
      } else {
        setStoredVideoMeta(null);
      }

      // Check preview URL
      const customUrl = await getMediaUrl("custom_intro_video");
      if (customUrl) {
        setResolvedVideoPreviewUrl(customUrl);
      } else {
        const resolved = await resolveMediaUrl(
          introVideo.videoUrl,
          DEFAULT_SETTINGS.introVideo.videoUrl
        );
        setResolvedVideoPreviewUrl(resolved || DEFAULT_SETTINGS.introVideo.videoUrl);
      }
    } catch (err) {
      console.warn("Failed to check stored video:", err);
    }
  }, [introVideo.videoUrl]);

  useEffect(() => {
    checkStoredVideo();

    const handleMediaUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ key?: string }>;
      if (!customEvent.detail || customEvent.detail.key === "custom_intro_video") {
        checkStoredVideo();
      }
    };

    window.addEventListener("cnb_media_updated", handleMediaUpdated);
    return () => {
      window.removeEventListener("cnb_media_updated", handleMediaUpdated);
    };
  }, [checkStoredVideo]);

  // Handle Video File Upload via IndexedDB (Supports up to 100MB effortlessly)
  const handleVideoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVideoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Up to 100MB limit for high quality intro video
    const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB
    if (file.size > MAX_VIDEO_SIZE) {
      const errorMsg =
        "Ukuran video melebihi batas 100MB. Harap gunakan video berukuran lebih kecil.";
      setVideoError(errorMsg);
      if (videoInputRef.current) videoInputRef.current.value = "";
      return;
    }

    // Verify video MIME type
    if (!file.type.startsWith("video/")) {
      const errorMsg = "Harap unggah file video yang valid (MP4 atau WebM).";
      setVideoError(errorMsg);
      if (videoInputRef.current) videoInputRef.current.value = "";
      return;
    }

    try {
      setIsVideoUploading(true);
      // Persist raw video Blob into client-side IndexedDB
      const objectUrl = await saveMediaFile("custom_intro_video", file, file.name);
      
      // Update settings with indexeddb schema pointer (both introVideo and hero.videoUrl)
      onChangeIntroVideo({ videoUrl: "indexeddb://custom_intro_video" });
      // Sync settings.hero.videoUrl so useIntroVideoUrl fallback chain works correctly
      updateSettings((prev) => ({
        ...prev,
        hero: { ...prev.hero, videoUrl: "indexeddb://custom_intro_video" },
      }));
      setResolvedVideoPreviewUrl(objectUrl);
      setStoredVideoMeta({ name: file.name, size: file.size });

      // Broadcast media update event so all components pick up the new video immediately
      window.dispatchEvent(new CustomEvent("cnb_media_updated", {
        detail: { key: "custom_intro_video", url: objectUrl }
      }));
    } catch (err) {
      console.error("Gagal menyimpan video ke IndexedDB:", err);
      setVideoError("Gagal memproses file video. Silakan coba lagi.");
    } finally {
      setIsVideoUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  // Reset to default intro video
  const handleResetVideo = async () => {
    try {
      await deleteMediaFile("custom_intro_video");
      onChangeIntroVideo({ videoUrl: DEFAULT_SETTINGS.introVideo.videoUrl });
      setStoredVideoMeta(null);
      setResolvedVideoPreviewUrl(DEFAULT_SETTINGS.introVideo.videoUrl);
      setVideoError(null);
    } catch (err) {
      console.error("Error resetting video:", err);
    }
  };

  // Handle 1:1 Photo File Selection & Cropping
  const handlePhotoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setPhotoError(validation.error || "Invalid image file");
      if (photoInputRef.current) photoInputRef.current.value = "";
      return;
    }

    try {
      const dataUrl = await readFileAsDataURL(file);
      setSelectedPhotoSrc(dataUrl);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setIsCropModalOpen(true);
    } catch (err) {
      console.error("Failed to read photo:", err);
      setPhotoError("Failed to read image file. Please try again.");
    } finally {
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const handleCropComplete = useCallback(
    (_croppedArea: Area, pixelCrop: Area) => {
      setCroppedAreaPixels(pixelCrop);
    },
    []
  );

  const handleApplyCrop = async () => {
    if (!croppedAreaPixels || !selectedPhotoSrc) return;
    try {
      setIsCropping(true);
      const croppedImage = await getCroppedImg1x1(
        selectedPhotoSrc,
        croppedAreaPixels,
        0
      );
      // Persist raw WebP data into IndexedDB to avoid 5MB localStorage limit
      const pointer = await saveImageDataUrl("hero_poster_1x1", croppedImage);
      onChangeHeroEditorial({ poster1x1Url: pointer });
      setIsCropModalOpen(false);
      setSelectedPhotoSrc(null);
    } catch (err) {
      console.error("Failed to crop image:", err);
      setPhotoError("Failed to crop image. Please try another file.");
    } finally {
      setIsCropping(false);
    }
  };

  // Modal keyboard escape listener
  useEffect(() => {
    if (!isCropModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isCropping) {
        setIsCropModalOpen(false);
        setSelectedPhotoSrc(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCropModalOpen, isCropping]);

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* 1. Header & Guidance */}
      <div className="border-b border-border-subtle pb-4 space-y-1">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-accent-warm" />
          <h2 className="text-base sm:text-lg font-bold text-text-primary">
            Intro Video Showcase &amp; Editorial Hero Section
          </h2>
        </div>
        <p className="text-xs text-text-muted">
          Konfigurasi pembuka beranda: Video ambient dengan penyimpanan IndexedDB (mendukung video HD &gt;50MB tanpa batas kuota) dan 2-kolom editorial hero section.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: INTRO VIDEO SHOWCASE (INDEXEDDB ENGINE) */}
      {/* ========================================================================= */}
      <div className="p-6 bg-canvas-secondary border border-border-subtle rounded-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
              <Video className="w-4 h-4 text-accent-warm" />
              <span>1. Ambient Intro Video Showcase (IndexedDB Persistent Storage)</span>
            </h3>
            <p className="text-xs text-text-muted">
              Topmost video showcase banner di halaman utama beranda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Visibility Toggle */}
            <button
              type="button"
              onClick={() =>
                onChangeIntroVideo({ isEnabled: !introVideo.isEnabled })
              }
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border shrink-0 ${
                introVideo.isEnabled
                  ? "bg-[#F5F8F3] border-[#D3DEC8] text-[#3B5E2B]"
                  : "bg-[#FDF6F5] border-[#ECCEC9] text-[#8C3426]"
              }`}
            >
              {introVideo.isEnabled ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Showcase Aktif</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Disembunyikan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Video Upload & IndexedDB Indicators */}
        <div className="space-y-4">
          {/* File Upload Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-accent-warm" />
                <span>Upload Video Intro (IndexedDB Engine • Max 100MB)</span>
              </label>
              {storedVideoMeta && (
                <button
                  type="button"
                  onClick={handleResetVideo}
                  className="text-xs text-[#8C3426] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset ke Video Default</span>
                </button>
              )}
            </div>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideoFileChange}
              className="hidden"
            />

            {videoError && (
              <div className="p-3 bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] rounded-md text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{videoError}</span>
              </div>
            )}

            <div
              onClick={() => {
                if (!isVideoUploading) videoInputRef.current?.click();
              }}
              className="w-full border border-dashed border-border-subtle hover:border-charcoal bg-canvas-primary hover:bg-[#F2F2EE] rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all group shadow-2xs"
            >
              {isVideoUploading ? (
                <div className="flex flex-col items-center py-2">
                  <Loader2 className="w-6 h-6 animate-spin text-accent-warm mb-2" />
                  <p className="text-xs font-semibold text-text-primary">
                    Menyimpan video ke IndexedDB client-side...
                  </p>
                  <p className="text-[11px] text-text-muted">
                    Memproses file video tanpa batas kuota localStorage
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-md bg-canvas-secondary border border-border-subtle flex items-center justify-center text-text-muted group-hover:text-text-primary mb-2 shadow-xs transition-colors">
                    <UploadCloud className="w-5 h-5 text-accent-warm" />
                  </div>
                  <p className="text-xs font-semibold text-text-primary">
                    Klik untuk memilih file video MP4 / WebM
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Tersimpan permanen di IndexedDB browser (Maksimal 100MB)
                  </p>
                </>
              )}
            </div>

            {/* Status indicator if custom video is active in IndexedDB */}
            {storedVideoMeta && (
              <div className="p-3 bg-[#F5F8F3] border border-[#D3DEC8] text-[#3B5E2B] rounded-md text-xs flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-[#3B5E2B] shrink-0" />
                  <span className="font-semibold">
                    Video Tersimpan di IndexedDB ({formatBytes(storedVideoMeta.size)})
                  </span>
                  {storedVideoMeta.name && (
                    <span className="text-[11px] text-[#557A46] truncate">
                      • {storedVideoMeta.name}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleResetVideo}
                  className="px-2.5 py-1 bg-white border border-[#D3DEC8] hover:bg-[#EAF2E6] text-[#3B5E2B] rounded text-[11px] font-medium transition-colors cursor-pointer shrink-0"
                >
                  Kembalikan Default
                </button>
              </div>
            )}
          </div>

          {/* Alternative Direct Video URL */}
          <div className="space-y-2">
            <label className="font-semibold text-xs text-text-primary block">
              Atau Gunakan Direct Video URL (CDN / MP4 Online)
            </label>
            <input
              type="url"
              value={introVideo.videoUrl}
              onChange={(e) =>
                onChangeIntroVideo({ videoUrl: e.target.value })
              }
              placeholder="https://assets.yourcdn.com/videos/coffee-intro.mp4"
              className="w-full px-3 py-2 text-xs bg-canvas-primary border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-charcoal font-mono"
            />
            {/* Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-text-muted">Preset Sampel:</span>
              {PRESET_VIDEOS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() =>
                    onChangeIntroVideo({ videoUrl: preset.url })
                  }
                  className="px-2 py-0.5 text-[10px] rounded bg-canvas-primary border border-border-subtle text-text-primary hover:bg-[#EFEFEA] transition-colors cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Poster / Fallback Image URL */}
          <div className="space-y-2">
            <label className="font-semibold text-xs text-text-primary block">
              Poster / Thumbnail Fallback Image URL
            </label>
            <input
              type="url"
              value={introVideo.posterUrl}
              onChange={(e) =>
                onChangeIntroVideo({ posterUrl: e.target.value })
              }
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 text-xs bg-canvas-primary border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-charcoal font-mono"
            />
            {/* Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-text-muted">Preset Poster:</span>
              {PRESET_POSTERS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() =>
                    onChangeIntroVideo({ posterUrl: preset.url })
                  }
                  className="px-2 py-0.5 text-[10px] rounded bg-canvas-primary border border-border-subtle text-text-primary hover:bg-[#EFEFEA] transition-colors cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: EDITORIAL HERO & 1:1 POSTER */}
      {/* ========================================================================= */}
      <div className="p-6 bg-canvas-secondary border border-border-subtle rounded-xl space-y-6">
        <div className="border-b border-border-subtle pb-4 space-y-0.5">
          <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent-warm" />
            <span>2. Editorial Hero &amp; 1:1 Square Poster</span>
          </h3>
          <p className="text-xs text-text-muted">
            Komposisi 2-kolom editorial dengan headline, deskripsi naratif, dan foto kurasi 1:1.
          </p>
        </div>

        {/* 1:1 Poster Image Section */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-text-primary block">
            1:1 Square Poster Photo (WebP Otomatis &lt;100KB)
          </label>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoFileChange}
            className="hidden"
          />

          {photoError && (
            <div className="p-3 bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] rounded-md text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{photoError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Square Preview Display */}
            <div className="md:col-span-4">
              <div className="aspect-square w-full max-w-[200px] rounded-xl overflow-hidden border border-border-subtle bg-canvas-primary shadow-xs relative">
                {resolvedPosterPreviewUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={resolvedPosterPreviewUrl}
                    alt="Hero 1:1 Poster Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                    <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
                    <span className="text-[10px]">1:1 Square</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-charcoal/80 text-white font-semibold">
                    1:1 WebP
                  </span>
                </div>
              </div>
            </div>

            {/* Actions & Direct URL */}
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-text-primary bg-canvas-primary border border-border-subtle rounded-md hover:bg-[#EFEFEA] hover:border-[#D0D0CA] transition-colors cursor-pointer shadow-2xs"
                >
                  <Crop className="w-3.5 h-3.5 text-accent-warm" />
                  <span>Upload &amp; Crop 1:1 Photo</span>
                </button>
              </div>

              {/* Direct URL input */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[11px] text-text-primary block">
                  Atau Direct Image URL (1:1 Ratio)
                </label>
                <input
                  type="url"
                  value={heroEditorial.poster1x1Url}
                  onChange={(e) =>
                    onChangeHeroEditorial({ poster1x1Url: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 text-xs bg-canvas-primary border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-charcoal font-mono"
                />
                {/* Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[10px] text-text-muted">Samples:</span>
                  {PRESET_1X1_PHOTOS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() =>
                        onChangeHeroEditorial({ poster1x1Url: preset.url })
                      }
                      className="px-2 py-0.5 text-[10px] rounded bg-canvas-primary border border-border-subtle text-text-primary hover:bg-[#EFEFEA] transition-colors cursor-pointer"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Text Fields */}
        <div className="space-y-4 pt-2 border-t border-border-subtle">
          {/* Badge Tag */}
          <div className="space-y-1.5">
            <label className="font-semibold text-xs text-text-primary block">
              Neutral Badge Text
            </label>
            <input
              type="text"
              value={heroEditorial.badgeText}
              onChange={(e) =>
                onChangeHeroEditorial({ badgeText: e.target.value })
              }
              placeholder="ESTABLISHED 2015 • PEKALONGAN"
              className="w-full px-3 py-2 text-xs bg-canvas-primary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal tracking-wide uppercase"
            />
          </div>

          {/* Primary Headline */}
          <div className="space-y-1.5">
            <label className="font-semibold text-xs text-text-primary block">
              Primary Headline <span className="text-[#8C3426]">*</span>
            </label>
            <input
              type="text"
              required
              value={heroEditorial.headline}
              onChange={(e) =>
                onChangeHeroEditorial({ headline: e.target.value })
              }
              placeholder="Crafted with passion, brewed with precision."
              className="w-full px-3 py-2 text-xs bg-canvas-primary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-sans font-bold text-sm"
            />
          </div>

          {/* Subheadline Narrative */}
          <div className="space-y-1.5">
            <label className="font-semibold text-xs text-text-primary block">
              Subheadline Narrative
            </label>
            <textarea
              rows={3}
              value={heroEditorial.subheadline}
              onChange={(e) =>
                onChangeHeroEditorial({ subheadline: e.target.value })
              }
              placeholder="Destinasi specialty coffee dan casual dining di Pekalongan. Menyajikan kopi sangrai mandiri, hidangan Nusantara & Western, serta ruang hangat untuk berkumpul dan bekerja."
              className="w-full px-3 py-2 text-xs bg-canvas-primary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal leading-relaxed"
            />
          </div>

          {/* Dual Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Primary CTA */}
            <div className="p-3 bg-canvas-primary border border-border-subtle rounded-lg space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-primary block">
                Primary CTA Button
              </span>
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={heroEditorial.primaryCtaText}
                  onChange={(e) =>
                    onChangeHeroEditorial({ primaryCtaText: e.target.value })
                  }
                  placeholder="Explore Menu"
                  className="w-full px-2.5 py-1.5 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-medium"
                />
                <input
                  type="text"
                  value={heroEditorial.primaryCtaLink}
                  onChange={(e) =>
                    onChangeHeroEditorial({ primaryCtaLink: e.target.value })
                  }
                  placeholder="/menu"
                  className="w-full px-2.5 py-1.5 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Secondary CTA */}
            <div className="p-3 bg-canvas-primary border border-border-subtle rounded-lg space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-primary block">
                Secondary CTA Button
              </span>
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={heroEditorial.secondaryCtaText}
                  onChange={(e) =>
                    onChangeHeroEditorial({ secondaryCtaText: e.target.value })
                  }
                  placeholder="Order at Table →"
                  className="w-full px-2.5 py-1.5 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-medium"
                />
                <input
                  type="text"
                  value={heroEditorial.secondaryCtaLink}
                  onChange={(e) =>
                    onChangeHeroEditorial({ secondaryCtaLink: e.target.value })
                  }
                  placeholder="/order/A01"
                  className="w-full px-2.5 py-1.5 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: LIVE PREVIEW SIMULATOR */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-accent-warm" />
            <span>Homepage Opening Live Simulation</span>
          </label>
          <span className="text-[11px] text-text-muted">Real-time render</span>
        </div>

        <div className="border border-border-subtle rounded-xl overflow-hidden bg-canvas-secondary shadow-sm divide-y divide-border-subtle">
          {/* Simulation 1: Video Banner */}
          <div className="relative">
            {introVideo.isEnabled ? (
              <div className="relative w-full aspect-video sm:aspect-21/9 max-h-[300px] overflow-hidden bg-charcoal">
                <video
                  src={resolvedVideoPreviewUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={introVideo.posterUrl}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono backdrop-blur-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-warm inline-block animate-pulse" />
                  <span>
                    {storedVideoMeta
                      ? `IndexedDB Custom Video (${formatBytes(storedVideoMeta.size)})`
                      : "Clean Video Intro (No Text Overlay)"}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-xs p-1 rounded-full border border-white/20">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white text-[9px]">
                    <Play className="w-2.5 h-2.5 ml-0.5" />
                  </div>
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white text-[9px]">
                    <Volume2 className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-text-muted bg-canvas-secondary font-mono">
                [Intro Video Showcase Hidden]
              </div>
            )}
          </div>

          {/* Simulation 2: Editorial Hero 2-Column */}
          <div className="p-6 sm:p-8 bg-canvas-primary">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-canvas-secondary border border-border-subtle text-[#1E1E1C] text-[10px] uppercase font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-warm inline-block animate-pulse" />
                  <span>{heroEditorial.badgeText || "ESTABLISHED 2015 • PEKALONGAN"}</span>
                </div>

                <h4 className="font-sans font-bold text-lg sm:text-xl text-text-primary leading-tight line-clamp-2">
                  {heroEditorial.headline ||
                    "Crafted with passion, brewed with precision."}
                </h4>

                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                  {heroEditorial.subheadline ||
                    "Destinasi specialty coffee dan casual dining di Pekalongan. Menyajikan kopi sangrai mandiri, hidangan Nusantara & Western, serta ruang hangat untuk berkumpul dan bekerja."}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <span className="px-3 py-1.5 rounded bg-[#1E1E1C] text-white font-medium text-[11px]">
                    {heroEditorial.primaryCtaText || "Explore Menu"}
                  </span>
                  <span className="px-3 py-1.5 rounded border border-[#E7E7E3] bg-white text-[#1E1E1C] font-medium text-[11px]">
                    {heroEditorial.secondaryCtaText || "Order at Table →"}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-5 flex justify-center sm:justify-end">
                <div className="aspect-square w-28 sm:w-36 rounded-xl overflow-hidden border border-[#E7E7E3] bg-canvas-secondary shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolvedPosterPreviewUrl}
                    alt="Editorial Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1:1 Photo Crop Modal */}
      {isCropModalOpen && selectedPhotoSrc && (
        <div
          onClick={() => {
            if (!isCropping) {
              setIsCropModalOpen(false);
              setSelectedPhotoSrc(null);
            }
          }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs transition-opacity duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-canvas-primary border border-border-subtle rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-canvas-primary">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-canvas-secondary border border-border-subtle text-text-primary">
                  <Crop className="w-4 h-4 text-accent-warm" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    Crop Hero Photo (1:1 Square)
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    Format WebP terkompresi otomatis (&lt;100KB)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isCropping) {
                    setIsCropModalOpen(false);
                    setSelectedPhotoSrc(null);
                  }
                }}
                disabled={isCropping}
                className="p-1 text-text-muted hover:text-text-primary rounded-md border border-border-subtle cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cropper Viewport (Locked 1:1 aspect) */}
            <div className="relative w-full aspect-square bg-charcoal">
              <Cropper
                image={selectedPhotoSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                showGrid={true}
              />
            </div>

            {/* Controls Bar */}
            <div className="p-4 bg-canvas-secondary border-t border-border-subtle space-y-3">
              <div className="flex items-center gap-2.5">
                <ZoomOut className="w-3.5 h-3.5 text-text-muted shrink-0" />
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  aria-label="Image zoom slider"
                  className="w-full accent-charcoal cursor-pointer"
                />
                <ZoomIn className="w-3.5 h-3.5 text-text-muted shrink-0" />
                <span className="font-mono text-xs font-semibold text-text-primary w-8 text-right tabular-nums">
                  {zoom.toFixed(1)}x
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsCropModalOpen(false);
                    setSelectedPhotoSrc(null);
                  }}
                  disabled={isCropping}
                  className="px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-primary bg-canvas-primary border border-border-subtle rounded-md hover:bg-[#EFEFEA] transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCrop}
                  disabled={isCropping || !croppedAreaPixels}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-charcoal rounded-md hover:bg-[#2C2C28] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isCropping ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Optimizing WebP...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Foto 1:1</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroSettingsTab;
