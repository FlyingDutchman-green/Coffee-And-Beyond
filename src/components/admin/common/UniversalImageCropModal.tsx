"use client";

import React, { useState, useCallback, useEffect } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { getCroppedImgUniversal } from "@/lib/image-utils";
import {
  Crop,
  X,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Loader2,
  AlertCircle,
} from "lucide-react";

export interface UniversalImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  aspectRatio: number; // e.g. 4/5 (0.8), 16/9 (1.777), 1/1 (1.0), 4/3 (1.333)
  cropShape?: "rect" | "round";
  title?: string;
  subtitle?: string;
  onCropComplete: (croppedBlob: Blob, croppedDataUrl: string) => void;
  onCancel: () => void;
}

/**
 * Returns a human-friendly aspect ratio label.
 */
function getRatioLabel(ratio: number): string {
  const eps = 0.05;
  if (Math.abs(ratio - 4 / 5) < eps || Math.abs(ratio - 0.8) < eps) return "4:5 Portrait";
  if (Math.abs(ratio - 16 / 9) < eps || Math.abs(ratio - 1.777) < eps) return "16:9 Widescreen";
  if (Math.abs(ratio - 1) < eps) return "1:1 Square";
  if (Math.abs(ratio - 4 / 3) < eps || Math.abs(ratio - 1.333) < eps) return "4:3 Standard";
  if (Math.abs(ratio - 21 / 9) < eps || Math.abs(ratio - 2.333) < eps) return "21:9 Ultrawide";
  return `${ratio.toFixed(2)}:1`;
}

export function UniversalImageCropModal({
  isOpen,
  imageSrc,
  aspectRatio,
  cropShape = "rect",
  title = "Sesuaikan & Potong Foto",
  subtitle,
  onCropComplete,
  onCancel,
}: UniversalImageCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset internal states when opened with a new image or aspect ratio
  useEffect(() => {
    if (isOpen) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setIsProcessing(false);
      setErrorMessage(null);
    }
  }, [isOpen, imageSrc, aspectRatio]);

  // Handle keyboard shortcuts (Escape to cancel)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isProcessing, onCancel]);

  const onCropChange = useCallback((newCrop: Point) => {
    setCrop(newCrop);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleCropComplete = useCallback(
    (_croppedArea: Area, pixelCrop: Area) => {
      setCroppedAreaPixels(pixelCrop);
    },
    []
  );

  const handleApplyCrop = async () => {
    if (!croppedAreaPixels || !imageSrc) {
      setErrorMessage("Pilih area crop terlebih dahulu sebelum menyimpan.");
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      // Perform canvas crop and WebP compression
      const { dataUrl, blob } = await getCroppedImgUniversal(
        imageSrc,
        croppedAreaPixels,
        aspectRatio,
        0,
        1200,
        0.85
      );

      onCropComplete(blob, dataUrl);
    } catch (err) {
      console.error("Universal Cropper Error:", err);
      setErrorMessage(
        "Gagal memotong gambar. Pastikan format file didukung (JPG/PNG/WebP)."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const ratioLabel = getRatioLabel(aspectRatio);
  const defaultSubtitle = `Framing ${ratioLabel} • Kompresi WebP otomatis (<100KB)`;

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      onClick={() => {
        if (!isProcessing) onCancel();
      }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-charcoal/80 backdrop-blur-xs transition-opacity duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="universal-crop-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-canvas-primary border border-border-subtle rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border-subtle flex items-center justify-between bg-canvas-primary">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-canvas-secondary border border-border-subtle text-text-primary shrink-0">
              <Crop className="w-4 h-4 text-accent-warm" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  id="universal-crop-modal-title"
                  className="font-bold text-sm sm:text-base text-text-primary tracking-tight"
                >
                  {title}
                </h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-canvas-secondary border border-border-subtle text-text-primary">
                  {ratioLabel}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {subtitle || defaultSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            aria-label="Tutup pemotong foto"
            className="p-1.5 text-text-muted hover:text-text-primary rounded-md border border-border-subtle hover:bg-canvas-secondary cursor-pointer transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div className="mx-4 mt-4 p-3 bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] rounded-md text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Interactive Cropper Canvas */}
        <div className="relative w-full h-[320px] sm:h-[400px] bg-[#121212] overflow-hidden select-none">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            cropShape={cropShape}
            showGrid={true}
            minZoom={1}
            maxZoom={3}
            zoomSpeed={0.1}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={handleCropComplete}
            classes={{
              containerClassName: "relative w-full h-full",
              cropAreaClassName:
                "border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] rounded-xs",
            }}
          />
        </div>

        {/* Zoom Controls Bar */}
        <div className="p-4 bg-canvas-secondary/80 border-t border-border-subtle space-y-2.5">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-semibold text-text-primary flex items-center gap-1.5">
              <span>Zoom &amp; Skala Fokus</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs tabular-nums text-text-primary font-bold">
                {zoom.toFixed(2)}x ({Math.round(zoom * 100)}%)
              </span>
              {zoom > 1 && (
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  disabled={isProcessing}
                  title="Reset zoom ke 1x"
                  className="text-[10px] text-text-muted hover:text-text-primary underline cursor-pointer"
                >
                  Reset 1x
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setZoom((prev) => Math.max(1, +(prev - 0.15).toFixed(2)))
              }
              disabled={zoom <= 1 || isProcessing}
              aria-label="Perkecil zoom"
              className="p-1.5 rounded-md bg-canvas-primary border border-border-subtle text-text-muted hover:text-text-primary disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.05}
              aria-label="Slider zoom foto"
              onChange={(e) => setZoom(Number(e.target.value))}
              disabled={isProcessing}
              className="flex-1 h-2 bg-[#E2E2DC] rounded-lg appearance-none cursor-pointer accent-charcoal"
            />

            <button
              type="button"
              onClick={() =>
                setZoom((prev) => Math.min(3, +(prev + 0.15).toFixed(2)))
              }
              disabled={zoom >= 3 || isProcessing}
              aria-label="Perbesar zoom"
              className="p-1.5 rounded-md bg-canvas-primary border border-border-subtle text-text-muted hover:text-text-primary disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-border-subtle bg-canvas-primary flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-text-muted text-center sm:text-left">
            Geser foto untuk menyesuaikan posisi • Scroll / slider untuk zoom
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium text-text-primary bg-canvas-secondary border border-border-subtle rounded-lg hover:bg-[#EFEFEA] transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={isProcessing || !croppedAreaPixels}
              className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-white bg-charcoal rounded-lg hover:bg-[#2C2C28] flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengompresi WebP...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-accent-warm" />
                  <span>Terapkan &amp; Simpan Foto</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UniversalImageCropModal;
