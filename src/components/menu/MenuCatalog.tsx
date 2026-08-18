"use client";

import React, { useState, useMemo } from "react";
import { Category, Product } from "@/types/menu";
import { useMenuStore } from "@/lib/menu-store";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { MenuSection } from "@/components/menu/MenuSection";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { ProductDetailModal } from "@/components/menu/ProductDetailModal";
import { UtensilsCrossed, Sparkles } from "lucide-react";

interface MenuCatalogProps {
  categories: Category[];
  initialProducts: Product[];
}

export function MenuCatalog({ categories: initialCategories, initialProducts }: MenuCatalogProps) {
  const { products: storeProducts, categories: storeCategories } = useMenuStore();

  const products = storeProducts.length > 0 ? storeProducts : initialProducts;
  const categories = storeCategories.length > 0 ? storeCategories : initialCategories;

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Calculate items count per category for badges in nav
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: products.length,
    };
    categories.forEach((cat) => {
      if (cat.slug !== "all") {
        counts[cat.slug] = products.filter(
          (p) => p.categorySlug === cat.slug || p.categoryId === cat.id
        ).length;
      }
    });
    return counts;
  }, [categories, products]);

  // Filter products by category and search keyword
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return products.filter((product) => {
      // Category Match
      const matchesCategory =
        selectedCategorySlug === "all" ||
        product.categorySlug === selectedCategorySlug ||
        product.categoryId === selectedCategorySlug;

      // Query Match
      if (!query) {
        return matchesCategory;
      }

      const inName = product.name.toLowerCase().includes(query);
      const inDesc = product.description.toLowerCase().includes(query);
      const inCategory = (product.categoryName || "").toLowerCase().includes(query);
      const inOrigin = (product.origin || "").toLowerCase().includes(query);
      const inRoast = (product.roastLevel || "").toLowerCase().includes(query);
      const inIngredients =
        product.ingredients?.some((i) => i.toLowerCase().includes(query)) || false;
      const inDietary =
        product.dietary?.some((d) => d.toLowerCase().includes(query)) || false;

      const matchesQuery =
        inName ||
        inDesc ||
        inCategory ||
        inOrigin ||
        inRoast ||
        inIngredients ||
        inDietary;

      return matchesCategory && matchesQuery;
    });
  }, [products, selectedCategorySlug, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategorySlug("all");
    setSearchQuery("");
  };

  const activeCategory = categories.find((c) => c.slug === selectedCategorySlug);
  const activeCategoryName = activeCategory?.name || "All Offerings";
  const isSearchActive = searchQuery.trim().length > 0;
  const isAllCategory = selectedCategorySlug === "all";

  // Specific list of real categories excluding 'all' for section-by-section view
  const actualCategories = useMemo(() => {
    return categories.filter((c) => c.slug !== "all");
  }, [categories]);

  return (
    <div className="w-full space-y-8">
      {/* Sticky Category Navigation Bar */}
      <CategoryNav
        categories={categories}
        selectedCategorySlug={selectedCategorySlug}
        onSelectCategory={(slug) => setSelectedCategorySlug(slug)}
        categoryCounts={categoryCounts}
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Filter Bar Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
          <div className="w-full md:max-w-md">
            <MenuSearch
              value={searchQuery}
              onChange={(q) => setSearchQuery(q)}
              placeholder="Search coffees, teas, pastries, kitchen plates..."
            />
          </div>

          {/* Quick Active Filters Summary */}
          <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-text-muted">
            <p>
              Showing{" "}
              <span className="font-semibold text-text-primary tabular-nums">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1 ? "offering" : "offerings"}
              {!isSearchActive && !isAllCategory && (
                <span>
                  {" "}
                  in <strong className="text-text-primary">{activeCategoryName}</strong>
                </span>
              )}
            </p>

            {(isSearchActive || !isAllCategory) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="hover:text-text-primary font-medium transition-colors underline underline-offset-4 cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Content Display: Categorized Sections or Filtered Grid */}
        {filteredProducts.length > 0 ? (
          // Case 1: "All Offerings" view with no search query -> Render organized Category Sections
          isAllCategory && !isSearchActive ? (
            <div className="space-y-16">
              {actualCategories.map((cat) => {
                const categoryProducts = filteredProducts.filter(
                  (p) => p.categorySlug === cat.slug || p.categoryId === cat.id
                );
                return (
                  <MenuSection
                    key={cat.id}
                    category={cat}
                    products={categoryProducts}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                  />
                );
              })}
            </div>
          ) : (
            // Case 2: Specific Category or Search Filter active -> Render Single Grid with Section Header
            <div className="space-y-6">
              {isSearchActive && (
                <div className="p-4 bg-canvas-secondary border border-border-subtle rounded-md flex items-center justify-between gap-3 text-xs">
                  <span className="text-text-muted flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent-warm" />
                    <span>
                      Search results for &ldquo;
                      <strong className="text-text-primary">{searchQuery}</strong>
                      &rdquo;
                      {!isAllCategory && ` within ${activeCategoryName}`}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-text-primary font-medium hover:underline cursor-pointer"
                  >
                    Clear search
                  </button>
                </div>
              )}

              {!isSearchActive && activeCategory && (
                <div className="border-b border-border-subtle pb-4 space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-text-primary">
                      {activeCategory.name}
                    </h2>
                    <span className="text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-sm bg-canvas-secondary border border-border-subtle text-text-muted">
                      {filteredProducts.length} items
                    </span>
                  </div>
                  {activeCategory.description && (
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {activeCategory.description}
                    </p>
                  )}
                </div>
              )}

              <MenuGrid
                products={filteredProducts}
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            </div>
          )
        ) : (
          /* Empty State */
          <div className="p-12 sm:p-16 border border-border-subtle rounded-lg bg-canvas-secondary text-center space-y-4 max-w-md mx-auto my-12">
            <div className="w-12 h-12 rounded-md bg-canvas-primary border border-border-subtle flex items-center justify-center text-text-muted mx-auto shadow-xs">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-semibold text-text-primary text-base">
                No offerings match your search
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                We couldn&apos;t find any menu items matching &ldquo;{searchQuery}&rdquo;
                {!isAllCategory && ` in ${activeCategoryName}`}. Try checking your spelling
                or resetting filters.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-medium bg-canvas-primary border border-border-subtle rounded-md text-text-primary hover:bg-[#EFEFEA] transition-colors shadow-xs cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
