"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Order } from "@/types/order";
import { getAllOrders } from "@/lib/order-store";
import { HistorySummaryCard } from "@/components/admin/HistorySummaryCard";
import { OrderHistoryTable } from "@/components/admin/OrderHistoryTable";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getAllOrders());

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "coffee_and_beyond_orders") {
        setOrders(getAllOrders());
      }
    };

    const handleCustom = () => {
      setOrders(getAllOrders());
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("coffee_order_updated", handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("coffee_order_updated", handleCustom);
    };
  }, []);

  // Historical orders are COMPLETED and CANCELLED
  const historicalOrders = useMemo(() => {
    return orders.filter(
      (o) => o.status === "COMPLETED" || o.status === "CANCELLED"
    );
  }, [orders]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const completed = historicalOrders.filter((o) => o.status === "COMPLETED");
    const cancelled = historicalOrders.filter((o) => o.status === "CANCELLED");
    const totalRevenue = completed.reduce((sum, o) => sum + o.totalAmount, 0);
    const avgTicket = completed.length > 0 ? totalRevenue / completed.length : 0;

    return {
      completedCount: completed.length,
      cancelledCount: cancelled.length,
      totalRevenue,
      avgTicket,
    };
  }, [historicalOrders]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-border-subtle pb-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
          <span className="w-6 h-[1px] bg-accent-warm" />
          <span>Operational Archive</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
          Order Transaction History
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Archived transaction records for completed and cancelled table orders.
        </p>
      </div>

      {/* Metrics Summary Strip */}
      <HistorySummaryCard
        completedCount={metrics.completedCount}
        cancelledCount={metrics.cancelledCount}
        totalRevenue={metrics.totalRevenue}
        avgTicket={metrics.avgTicket}
      />

      {/* Interactive Orders Archive Table */}
      <OrderHistoryTable orders={historicalOrders} />
    </div>
  );
}
