"use client";

import React, { useState, useCallback, useEffect } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { getCroppedImg } from "@/lib/image-utils";
import { X, Check, ZoomIn, ZoomOut, Crop, Loader2 } from "lucide-react";

interface ImageCropModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
}

export function ImageCropModal({
  imageSrc,
  isOpen,
  onClose,
  onCropComplete,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Reset state when opening a new image
  useEffect(() => {
    if (isOpen) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setIsProcessing(false);
    }
  }, [isOpen, imageSrc]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isProcessing]);

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
    if (!croppedAreaPixels || !imageSrc) return;
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      onCropComplete(croppedImage);
      onClose();
    } catch (err) {
      console.error("Failed to crop image:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      onClick={() => {
        if (!isProcessing) onClose();
      }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs transition-opacity duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-canvas-primary border border-border-subtle rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border-subtle flex items-center justify-between bg-canvas-primary">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-canvas-secondary border border-border-subtle text-text-primary">
              <Crop className="w-4 h-4 text-accent-warm" />
            </div>
            <div>
              <h3
                id="crop-modal-title"
                className="font-bold text-sm sm:text-base text-text-primary"
              >
                Crop Product Photography
              </h3>
              <p className="text-xs text-text-muted">
                Locked 4:3 ratio for menu cards &amp; ordering cards
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            aria-label="Close crop dialog"
            className="p-1.5 text-text-muted hover:text-text-primary rounded-md border border-border-subtle cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cropper Canvas Area */}
        <div className="relative w-full h-[320px] sm:h-[380px] bg-[#121212] overflow-hidden select-none">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            cropShape="rect"
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
                "border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] rounded-sm",
            }}
          />
        </div>

        {/* Zoom Controls Bar */}
        <div className="p-4 bg-canvas-secondary/70 border-t border-border-subtle space-y-2">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span className="font-medium text-text-primary">Zoom &amp; Scale</span>
            <span className="font-mono text-[11px] tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(1, +(prev - 0.2).toFixed(2)))}
              disabled={zoom <= 1 || isProcessing}
              aria-label="Zoom out"
              className="p-1.5 rounded bg-canvas-primary border border-border-subtle text-text-muted hover:text-text-primary disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.05}
              aria-label="Zoom slider"
              onChange={(e) => setZoom(Number(e.target.value))}
              disabled={isProcessing}
              className="flex-1 h-1.5 bg-[#E2E2DC] rounded-lg appearance-none cursor-pointer accent-[#1E1E1C]"
            />

            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(3, +(prev + 0.2).toFixed(2)))}
              disabled={zoom >= 3 || isProcessing}
              aria-label="Zoom in"
              className="p-1.5 rounded bg-canvas-primary border border-border-subtle text-text-muted hover:text-text-primary disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-border-subtle bg-canvas-primary flex items-center justify-between gap-3">
          <span className="text-[11px] text-text-muted hidden sm:inline-block">
            Drag to pan position • Scroll or slider to zoom
          </span>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary hover:bg-[#EFEFEA] font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={isProcessing}
              className="px-4 py-2 text-xs bg-[#1E1E1C] text-white rounded-md hover:bg-[#3A3A37] font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Crop</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCropModal;
