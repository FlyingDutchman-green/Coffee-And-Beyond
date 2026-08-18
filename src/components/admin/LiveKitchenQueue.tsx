"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Order, OrderStatus } from "@/types/order";
import {
  getAllOrders,
  updateOrderStatus,
} from "@/data/orderStore";
import { KitchenTicketCard } from "@/components/admin/KitchenTicketCard";
import { CancelOrderDialog } from "@/components/admin/CancelOrderDialog";
import {
  Search,
  X,
  Coffee,
  Clock,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export function LiveKitchenQueue() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | OrderStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Sync orders from storage
  const syncOrders = useCallback(() => {
    const list = getAllOrders();
    setOrders(list);
  }, []);

  useEffect(() => {
    syncOrders();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "coffee_and_beyond_orders") {
        syncOrders();
      }
    };

    const handleCustom = () => {
      syncOrders();
    };

    // Auto refresh every 10s as a resilient fallback
    const interval = setInterval(syncOrders, 10000);

    window.addEventListener("storage", handleStorage);
    window.addEventListener("coffee_order_updated", handleCustom);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("coffee_order_updated", handleCustom);
    };
  }, [syncOrders]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast.success("Status pesanan diperbarui.");
    syncOrders();
  };

  const handleConfirmCancel = (orderId: string) => {
    updateOrderStatus(orderId, "CANCELLED");
    toast.error("Pesanan telah dibatalkan.");
    syncOrders();
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    syncOrders();
    setTimeout(() => setIsRefreshing(false), 300);
  };

  // Active tickets are those in NEW, CONFIRMED, PREPARING, READY
  const activeOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.status === "NEW" ||
        o.status === "CONFIRMED" ||
        o.status === "PREPARING" ||
        o.status === "READY"
    );
  }, [orders]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: activeOrders.length,
      new: orders.filter((o) => o.status === "NEW").length,
      confirmed: orders.filter((o) => o.status === "CONFIRMED").length,
      preparing: orders.filter((o) => o.status === "PREPARING").length,
      ready: orders.filter((o) => o.status === "READY").length,
    };
  }, [orders, activeOrders]);

  // Filtered orders by tab and search
  const displayedOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return activeOrders.filter((order) => {
      // Tab filter
      const matchesTab = activeTab === "ALL" || order.status === activeTab;

      if (!query) return matchesTab;

      // Query filter
      const matchesQuery =
        order.id.toLowerCase().includes(query) ||
        order.tableId.toLowerCase().includes(query) ||
        order.items.some((i) => i.name.toLowerCase().includes(query));

      return matchesTab && matchesQuery;
    });
  }, [activeOrders, activeTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Controls Bar: Tabs, Search, Actions */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-canvas-primary border border-border-subtle p-4 rounded-lg shadow-2xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 border ${
              activeTab === "ALL"
                ? "bg-charcoal text-white border-charcoal shadow-xs"
                : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary hover:bg-[#EFEFEA]"
            }`}
          >
            <span>All Active Queue</span>
            <span
              className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full border ${
                activeTab === "ALL"
                  ? "bg-white/20 text-white border-white/30"
                  : "bg-canvas-primary text-text-muted border-border-subtle"
              }`}
            >
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("NEW")}
            className={`px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 border ${
              activeTab === "NEW"
                ? "bg-charcoal text-white border-charcoal font-semibold shadow-xs"
                : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>New ({counts.new})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("CONFIRMED")}
            className={`px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 border ${
              activeTab === "CONFIRMED"
                ? "bg-charcoal text-white border-charcoal font-semibold shadow-xs"
                : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary"
            }`}
          >
            <span>Confirmed ({counts.confirmed})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("PREPARING")}
            className={`px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 border ${
              activeTab === "PREPARING"
                ? "bg-charcoal text-white border-charcoal font-semibold shadow-xs"
                : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary"
            }`}
          >
            <span>In Prep ({counts.preparing})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("READY")}
            className={`px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 border ${
              activeTab === "READY"
                ? "bg-charcoal text-white border-charcoal font-semibold shadow-xs"
                : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready ({counts.ready})</span>
          </button>
        </div>

        {/* Right Search & Refresh Controls */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search table or order #..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-charcoal"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-text-muted hover:text-text-primary"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Manual Refresh */}
          <button
            type="button"
            onClick={handleManualRefresh}
            title="Segarkan antrean pesanan"
            aria-label="Segarkan antrean pesanan"
            className="p-2 bg-canvas-secondary border border-border-subtle rounded-md text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Grid of Kitchen Tickets */}
      {displayedOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {displayedOrders.map((order) => (
            <KitchenTicketCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onRequestCancel={(o) => setCancelModalOrder(o)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-[#E7E7E3] rounded-2xl p-12 text-center max-w-md mx-auto shadow-xs my-8">
          <div className="w-12 h-12 rounded-full bg-[#F7F7F5] flex items-center justify-center mx-auto mb-4 text-[#777772]">
            <Coffee className="w-6 h-6" />
          </div>
          <h3 className="font-sans font-bold text-base text-[#1E1E1C]">
            Belum Ada Pesanan Aktif
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#777772] mt-1.5 leading-relaxed">
            {searchQuery || activeTab !== "ALL"
              ? "Tidak ada pesanan aktif yang cocok dengan filter yang dipilih."
              : "Antrean dapur sedang tenang. Pesanan baru yang dikirim dari meja pelanggan akan otomatis masuk dan berdering di sini."}
          </p>
          {(searchQuery || activeTab !== "ALL") && (
            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("ALL");
                  setSearchQuery("");
                }}
                className="px-3.5 py-1.5 text-xs font-medium bg-[#F7F7F5] border border-[#E7E7E3] rounded-md text-[#1E1E1C] hover:bg-[#EFEFEA] transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      <CancelOrderDialog
        order={cancelModalOrder}
        isOpen={!!cancelModalOrder}
        onClose={() => setCancelModalOrder(null)}
        onConfirmCancel={handleConfirmCancel}
      />
    </div>
  );
}
