import { Product } from "@/types/menu";
import {
  getAllProducts,
  toggleProductAvailability as toggleAvail,
  updateProduct as updateProd,
  saveProducts,
  resetToDefaultMenu,
} from "@/lib/menu-store";

export interface StockOverride {
  isAvailable: boolean;
  price?: number;
}

export type MenuStockMap = Record<string, StockOverride>;

export function getStockOverrides(): MenuStockMap {
  const products = getAllProducts();
  const map: MenuStockMap = {};
  products.forEach((p) => {
    map[p.id] = {
      isAvailable: p.isAvailable,
      price: p.price,
    };
  });
  return map;
}

export function saveStockOverrides(overrides: MenuStockMap): void {
  const products = getAllProducts();
  const updated = products.map((p) => {
    const override = overrides[p.id];
    if (!override) return p;
    return {
      ...p,
      isAvailable:
        override.isAvailable !== undefined ? override.isAvailable : p.isAvailable,
      price: override.price !== undefined ? override.price : p.price,
    };
  });
  saveProducts(updated);
}

export function toggleProductAvailability(productId: string): boolean {
  return toggleAvail(productId);
}

export function updateProductPrice(productId: string, newPrice: number): void {
  updateProd(productId, { price: newPrice });
}

export function getMergedProducts(): Product[] {
  return getAllProducts();
}

export function resetMenuStock(): void {
  resetToDefaultMenu();
}
