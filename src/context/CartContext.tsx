"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { OrderItem, Order } from "@/types/order";
import { Product } from "@/types/menu";
import { createNewOrder } from "@/data/orderStore";

interface CartContextType {
  tableId: string;
  items: OrderItem[];
  addItem: (product: Product, quantity?: number, notes?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateItemNotes: (productId: string, notes: string) => void;
  getItemQuantity: (productId: string) => number;
  getItem: (productId: string) => OrderItem | undefined;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  submitOrder: (customerNotes?: string) => Promise<Order>;
  isSubmitting: boolean;
  error: string | null;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  tableId: string;
  children: ReactNode;
}

export function CartProvider({ tableId, children }: CartProviderProps) {
  const normalizedTableId = tableId.trim().toUpperCase();
  const storageKey = `coffee_and_beyond_cart_${normalizedTableId}`;

  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cart from localStorage on mount or table change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        setItems([]);
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage:", e);
      setItems([]);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Persist cart to localStorage on changes after initial load
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e);
    }
  }, [items, storageKey, isLoaded]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  const getItemQuantity = useCallback(
    (productId: string): number => {
      const found = items.find((item) => item.productId === productId);
      return found ? found.quantity : 0;
    },
    [items]
  );

  const getItem = useCallback(
    (productId: string): OrderItem | undefined => {
      return items.find((item) => item.productId === productId);
    },
    [items]
  );

  const addItem = useCallback(
    (product: Product, quantity: number = 1, notes?: string) => {
      if (!product.isAvailable) {
        setError(`"${product.name}" saat ini sedang habis.`);
        return;
      }

      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.productId === product.id
        );

        if (existingIndex >= 0) {
          const updated = [...prev];
          const current = updated[existingIndex];
          const newQty = current.quantity + quantity;
          if (newQty <= 0) {
            return prev.filter((item) => item.productId !== product.id);
          }
          updated[existingIndex] = {
            ...current,
            quantity: newQty,
            notes: notes !== undefined ? notes : current.notes,
          };
          return updated;
        }

        if (quantity <= 0) return prev;

        const newItem: OrderItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          notes,
          categoryName: product.categoryName,
          categorySlug: product.categorySlug,
        };

        return [...prev, newItem];
      });
      setError(null);
    },
    []
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.productId !== productId);
      }
      return prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
    });
  }, []);

  const updateItemNotes = useCallback((productId: string, notes: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, notes: notes.trim() ? notes : undefined }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.error("Failed to clear cart storage:", e);
    }
  }, [storageKey]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const submitOrder = useCallback(
    async (customerNotes?: string): Promise<Order> => {
      if (items.length === 0) {
        throw new Error("Keranjang pesanan masih kosong.");
      }

      setIsSubmitting(true);
      setError(null);

      try {
        // Create and persist the order
        const createdOrder = createNewOrder({
          tableId: normalizedTableId,
          items,
          customerNotes,
        });

        // Clear table cart upon successful order creation
        clearCart();
        setIsDrawerOpen(false);

        return createdOrder;
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Gagal mengirim pesanan. Silakan coba lagi.";
        setError(errorMsg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [items, normalizedTableId, clearCart]
  );

  const value = useMemo(
    () => ({
      tableId: normalizedTableId,
      items,
      addItem,
      removeItem,
      updateQuantity,
      updateItemNotes,
      getItemQuantity,
      getItem,
      clearCart,
      subtotal,
      totalItems,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      submitOrder,
      isSubmitting,
      error,
      clearError,
    }),
    [
      normalizedTableId,
      items,
      addItem,
      removeItem,
      updateQuantity,
      updateItemNotes,
      getItemQuantity,
      getItem,
      clearCart,
      subtotal,
      totalItems,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      submitOrder,
      isSubmitting,
      error,
      clearError,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function useOptionalCart() {
  return useContext(CartContext);
}

