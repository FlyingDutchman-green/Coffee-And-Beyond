"use client";

import React from "react";
import { UniversalImageCropModal } from "@/components/admin/common/UniversalImageCropModal";

export interface ImageCropModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
  aspectRatio?: number;
  title?: string;
  subtitle?: string;
}

export function ImageCropModal({
  imageSrc,
  isOpen,
  onClose,
  onCropComplete,
  aspectRatio = 4 / 3,
  title = "Crop Product Photography",
  subtitle = "Locked 4:3 ratio for menu cards & ordering cards",
}: ImageCropModalProps) {
  return (
    <UniversalImageCropModal
      isOpen={isOpen}
      imageSrc={imageSrc}
      aspectRatio={aspectRatio}
      title={title}
      subtitle={subtitle}
      onCropComplete={(_blob, dataUrl) => onCropComplete(dataUrl)}
      onCancel={onClose}
    />
  );
}

export default ImageCropModal;

