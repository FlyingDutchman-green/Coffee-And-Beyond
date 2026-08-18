"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ArticleShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share cancelled or unsupported
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error("Failed to copy link:", e);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="p-1.5 text-text-muted hover:text-text-primary hover:bg-canvas-primary rounded-md border border-border-subtle transition-colors flex items-center gap-1 text-xs px-2.5"
      aria-label="Bagikan artikel"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-accent-warm" />
          <span>Link Disalin</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          <span>Bagikan</span>
        </>
      )}
    </button>
  );
}
