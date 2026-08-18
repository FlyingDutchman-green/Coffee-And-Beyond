"use client";

import React, { useState, useRef } from "react";
import { SpaceVibeSettings } from "@/lib/settings-store";
import {
  validateImageFile,
  compressImageToWebP,
  formatDataUrlSize,
} from "@/lib/image-utils";
import { saveImageDataUrl } from "@/lib/media-storage";
import { useMediaUrl } from "@/lib/use-media";
import {
  Layers,
  Image as ImageIcon,
  Sparkles,
  UploadCloud,
  Quote,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface SpaceSettingsTabProps {
  spaceVibe: SpaceVibeSettings;
  onChangeSpaceVibe: (partial: Partial<SpaceVibeSettings>) => void;
}

const PRESET_SLOT1_PHOTOS = [
  {
    name: "Oak Wood Brew Station",
    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Sunlit Window Nook",
    url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Acoustic Corner Seating",
    url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1000&auto=format&fit=crop",
  },
];

const PRESET_SLOT2_PHOTOS = [
  {
    name: "Latte Art Steamed Cup",
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Slow Bar Drip Craft",
    url: "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Ceramic Espresso Shot",
    url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1000&auto=format&fit=crop",
  },
];

const PRESET_SLOT3_PHOTOS = [
  {
    name: "Wide Pekalongan Bar Lounge",
    url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1600&auto=format&fit=crop",
  },
  {
    name: "Communal Table Flow",
    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1600&auto=format&fit=crop",
  },
  {
    name: "Minimalist Main Counter",
    url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1600&auto=format&fit=crop",
  },
];

export function SpaceSettingsTab({
  spaceVibe,
  onChangeSpaceVibe,
}: SpaceSettingsTabProps) {
  const fileInput1Ref = useRef<HTMLInputElement>(null);
  const fileInput2Ref = useRef<HTMLInputElement>(null);
  const fileInput3Ref = useRef<HTMLInputElement>(null);

  const [uploadError1, setUploadError1] = useState<string | null>(null);
  const [uploadError2, setUploadError2] = useState<string | null>(null);
  const [uploadError3, setUploadError3] = useState<string | null>(null);
  const [compressingSlot, setCompressingSlot] = useState<1 | 2 | 3 | null>(null);

  // Reactively resolve media URLs from IndexedDB, data URLs, or HTTP URLs
  const previewImage1 = useMediaUrl(spaceVibe.image1Url);
  const previewImage2 = useMediaUrl(spaceVibe.image2Url);
  const previewImage3 = useMediaUrl(spaceVibe.image3Url);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    slot: 1 | 2 | 3
  ) => {
    const setError =
      slot === 1
        ? setUploadError1
        : slot === 2
        ? setUploadError2
        : setUploadError3;
    const inputRef =
      slot === 1
        ? fileInput1Ref
        : slot === 2
        ? fileInput2Ref
        : fileInput3Ref;

    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || "Invalid image file");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    try {
      setCompressingSlot(slot);
      // Auto compress to WebP format (<100KB) with max 1200px dimension
      const webpDataUrl = await compressImageToWebP(file, 1200, 0.85);

      // Persist to IndexedDB to avoid 5MB localStorage limit
      const pointer = await saveImageDataUrl(`space_vibe_${slot}`, webpDataUrl);

      if (slot === 1) onChangeSpaceVibe({ image1Url: pointer });
      if (slot === 2) onChangeSpaceVibe({ image2Url: pointer });
      if (slot === 3) onChangeSpaceVibe({ image3Url: pointer });
    } catch (err) {
      console.error("Gagal mengompresi gambar:", err);
      setError("Gagal memproses gambar. Silakan coba lagi.");
    } finally {
      setCompressingSlot(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleUpdateHighlight = (
    index: number,
    field: "label" | "description",
    val: string
  ) => {
    const updated = [...(spaceVibe.highlights || [])];
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: val };
      onChangeSpaceVibe({ highlights: updated });
    }
  };

  const handleAddHighlight = () => {
    const updated = [
      ...(spaceVibe.highlights || []),
      { label: "NEW AMENITY HIGHLIGHT", description: "Deskripsi fitur suasana..." },
    ];
    onChangeSpaceVibe({ highlights: updated });
  };

  const handleRemoveHighlight = (index: number) => {
    const updated = (spaceVibe.highlights || []).filter((_, i) => i !== index);
    onChangeSpaceVibe({ highlights: updated });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* 1. Header & Guidance */}
      <div className="border-b border-border-subtle pb-4 space-y-1">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent-warm" />
          <h2 className="text-base sm:text-lg font-bold text-text-primary">
            The Space &amp; Vibe Experience CMS
          </h2>
        </div>
        <p className="text-xs text-text-muted">
          Konfigurasi narasi editorial, kutipan filosofi, dan 3 foto Bento Collage terkompresi WebP otomatis (&lt;100KB) untuk bagian &ldquo;The Space&rdquo; di Beranda.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: BENTO COLLAGE 3-PHOTO SLOTS */}
      {/* ========================================================================= */}
      <div className="p-6 bg-canvas-secondary border border-border-subtle rounded-xl space-y-6">
        <div className="border-b border-border-subtle pb-4 space-y-0.5">
          <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-accent-warm" />
            <span>1. Visual Bento Collage (3 Showcase Photo Slots • WebP &lt;100KB)</span>
          </h3>
          <p className="text-xs text-text-muted">
            Slot 1 (Top Left Portrait), Slot 2 (Top Right Detail), dan Slot 3 (Bottom Wide Interior).
          </p>
        </div>

        {/* 3 Slots Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SLOT 1: Top Left (Vertical Nook) */}
          <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-3 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Slot 1: Nook / Portrait
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-canvas-secondary border border-border-subtle text-text-muted font-semibold">
                  4:5 WebP
                </span>
              </div>

              {/* Preview */}
              <div className="aspect-[4/5] w-full rounded-lg overflow-hidden border border-border-subtle bg-canvas-secondary relative group">
                {spaceVibe.image1Url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={previewImage1 || spaceVibe.image1Url}
                    alt="Slot 1 Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                    <ImageIcon className="w-6 h-6 opacity-40 mb-1" />
                    <span className="text-[10px]">Empty Slot</span>
                  </div>
                )}
                {spaceVibe.image1Url?.startsWith("indexeddb:") && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-charcoal/80 text-white backdrop-blur-xs">
                    IndexedDB HD
                  </div>
                )}
                {spaceVibe.image1Url?.startsWith("data:") && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-charcoal/80 text-white backdrop-blur-xs">
                    {formatDataUrlSize(spaceVibe.image1Url)}
                  </div>
                )}
              </div>

              <input
                ref={fileInput1Ref}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFileUpload(e, 1)}
                className="hidden"
              />

              {uploadError1 && (
                <div className="p-2 bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] rounded text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{uploadError1}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInput1Ref.current?.click()}
                disabled={compressingSlot === 1}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-canvas-secondary border border-border-subtle rounded-md hover:bg-[#EFEFEA] transition-colors cursor-pointer disabled:opacity-50"
              >
                {compressingSlot === 1 ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Compressing WebP...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5 text-accent-warm" />
                    <span>Upload &amp; Kompresi WebP</span>
                  </>
                )}
              </button>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-text-muted block">
                  Atau Direct Image URL
                </label>
                <input
                  type="url"
                  value={spaceVibe.image1Url}
                  onChange={(e) =>
                    onChangeSpaceVibe({ image1Url: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-2.5 py-1.5 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="pt-2 border-t border-border-subtle space-y-1">
              <span className="text-[10px] text-text-muted block">Sampel Foto:</span>
              <div className="flex flex-wrap gap-1">
                {PRESET_SLOT1_PHOTOS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => onChangeSpaceVibe({ image1Url: p.url })}
                    className="px-1.5 py-0.5 text-[10px] rounded bg-canvas-secondary border border-border-subtle text-text-primary hover:bg-[#EFEFEA] transition-colors cursor-pointer"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SLOT 2: Top Right (Detail Cup / Barista) */}
          <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-3 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Slot 2: Detail Cup / Barista
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-canvas-secondary border border-border-subtle text-text-muted font-semibold">
                  4:5 WebP
                </span>
              </div>

              {/* Preview */}
              <div className="aspect-[4/5] w-full rounded-lg overflow-hidden border border-border-subtle bg-canvas-secondary relative group">
                {spaceVibe.image2Url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={previewImage2 || spaceVibe.image2Url}
                    alt="Slot 2 Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                    <ImageIcon className="w-6 h-6 opacity-40 mb-1" />
                    <span className="text-[10px]">Empty Slot</span>
                  </div>
                )}
                {spaceVibe.image2Url?.startsWith("indexeddb:") && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-charcoal/80 text-white backdrop-blur-xs">
                    IndexedDB HD
                  </div>
                )}
                {spaceVibe.image2Url?.startsWith("data:") && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-charcoal/80 text-white backdrop-blur-xs">
                    {formatDataUrlSize(spaceVibe.image2Url)}
                  </div>
                )}
              </div>

              <input
                ref={fileInput2Ref}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFileUpload(e, 2)}
                className="hidden"
              />

              {uploadError2 && (
                <div className="p-2 bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] rounded text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{uploadError2}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInput2Ref.current?.click()}
                disabled={compressingSlot === 2}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-canvas-secondary border border-border-subtle rounded-md hover:bg-[#EFEFEA] transition-colors cursor-pointer disabled:opacity-50"
              >
                {compressingSlot === 2 ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Compressing WebP...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5 text-accent-warm" />
                    <span>Upload &amp; Kompresi WebP</span>
                  </>
                )}
              </button>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-text-muted block">
                  Atau Direct Image URL
                </label>
                <input
                  type="url"
                  value={spaceVibe.image2Url}
                  onChange={(e) =>
                    onChangeSpaceVibe({ image2Url: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-2.5 py-1.5 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="pt-2 border-t border-border-subtle space-y-1">
              <span className="text-[10px] text-text-muted block">Sampel Foto:</span>
              <div className="flex flex-wrap gap-1">
                {PRESET_SLOT2_PHOTOS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => onChangeSpaceVibe({ image2Url: p.url })}
                    className="px-1.5 py-0.5 text-[10px] rounded bg-canvas-secondary border border-border-subtle text-text-primary hover:bg-[#EFEFEA] transition-colors cursor-pointer"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SLOT 3: Bottom Wide (Interior Atmosphere) */}
          <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-3 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Slot 3: Wide Atmosphere
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-canvas-secondary border border-border-subtle text-text-muted font-semibold">
                  16:9 WebP
                </span>
              </div>

              {/* Preview */}
              <div className="aspect-[4/5] lg:aspect-[4/5] w-full rounded-lg overflow-hidden border border-border-subtle bg-canvas-secondary relative group">
                {spaceVibe.image3Url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={previewImage3 || spaceVibe.image3Url}
                    alt="Slot 3 Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                    <ImageIcon className="w-6 h-6 opacity-40 mb-1" />
                    <span className="text-[10px]">Empty Slot</span>
                  </div>
                )}
                {spaceVibe.image3Url?.startsWith("indexeddb:") && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-charcoal/80 text-white backdrop-blur-xs">
                    IndexedDB HD
                  </div>
                )}
                {spaceVibe.image3Url?.startsWith("data:") && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-charcoal/80 text-white backdrop-blur-xs">
                    {formatDataUrlSize(spaceVibe.image3Url)}
                  </div>
                )}
              </div>

              <input
                ref={fileInput3Ref}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFileUpload(e, 3)}
                className="hidden"
              />

              {uploadError3 && (
                <div className="p-2 bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] rounded text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{uploadError3}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInput3Ref.current?.click()}
                disabled={compressingSlot === 3}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-canvas-secondary border border-border-subtle rounded-md hover:bg-[#EFEFEA] transition-colors cursor-pointer disabled:opacity-50"
              >
                {compressingSlot === 3 ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Compressing WebP...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5 text-accent-warm" />
                    <span>Upload &amp; Kompresi WebP</span>
                  </>
                )}
              </button>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-text-muted block">
                  Atau Direct Image URL
                </label>
                <input
                  type="url"
                  value={spaceVibe.image3Url}
                  onChange={(e) =>
                    onChangeSpaceVibe({ image3Url: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-2.5 py-1.5 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="pt-2 border-t border-border-subtle space-y-1">
              <span className="text-[10px] text-text-muted block">Sampel Foto:</span>
              <div className="flex flex-wrap gap-1">
                {PRESET_SLOT3_PHOTOS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => onChangeSpaceVibe({ image3Url: p.url })}
                    className="px-1.5 py-0.5 text-[10px] rounded bg-canvas-secondary border border-border-subtle text-text-primary hover:bg-[#EFEFEA] transition-colors cursor-pointer"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: EDITORIAL STORYTELLING & PULL-QUOTE */}
      {/* ========================================================================= */}
      <div className="p-6 bg-canvas-secondary border border-border-subtle rounded-xl space-y-6">
        <div className="border-b border-border-subtle pb-4 space-y-0.5">
          <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
            <Quote className="w-4 h-4 text-accent-warm" />
            <span>2. Editorial Storytelling, Philosophy Quote &amp; Highlights</span>
          </h3>
          <p className="text-xs text-text-muted">
            Konfigurasi narasi copy kolom kiri, pull-quote dengan aksen vertikal, dan poin fasilitas unggulan.
          </p>
        </div>

        <div className="space-y-4">
          {/* Eyebrow Badge & Headline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-1">
              <label className="font-semibold text-xs text-text-primary block">
                Section Badge
              </label>
              <input
                type="text"
                value={spaceVibe.badgeText}
                onChange={(e) =>
                  onChangeSpaceVibe({ badgeText: e.target.value })
                }
                placeholder="THE VIBE & ARCHITECTURE"
                className="w-full px-3 py-2 text-xs bg-canvas-primary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal uppercase tracking-wider"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-semibold text-xs text-text-primary block">
                Section Headline <span className="text-[#8C3426]">*</span>
              </label>
              <input
                type="text"
                required
                value={spaceVibe.headline}
                onChange={(e) =>
                  onChangeSpaceVibe({ headline: e.target.value })
                }
                placeholder="A Sanctuary Designed for Unhurried Moments & Quiet Focus."
                className="w-full px-3 py-2 text-xs bg-canvas-primary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-sans font-bold text-sm"
              />
            </div>
          </div>

          {/* 2 Story Paragraphs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-xs text-text-primary block">
                Story Paragraph 1
              </label>
              <textarea
                rows={4}
                value={spaceVibe.storyParagraph1}
                onChange={(e) =>
                  onChangeSpaceVibe({ storyParagraph1: e.target.value })
                }
                placeholder="Hadir sebagai destinasi specialty coffee dan casual dining di Pekalongan..."
                className="w-full px-3 py-2 text-xs bg-canvas-primary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-xs text-text-primary block">
                Story Paragraph 2
              </label>
              <textarea
                rows={4}
                value={spaceVibe.storyParagraph2}
                onChange={(e) =>
                  onChangeSpaceVibe({ storyParagraph2: e.target.value })
                }
                placeholder="Setiap sudut dirancang memadukan material kayu oak hangat..."
                className="w-full px-3 py-2 text-xs bg-canvas-primary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal leading-relaxed"
              />
            </div>
          </div>

          {/* Pull Quote Box */}
          <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-primary block">
              Philosophy Pull-Quote &amp; Attribution
            </span>
            <div className="space-y-2">
              <textarea
                rows={2}
                value={spaceVibe.quoteText}
                onChange={(e) =>
                  onChangeSpaceVibe({ quoteText: e.target.value })
                }
                placeholder="Kami tidak terburu-buru dalam menyeduh. Kami tidak terburu-buru menikmati momen."
                className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-sans font-medium text-sm"
              />
              <input
                type="text"
                value={spaceVibe.quoteAuthor}
                onChange={(e) =>
                  onChangeSpaceVibe({ quoteAuthor: e.target.value })
                }
                placeholder="FOUNDER, COFFEE AND BEYOND"
                className="w-full px-3 py-1.5 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-mono uppercase text-[11px]"
              />
            </div>
          </div>

          {/* Highlights List Editor */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Sub-Highlights (3 Poin Utama)
              </span>
              <button
                type="button"
                onClick={handleAddHighlight}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-canvas-primary border border-border-subtle rounded hover:bg-[#EFEFEA] transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3 text-accent-warm" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {spaceVibe.highlights?.map((hl, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-canvas-primary border border-border-subtle rounded-lg flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-warm mt-3 shrink-0" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                    <input
                      type="text"
                      value={hl.label}
                      onChange={(e) =>
                        handleUpdateHighlight(idx, "label", e.target.value)
                      }
                      placeholder="LABEL"
                      className="px-2.5 py-1.5 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-bold uppercase"
                    />
                    <input
                      type="text"
                      value={hl.description}
                      onChange={(e) =>
                        handleUpdateHighlight(idx, "description", e.target.value)
                      }
                      placeholder="Short description..."
                      className="sm:col-span-2 px-2.5 py-1.5 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(idx)}
                    aria-label="Remove highlight"
                    className="p-1.5 text-[#8C3426] hover:bg-[#FDF6F5] rounded transition-colors cursor-pointer shrink-0 mt-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
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
            <span>The Space Section Live Simulation Preview</span>
          </label>
          <span className="text-[11px] text-text-muted">Real-time render</span>
        </div>

        <div className="border border-border-subtle rounded-xl overflow-hidden bg-canvas-primary shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Preview */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase font-semibold tracking-wider text-[#777772]">
                <span className="w-4 h-[1px] bg-accent-warm" />
                <span>{spaceVibe.badgeText || "THE VIBE & ARCHITECTURE"}</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-sans font-bold text-[#1E1E1C] leading-snug">
                {spaceVibe.headline ||
                  "A Sanctuary Designed for Unhurried Moments & Quiet Focus."}
              </h4>

              <div className="text-xs text-[#777772] space-y-2 leading-relaxed line-clamp-3">
                <p>{spaceVibe.storyParagraph1}</p>
              </div>

              {/* Quote */}
              <div className="border-l-2 border-[#1E1E1C] pl-3 py-2 bg-[#F7F7F5]/80 rounded-r">
                <p className="font-sans font-medium text-xs sm:text-sm text-[#1E1E1C] leading-relaxed">
                  &ldquo;{spaceVibe.quoteText}&rdquo;
                </p>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#777772] mt-1 block">
                  — {spaceVibe.quoteAuthor}
                </span>
              </div>

              {/* Highlights */}
              {spaceVibe.highlights && spaceVibe.highlights.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-border-subtle">
                  {spaceVibe.highlights.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px]">
                      <span className="w-1 h-1 rounded-full bg-accent-warm" />
                      <span className="font-bold text-[#1E1E1C] uppercase text-[10px]">
                        {item.label}:
                      </span>
                      <span className="text-[#777772] text-[10px] truncate">
                        {item.description}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Preview (Bento Collage) */}
            <div className="lg:col-span-6 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-[4/5] rounded-lg overflow-hidden border border-[#E7E7E3] bg-canvas-secondary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewImage1 || spaceVibe.image1Url}
                    alt="Preview 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/5] rounded-lg overflow-hidden border border-[#E7E7E3] bg-canvas-secondary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewImage2 || spaceVibe.image2Url}
                    alt="Preview 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="aspect-video sm:aspect-[21/9] rounded-lg overflow-hidden border border-[#E7E7E3] bg-canvas-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewImage3 || spaceVibe.image3Url}
                  alt="Preview 3"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpaceSettingsTab;
