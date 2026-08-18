"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Category } from "@/types/menu";
import { useMenuStore } from "@/lib/menu-store";
import { CategoryFormModal } from "@/components/admin/categories/CategoryFormModal";
import { DeleteCategoryDialog } from "@/components/admin/categories/DeleteCategoryDialog";
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Coffee,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function CategoryManagementList() {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    isLoading,
  } = useMenuStore();

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Count products for each category
  const productCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    categories.forEach((cat) => {
      if (cat.slug === "all") {
        map[cat.id] = products.length;
      } else {
        map[cat.id] = products.filter(
          (p) => p.categoryId === cat.id || p.categorySlug === cat.slug
        ).length;
      }
    });
    return map;
  }, [categories, products]);

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const sorted = [...categories].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    if (!query) return sorted;
    return sorted.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.slug.toLowerCase().includes(query) ||
        (c.description && c.description.toLowerCase().includes(query))
    );
  }, [categories, searchQuery]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  // Create or Update
  const handleSaveCategory = (data: {
    name: string;
    slug: string;
    description?: string;
    sortOrder: number;
  }) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, data);
      toast.success("Kategori berhasil diperbarui.");
      showNotification(`Category "${data.name}" updated successfully.`);
    } else {
      addCategory(data);
      toast.success("Kategori/Menu baru berhasil ditambahkan.");
      showNotification(`New category "${data.name}" created successfully.`);
    }
  };

  // Delete
  const handleConfirmDelete = () => {
    if (!deletingCategory) return;
    const res = deleteCategory(deletingCategory.id);
    if (res.success) {
      toast.error("Item berhasil dihapus.");
      showNotification(`Category "${deletingCategory.name}" removed.`);
    } else {
      toast.error(res.error || "Failed to delete category.");
      showError(res.error || "Failed to delete category.");
    }
    setDeletingCategory(null);
  };


  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {notification && (
        <div className="p-3 bg-[#F5F8F3] border border-[#D3DEC8] text-[#3B5E2B] rounded-lg text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#3B5E2B]" />
            <span>{notification}</span>
          </div>
          <Link
            href="/menu"
            target="_blank"
            className="inline-flex items-center gap-1 text-xs underline underline-offset-4 hover:opacity-80"
          >
            <span>View Public Menu</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] rounded-lg text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-canvas-primary border border-border-subtle rounded-lg p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-10 h-10 rounded-md bg-canvas-secondary border border-border-subtle flex items-center justify-center text-text-primary shrink-0">
            <FolderTree className="w-5 h-5 text-accent-warm" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-medium">Total Categories</p>
            <p className="text-xl font-bold text-text-primary tabular-nums">
              {isMounted ? categories.length : 0}
            </p>
          </div>
        </div>

        <div className="bg-canvas-primary border border-border-subtle rounded-lg p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-10 h-10 rounded-md bg-canvas-secondary border border-border-subtle flex items-center justify-center text-text-primary shrink-0">
            <Coffee className="w-5 h-5 text-accent-warm" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-medium">Categorized Offerings</p>
            <p className="text-xl font-bold text-text-primary tabular-nums">
              {isMounted ? `${products.length} Items` : "0 Items"}
            </p>
          </div>
        </div>

        <div className="bg-canvas-primary border border-border-subtle rounded-lg p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-10 h-10 rounded-md bg-canvas-secondary border border-border-subtle flex items-center justify-center text-text-primary shrink-0">
            <Layers className="w-5 h-5 text-accent-warm" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-medium">Live QR Sync</p>
            <p className="text-xs font-semibold text-[#3B5E2B] mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3B5E2B] inline-block animate-pulse" />
              <span>Multi-Tab Broadcast</span>
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-canvas-primary border border-border-subtle rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories or slug..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-charcoal"
          />
        </div>

        {/* Add Category Trigger */}
        <button
          type="button"
          onClick={() => {
            setEditingCategory(null);
            setIsFormModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-charcoal rounded-md hover:bg-[#2C2C28] transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-canvas-primary border border-border-subtle rounded-lg shadow-2xs overflow-hidden">
        {!isMounted || isLoading ? (
          <div className="p-12 text-center text-xs text-text-muted">
            Loading categories catalog...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FolderTree className="w-8 h-8 text-text-muted mx-auto" />
            <p className="text-sm font-semibold text-text-primary">
              No categories found
            </p>
            <p className="text-xs text-text-muted">
              No categories match your search &ldquo;{searchQuery}&rdquo;.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-canvas-secondary text-text-muted font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 w-[30%]">Category Name &amp; Slug</th>
                  <th className="py-3 px-4 w-[40%] hidden md:table-cell">Description</th>
                  <th className="py-3 px-4 w-[15%] text-center">Linked Products</th>
                  <th className="py-3 px-4 w-[15%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredCategories.map((category) => {
                  const isAll = category.slug === "all" || category.id === "cat-all";
                  const count = productCountMap[category.id] || 0;

                  return (
                    <tr
                      key={category.id}
                      className="hover:bg-canvas-secondary/60 transition-colors group"
                    >
                      {/* Name & Slug */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-text-primary text-sm block">
                            {category.name}
                          </span>
                          <span className="text-[11px] font-mono text-text-muted block">
                            /{category.slug}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 hidden md:table-cell text-text-muted max-w-sm">
                        <p className="line-clamp-2 leading-relaxed">
                          {category.description || "—"}
                        </p>
                      </td>

                      {/* Linked Products Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-xs font-semibold px-2.5 py-1 rounded-full border tabular-nums ${
                            count > 0
                              ? "bg-canvas-secondary border-border-subtle text-text-primary"
                              : "bg-[#FDF6F5] border-[#ECCEC9] text-[#8C3426]"
                          }`}
                        >
                          <Coffee className="w-3 h-3 text-accent-warm" />
                          <span>{count} {count === 1 ? "item" : "items"}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategory(category);
                              setIsFormModalOpen(true);
                            }}
                            aria-label={`Edit ${category.name}`}
                            className="p-1.5 text-text-muted hover:text-text-primary rounded hover:bg-canvas-secondary border border-transparent hover:border-border-subtle transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingCategory(category)}
                            disabled={isAll}
                            title={isAll ? "System default category cannot be deleted" : `Delete ${category.name}`}
                            aria-label={isAll ? "System category locked" : `Delete ${category.name}`}
                            className="p-1.5 text-text-muted hover:text-[#8C3426] rounded hover:bg-[#FDF6F5] border border-transparent hover:border-[#ECCEC9] transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
                          >
                            {isAll ? (
                              <Lock className="w-3.5 h-3.5" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <CategoryFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        initialCategory={editingCategory}
        existingCategories={categories}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteCategoryDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleConfirmDelete}
        category={deletingCategory}
        linkedProductsCount={
          deletingCategory ? productCountMap[deletingCategory.id] || 0 : 0
        }
      />
    </div>
  );
}

export default CategoryManagementList;
