"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import {
  validateImageFile,
  readFileAsDataURL,
  getCroppedImg16x9,
} from "@/lib/image-utils";
import { saveImageDataUrl, resolveMediaUrl } from "@/lib/media-storage";
import { useMediaUrl } from "@/lib/use-media";
import {
  UploadCloud,
  Image as ImageIcon,
  Crop,
  Check,
  X,
  Trash2,
  ZoomIn,
  ZoomOut,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface SpaceImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export function SpaceImageUpload({
  value,
  onChange,
  label = "Facility 16:9 Showcase Image",
}: SpaceImageUploadProps) {
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reactively resolve IndexedDB object URL or data URL
  const resolvedPreview = useMediaUrl(value, "");

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setValidationError(validation.error || "Invalid image file");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      const dataUrl = await readFileAsDataURL(file);
      setSelectedImageSrc(dataUrl);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setIsCropModalOpen(true);
    } catch (err) {
      console.error("Failed to read image:", err);
      setValidationError("Failed to read image file. Please try again.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCropComplete = useCallback(
    (_croppedArea: Area, pixelCrop: Area) => {
      setCroppedAreaPixels(pixelCrop);
    },
    []
  );

  const handleApplyCrop = async () => {
    if (!croppedAreaPixels || !selectedImageSrc) return;
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg16x9(
        selectedImageSrc,
        croppedAreaPixels,
        0
      );
      const key = `space_facility_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const pointer = await saveImageDataUrl(key, croppedImage);
      onChange(pointer);
      setIsCropModalOpen(false);
      setSelectedImageSrc(null);
    } catch (err) {
      console.error("Failed to crop image:", err);
      setValidationError("Failed to crop image. Please try another file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    setValidationError(null);
  };

  // Keyboard escape for modal
  useEffect(() => {
    if (!isCropModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) {
        setIsCropModalOpen(false);
        setSelectedImageSrc(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCropModalOpen, isProcessing]);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-text-primary">
        {label}
      </label>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Notice */}
      {validationError && (
        <div className="p-2.5 bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] rounded-md text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Image Preview or Drop Trigger */}
      {value ? (
        <div className="space-y-2">
          <div className="relative w-full aspect-video rounded-md overflow-hidden border border-border-subtle bg-canvas-secondary group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolvedPreview || value}
              alt="Facility preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-charcoal/80 text-white backdrop-blur-xs font-semibold">
                16:9 WebP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-primary bg-canvas-secondary border border-border-subtle rounded-md hover:bg-[#EFEFEA] hover:border-[#D0D0CA] transition-colors cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-accent-warm" />
              <span>Replace Photo</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-[#8C3426] bg-[#FDF6F5] border border-[#ECCEC9] rounded-md hover:bg-[#FCEEED] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-video rounded-md border border-dashed border-border-subtle hover:border-[#A69B8C] bg-canvas-secondary hover:bg-[#F2F2EE] transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-md bg-canvas-primary border border-border-subtle flex items-center justify-center text-text-muted group-hover:text-text-primary mb-2 shadow-xs transition-colors">
            <UploadCloud className="w-5 h-5 text-accent-warm" />
          </div>
          <p className="text-xs font-medium text-text-primary">
            Upload 16:9 Facility Photo
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">
            JPG, PNG, or WebP up to 5MB (Cropped 16:9)
          </p>
        </div>
      )}

      {/* 16:9 Crop Modal */}
      {isCropModalOpen && selectedImageSrc && (
        <div
          onClick={() => {
            if (!isProcessing) {
              setIsCropModalOpen(false);
              setSelectedImageSrc(null);
            }
          }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs transition-opacity duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-canvas-primary border border-border-subtle rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border-subtle flex items-center justify-between bg-canvas-primary">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-canvas-secondary border border-border-subtle text-text-primary">
                  <Crop className="w-4 h-4 text-accent-warm" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary">
                    Crop Facility Photo (16:9)
                  </h3>
                  <p className="text-xs text-text-muted">
                    Adjust zoom and framing for widescreen showcase display
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isProcessing) {
                    setIsCropModalOpen(false);
                    setSelectedImageSrc(null);
                  }
                }}
                disabled={isProcessing}
                className="p-1.5 text-text-muted hover:text-text-primary rounded-md border border-border-subtle cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cropper Viewport (Locked 16:9 aspect) */}
            <div className="relative w-full h-72 sm:h-80 bg-charcoal">
              <Cropper
                image={selectedImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                showGrid={true}
              />
            </div>

            {/* Controls Bar */}
            <div className="p-4 sm:p-5 bg-canvas-secondary border-t border-border-subtle space-y-4">
              <div className="flex items-center gap-3">
                <ZoomOut className="w-4 h-4 text-text-muted shrink-0" />
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
                <ZoomIn className="w-4 h-4 text-text-muted shrink-0" />
                <span className="font-mono text-xs font-semibold text-text-primary w-10 text-right tabular-nums">
                  {zoom.toFixed(1)}x
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCropModalOpen(false);
                    setSelectedImageSrc(null);
                  }}
                  disabled={isProcessing}
                  className="px-4 py-2 text-xs font-medium text-text-muted hover:text-text-primary bg-canvas-primary border border-border-subtle rounded-md hover:bg-[#EFEFEA] transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCrop}
                  disabled={isProcessing || !croppedAreaPixels}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-charcoal rounded-md hover:bg-[#2C2C28] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Optimizing WebP...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save 16:9 Image</span>
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
