"use client";

import React, { useEffect } from "react";
import { Category } from "@/types/menu";
import { AlertTriangle, Trash2, X, ShieldAlert } from "lucide-react";

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  category: Category | null;
  linkedProductsCount: number;
}

export function DeleteCategoryDialog({
  isOpen,
  onClose,
  onConfirm,
  category,
  linkedProductsCount,
}: DeleteCategoryDialogProps) {
  // Keyboard escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !category) return null;

  const isProtected = category.slug === "all" || category.id === "cat-all";
  const hasLinkedProducts = linkedProductsCount > 0;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs transition-opacity duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-canvas-primary border border-border-subtle rounded-lg shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-md border flex items-center justify-center shrink-0 ${
                isProtected || hasLinkedProducts
                  ? "bg-[#FFF9EB] border-[#F0DFA8] text-[#8C6D1F]"
                  : "bg-[#FDF6F5] border-[#ECCEC9] text-[#8C3426]"
              }`}
            >
              {isProtected ? (
                <ShieldAlert className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                {isProtected
                  ? "Protected Category"
                  : hasLinkedProducts
                  ? "Cannot Delete Category"
                  : "Delete Category?"}
              </h3>
              <p className="text-xs text-text-muted">
                Category: <strong className="text-text-primary">{category.name}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 text-text-muted hover:text-text-primary rounded border border-border-subtle cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Details */}
        {isProtected ? (
          <div className="p-3.5 bg-canvas-secondary border border-border-subtle rounded-md text-xs text-text-muted space-y-2">
            <p>
              The <strong>&ldquo;{category.name}&rdquo;</strong> category is a core system classification used as the default overview filter across the website and table ordering views.
            </p>
            <p className="font-medium text-text-primary">
              It cannot be deleted.
            </p>
          </div>
        ) : hasLinkedProducts ? (
          <div className="p-3.5 bg-[#FFF9EB] border border-[#F0DFA8] rounded-md text-xs text-[#6B5214] space-y-2 leading-relaxed">
            <p>
              This category currently contains{" "}
              <strong className="text-[#1E1E1C] font-bold">
                {linkedProductsCount} linked menu item{linkedProductsCount === 1 ? "" : "s"}
              </strong>
              .
            </p>
            <p>
              To maintain catalog data integrity, you must first reassign or remove all products belonging to this category in{" "}
              <strong className="underline">Menu Management</strong> before deleting it.
            </p>
          </div>
        ) : (
          <p className="text-xs text-text-muted leading-relaxed">
            Are you sure you want to permanently delete the category{" "}
            <strong className="text-text-primary">&ldquo;{category.name}&rdquo;</strong>? This action will remove the category tab from the menu and QR ordering pages immediately.
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-text-muted hover:text-text-primary bg-canvas-secondary border border-border-subtle rounded-md hover:bg-[#EFEFEA] transition-colors cursor-pointer"
          >
            {hasLinkedProducts || isProtected ? "Close" : "Cancel"}
          </button>

          {!isProtected && !hasLinkedProducts && (
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#8C3426] hover:bg-[#782C20] rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Category</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
