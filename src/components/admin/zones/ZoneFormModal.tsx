"use client";

import React, { useState, useEffect } from "react";
import { Zone } from "@/lib/zone-store";
import { X, Check, MapPin, AlertCircle } from "lucide-react";

interface ZoneFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (zoneData: {
    name: string;
    slug: string;
    description?: string;
    sortOrder: number;
  }) => void;
  initialZone?: Zone | null;
  existingZones: Zone[];
}

export function ZoneFormModal({
  isOpen,
  onClose,
  onSave,
  initialZone,
  existingZones,
}: ZoneFormModalProps) {
  const isEditing = !!initialZone;

  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // Initialize form state
  useEffect(() => {
    if (isOpen) {
      if (initialZone) {
        setName(initialZone.name);
        setSlug(initialZone.slug);
        setIsSlugManuallyEdited(true);
        setDescription(initialZone.description || "");
        setSortOrder(initialZone.sortOrder || 1);
      } else {
        setName("");
        setSlug("");
        setIsSlugManuallyEdited(false);
        setDescription("");
        const maxSort =
          existingZones.length > 0
            ? Math.max(...existingZones.map((z) => z.sortOrder || 0))
            : 0;
        setSortOrder(maxSort + 1);
      }
      setError(null);
    }
  }, [isOpen, initialZone, existingZones]);

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
      setError("Zone name is required.");
      return;
    }

    if (!trimmedSlug) {
      setError("Zone slug is required.");
      return;
    }

    // Check slug collision
    const collision = existingZones.find(
      (z) =>
        z.slug.toLowerCase() === trimmedSlug.toLowerCase() &&
        (!initialZone || z.id !== initialZone.id)
    );

    if (collision) {
      setError(
        `The slug "${trimmedSlug}" is already in use by zone "${collision.name}". Please choose a unique slug.`
      );
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
              <MapPin className="w-4 h-4 text-accent-warm" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">
                {isEditing ? `Edit Zone: ${initialZone?.name}` : "Add New Zone"}
              </h3>
              <p className="text-xs text-text-muted">
                {isEditing
                  ? `Update configuration for "${initialZone?.name}"`
                  : "Register a new seating area or dining section in the café"}
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
              Zone Name <span className="text-[#8C3426]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Rooftop Lounge, Garden Pergola, Espresso Bar"
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-medium"
            />
          </div>

          {/* Slug Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-text-primary">
                Zone Slug <span className="text-[#8C3426]">*</span>
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
              placeholder="e.g. rooftop-lounge"
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-mono"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary">
              Zone Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe seating characteristics, power outlet availability, acoustics, or ambience..."
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal leading-relaxed"
            />
            <p className="text-[11px] text-text-muted">
              Used in table fleet overview and admin space management notes.
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
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#1E1E1C] rounded-md hover:bg-[#3A3A37] transition-colors shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isEditing ? "Update Zone" : "Create Zone"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
