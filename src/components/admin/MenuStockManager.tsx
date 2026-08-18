"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Product } from "@/types/menu";
import { CATEGORIES, formatPrice } from "@/data/menu";
import {
  getMergedProducts,
  toggleProductAvailability,
  updateProductPrice,
  saveStockOverrides,
} from "@/data/menuStockStore";
import {
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  Coffee,
  RotateCcw,
  Sparkles,
  Edit2,
  Check,
} from "lucide-react";

export function MenuStockManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>("");

  const refreshProducts = () => {
    setProducts(getMergedProducts());
  };

  useEffect(() => {
    refreshProducts();

    const handleStockUpdate = () => {
      refreshProducts();
    };

    window.addEventListener("coffee_menu_stock_updated", handleStockUpdate);
    window.addEventListener("storage", handleStockUpdate);

    return () => {
      window.removeEventListener("coffee_menu_stock_updated", handleStockUpdate);
      window.removeEventListener("storage", handleStockUpdate);
    };
  }, []);

  const handleToggle = (productId: string) => {
    toggleProductAvailability(productId);
    refreshProducts();
  };

  const handleSavePrice = (productId: string) => {
    const num = parseInt(tempPrice.replace(/\D/g, ""), 10);
    if (!isNaN(num) && num > 0) {
      updateProductPrice(productId, num);
      refreshProducts();
    }
    setEditingPriceId(null);
  };

  const handleResetDefaults = () => {
    saveStockOverrides({});
    refreshProducts();
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.categorySlug === selectedCategory ||
        product.categoryId === selectedCategory;

      if (!query) return matchesCategory;

      const matchesQuery =
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.categoryName || "").toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  const soldOutCount = products.filter((p) => !p.isAvailable).length;

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-canvas-primary border border-border-subtle p-4 sm:p-5 rounded-lg shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-text-primary tracking-tight">
            Menu Availability &amp; Stock Controls
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Toggle menu items on/off in real-time. Changes immediately update both public
            menu and table ordering.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-md bg-canvas-secondary border border-border-subtle text-xs">
            <span className="text-text-muted">Currently Sold Out: </span>
            <strong className="text-text-primary font-mono">{soldOutCount} items</strong>
          </div>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-1.5 text-xs font-medium bg-canvas-secondary border border-border-subtle rounded-md text-text-muted hover:text-text-primary hover:bg-[#EFEFEA] transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Stock</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-canvas-primary border border-border-subtle p-4 rounded-lg shadow-2xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border shrink-0 ${
                  isActive
                    ? "bg-charcoal text-white border-charcoal font-semibold shadow-xs"
                    : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search offerings by name..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-charcoal"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-text-muted hover:text-text-primary"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-canvas-primary border border-border-subtle rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-canvas-secondary/80 border-b border-border-subtle text-text-muted font-medium uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (IDR)</th>
                <th className="py-3 px-4">Kitchen Status</th>
                <th className="py-3 px-4 text-right">Quick Stock Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredProducts.map((product) => {
                const isSoldOut = !product.isAvailable;
                const isEditingPrice = editingPriceId === product.id;

                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-canvas-secondary/40 transition-colors ${
                      isSoldOut ? "bg-canvas-secondary/20" : ""
                    }`}
                  >
                    {/* Name & ID */}
                    <td className="py-3.5 px-4 space-y-0.5 max-w-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary text-sm">
                          {product.name}
                        </span>
                        <span className="font-mono text-[10px] text-text-muted">
                          #{product.id.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-text-muted text-[11px] truncate">
                        {product.description}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-text-muted font-medium">
                      {product.categoryName}
                    </td>

                    {/* Price with Edit */}
                    <td className="py-3.5 px-4">
                      {isEditingPrice ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSavePrice(product.id);
                            }}
                            autoFocus
                            className="w-24 px-2 py-1 text-xs bg-canvas-primary border border-charcoal rounded text-text-primary font-mono tabular-nums"
                          />
                          <button
                            type="button"
                            onClick={() => handleSavePrice(product.id)}
                            className="p-1 rounded bg-charcoal text-white hover:bg-[#3A3A37]"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-text-primary tabular-nums">
                            {formatPrice(product.price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPriceId(product.id);
                              setTempPrice(product.price.toString());
                            }}
                            title="Edit price"
                            className="p-1 text-text-muted hover:text-text-primary rounded"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {isSoldOut ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded-sm bg-[#F7F7F5] border border-[#E7E7E3] text-[#777772]">
                          <AlertCircle className="w-3 h-3" />
                          <span>Sold Out</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded-sm bg-[#F5F8F3] border border-[#D3DEC8] text-[#3B5E2B]">
                          <CheckCircle2 className="w-3 h-3 text-[#3B5E2B]" />
                          <span>In Stock</span>
                        </span>
                      )}
                    </td>

                    {/* Stock Switch Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggle(product.id)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border shadow-2xs ${
                          isSoldOut
                            ? "bg-canvas-primary border-border-subtle text-text-primary hover:bg-canvas-secondary"
                            : "bg-[#FDF6F5] border-[#ECCEC9] text-[#8C3426] hover:bg-[#faeae8]"
                        }`}
                      >
                        {isSoldOut ? "Mark In-Stock" : "Mark Sold Out"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
