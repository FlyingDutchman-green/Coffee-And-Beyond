"use client";

import { useState, useEffect, useCallback } from "react";
import { Category } from "@/types/menu";
import { CATEGORIES as DEFAULT_CATEGORIES } from "@/data/categories";

export const MENU_CATEGORIES_STORAGE_KEY = "coffee_and_beyond_menu_categories";
export const CATEGORY_DATA_VERSION = "2026-v2-pekalongan-authentic";
export const CATEGORY_VERSION_STORAGE_KEY = "cnb_category_version";

export function getAllCategories(): Category[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;
  try {
    const version = localStorage.getItem(CATEGORY_VERSION_STORAGE_KEY);
    const raw = localStorage.getItem(MENU_CATEGORIES_STORAGE_KEY);

    // Auto-migration to authentic categories if version mismatch or invalid count
    if (version !== CATEGORY_DATA_VERSION || !raw) {
      localStorage.setItem(CATEGORY_VERSION_STORAGE_KEY, CATEGORY_DATA_VERSION);
      localStorage.setItem(
        MENU_CATEGORIES_STORAGE_KEY,
        JSON.stringify(DEFAULT_CATEGORIES)
      );
      return DEFAULT_CATEGORIES;
    }

    const parsed: Category[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length < 8) {
      localStorage.setItem(
        MENU_CATEGORIES_STORAGE_KEY,
        JSON.stringify(DEFAULT_CATEGORIES)
      );
      return DEFAULT_CATEGORIES;
    }
    return parsed;
  } catch (e) {
    console.error("Failed to parse categories from localStorage:", e);
    return DEFAULT_CATEGORIES;
  }
}

export const getCategories = getAllCategories;

function notifyCategorySubscribers() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("coffee_categories_updated"));
    window.dispatchEvent(new CustomEvent("coffee_menu_updated"));
  }
}

export function saveCategories(categories: Category[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      MENU_CATEGORIES_STORAGE_KEY,
      JSON.stringify(categories)
    );
    notifyCategorySubscribers();
  } catch (e) {
    console.error("Failed to save categories to localStorage:", e);
  }
}

export function addCategory(
  categoryData: Omit<Category, "id" | "slug"> & { id?: string; slug?: string }
): Category {
  const categories = getAllCategories();

  const id =
    categoryData.id ||
    `cat-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

  const slug =
    categoryData.slug ||
    categoryData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const sortOrder =
    categoryData.sortOrder !== undefined
      ? categoryData.sortOrder
      : categories.length > 0
      ? Math.max(...categories.map((c) => c.sortOrder || 0)) + 1
      : 1;

  const category: Category = {
    ...categoryData,
    id,
    slug,
    sortOrder,
  };

  const updated = [...categories, category];
  saveCategories(updated);
  return category;
}

export function updateCategory(
  categoryId: string,
  partial: Partial<Category>
): Category | null {
  const categories = getAllCategories();
  const index = categories.findIndex(
    (c) => c.id.toLowerCase() === categoryId.toLowerCase()
  );
  if (index === -1) return null;

  const current = categories[index];
  const updatedCategory: Category = {
    ...current,
    ...partial,
  };

  const updatedCategories = [...categories];
  updatedCategories[index] = updatedCategory;
  saveCategories(updatedCategories);

  return updatedCategory;
}

export function deleteCategory(categoryId: string): { success: boolean; error?: string } {
  const categories = getAllCategories();
  const target = categories.find(
    (c) => c.id.toLowerCase() === categoryId.toLowerCase()
  );

  if (!target) {
    return { success: false, error: "Category not found." };
  }

  if (target.slug === "all" || target.id === "cat-all") {
    return { success: false, error: "Cannot delete the default 'All Offerings' category." };
  }

  const filtered = categories.filter(
    (c) => c.id.toLowerCase() !== categoryId.toLowerCase()
  );
  saveCategories(filtered);
  return { success: true };
}

export function resetCategoriesToDefault(): Category[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      CATEGORY_VERSION_STORAGE_KEY,
      CATEGORY_DATA_VERSION
    );
    localStorage.setItem(
      MENU_CATEGORIES_STORAGE_KEY,
      JSON.stringify(DEFAULT_CATEGORIES)
    );
    notifyCategorySubscribers();
  }
  return DEFAULT_CATEGORIES;
}

export function useCategoryStore() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshCategories = useCallback(() => {
    setCategories(getAllCategories());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshCategories();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === MENU_CATEGORIES_STORAGE_KEY) {
        refreshCategories();
      }
    };

    const handleCustomUpdate = () => {
      refreshCategories();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("coffee_categories_updated", handleCustomUpdate);
    window.addEventListener("coffee_menu_updated", handleCustomUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("coffee_categories_updated", handleCustomUpdate);
      window.removeEventListener("coffee_menu_updated", handleCustomUpdate);
    };
  }, [refreshCategories]);

  return {
    categories,
    isLoading,
    refreshCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    resetCategories: resetCategoriesToDefault,
  };
}
