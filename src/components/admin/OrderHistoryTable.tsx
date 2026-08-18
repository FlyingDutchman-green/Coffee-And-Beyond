"use client";

import React, { useState, useMemo } from "react";
import { Order } from "@/types/order";
import { formatPrice } from "@/data/menu";
import { OrderSummaryCard } from "@/components/order/OrderSummaryCard";
import { Search, X, History, Receipt } from "lucide-react";

interface OrderHistoryTableProps {
  orders: Order[];
}

export function OrderHistoryTable({ orders }: OrderHistoryTableProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "COMPLETED" | "CANCELLED">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;

      if (!query) return matchesStatus;

      const matchesQuery =
        order.id.toLowerCase().includes(query) ||
        order.tableId.toLowerCase().includes(query) ||
        order.items.some((i) => i.name.toLowerCase().includes(query));

      return matchesStatus && matchesQuery;
    });
  }, [orders, statusFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-canvas-primary border border-border-subtle p-4 rounded-lg shadow-2xs">
        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors border cursor-pointer ${
              statusFilter === "ALL"
                ? "bg-[#1E1E1C] text-white border-[#1E1E1C]"
                : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary"
            }`}
          >
            All History ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("COMPLETED")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border cursor-pointer ${
              statusFilter === "COMPLETED"
                ? "bg-[#1E1E1C] text-white border-[#1E1E1C] font-semibold"
                : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary"
            }`}
          >
            Completed ({orders.filter((o) => o.status === "COMPLETED").length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("CANCELLED")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border cursor-pointer ${
              statusFilter === "CANCELLED"
                ? "bg-[#1E1E1C] text-white border-[#1E1E1C] font-semibold"
                : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary"
            }`}
          >
            Cancelled ({orders.filter((o) => o.status === "CANCELLED").length})
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
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-[#1E1E1C]"
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
                      <td className="py-3.5 px-4 text-text-muted font-mono">{dateFormatted}</td>
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
                          className="px-2.5 py-1 text-[11px] font-medium bg-canvas-secondary border border-border-subtle rounded text-text-primary hover:bg-[#EFEFEA] transition-colors cursor-pointer"
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
              Orders marked as Completed or Cancelled will appear here automatically.
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
                className="p-1 text-text-muted hover:text-text-primary rounded-md border border-border-subtle cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <OrderSummaryCard order={selectedOrder} />

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2 text-xs font-semibold bg-canvas-secondary border border-border-subtle rounded-md text-text-primary hover:bg-[#EFEFEA] cursor-pointer"
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
