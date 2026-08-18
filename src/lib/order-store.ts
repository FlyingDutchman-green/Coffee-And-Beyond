"use client";

import { useState, useEffect, useCallback } from "react";
import { Order, OrderStatus, OrderItem } from "@/types/order";

export const ORDERS_STORAGE_KEY = "coffee_and_beyond_orders";

// Initial seed orders for realistic testing and operational demonstration
export const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-8921",
    tableId: "A03",
    items: [
      {
        productId: "sig-01",
        name: "Beyond Aren Latte",
        price: 38000,
        quantity: 2,
        notes: "Oat milk, less ice",
        categoryName: "Signature Coffee",
      },
      {
        productId: "kit-01",
        name: "Truffle Wild Mushroom Toast",
        price: 58000,
        quantity: 1,
        notes: "Extra crispy toast",
        categoryName: "Comfort Kitchen",
      },
    ],
    status: "CONFIRMED",
    customerNotes: "Please serve the drinks first.",
    totalAmount: 134000,
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(), // 4 mins ago
    updatedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-8922",
    tableId: "B01",
    items: [
      {
        productId: "man-01",
        name: "Panama Geisha Natural V60",
        price: 68000,
        quantity: 1,
        categoryName: "Manual Brew & Single Origin",
      },
      {
        productId: "pas-02",
        name: "Pistachio Pain au Chocolat",
        price: 38000,
        quantity: 1,
        categoryName: "Pastry & Bakery",
      },
    ],
    status: "PREPARING",
    totalAmount: 106000,
    createdAt: new Date(Date.now() - 9 * 60 * 1000).toISOString(), // 9 mins ago
    updatedAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-8919",
    tableId: "A01",
    items: [
      {
        productId: "tea-01",
        name: "Kyoto Ceremonial Matcha Latte",
        price: 44000,
        quantity: 1,
        notes: "Iced, oat milk",
        categoryName: "Tea & Botanicals",
      },
      {
        productId: "pas-01",
        name: "Classic French Butter Croissant",
        price: 32000,
        quantity: 1,
        categoryName: "Pastry & Bakery",
      },
    ],
    status: "COMPLETED",
    totalAmount: 76000,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

export function generateOrderId(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${randomDigits}`;
}

export function getAllOrders(): Order[] {
  if (typeof window === "undefined") return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse orders from localStorage:", e);
    return INITIAL_ORDERS;
  }
}

export function getOrderById(orderId: string): Order | null {
  const orders = getAllOrders();
  return orders.find((o) => o.id.toUpperCase() === orderId.toUpperCase()) || null;
}

export function getOrdersByTable(tableId: string): Order[] {
  const orders = getAllOrders();
  const normalized = tableId.toUpperCase();
  return orders.filter((o) => o.tableId.toUpperCase() === normalized);
}

export function getActiveOrders(): Order[] {
  const orders = getAllOrders();
  return orders.filter(
    (o) =>
      o.status === "NEW" ||
      o.status === "CONFIRMED" ||
      o.status === "PREPARING" ||
      o.status === "READY"
  );
}

export function getHistoricalOrders(): Order[] {
  const orders = getAllOrders();
  return orders.filter(
    (o) => o.status === "COMPLETED" || o.status === "CANCELLED"
  );
}

function notifySubscribers(order: Order, isNew: boolean = false) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("coffee_order_updated", {
        detail: order,
      })
    );

    if (isNew) {
      window.dispatchEvent(
        new CustomEvent("coffee_new_order_created", {
          detail: order,
        })
      );
    }
  }
}

export function saveOrder(order: Order, isNew: boolean = false): Order {
  if (typeof window === "undefined") return order;
  try {
    const orders = getAllOrders();
    const existingIndex = orders.findIndex((o) => o.id === order.id);

    let updatedOrders: Order[];
    if (existingIndex >= 0) {
      updatedOrders = [...orders];
      updatedOrders[existingIndex] = order;
    } else {
      updatedOrders = [order, ...orders];
    }

    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
    notifySubscribers(order, isNew);
    return order;
  } catch (e) {
    console.error("Failed to save order to localStorage:", e);
    return order;
  }
}

export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Order | null {
  const order = getOrderById(orderId);
  if (!order) return null;

  const updated: Order = {
    ...order,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };

  return saveOrder(updated, false);
}

export function createNewOrder({
  tableId,
  items,
  customerNotes,
}: {
  tableId: string;
  items: OrderItem[];
  customerNotes?: string;
}): Order {
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const newOrder: Order = {
    id: generateOrderId(),
    tableId: tableId.toUpperCase(),
    items: [...items],
    status: "NEW",
    customerNotes: customerNotes?.trim() || undefined,
    totalAmount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return saveOrder(newOrder, true);
}

/**
 * Custom React hook for reactive order state synchronization across tabs and within the window.
 */
export function useOrderStore() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshOrders = useCallback(() => {
    setOrders(getAllOrders());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshOrders();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ORDERS_STORAGE_KEY) {
        refreshOrders();
      }
    };

    const handleOrderUpdate = () => {
      refreshOrders();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("coffee_order_updated", handleOrderUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("coffee_order_updated", handleOrderUpdate);
    };
  }, [refreshOrders]);

  const updateStatus = useCallback(
    (orderId: string, newStatus: OrderStatus) => {
      const res = updateOrderStatus(orderId, newStatus);
      refreshOrders();
      return res;
    },
    [refreshOrders]
  );

  const createOrder = useCallback(
    (params: { tableId: string; items: OrderItem[]; customerNotes?: string }) => {
      const res = createNewOrder(params);
      refreshOrders();
      return res;
    },
    [refreshOrders]
  );

  return {
    orders,
    isLoading,
    refreshOrders,
    updateStatus,
    createOrder,
  };
}
