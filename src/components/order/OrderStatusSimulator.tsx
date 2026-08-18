"use client";

import React from "react";
import { OrderStatus } from "@/types/order";
import { ChevronRight, RotateCcw, XCircle, Wrench } from "lucide-react";

interface OrderStatusSimulatorProps {
  currentStatus: OrderStatus;
  onStatusChange: (newStatus: OrderStatus) => void;
}

const STATUS_FLOW: OrderStatus[] = [
  "NEW",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
];

export function OrderStatusSimulator({
  currentStatus,
  onStatusChange,
}: OrderStatusSimulatorProps) {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  const nextStatus =
    currentIndex >= 0 && currentIndex < STATUS_FLOW.length - 1
      ? STATUS_FLOW[currentIndex + 1]
      : null;

  const STATUS_LABEL_MAP: Record<OrderStatus, string> = {
    NEW: "Pesanan Diterima",
    CONFIRMED: "Pembayaran Terverifikasi",
    PREPARING: "Sedang Disiapkan",
    READY: "Siap Diantar",
    COMPLETED: "Selesai",
    CANCELLED: "Dibatalkan",
  };

  const handleNext = () => {
    if (nextStatus) {
      onStatusChange(nextStatus);
    }
  };

  const handleReset = () => {
    onStatusChange("NEW");
  };

  const handleCancel = () => {
    onStatusChange("CANCELLED");
  };

  return (
    <div className="p-4 rounded-lg bg-canvas-secondary border border-border-subtle space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
          <Wrench className="w-3.5 h-3.5 text-accent-warm" />
          <span>Simulator Status Dapur (Alat Uji QA)</span>
        </div>
        <span className="text-[10px] font-mono text-text-muted bg-canvas-primary border border-border-subtle px-1.5 py-0.5 rounded-sm">
          Simulasi Sistem
        </span>
      </div>

      <p className="text-[11px] text-text-muted leading-relaxed">
        Uji coba alur status pesanan secara langsung seperti yang dijalankan kasir dan staf dapur.
      </p>

      <div className="flex items-center gap-2 flex-wrap pt-1">
        {nextStatus && (
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 min-w-[120px] px-3 py-2 text-xs font-semibold bg-charcoal text-white rounded-md hover:bg-[#3A3A37] transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
          >
            <span>Lanjut: &ldquo;{STATUS_LABEL_MAP[nextStatus]}&rdquo;</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-2 text-xs font-medium bg-canvas-primary text-text-primary border border-border-subtle rounded-md hover:bg-canvas-secondary transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 text-text-muted" />
          <span>Reset Diterima</span>
        </button>

        {currentStatus !== "CANCELLED" && (
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-2 text-xs font-medium text-[#8C3426] bg-canvas-primary border border-[#ECCEC9] rounded-md hover:bg-[#FDF6F5] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <XCircle className="w-3 h-3" />
            <span>Batalkan Pesanan</span>
          </button>
        )}
      </div>
    </div>
  );
}
