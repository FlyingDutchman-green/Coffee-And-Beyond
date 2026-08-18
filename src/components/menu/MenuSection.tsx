"use client";

import React from "react";
import { Category, Product } from "@/types/menu";
import { MenuGrid } from "@/components/menu/MenuGrid";

interface MenuSectionProps {
  category: Category;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export function MenuSection({
  category,
  products,
  onSelectProduct,
}: MenuSectionProps) {
  if (products.length === 0) return null;

  return (
    <section
      id={`section-${category.slug}`}
      className="space-y-6 scroll-mt-32 pt-2"
      aria-labelledby={`heading-${category.slug}`}
    >
      {/* Category Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border-subtle pb-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <h2
              id={`heading-${category.slug}`}
              className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary"
            >
              {category.name}
            </h2>
            <span className="text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-sm bg-canvas-secondary border border-border-subtle text-text-muted">
              {products.length} {products.length === 1 ? "item" : "items"}
            </span>
          </div>
          {category.description && (
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Grid of Category Products */}
      <MenuGrid products={products} onSelectProduct={onSelectProduct} />
    </section>
  );
}
