"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Order, OrderStatus } from "@/types/order";
import {
  getAllOrders,
  updateOrderStatus,
} from "@/lib/order-store";
import { KitchenOrderCard } from "@/components/admin/KitchenOrderCard";
import {
  StatusFilterBar,
  FilterStatusTab,
} from "@/components/admin/StatusFilterBar";
import { CancelOrderDialog } from "@/components/admin/CancelOrderDialog";
import { AudioAlert } from "@/components/admin/AudioAlert";
import {
  Search,
  X,
  Coffee,
  RefreshCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";

export function LiveOrderFeed() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<FilterStatusTab>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const prevNewOrderCountRef = useRef<number>(0);
  const hasInitializedRef = useRef<boolean>(false);

  // Sync orders from storage
  const syncOrders = useCallback(() => {
    const list = getAllOrders();
    setOrders(list);

    const currentNewCount = list.filter((o) => o.status === "NEW").length;
    if (hasInitializedRef.current && currentNewCount > prevNewOrderCountRef.current) {
      AudioAlert.playNewOrderAlert();
    }
    prevNewOrderCountRef.current = currentNewCount;
    hasInitializedRef.current = true;
  }, []);

  useEffect(() => {
    syncOrders();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "coffee_and_beyond_orders") {
        syncOrders();
      }
    };

    const handleOrderUpdate = () => {
      syncOrders();
    };

    const handleNewOrder = () => {
      syncOrders();
      AudioAlert.playNewOrderAlert();
    };

    // Auto-refresh interval fallback every 8 seconds
    const interval = setInterval(syncOrders, 8000);

    window.addEventListener("storage", handleStorage);
    window.addEventListener("coffee_order_updated", handleOrderUpdate);
    window.addEventListener("coffee_new_order_created", handleNewOrder);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("coffee_order_updated", handleOrderUpdate);
      window.removeEventListener("coffee_new_order_created", handleNewOrder);
    };
  }, [syncOrders]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    AudioAlert.playStatusTransitionAlert();
    toast.success("Status pesanan diperbarui.");
    syncOrders();
  };

  const handleConfirmCancel = (orderId: string) => {
    updateOrderStatus(orderId, "CANCELLED");
    AudioAlert.playStatusTransitionAlert();
    toast.error("Pesanan telah dibatalkan.");
    syncOrders();
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    syncOrders();
    setTimeout(() => setIsRefreshing(false), 300);
  };

  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    AudioAlert.setMuted(nextMuted);
    if (!nextMuted) {
      AudioAlert.playStatusTransitionAlert();
    }
  };

  // Active tickets are those in NEW, CONFIRMED, PREPARING, READY
  // Sorted by oldest submission time first (longest waiting queue prioritized at top-left)
  const activeOrders = useMemo(() => {
    return orders
      .filter(
        (o) =>
          o.status === "NEW" ||
          o.status === "CONFIRMED" ||
          o.status === "PREPARING" ||
          o.status === "READY"
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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
      {/* Top Controls Toolbar: Tabs, Search, Sound, Refresh */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-canvas-primary border border-border-subtle p-4 rounded-lg shadow-2xs">
        {/* Status Filter Tabs */}
        <StatusFilterBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
        />

        {/* Right Search, Sound & Refresh Controls */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari meja atau no order..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-[#1E1E1C]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Hapus pencarian"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sound Alert Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={isMuted ? "Bunyikan notifikasi suara" : "Senyapkan notifikasi suara"}
            aria-label={isMuted ? "Bunyikan notifikasi suara" : "Senyapkan notifikasi suara"}
            className={`p-2 border rounded-md transition-colors cursor-pointer ${
              isMuted
                ? "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary"
                : "bg-[#FDFBF7] text-[#7A5E28] border-[#E2D9C8] font-semibold"
            }`}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#7A5E28]" />
            )}
          </button>

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
            <KitchenOrderCard
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
