"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Order } from "@/types/order";
import { getAllOrders } from "@/data/orderStore";
import { formatPrice } from "@/data/menu";
import { OrderSummaryCard } from "@/components/order/OrderSummaryCard";
import {
  Search,
  X,
  History,
  CheckCheck,
  XCircle,
  Receipt,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export function OrderHistoryView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "COMPLETED" | "CANCELLED">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  // Filtered list
  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return historicalOrders.filter((order) => {
      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;

      if (!query) return matchesStatus;

      const matchesQuery =
        order.id.toLowerCase().includes(query) ||
        order.tableId.toLowerCase().includes(query) ||
        order.items.some((i) => i.name.toLowerCase().includes(query));

      return matchesStatus && matchesQuery;
    });
  }, [historicalOrders, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Completed */}
        <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span>Completed Orders</span>
            <CheckCheck className="w-4 h-4 text-[#3B5E2B]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums">
            {metrics.completedCount}
          </p>
        </div>

        {/* Total Revenue */}
        <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-accent-warm" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums">
            {formatPrice(metrics.totalRevenue)}
          </p>
        </div>

        {/* Average Ticket Value */}
        <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span>Avg Order Value</span>
            <TrendingUp className="w-4 h-4 text-text-muted" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums">
            {formatPrice(metrics.avgTicket)}
          </p>
        </div>

        {/* Cancelled Orders */}
        <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span>Cancelled Orders</span>
            <XCircle className="w-4 h-4 text-[#8C3426]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums">
            {metrics.cancelledCount}
          </p>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-canvas-primary border border-border-subtle p-4 rounded-lg shadow-2xs">
        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border ${
              statusFilter === "ALL"
                ? "bg-charcoal text-white border-charcoal"
                : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary"
            }`}
          >
            All History ({historicalOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("COMPLETED")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
              statusFilter === "COMPLETED"
                ? "bg-charcoal text-white border-charcoal"
                : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary"
            }`}
          >
            Completed ({metrics.completedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("CANCELLED")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
              statusFilter === "CANCELLED"
                ? "bg-charcoal text-white border-charcoal"
                : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary"
            }`}
          >
            Cancelled ({metrics.cancelledCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, table, item..."
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
      </div>

      {/* Orders Table */}
      <div className="bg-canvas-primary border border-border-subtle rounded-lg overflow-hidden shadow-2xs">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-canvas-secondary/80 border-b border-border-subtle text-text-muted font-medium uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Table</th>
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4">Total (IDR)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredOrders.map((order) => {
                  const dateFormatted = new Date(order.createdAt).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  );

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-canvas-secondary/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-text-primary">
                        #{order.id}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-text-primary">
                        TABLE {order.tableId}
                      </td>
                      <td className="py-3.5 px-4 text-text-muted">{dateFormatted}</td>
                      <td className="py-3.5 px-4 text-text-primary max-w-xs truncate">
                        {order.items
                          .map((i) => `${i.quantity}x ${i.name}`)
                          .join(", ")}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-text-primary tabular-nums">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="py-3.5 px-4">
                        {order.status === "COMPLETED" ? (
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-sm bg-[#FAFAFA] border border-[#E7E7E3] text-[#777772]">
                            Completed
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-sm bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426]">
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1 text-[11px] font-medium bg-canvas-secondary border border-border-subtle rounded text-text-primary hover:bg-[#EFEFEA] transition-colors"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-2">
            <History className="w-8 h-8 text-text-muted mx-auto" />
            <h3 className="font-semibold text-text-primary text-sm">
              No historical orders found
            </h3>
            <p className="text-xs text-text-muted">
              Orders marked as Completed or Cancelled will be archived here.
            </p>
          </div>
        )}
      </div>

      {/* Receipt Detail Modal */}
      {selectedOrder && (
        <div
          onClick={() => setSelectedOrder(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs transition-opacity duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-canvas-primary border border-border-subtle rounded-lg shadow-xl overflow-hidden p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-text-muted" />
                <h3 className="font-bold text-sm font-mono text-text-primary">
                  Order Receipt #{selectedOrder.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close receipt"
                className="p-1 text-text-muted hover:text-text-primary rounded-md border border-border-subtle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <OrderSummaryCard order={selectedOrder} />

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2 text-xs font-semibold bg-canvas-secondary border border-border-subtle rounded-md text-text-primary hover:bg-[#EFEFEA]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
