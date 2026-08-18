"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/types/menu";
import { formatPrice } from "@/data/menu";
import { useMenuStore } from "@/lib/menu-store";
import { StockQuickToggle } from "@/components/admin/menu/StockQuickToggle";
import { ProductEditModal } from "@/components/admin/menu/ProductEditModal";
import { NewProductModal } from "@/components/admin/menu/NewProductModal";
import {
  Search,
  X,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Sparkles,
  Coffee,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "stock-first" | "soldout-first";


export function MenuManagementList() {
  const {
    products,
    categories,
    toggleAvailability,
    updateProduct,
    addProduct,
    deleteProduct,
    resetToDefaultMenu,
  } = useMenuStore();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Metrics summary
  const inStockCount = useMemo(() => products.filter((p) => p.isAvailable).length, [products]);
  const soldOutCount = useMemo(() => products.filter((p) => !p.isAvailable).length, [products]);
  const actualCategoriesCount = useMemo(
    () => categories.filter((c) => c.slug !== "all").length,
    [categories]
  );

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesCat =
        selectedCategory === "all" ||
        product.categorySlug === selectedCategory ||
        product.categoryId === selectedCategory;

      if (!query) return matchesCat;

      const matchesQuery =
        product.name.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.categoryName || "").toLowerCase().includes(query);

      return matchesCat && matchesQuery;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "stock-first":
          return (b.isAvailable ? 1 : 0) - (a.isAvailable ? 1 : 0);
        case "soldout-first":
          return (a.isAvailable ? 1 : 0) - (b.isAvailable ? 1 : 0);
        default:
          return 0;
      }
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleDeleteConfirm = (productId: string) => {
    deleteProduct(productId);
    toast.error("Item berhasil dihapus.");
    setDeletingProductId(null);
  };


  const handleReset = () => {
    if (
      window.confirm(
        "Reset menu catalog to default artisanal menu? Custom added items will be replaced."
      )
    ) {
      resetToDefaultMenu();
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span>Total Offerings</span>
            <Coffee className="w-4 h-4 text-accent-warm" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums">
            {products.length}
          </p>
        </div>

        <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span>Active In-Stock</span>
            <CheckCircle2 className="w-4 h-4 text-[#3B5E2B]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#3B5E2B] tabular-nums">
            {inStockCount}
          </p>
        </div>

        <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span>Currently Sold Out</span>
            <AlertCircle className="w-4 h-4 text-[#8C3426]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#8C3426] tabular-nums">
            {soldOutCount}
          </p>
        </div>

        <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span>Menu Categories</span>
            <Sparkles className="w-4 h-4 text-accent-warm" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums">
            {actualCategoriesCount}
          </p>
        </div>
      </div>

      {/* Control Bar: Categories, Search, Sort & Add CTA */}
      <div className="bg-canvas-primary border border-border-subtle p-4 rounded-lg shadow-2xs space-y-4">
        {/* Top row: Categories & Add Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              const count =
                cat.slug === "all"
                  ? products.length
                  : products.filter(
                      (p) => p.categorySlug === cat.slug || p.categoryId === cat.id
                    ).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-md text-xs transition-colors border shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-[#1E1E1C] text-white border-[#1E1E1C] font-semibold shadow-xs"
                      : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary hover:bg-[#EFEFEA]"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full border ${
                      isActive
                        ? "bg-white/20 text-white border-white/30"
                        : "bg-canvas-primary text-text-muted border-border-subtle"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              title="Reset to default menu"
              className="p-2 text-xs font-medium bg-canvas-secondary border border-border-subtle rounded-md text-text-muted hover:text-text-primary hover:bg-[#EFEFEA] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsNewModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-[#1E1E1C] text-white rounded-md hover:bg-[#3A3A37] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Offering</span>
            </button>
          </div>
        </div>

        {/* Bottom row: Search & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-border-subtle">
          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items by name, category, ID..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-charcoal"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-2.5 py-1.5 bg-canvas-secondary border border-border-subtle rounded-md text-text-primary text-xs focus:outline-none focus:ring-1 focus:ring-charcoal cursor-pointer"
            >
              <option value="name-asc">Name (A &rarr; Z)</option>
              <option value="name-desc">Name (Z &rarr; A)</option>
              <option value="price-asc">Price (Low &rarr; High)</option>
              <option value="price-desc">Price (High &rarr; Low)</option>
              <option value="stock-first">In-Stock First</option>
              <option value="soldout-first">Sold Out First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-canvas-primary border border-border-subtle rounded-lg overflow-hidden shadow-2xs">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-canvas-secondary/80 border-b border-border-subtle text-text-muted font-medium uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Offering Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (IDR)</th>
                  <th className="py-3 px-4 text-center">Stock Toggle</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredProducts.map((product) => {
                  const isSoldOut = !product.isAvailable;

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-canvas-secondary/40 transition-colors ${
                        isSoldOut ? "bg-canvas-secondary/20" : ""
                      }`}
                    >
                      {/* Name, ID, Desc with Thumbnail */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-8 rounded bg-canvas-secondary border border-border-subtle shrink-0 overflow-hidden flex items-center justify-center text-text-muted relative">
                            {product.imageUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Coffee className="w-3.5 h-3.5 text-accent-warm/70" />
                            )}
                          </div>
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-text-primary text-sm leading-snug truncate">
                                {product.name}
                              </span>
                              <span className="font-mono text-[10px] text-text-muted px-1.5 py-0.2 rounded bg-canvas-secondary border border-border-subtle shrink-0">
                                #{product.id}
                              </span>
                              {product.isFeatured && (
                                <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded-sm bg-[#FDFBF7] border border-[#E2D9C8] text-[#7A5E28] shrink-0">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-text-muted text-[11px] line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-text-muted font-medium">
                        {product.categoryName}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-semibold text-text-primary tabular-nums">
                        {formatPrice(product.price)}
                      </td>

                      {/* Stock Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <StockQuickToggle
                          productId={product.id}
                          isAvailable={product.isAvailable}
                          onToggle={() => toggleAvailability(product.id)}
                        />
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(product)}
                            title="Edit offering"
                            className="p-1.5 text-text-muted hover:text-text-primary bg-canvas-secondary border border-border-subtle rounded-md transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingProductId(product.id)}
                            title="Delete offering"
                            className="p-1.5 text-text-muted hover:text-[#8C3426] bg-canvas-secondary border border-border-subtle rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-2">
            <Coffee className="w-8 h-8 text-text-muted mx-auto" />
            <h3 className="font-semibold text-text-primary text-sm">
              No offerings matched your filters
            </h3>
            <p className="text-xs text-text-muted">
              Try adjusting your category filter or search query.
            </p>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      <ProductEditModal
        product={editingProduct}
        categories={categories}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={(id, updated) => {
          updateProduct(id, updated);
          toast.success("Menu berhasil diperbarui.");
        }}
      />

      {/* New Product Modal */}
      <NewProductModal
        categories={categories}
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onAdd={(newProduct) => {
          addProduct(newProduct);
          toast.success("Kategori/Menu baru berhasil ditambahkan.");
        }}
      />


      {/* Delete Confirmation Modal */}
      {deletingProductId && (
        <div
          onClick={() => setDeletingProductId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs transition-opacity duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-canvas-primary border border-border-subtle rounded-lg shadow-xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-left"
          >
            <div className="flex items-center gap-2 text-[#8C3426]">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-semibold text-sm text-text-primary">
                Delete Menu Item?
              </h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Are you sure you want to remove this item from the catalog? This will remove it from both online and table ordering.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProductId(null)}
                className="px-3 py-1.5 text-xs font-medium bg-canvas-secondary border border-border-subtle rounded-md text-text-primary hover:bg-[#EFEFEA] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteConfirm(deletingProductId)}
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#8C3426] text-white rounded-md hover:bg-[#732B20] transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
