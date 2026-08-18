"use client";

import React, { useRef, useEffect } from "react";
import { Category } from "@/types/menu";

interface CategoryNavProps {
  categories: Category[];
  selectedCategorySlug: string;
  onSelectCategory: (slug: string) => void;
  categoryCounts?: Record<string, number>;
}

export function CategoryNav({
  categories,
  selectedCategorySlug,
  onSelectCategory,
  categoryCounts,
}: CategoryNavProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Auto scroll active tab into view horizontally on mobile
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const tab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();

      if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
        tab.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedCategorySlug]);

  return (
    <nav
      aria-label="Menu category navigation"
      className="sticky top-16 z-30 w-full bg-canvas-primary/98 backdrop-blur-xs border-b border-border-subtle transition-all"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 sm:gap-2 py-3 overflow-x-auto no-scrollbar scroll-smooth"
          role="tablist"
        >
          {categories.map((category) => {
            const isActive = selectedCategorySlug === category.slug;
            const count = categoryCounts?.[category.slug];

            return (
              <button
                key={category.id}
                ref={isActive ? activeTabRef : null}
                role="tab"
                aria-selected={isActive}
                aria-controls={`section-${category.slug}`}
                type="button"
                onClick={() => onSelectCategory(category.slug)}
                className={`whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors border shrink-0 flex items-center gap-2 select-none focus:outline-none focus:ring-1 focus:ring-charcoal ${
                  isActive
                    ? "bg-charcoal text-white border-charcoal font-semibold shadow-xs"
                    : "bg-canvas-primary text-text-muted border-border-subtle hover:text-text-primary hover:bg-canvas-secondary"
                }`}
              >
                <span>{category.name}</span>
                {typeof count === "number" && (
                  <span
                    className={`text-[10px] tabular-nums font-mono px-1.5 py-0.2 rounded-sm border ${
                      isActive
                        ? "bg-white/20 text-white border-white/30"
                        : "bg-canvas-secondary text-text-muted border-border-subtle"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
