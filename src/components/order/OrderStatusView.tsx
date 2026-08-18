"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Order, OrderStatus, TableInfo } from "@/types/order";
import { getOrderById, updateOrderStatus, saveOrder } from "@/data/orderStore";
import { OrderStatusTracker } from "@/components/order/OrderStatusTracker";
import { PaymentNotice } from "@/components/order/PaymentNotice";
import { OrderSummaryCard } from "@/components/order/OrderSummaryCard";
import { TableContextBanner } from "@/components/order/TableContextBanner";
import { ArrowLeft, PlusCircle, AlertCircle, RefreshCw } from "lucide-react";

interface OrderStatusViewProps {
  table: TableInfo;
  orderId: string;
}

export function OrderStatusView({ table, orderId }: OrderStatusViewProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncOrder = useCallback(() => {
    const existing = getOrderById(orderId);
    if (existing) {
      setOrder(existing);
    }
  }, [orderId]);

  // Initial load
  useEffect(() => {
    const existing = getOrderById(orderId);

    if (existing) {
      setOrder(existing);
    } else {
      // Fallback mock order if accessed directly via URL without prior cart submission
      const fallbackOrder: Order = {
        id: orderId.toUpperCase(),
        tableId: table.id,
        items: [
          {
            productId: "sig-01",
            name: "Beyond Aren Latte",
            price: 38000,
            quantity: 1,
            notes: "Oat milk, less sugar",
          },
          {
            productId: "pas-02",
            name: "Pistachio Pain au Chocolat",
            price: 38000,
            quantity: 1,
          },
        ],
        status: "NEW",
        totalAmount: 76000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveOrder(fallbackOrder);
      setOrder(fallbackOrder);
    }

    setIsLoading(false);
  }, [orderId, table.id]);

  // Listen for storage events (other tabs/windows) and custom events (same window)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "coffee_and_beyond_orders") {
        syncOrder();
      }
    };

    const handleCustomUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Order>;
      if (
        customEvent.detail &&
        customEvent.detail.id.toUpperCase() === orderId.toUpperCase()
      ) {
        setOrder({ ...customEvent.detail });
      } else {
        syncOrder();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("coffee_order_updated", handleCustomUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("coffee_order_updated", handleCustomUpdate);
    };
  }, [orderId, syncOrder]);

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (!order) return;
    const updated = updateOrderStatus(order.id, newStatus);
    if (updated) {
      setOrder({ ...updated });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas-secondary flex items-center justify-center p-4 text-text-muted">
        <div className="flex items-center gap-2 text-xs">
          <RefreshCw className="w-4 h-4 animate-spin text-accent-warm" />
          <span>Memuat status pesanan...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-canvas-secondary flex flex-col items-center justify-center p-4 text-center space-y-4">
        <div className="p-3 rounded-full bg-canvas-primary border border-border-subtle text-text-muted">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-text-primary">
            Pesanan Tidak Ditemukan
          </h2>
          <p className="text-xs text-text-muted max-w-xs">
            Kami tidak dapat menemukan pesanan #{orderId}. Silakan pindai ulang kode QR di meja Anda.
          </p>
        </div>
        <Link
          href={`/order/${table.id}`}
          className="px-4 py-2 text-xs font-semibold bg-charcoal text-white rounded-md hover:bg-[#3A3A37] transition-colors"
        >
          Kembali ke Menu Meja {table.id}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-secondary flex flex-col items-center pb-16 text-text-primary">
      {/* Mobile Ordering Container max-w-[480px] */}
      <div className="w-full max-w-[480px] bg-canvas-primary border-x border-border-subtle min-h-screen flex flex-col shadow-xs">
        {/* Table Banner */}
        <TableContextBanner table={table} />

        {/* Back navigation & Page Title */}
        <div className="p-4 border-b border-border-subtle bg-canvas-primary flex items-center justify-between gap-3">
          <Link
            href={`/order/${table.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Menu Meja {table.id}</span>
          </Link>

          <span className="font-mono text-xs font-semibold text-text-primary bg-canvas-secondary px-2.5 py-0.5 rounded border border-border-subtle">
            No. Pesanan: #{order.id}
          </span>
        </div>

        {/* Main Status Tracking Flow */}
        <main className="flex-1 p-4 space-y-5">
          {/* Visual Progress Stepper */}
          <OrderStatusTracker status={order.status} />

          {/* Payment & Cashier Instructions Notice */}
          <PaymentNotice
            orderId={order.id}
            tableId={table.id}
            status={order.status}
          />

          {/* Order Summary & Item Receipt Breakdown */}
          <OrderSummaryCard order={order} />

          {/* Help Info Callout */}
          <div className="p-3 bg-canvas-secondary border border-border-subtle rounded-md text-xs text-text-muted text-center leading-relaxed">
            <span>Butuh bantuan? Silakan panggil staf kami atau hubungi kasir.</span>
          </div>

          {/* Action Buttons to add more items */}
          <div className="pt-1">
            <Link
              href={`/order/${table.id}`}
              className="w-full h-11 bg-canvas-primary text-text-primary border border-border-subtle font-semibold text-xs rounded-md hover:bg-canvas-secondary transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-accent-warm" />
              <span>Pesan Menu Tambahan +</span>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
