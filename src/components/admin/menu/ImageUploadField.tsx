"use client";

import React, { useState, useRef } from "react";
import {
  validateImageFile,
  readFileAsDataURL,
} from "@/lib/image-utils";
import { saveImageDataUrl, resolveMediaUrl } from "@/lib/media-storage";
import { useMediaUrl } from "@/lib/use-media";
import { ImageCropModal } from "@/components/admin/menu/ImageCropModal";
import {
  Upload,
  Crop,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface ImageUploadFieldProps {
  value?: string;
  onChange: (imageUrl?: string) => void;
  label?: string;
}

export function ImageUploadField({
  value,
  onChange,
  label = "Product Photo (4:3 Ratio)",
}: ImageUploadFieldProps) {
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reactively resolve IndexedDB object URL or data URL
  const resolvedPreview = useMediaUrl(value, "");

  const processFile = async (file: File) => {
    setErrorMessage(null);
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setErrorMessage(validation.error || "Invalid file selected.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      const dataUrl = await readFileAsDataURL(file);
      setRawImageSrc(dataUrl);
      setIsCropModalOpen(true);
    } catch (err) {
      console.error("Error reading uploaded file:", err);
      setErrorMessage("Failed to read image file. Please try another image.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleCropComplete = async (croppedDataUrl: string) => {
    try {
      const imgKey = `menu_img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const pointer = await saveImageDataUrl(imgKey, croppedDataUrl);
      onChange(pointer);
    } catch (err) {
      console.warn("Failed to persist to IndexedDB, fallback to data URL:", err);
      onChange(croppedDataUrl);
    }
    setRawImageSrc(null);
    setIsCropModalOpen(false);
  };

  const handleCloseCropModal = () => {
    setIsCropModalOpen(false);
    setRawImageSrc(null);
  };

  const handleAdjustExisting = async () => {
    if (value) {
      try {
        const resolved = await resolveMediaUrl(value);
        setRawImageSrc(resolved || value);
      } catch {
        setRawImageSrc(value);
      }
      setIsCropModalOpen(true);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-text-primary text-xs flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-accent-warm" />
          <span>{label}</span>
        </label>
        <span className="text-[10px] text-text-muted">
          JPG, PNG, WebP • Max 5MB
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Upload product photo"
      />

      {/* Error Message */}
      {errorMessage && (
        <div className="p-2.5 bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] rounded-md text-xs flex items-start gap-2 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-[#8C3426] hover:underline font-bold text-xs"
          >
            &times;
          </button>
        </div>
      )}

      {/* Filled State: 4:3 Preview with Controls */}
      {value ? (
        <div className="relative group border border-border-subtle rounded-md overflow-hidden bg-canvas-secondary">
          <div className="w-full aspect-4/3 relative flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolvedPreview || value}
              alt="Product preview"
              className="w-full h-full object-cover select-none"
            />

            {/* Top info badge */}
            <div className="absolute top-2 left-2 z-10">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-charcoal/80 text-white backdrop-blur-xs shadow-xs">
                4:3 Cropped
              </span>
            </div>

            {/* Hover overlay action bar */}
            <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
              <button
                type="button"
                onClick={handleAdjustExisting}
                className="px-3 py-1.5 bg-canvas-primary text-text-primary rounded-md text-xs font-semibold hover:bg-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Crop className="w-3.5 h-3.5" />
                <span>Adjust Crop</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-canvas-primary text-text-primary rounded-md text-xs font-semibold hover:bg-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Change</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 bg-[#8C3426] text-white rounded-md text-xs font-semibold hover:bg-[#732B20] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          {/* Bottom inline bar */}
          <div className="p-2 bg-canvas-primary border-t border-border-subtle flex items-center justify-between text-xs">
            <span className="text-text-muted text-[11px]">
              Ready to display on public menu cards
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAdjustExisting}
                className="text-[11px] font-medium text-text-primary hover:underline"
              >
                Adjust
              </button>
              <span className="text-border-subtle">•</span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-[11px] font-medium text-[#8C3426] hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State Dropzone */
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full p-6 border-dashed border rounded-md cursor-pointer transition-all duration-150 flex flex-col items-center justify-center text-center gap-2 ${
            isDragging
              ? "bg-[#EFEFEA] border-charcoal"
              : "bg-[#F7F7F5] border-[#E7E7E3] hover:border-[#C8C8C2] hover:bg-[#F2F2EE]"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-canvas-primary border border-border-subtle flex items-center justify-center text-text-muted shadow-2xs">
            <Upload className="w-4 h-4 text-accent-warm" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-text-primary">
              Click to upload product photo
            </p>
            <p className="text-[11px] text-text-muted">
              JPG, PNG, WebP up to 5MB (Locked to 4:3 aspect ratio)
            </p>
          </div>
        </div>
      )}

      {/* Interactive Crop Modal */}
      {rawImageSrc && (
        <ImageCropModal
          imageSrc={rawImageSrc}
          isOpen={isCropModalOpen}
          onClose={handleCloseCropModal}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
