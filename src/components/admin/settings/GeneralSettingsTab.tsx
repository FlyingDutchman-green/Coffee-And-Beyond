"use client";

import React, { useRef, useState } from "react";
import { BrandingSettings } from "@/lib/settings-store";
import { BrandLogo } from "@/components/ui/BrandLogo";
import {
  Upload,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  Sparkles,
  Layers,
  Sun,
  Moon,
  Info,
  Type,
} from "lucide-react";

interface GeneralSettingsTabProps {
  branding: BrandingSettings;
  onChangeBranding: (partial: Partial<BrandingSettings>) => void;
}

export function GeneralSettingsTab({
  branding,
  onChangeBranding,
}: GeneralSettingsTabProps) {
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const [previewSize, setPreviewSize] = useState<"sm" | "md" | "lg">("sm");
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("svg") && !file.name.endsWith(".svg")) {
      setUploadStatus("Please upload a valid .svg vector file.");
      setTimeout(() => setUploadStatus(null), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onChangeBranding({ logoSvgUrl: dataUrl });
        setUploadStatus("Icon Mark (logo.svg) updated successfully!");
        setTimeout(() => setUploadStatus(null), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    onChangeBranding({ logoSvgUrl: "/logo.svg" });
    setUploadStatus("Icon Mark reset to default (/logo.svg).");
    setTimeout(() => setUploadStatus(null), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Informative Header Banner */}
      <div className="p-4 sm:p-5 rounded-lg bg-white border border-[#E7E7E3] shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-accent-warm">
          <Sparkles className="w-4 h-4" />
          <h3 className="text-sm font-bold text-[#1E1E1C] tracking-tight">
            Vector Icon Mark + Stacked CSS Typography Branding System
          </h3>
        </div>
        <p className="text-xs text-[#777772] leading-relaxed">
          Combines the <strong className="text-[#1E1E1C]">Icon Mark (logo.svg)</strong> with <strong className="text-[#1E1E1C]">3-line stacked CSS typography (COFFEE / AND / BEYOND)</strong> for crisp, scalable rendering across all viewports.
        </p>
      </div>

      {/* Upload Feedback Toast */}
      {uploadStatus && (
        <div className="p-3 bg-[#F5F8F3] border border-[#D3DEC8] text-[#3B5E2B] rounded-lg text-xs font-medium flex items-center gap-2 animate-in fade-in duration-150 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{uploadStatus}</span>
        </div>
      )}

      {/* 2-Column Asset Management & Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: Icon Mark (logo.svg) */}
        <div className="bg-white border border-[#E7E7E3] rounded-lg p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E7E7E3] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-[#F7F7F5] border border-[#E7E7E3] flex items-center justify-center text-accent-warm">
                <FileCode2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E1E1C]">
                  Icon Mark (Simbol Grafis Kafe)
                </h4>
                <p className="text-[11px] text-[#777772]">
                  Square SVG symbol mark (default: <code>/logo.svg</code>)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleResetLogo}
              className="text-[11px] text-[#777772] hover:text-[#1E1E1C] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Default</span>
            </button>
          </div>

          {/* Asset Preview Thumbnail */}
          <div className="p-4 rounded-md bg-[#F7F7F5] border border-[#E7E7E3] flex items-center justify-center min-h-[90px]">
            {branding.logoSvgUrl ? (
              <img
                src={branding.logoSvgUrl}
                alt="Icon Mark Preview"
                className="h-12 w-auto object-contain"
              />
            ) : (
              <div className="text-xs text-[#777772] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>No icon asset specified</span>
              </div>
            )}
          </div>

          {/* URL Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="logoSvgUrl"
              className="text-xs font-semibold text-[#1E1E1C]"
            >
              Vector URL or Path
            </label>
            <input
              id="logoSvgUrl"
              type="text"
              value={branding.logoSvgUrl}
              onChange={(e) => onChangeBranding({ logoSvgUrl: e.target.value })}
              placeholder="/logo.svg"
              className="w-full px-3 py-2 text-xs rounded-md border border-[#E7E7E3] bg-white focus:outline-none focus:ring-1 focus:ring-[#1E1E1C] font-mono text-[#1E1E1C]"
            />
          </div>

          {/* Upload Button */}
          <div>
            <input
              ref={logoFileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <button
              type="button"
              onClick={() => logoFileInputRef.current?.click()}
              className="w-full py-2.5 px-3 text-xs font-semibold text-[#1E1E1C] bg-[#F7F7F5] border border-[#E7E7E3] hover:bg-[#EFEFEA] rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom logo.svg</span>
            </button>
          </div>
        </div>

        {/* SECTION 2: Stacked Typography & Accessibility */}
        <div className="bg-white border border-[#E7E7E3] rounded-lg p-5 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-[#E7E7E3] pb-3">
            <div className="w-8 h-8 rounded-md bg-[#F7F7F5] border border-[#E7E7E3] flex items-center justify-center text-accent-warm">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1E1E1C]">
                3-Row Stacked Brand Typography
              </h4>
              <p className="text-[11px] text-[#777772]">
                Pure CSS text rendering (bold uppercase sans-serif)
              </p>
            </div>
          </div>

          {/* Typography Sample Card */}
          <div className="p-4 rounded-md bg-[#F7F7F5] border border-[#E7E7E3] flex flex-col justify-center items-center min-h-[90px]">
            <div className="flex flex-col text-left font-sans font-black uppercase text-[#1E1E1C] leading-[0.84] text-sm tracking-tight">
              <span>COFFEE</span>
              <span>AND</span>
              <span>BEYOND</span>
            </div>
          </div>

          {/* Alt Text / Brand Name Input */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-accent-warm" />
              <label
                htmlFor="brandAltText"
                className="text-xs font-semibold text-[#1E1E1C]"
              >
                Brand Name &amp; Accessibility Alt Text
              </label>
            </div>
            <input
              id="brandAltText"
              type="text"
              value={branding.altText || ""}
              onChange={(e) => onChangeBranding({ altText: e.target.value })}
              placeholder="Coffee And Beyond"
              className="w-full px-3 py-2 text-xs rounded-md border border-[#E7E7E3] bg-white focus:outline-none focus:ring-1 focus:ring-[#1E1E1C] font-medium text-[#1E1E1C]"
            />
            <p className="text-[11px] text-[#777772]">
              Used for SEO, screen readers, and HTML document meta labels.
            </p>
          </div>
        </div>
      </div>

      {/* LIVE SIMULATION CARDS SECTION */}
      <div className="bg-white border border-[#E7E7E3] rounded-lg p-6 space-y-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E7E3] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#F7F7F5] border border-[#E7E7E3] flex items-center justify-center text-accent-warm">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E1E1C]">
                Live Surface Simulation
              </h3>
              <p className="text-xs text-[#777772]">
                Real-time preview across light navbar, footer canvas, and dark backgrounds.
              </p>
            </div>
          </div>

          {/* Size Filter Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F7F7F5] border border-[#E7E7E3] rounded-md">
            {(["sm", "md", "lg"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPreviewSize(s)}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                  previewSize === s
                    ? "bg-[#1E1E1C] text-white shadow-2xs"
                    : "text-[#777772] hover:text-[#1E1E1C]"
                }`}
              >
                {s.toUpperCase()} ({s === "sm" ? "Navbar / Admin" : s === "md" ? "Footer" : "Display"})
              </button>
            ))}
          </div>
        </div>

        {/* 1. Public Navbar Simulation (Light Canvas) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#777772]">
            <div className="flex items-center gap-1.5 font-semibold text-[#1E1E1C]">
              <Sun className="w-3.5 h-3.5 text-accent-warm" />
              <span>Public Navbar Surface (Light Canvas)</span>
            </div>
            <span className="text-[11px] font-mono">bg-canvas-primary</span>
          </div>

          <div className="w-full bg-[#FAF9F5] border border-[#E7E7E3] rounded-lg p-4 flex items-center justify-between shadow-2xs">
            <BrandLogo
              size={previewSize}
              logoUrl={branding.logoSvgUrl}
              altText={branding.altText}
            />

            <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-[#777772]">
              <span>Home</span>
              <span>Menu</span>
              <span>About</span>
              <span className="px-3 py-1.5 rounded border border-[#E7E7E3] bg-white text-[#1E1E1C] text-[11px] font-semibold">
                Order at Table
              </span>
            </div>
          </div>
        </div>

        {/* 2. Public Footer Simulation (Warm Gray / #F7F7F5) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#777772]">
            <div className="flex items-center gap-1.5 font-semibold text-[#1E1E1C]">
              <Layers className="w-3.5 h-3.5 text-accent-warm" />
              <span>Public Footer Column 1 Surface (Off-White / #F7F7F5)</span>
            </div>
            <span className="text-[11px] font-mono">#F7F7F5</span>
          </div>

          <div className="w-full bg-[#F7F7F5] border border-[#E7E7E3] rounded-lg p-5 space-y-3">
            <BrandLogo
              size={previewSize === "sm" ? "md" : previewSize}
              logoUrl={branding.logoSvgUrl}
              altText={branding.altText}
            />
            <p className="text-xs text-[#777772] max-w-sm">
              &ldquo;Coffee and everything beyond it.&rdquo; A serene third space designed for thoughtful pauses, deep work, and specialty brews.
            </p>
          </div>
        </div>

        {/* 3. Dark Background Simulation (High Contrast / #1E1E1C) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#777772]">
            <div className="flex items-center gap-1.5 font-semibold text-[#1E1E1C]">
              <Moon className="w-3.5 h-3.5 text-accent-warm" />
              <span>Dark Theme Contrast Inspection</span>
            </div>
            <span className="text-[11px] font-mono">bg-charcoal (#1E1E1C)</span>
          </div>

          <div className="w-full bg-[#1E1E1C] border border-[#2D2D2A] rounded-lg p-5 flex items-center justify-between">
            <div className="bg-white/95 px-3 py-1.5 rounded-md border border-white/20">
              <BrandLogo
                size={previewSize}
                logoUrl={branding.logoSvgUrl}
                altText={branding.altText}
              />
            </div>
            <span className="text-xs font-mono text-[#A69B8C]">
              Crisp Vector Icon + Stacked CSS Typography
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
