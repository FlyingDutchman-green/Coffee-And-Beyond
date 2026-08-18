"use client";

import React from "react";
import { Order } from "@/types/order";
import { formatPrice } from "@/data/menu";
import { Receipt, Clock, MapPin, MessageSquare } from "lucide-react";

interface OrderSummaryCardProps {
  order: Order;
}

export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const formattedTime = new Date(order.createdAt).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const totalQuantity = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="bg-canvas-primary border border-border-subtle rounded-lg p-5 sm:p-6 space-y-5">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-4 border-b border-border-subtle pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-text-muted" />
            <h3 className="font-mono text-sm sm:text-base font-bold text-text-primary">
              No. Pesanan: #{order.id}
            </h3>
          </div>
          <p className="text-xs text-text-muted flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>
              {formattedDate}, {formattedTime} WIB
            </span>
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-text-muted block uppercase tracking-wider font-semibold">
            Meja
          </span>
          <span className="font-mono font-bold text-sm sm:text-base text-text-primary flex items-center gap-1 justify-end">
            <MapPin className="w-3.5 h-3.5 text-accent-warm" />
            <span>{order.tableId}</span>
          </span>
        </div>
      </div>

      {/* Items Breakdown */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase font-semibold tracking-wider text-text-primary">
          Rincian Pesanan ({totalQuantity})
        </h4>

        <div className="divide-y divide-border-subtle">
          {order.items.map((item, idx) => (
            <div key={`${item.productId}-${idx}`} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
              <div className="flex items-start justify-between gap-2 text-xs sm:text-sm">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="font-mono font-semibold text-text-primary shrink-0">
                    [{item.quantity}x]
                  </span>
                  <span className="text-text-primary font-medium truncate">
                    {item.name}
                  </span>
                </div>
                <span className="font-semibold text-text-primary tabular-nums shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>

              {item.notes && (
                <div className="pl-6 text-[11px] text-accent-warm italic">
                  Catatan: {item.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* General Customer Notes */}
      {order.customerNotes && (
        <div className="p-3 rounded-md bg-canvas-secondary border border-border-subtle space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-text-primary">
            <MessageSquare className="w-3.5 h-3.5 text-accent-warm" />
            <span>Catatan Meja</span>
          </div>
          <p className="text-text-muted italic">{order.customerNotes}</p>
        </div>
      )}

      {/* Total Payment Amount */}
      <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
        <div>
          <span className="text-xs text-text-muted font-medium block">Total Pembayaran</span>
          <span className="text-[11px] text-text-muted">Termasuk pajak &amp; layanan</span>
        </div>
        <span className="text-lg sm:text-xl font-bold text-text-primary tabular-nums">
          {formatPrice(order.totalAmount)}
        </span>
      </div>
    </div>
  );
}
