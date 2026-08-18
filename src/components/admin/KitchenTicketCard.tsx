"use client";

import React, { useState, useEffect } from "react";
import { Order, OrderStatus } from "@/types/order";
import { formatPrice } from "@/data/menu";
import {
  Clock,
  CheckCircle,
  Coffee,
  Sparkles,
  CheckCheck,
  XCircle,
  FileText,
  AlertCircle,
} from "lucide-react";

interface KitchenTicketCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onRequestCancel: (order: Order) => void;
}

// Calculate human-friendly elapsed time since order was submitted
function getElapsedTime(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);

  if (diffMin < 1) return "< 1m ago";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  return `${diffHrs}h ${diffMin % 60}m ago`;
}

export function KitchenTicketCard({
  order,
  onStatusChange,
  onRequestCancel,
}: KitchenTicketCardProps) {
  const [elapsed, setElapsed] = useState<string>(getElapsedTime(order.createdAt));

  // Periodically refresh elapsed timer every 15 seconds
  useEffect(() => {
    setElapsed(getElapsedTime(order.createdAt));
    const interval = setInterval(() => {
      setElapsed(getElapsedTime(order.createdAt));
    }, 15000);

    return () => clearInterval(interval);
  }, [order.createdAt]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "NEW":
        return (
          <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-sm bg-[#F7F7F5] border border-[#E7E7E3] text-[#1E1E1C] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>New Order</span>
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-sm bg-[#FDFBF7] border border-[#E2D9C8] text-[#7A5E28] flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-[#7A5E28]" />
            <span>Confirmed</span>
          </span>
        );
      case "PREPARING":
        return (
          <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-sm bg-[#F4F7FA] border border-[#D2DCE5] text-[#2B4C6F] flex items-center gap-1">
            <Coffee className="w-3 h-3 text-[#2B4C6F]" />
            <span>Preparing</span>
          </span>
        );
      case "READY":
        return (
          <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-sm bg-[#F5F8F3] border border-[#D3DEC8] text-[#3B5E2B] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#3B5E2B]" />
            <span>Ready to Serve</span>
          </span>
        );
      case "COMPLETED":
        return (
          <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-sm bg-[#FAFAFA] border border-[#E7E7E3] text-[#777772] flex items-center gap-1">
            <CheckCheck className="w-3 h-3 text-[#777772]" />
            <span>Completed</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-sm bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] flex items-center gap-1">
            <XCircle className="w-3 h-3 text-[#8C3426]" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  // Determine next action configuration
  const getActionConfig = (status: OrderStatus) => {
    switch (status) {
      case "NEW":
        return {
          label: "Confirm Payment & Accept",
          nextStatus: "CONFIRMED" as OrderStatus,
          icon: CheckCircle,
        };
      case "CONFIRMED":
        return {
          label: "Start Preparing",
          nextStatus: "PREPARING" as OrderStatus,
          icon: Coffee,
        };
      case "PREPARING":
        return {
          label: "Mark Ready to Serve",
          nextStatus: "READY" as OrderStatus,
          icon: Sparkles,
        };
      case "READY":
        return {
          label: "Serve & Complete",
          nextStatus: "COMPLETED" as OrderStatus,
          icon: CheckCheck,
        };
      default:
        return null;
    }
  };

  const action = getActionConfig(order.status);
  const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="bg-canvas-primary border border-border-subtle rounded-lg p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-2xs hover:border-[#D0D0CA] transition-colors">
      {/* Header: Table, Order ID, Timer, Status */}
      <div className="space-y-3 border-b border-border-subtle pb-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-text-primary tracking-tight font-mono">
                TABLE {order.tableId}
              </span>
              <span className="font-mono text-xs text-text-muted">
                #{order.id}
              </span>
            </div>
            <p className="text-[11px] text-text-muted font-mono flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-accent-warm" />
              <span>{elapsed}</span>
            </p>
          </div>

          <div>{getStatusBadge(order.status)}</div>
        </div>
      </div>

      {/* Item List with high-contrast quantity badges & note callouts */}
      <div className="space-y-3 flex-1">
        <div className="divide-y divide-border-subtle">
          {order.items.map((item, idx) => (
            <div
              key={`${item.productId}-${idx}`}
              className="py-2.5 first:pt-0 last:pb-0 space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <span className="bg-charcoal text-white px-2 py-0.5 rounded text-xs font-bold font-mono shrink-0 shadow-2xs">
                    {item.quantity}x
                  </span>
                  <div>
                    <p className="font-semibold text-text-primary text-sm leading-snug">
                      {item.name}
                    </p>
                    {item.categoryName && (
                      <span className="text-[10px] text-text-muted uppercase">
                        {item.categoryName}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-xs font-semibold text-text-primary tabular-nums shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>

              {/* Special Note Callout */}
              {item.notes && (
                <div className="ml-8 p-2 rounded-r-md bg-canvas-secondary border-l-2 border-accent-warm text-xs text-text-muted space-y-0.5">
                  <div className="flex items-center gap-1 font-semibold text-text-primary text-[11px]">
                    <FileText className="w-3 h-3 text-accent-warm" />
                    <span>Special Request:</span>
                  </div>
                  <p className="italic text-text-primary font-medium">{item.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* General Customer Notes */}
        {order.customerNotes && (
          <div className="p-2.5 rounded-md bg-canvas-secondary border border-border-subtle space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-text-primary">
              <AlertCircle className="w-3.5 h-3.5 text-accent-warm" />
              <span>General Table Instruction</span>
            </div>
            <p className="text-text-muted italic">{order.customerNotes}</p>
          </div>
        )}
      </div>

      {/* Bottom Summary & Actions */}
      <div className="pt-3 border-t border-border-subtle space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-muted">
            Total ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})
          </span>
          <span className="font-bold text-sm sm:text-base text-text-primary tabular-nums">
            {formatPrice(order.totalAmount)}
          </span>
        </div>

        {/* Primary Action Button */}
        {action && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onStatusChange(order.id, action.nextStatus)}
              className="w-full h-11 bg-charcoal text-white font-semibold text-xs sm:text-sm rounded-md hover:bg-[#3A3A37] transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <action.icon className="w-4 h-4" />
              <span>{action.label}</span>
            </button>

            {order.status !== "COMPLETED" && (
              <button
                type="button"
                onClick={() => onRequestCancel(order)}
                className="w-full py-1 text-[11px] font-medium text-text-muted hover:text-[#8C3426] transition-colors text-center"
              >
                Cancel this order ticket
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
