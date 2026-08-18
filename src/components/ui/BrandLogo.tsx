"use client";

import React, { useState } from "react";
import { useSettingsStore } from "@/lib/settings-store";
import { useMediaUrl } from "@/lib/use-media";

export interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  monochrome?: boolean;
  showText?: boolean;
  logoUrl?: string;
  altText?: string;
  textColor?: string;
}

export function BrandLogo({
  className = "",
  size = "sm",
  monochrome = false,
  showText = true,
  logoUrl,
  altText,
  textColor,
}: BrandLogoProps) {
  const { settings } = useSettingsStore();
  const [iconError, setIconError] = useState(false);

  const rawLogoUrl = logoUrl ?? settings.branding?.logoSvgUrl ?? "/logo.svg";
  const finalLogoUrl = useMediaUrl(rawLogoUrl, "/logo.svg");

  const finalAltText =
    altText ?? settings.branding?.altText ?? "Coffee And Beyond";

  // Sizing definitions:
  // sm (Navbar & Admin): Icon w-9 h-9 sm:w-10 sm:h-10, Text 11px-12px leading-[0.84]
  // md (Footer): Icon w-11 h-11 sm:w-12 sm:h-12, Text 13px-14px leading-[0.84]
  // lg (Display/Preview): Icon w-14 h-14, Text 16px-18px leading-[0.84]
  const sizeConfig = {
    sm: {
      container: "gap-2.5",
      icon: "w-9 h-9 sm:w-10 sm:h-10 object-contain shrink-0",
      text: "text-[11px] sm:text-[12px] font-sans font-black uppercase tracking-tight leading-[0.84]",
      iconFallbackSize: "w-9 h-9 sm:w-10 sm:h-10 p-1.5",
    },
    md: {
      container: "gap-3",
      icon: "w-11 h-11 sm:w-12 sm:h-12 object-contain shrink-0",
      text: "text-[13px] sm:text-[14px] font-sans font-black uppercase tracking-tight leading-[0.84]",
      iconFallbackSize: "w-11 h-11 sm:w-12 sm:h-12 p-2",
    },
    lg: {
      container: "gap-3.5",
      icon: "w-14 h-14 object-contain shrink-0",
      text: "text-[16px] sm:text-[18px] font-sans font-black uppercase tracking-tight leading-[0.84]",
      iconFallbackSize: "w-14 h-14 p-2.5",
    },
  }[size];

  const monochromeFilter = monochrome ? "grayscale contrast-125" : "";
  const resolvedTextColor =
    textColor ?? (monochrome ? "text-white" : "text-[#1E1E1C]");

  return (
    <div
      className={`inline-flex items-center select-none ${sizeConfig.container} ${className}`}
    >
      {/* 1. Sisi Kiri: Icon Mark (logo.svg) */}
      {!iconError && finalLogoUrl ? (
        <img
          src={finalLogoUrl}
          alt={`${finalAltText} Icon Mark`}
          className={`${sizeConfig.icon} ${monochromeFilter} transition-transform`}
          onError={() => setIconError(true)}
          loading="eager"
          decoding="async"
        />
      ) : (
        /* Fallback Minimalist Coffee Cup SVG Icon */
        <div
          className={`flex items-center justify-center rounded-lg bg-[#1E1E1C] text-white shrink-0 ${sizeConfig.iconFallbackSize}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full"
          >
            <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="10" y1="1" x2="10" y2="4" />
            <line x1="14" y1="1" x2="14" y2="4" />
          </svg>
        </div>
      )}

      {/* 2. Sisi Kanan: Stacked Brand Typography (COFFEE / AND / BEYOND) */}
      {showText && (
        <div
          className={`flex flex-col justify-center select-none text-left ${resolvedTextColor} ${sizeConfig.text}`}
          aria-label={finalAltText}
        >
          <span>COFFEE</span>
          <span>AND</span>
          <span>BEYOND</span>
        </div>
      )}
    </div>
  );
}

export default BrandLogo;
