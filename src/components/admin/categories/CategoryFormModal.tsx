"use client";

import React, { useState, useEffect } from "react";
import { Category } from "@/types/menu";
import { X, Check, FolderTree, AlertCircle } from "lucide-react";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: {
    name: string;
    slug: string;
    description?: string;
    sortOrder: number;
  }) => void;
  initialCategory?: Category | null;
  existingCategories: Category[];
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  initialCategory,
  existingCategories,
}: CategoryFormModalProps) {
  const isEditing = !!initialCategory;

  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // Initialize form state
  useEffect(() => {
    if (isOpen) {
      if (initialCategory) {
        setName(initialCategory.name);
        setSlug(initialCategory.slug);
        setIsSlugManuallyEdited(true);
        setDescription(initialCategory.description || "");
        setSortOrder(initialCategory.sortOrder || 1);
      } else {
        setName("");
        setSlug("");
        setIsSlugManuallyEdited(false);
        setDescription("");
        const maxSort =
          existingCategories.length > 0
            ? Math.max(...existingCategories.map((c) => c.sortOrder || 0))
            : 0;
        setSortOrder(maxSort + 1);
      }
      setError(null);
    }
  }, [isOpen, initialCategory, existingCategories]);

  // Handle auto slug generation from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManuallyEdited) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugManuallyEdited(true);
    setSlug(
      val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]+/g, "-")
    );
  };

  // Keyboard escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    if (!trimmedSlug) {
      setError("Category slug is required.");
      return;
    }

    // Check slug collision
    const collision = existingCategories.find(
      (c) =>
        c.slug.toLowerCase() === trimmedSlug.toLowerCase() &&
        (!initialCategory || c.id !== initialCategory.id)
    );

    if (collision) {
      setError(`The slug "${trimmedSlug}" is already in use by "${collision.name}". Please choose a unique slug.`);
      return;
    }

    onSave({
      name: trimmedName,
      slug: trimmedSlug,
      description: description.trim() || undefined,
      sortOrder: Number(sortOrder) || 1,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs transition-opacity duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-canvas-primary border border-border-subtle rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-canvas-primary">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-canvas-secondary border border-border-subtle text-text-primary">
              <FolderTree className="w-4 h-4 text-accent-warm" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">
                {isEditing ? "Edit Category" : "Add New Category"}
              </h3>
              <p className="text-xs text-text-muted">
                {isEditing
                  ? `Update configuration for "${initialCategory?.name}"`
                  : "Create a new offering section in the menu"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-text-muted hover:text-text-primary rounded-md border border-border-subtle cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] rounded-md text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary">
              Category Name <span className="text-[#8C3426]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Seasonal Specials, Cold Brew &amp; Tonics"
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-medium"
            />
          </div>

          {/* Slug Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-text-primary">
                URL Slug <span className="text-[#8C3426]">*</span>
              </label>
              {isSlugManuallyEdited && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSlugManuallyEdited(false);
                    setSlug(
                      name
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, "")
                    );
                  }}
                  className="text-[10px] text-text-muted hover:text-text-primary underline cursor-pointer"
                >
                  Auto-generate
                </button>
              )}
            </div>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="e.g. seasonal-specials"
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-mono"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary">
              Section Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context on what guests can expect in this section..."
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal leading-relaxed"
            />
            <p className="text-[11px] text-text-muted">
              Displayed at the top of the category section on public and table ordering pages.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-text-muted hover:text-text-primary bg-canvas-primary border border-border-subtle rounded-md hover:bg-[#EFEFEA] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-charcoal rounded-md hover:bg-[#2C2C28] transition-colors shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isEditing ? "Update Category" : "Create Category"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
