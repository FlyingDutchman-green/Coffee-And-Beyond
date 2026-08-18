"use client";

import React, { useState, useMemo } from "react";
import { Product, Category } from "@/types/menu";
import { TableInfo } from "@/types/order";
import { useMenuStore } from "@/lib/menu-store";
import { useTableStore } from "@/lib/table-store";
import { TableContextBanner } from "@/components/order/TableContextBanner";
import { OrderProductCard } from "@/components/order/OrderProductCard";
import { StickyCartBar } from "@/components/order/StickyCartBar";
import { CartDrawer } from "@/components/order/CartDrawer";
import { ProductDetailModal } from "@/components/menu/ProductDetailModal";
import { Search, X, UtensilsCrossed, AlertTriangle } from "lucide-react";

interface TableOrderExperienceProps {
  table: TableInfo;
  categories: Category[];
  products: Product[];
}

export function TableOrderExperience({
  table: initialTable,
  categories: initialCategories,
  products: initialProducts,
}: TableOrderExperienceProps) {
  const { products: storeProducts, categories: storeCategories } = useMenuStore();
  const { tables: storeTables } = useTableStore();

  const products = storeProducts.length > 0 ? storeProducts : initialProducts;
  const categories = storeCategories.length > 0 ? storeCategories : initialCategories;
  
  const currentTable =
    storeTables.find((t) => t.id.toUpperCase() === initialTable.id.toUpperCase()) ||
    initialTable;

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);

  // Filter products by category & search
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return products.filter((product) => {
      const matchesCategory =
        selectedCategorySlug === "all" ||
        product.categorySlug === selectedCategorySlug ||
        product.categoryId === selectedCategorySlug;

      if (!query) return matchesCategory;

      const matchesQuery =
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.categoryName || "").toLowerCase().includes(query) ||
        (product.origin && product.origin.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [products, selectedCategorySlug, searchQuery]);

  const activeCategory = categories.find((c) => c.slug === selectedCategorySlug);
  const activeCategoryName =
    selectedCategorySlug === "all"
      ? "Semua Menu"
      : activeCategory?.name || "Semua Menu";

  const handleResetFilters = () => {
    setSelectedCategorySlug("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-canvas-secondary flex flex-col items-center pb-24 text-text-primary">
      {/* Mobile Ordering Container max-w-[480px] */}
      <div className="w-full max-w-[480px] bg-canvas-primary border-x border-border-subtle min-h-screen flex flex-col shadow-xs">
        {/* Table Banner */}
        <TableContextBanner table={currentTable} />

        {/* Table Inactive Notice if disabled by admin */}
        {!currentTable.isActive && (
          <div className="p-3 bg-[#FDF6F5] border-b border-[#ECCEC9] text-[#8C3426] flex items-center gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Meja ini sedang tidak menerima pesanan baru. Silakan hubungi staf kami.
            </span>
          </div>
        )}

        {/* Search Input Bar */}
        <div className="p-4 border-b border-border-subtle bg-canvas-primary space-y-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kopi, teh, pastry, makanan utama..."
              className="w-full pl-10 pr-9 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-charcoal"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Hapus pencarian"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Horizontal Category Scroll Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {categories.map((category) => {
              const isActive = selectedCategorySlug === category.slug;
              const displayName =
                category.slug === "all" ? "Semua Menu" : category.name;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategorySlug(category.slug)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-medium transition-colors border shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-charcoal text-white border-charcoal font-semibold shadow-xs"
                      : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary hover:bg-[#EFEFEA]"
                  }`}
                >
                  {displayName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products List Content Area */}
        <main className="flex-1 p-4 space-y-4">
          {/* Header row with count */}
          <div className="flex items-center justify-between text-xs text-text-muted px-1">
            <p>
              <strong className="text-text-primary font-semibold">
                {activeCategoryName}
              </strong>{" "}
              ({filteredProducts.length})
            </p>
            {(searchQuery || selectedCategorySlug !== "all") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-text-primary hover:underline underline-offset-4 cursor-pointer font-medium"
              >
                Reset filter
              </button>
            )}
          </div>

          {/* Product Items */}
          {filteredProducts.length > 0 ? (
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <OrderProductCard
                  key={product.id}
                  product={product}
                  onOpenDetail={(p) => setSelectedDetailProduct(p)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="p-8 border border-border-subtle rounded-lg bg-canvas-secondary text-center space-y-3 my-8">
              <div className="w-10 h-10 rounded-md bg-canvas-primary border border-border-subtle flex items-center justify-center text-text-muted mx-auto">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm text-text-primary">
                  Menu tidak ditemukan
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Tidak ada menu yang sesuai dengan kata kunci &ldquo;{searchQuery}&rdquo;.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-1.5 text-xs font-medium bg-canvas-primary border border-border-subtle rounded-md text-text-primary hover:bg-[#EFEFEA] cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Floating Cart Trigger Bar */}
      <StickyCartBar />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedDetailProduct}
        onClose={() => setSelectedDetailProduct(null)}
      />
    </div>
  );
}
