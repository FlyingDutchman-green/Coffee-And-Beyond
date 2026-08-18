"use client";

import React, { useState, useEffect } from "react";
import { Product, Category } from "@/types/menu";
import { ImageUploadField } from "@/components/admin/menu/ImageUploadField";
import { X, Check, Coffee, AlertCircle } from "lucide-react";

interface ProductEditModalProps {
  product: Product | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (productId: string, updatedData: Partial<Product>) => void;
}

export function ProductEditModal({
  product,
  categories,
  isOpen,
  onClose,
  onSave,
}: ProductEditModalProps) {
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [servingTemperature, setServingTemperature] = useState<string>("Hot / Iced");
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategoryId(product.categoryId || product.categorySlug || "signature-coffee");
      setPrice(product.price.toString());
      setDescription(product.description || "");
      setImageUrl(product.imageUrl || undefined);
      setServingTemperature(product.servingTemperature || "Hot / Iced");
      setIsAvailable(product.isAvailable);
      setIsFeatured(product.isFeatured || false);
      setError(null);
    }
  }, [product]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseInt(price.replace(/\D/g, ""), 10);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError("Please enter a valid price in IDR.");
      return;
    }

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }

    const selectedCat = categories.find((c) => c.id === categoryId || c.slug === categoryId);

    onSave(product.id, {
      name: name.trim(),
      categoryId: selectedCat?.id || categoryId,
      categorySlug: selectedCat?.slug || categoryId,
      categoryName: selectedCat?.name || "General",
      price: numPrice,
      description: description.trim(),
      imageUrl: imageUrl || undefined,
      servingTemperature: servingTemperature as "Hot" | "Iced" | "Hot / Iced",
      isAvailable,
      isFeatured,
    });

    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs transition-opacity duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-canvas-primary border border-border-subtle rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-canvas-secondary border border-border-subtle text-text-primary">
              <Coffee className="w-4 h-4 text-accent-warm" />
            </div>
            <div>
              <h3 className="font-bold text-base text-text-primary">
                Edit Offering: {product.name}
              </h3>
              <p className="text-xs font-mono text-text-muted">
                #{product.id.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-text-muted hover:text-text-primary rounded-md border border-border-subtle cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Product Photography Upload & 4:3 Cropper */}
          <ImageUploadField
            value={imageUrl}
            onChange={setImageUrl}
            label="Product Photography (4:3 Ratio)"
          />

          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-text-primary block">
                Item Name <span className="text-[#8C3426]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-text-primary block">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal"
              >
                {categories
                  .filter((c) => c.slug !== "all")
                  .map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Price & Serving Temp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-text-primary block">
                Price (IDR) <span className="text-[#8C3426]">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                step={1000}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-canvas-secondary border border-border-subtle rounded-md text-text-primary font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-charcoal"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-text-primary block">
                Serving Temp
              </label>
              <select
                value={servingTemperature}
                onChange={(e) => setServingTemperature(e.target.value)}
                className="w-full px-3 py-2 bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal"
              >
                <option value="Hot">Hot</option>
                <option value="Iced">Iced</option>
                <option value="Hot / Iced">Hot / Iced</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-semibold text-text-primary block">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal leading-relaxed"
            />
          </div>

          {/* Stock & Featured Flags */}
          <div className="pt-2 border-t border-border-subtle flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 rounded border-border-subtle text-charcoal focus:ring-0"
              />
              <span className="font-semibold text-text-primary">
                Available in Stock
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-border-subtle text-charcoal focus:ring-0"
              />
              <span className="font-semibold text-text-primary">
                Featured on Landing
              </span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-border-subtle flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-canvas-secondary border border-border-subtle rounded-md text-text-primary hover:bg-[#EFEFEA] font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1E1E1C] text-white rounded-md hover:bg-[#3A3A37] font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
