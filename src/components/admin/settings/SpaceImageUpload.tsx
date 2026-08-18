"use client";

import React, { useState, useRef } from "react";
import { validateImageFile, readFileAsDataURL } from "@/lib/image-utils";
import { saveImageDataUrl } from "@/lib/media-storage";
import { useMediaUrl } from "@/lib/use-media";
import { UniversalImageCropModal } from "@/components/admin/common/UniversalImageCropModal";
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
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
      setIsCropModalOpen(true);
    } catch (err) {
      console.error("Failed to read image:", err);
      setValidationError("Failed to read image file. Please try again.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCropComplete = async (_blob: Blob, croppedDataUrl: string) => {
    try {
      const key = `space_facility_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const pointer = await saveImageDataUrl(key, croppedDataUrl);
      onChange(pointer);
      setIsCropModalOpen(false);
      setSelectedImageSrc(null);
    } catch (err) {
      console.error("Failed to save cropped facility image:", err);
      setValidationError("Failed to save image. Please try another file.");
    }
  };

  const handleRemove = () => {
    onChange("");
    setValidationError(null);
  };

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
            JPG, PNG, or WebP up to 10MB (Cropped 16:9)
          </p>
        </div>
      )}

      {/* 16:9 Universal Crop Modal */}
      <UniversalImageCropModal
        isOpen={isCropModalOpen}
        imageSrc={selectedImageSrc}
        aspectRatio={16 / 9}
        title="Sesuaikan Foto Fasilitas (16:9 Widescreen)"
        subtitle="Rasio lebar 16:9 untuk showcase fasilitas kafe"
        onCropComplete={handleCropComplete}
        onCancel={() => {
          setIsCropModalOpen(false);
          setSelectedImageSrc(null);
        }}
      />
    </div>
  );
}
