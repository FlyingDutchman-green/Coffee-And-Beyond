"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, Category } from "@/types/menu";
import {
  PRODUCTS as DEFAULT_PRODUCTS,
  CATEGORIES as DEFAULT_CATEGORIES,
} from "@/data/menu";

export const MENU_PRODUCTS_STORAGE_KEY = "coffee_and_beyond_menu_products";
export const MENU_CATEGORIES_STORAGE_KEY = "coffee_and_beyond_menu_categories";
export const MENU_DATA_VERSION = "2026-v2-pekalongan-authentic";
export const MENU_VERSION_STORAGE_KEY = "cnb_menu_version";

/**
 * Check and run auto-migration if stored cache belongs to older mockups/versions
 */
function ensureDataVersionMigrated() {
  if (typeof window === "undefined") return;
  try {
    const version = localStorage.getItem(MENU_VERSION_STORAGE_KEY);
    if (version !== MENU_DATA_VERSION) {
      localStorage.setItem(MENU_VERSION_STORAGE_KEY, MENU_DATA_VERSION);
      localStorage.setItem(
        MENU_PRODUCTS_STORAGE_KEY,
        JSON.stringify(DEFAULT_PRODUCTS)
      );
      localStorage.setItem(
        MENU_CATEGORIES_STORAGE_KEY,
        JSON.stringify(DEFAULT_CATEGORIES)
      );
      notifyMenuSubscribers();
    }
  } catch (e) {
    console.error("Migration error in menu store:", e);
  }
}

export function getAllCategories(): Category[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;
  try {
    ensureDataVersionMigrated();
    const raw = localStorage.getItem(MENU_CATEGORIES_STORAGE_KEY);
    if (!raw) {
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

export function getAllProducts(): Product[] {
  if (typeof window === "undefined") return DEFAULT_PRODUCTS;
  try {
    ensureDataVersionMigrated();
    const raw = localStorage.getItem(MENU_PRODUCTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        MENU_PRODUCTS_STORAGE_KEY,
        JSON.stringify(DEFAULT_PRODUCTS)
      );
      return DEFAULT_PRODUCTS;
    }
    const parsed: Product[] = JSON.parse(raw);
    // If cache is from old mockup with fewer products or missing signature items
    if (!Array.isArray(parsed) || parsed.length < 25) {
      localStorage.setItem(
        MENU_PRODUCTS_STORAGE_KEY,
        JSON.stringify(DEFAULT_PRODUCTS)
      );
      return DEFAULT_PRODUCTS;
    }
    return parsed;
  } catch (e) {
    console.error("Failed to parse products from localStorage:", e);
    return DEFAULT_PRODUCTS;
  }
}
export const getProducts = getAllProducts;

export function getProductById(productId: string): Product | null {
  const products = getAllProducts();
  return (
    products.find((p) => p.id.toLowerCase() === productId.toLowerCase()) || null
  );
}

function notifyMenuSubscribers() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("coffee_menu_updated"));
    window.dispatchEvent(new CustomEvent("coffee_menu_stock_updated"));
    window.dispatchEvent(new CustomEvent("coffee_categories_updated"));
  }
}

export function saveProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      MENU_PRODUCTS_STORAGE_KEY,
      JSON.stringify(products)
    );
    notifyMenuSubscribers();
  } catch (e) {
    console.error("Failed to save products to localStorage:", e);
  }
}

export function saveCategories(categories: Category[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      MENU_CATEGORIES_STORAGE_KEY,
      JSON.stringify(categories)
    );
    notifyMenuSubscribers();
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

  // If name or slug changed, synchronize products referencing this category
  if (
    (partial.name && partial.name !== current.name) ||
    (partial.slug && partial.slug !== current.slug)
  ) {
    const products = getAllProducts();
    let hasProductChanges = false;
    const updatedProducts = products.map((p) => {
      if (p.categoryId === current.id || p.categorySlug === current.slug) {
        hasProductChanges = true;
        return {
          ...p,
          categoryId: updatedCategory.id,
          categoryName: updatedCategory.name,
          categorySlug: updatedCategory.slug,
        };
      }
      return p;
    });

    if (hasProductChanges) {
      saveProducts(updatedProducts);
    }
  }

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

  const products = getAllProducts();
  const linkedProducts = products.filter(
    (p) => p.categoryId === target.id || p.categorySlug === target.slug
  );

  if (linkedProducts.length > 0) {
    return {
      success: false,
      error: `Cannot delete '${target.name}' because it contains ${linkedProducts.length} active menu item(s). Reassign or remove the items first.`,
    };
  }

  const filtered = categories.filter(
    (c) => c.id.toLowerCase() !== categoryId.toLowerCase()
  );
  saveCategories(filtered);
  return { success: true };
}

export function toggleProductAvailability(productId: string): boolean {
  const products = getAllProducts();
  const index = products.findIndex(
    (p) => p.id.toLowerCase() === productId.toLowerCase()
  );
  if (index === -1) return false;

  const current = products[index];
  const newStatus = !current.isAvailable;
  const updated = [...products];
  updated[index] = { ...current, isAvailable: newStatus };

  saveProducts(updated);
  return newStatus;
}

export function updateProduct(
  productId: string,
  partial: Partial<Product>
): Product | null {
  const products = getAllProducts();
  const index = products.findIndex(
    (p) => p.id.toLowerCase() === productId.toLowerCase()
  );
  if (index === -1) return null;

  const current = products[index];
  const categories = getAllCategories();
  
  let categoryName = current.categoryName;
  let categorySlug = current.categorySlug;
  if (partial.categoryId && partial.categoryId !== current.categoryId) {
    const cat = categories.find((c) => c.id === partial.categoryId || c.slug === partial.categoryId);
    if (cat) {
      categoryName = cat.name;
      categorySlug = cat.slug;
    }
  }

  const updatedProduct: Product = {
    ...current,
    ...partial,
    categoryName: partial.categoryName || categoryName,
    categorySlug: partial.categorySlug || categorySlug,
  };

  const updated = [...products];
  updated[index] = updatedProduct;
  saveProducts(updated);
  return updatedProduct;
}

export function addProduct(
  newProductData: Omit<Product, "id" | "slug"> & { id?: string; slug?: string }
): Product {
  const products = getAllProducts();
  const categories = getAllCategories();

  const id =
    newProductData.id ||
    `custom-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  
  const slug =
    newProductData.slug ||
    newProductData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const cat = categories.find(
    (c) => c.id === newProductData.categoryId || c.slug === newProductData.categoryId
  );

  const product: Product = {
    ...newProductData,
    id,
    slug,
    categoryName: newProductData.categoryName || cat?.name || "General",
    categorySlug: newProductData.categorySlug || cat?.slug || "general",
    isAvailable: newProductData.isAvailable ?? true,
  };

  const updated = [product, ...products];
  saveProducts(updated);
  return product;
}

export function deleteProduct(productId: string): boolean {
  const products = getAllProducts();
  const filtered = products.filter(
    (p) => p.id.toLowerCase() !== productId.toLowerCase()
  );
  if (filtered.length === products.length) return false;

  saveProducts(filtered);
  return true;
}

export function resetToDefaultMenu(): Product[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      MENU_VERSION_STORAGE_KEY,
      MENU_DATA_VERSION
    );
    localStorage.setItem(
      MENU_PRODUCTS_STORAGE_KEY,
      JSON.stringify(DEFAULT_PRODUCTS)
    );
    localStorage.setItem(
      MENU_CATEGORIES_STORAGE_KEY,
      JSON.stringify(DEFAULT_CATEGORIES)
    );
    notifyMenuSubscribers();
  }
  return DEFAULT_PRODUCTS;
}

/**
 * Custom React hook for reactive menu products and categories synchronization.
 */
export function useMenuStore() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshMenu = useCallback(() => {
    setProducts(getAllProducts());
    setCategories(getAllCategories());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshMenu();

    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === MENU_PRODUCTS_STORAGE_KEY ||
        e.key === MENU_CATEGORIES_STORAGE_KEY ||
        e.key === MENU_VERSION_STORAGE_KEY
      ) {
        refreshMenu();
      }
    };

    const handleMenuUpdate = () => {
      refreshMenu();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("coffee_menu_updated", handleMenuUpdate);
    window.addEventListener("coffee_menu_stock_updated", handleMenuUpdate);
    window.addEventListener("coffee_categories_updated", handleMenuUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("coffee_menu_updated", handleMenuUpdate);
      window.removeEventListener("coffee_menu_stock_updated", handleMenuUpdate);
      window.removeEventListener("coffee_categories_updated", handleMenuUpdate);
    };
  }, [refreshMenu]);

  const toggleAvailability = useCallback(
    (productId: string) => {
      const res = toggleProductAvailability(productId);
      refreshMenu();
      return res;
    },
    [refreshMenu]
  );

  const update = useCallback(
    (productId: string, partial: Partial<Product>) => {
      const res = updateProduct(productId, partial);
      refreshMenu();
      return res;
    },
    [refreshMenu]
  );

  const add = useCallback(
    (productData: Omit<Product, "id" | "slug"> & { id?: string; slug?: string }) => {
      const res = addProduct(productData);
      refreshMenu();
      return res;
    },
    [refreshMenu]
  );

  const remove = useCallback(
    (productId: string) => {
      const res = deleteProduct(productId);
      refreshMenu();
      return res;
    },
    [refreshMenu]
  );

  const reset = useCallback(() => {
    const res = resetToDefaultMenu();
    refreshMenu();
    return res;
  }, [refreshMenu]);

  const addCat = useCallback(
    (categoryData: Omit<Category, "id" | "slug"> & { id?: string; slug?: string }) => {
      const res = addCategory(categoryData);
      refreshMenu();
      return res;
    },
    [refreshMenu]
  );

  const updateCat = useCallback(
    (categoryId: string, partial: Partial<Category>) => {
      const res = updateCategory(categoryId, partial);
      refreshMenu();
      return res;
    },
    [refreshMenu]
  );

  const removeCat = useCallback(
    (categoryId: string) => {
      const res = deleteCategory(categoryId);
      refreshMenu();
      return res;
    },
    [refreshMenu]
  );

  const saveCats = useCallback(
    (cats: Category[]) => {
      saveCategories(cats);
      refreshMenu();
    },
    [refreshMenu]
  );

  return {
    products,
    categories,
    isLoading,
    refreshMenu,
    toggleAvailability,
    updateProduct: update,
    addProduct: add,
    deleteProduct: remove,
    resetToDefaultMenu: reset,
    addCategory: addCat,
    updateCategory: updateCat,
    deleteCategory: removeCat,
    saveCategories: saveCats,
  };
}
