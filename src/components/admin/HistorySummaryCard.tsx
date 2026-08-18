"use client";

import React from "react";
import { formatPrice } from "@/data/menu";
import { CheckCheck, XCircle, DollarSign, TrendingUp } from "lucide-react";

interface HistorySummaryCardProps {
  completedCount: number;
  cancelledCount: number;
  totalRevenue: number;
  avgTicket: number;
}

export function HistorySummaryCard({
  completedCount,
  cancelledCount,
  totalRevenue,
  avgTicket,
}: HistorySummaryCardProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Selesai */}
      <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-1 shadow-2xs">
        <div className="flex items-center justify-between text-text-muted text-xs">
          <span>Total Selesai</span>
          <CheckCheck className="w-4 h-4 text-[#3B5E2B]" />
        </div>
        <p className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums">
          {completedCount}
        </p>
      </div>

      {/* Akumulasi Nilai Transaksi */}
      <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-1 shadow-2xs">
        <div className="flex items-center justify-between text-text-muted text-xs">
          <span>Akumulasi Transaksi</span>
          <DollarSign className="w-4 h-4 text-accent-warm" />
        </div>
        <p className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums">
          {formatPrice(totalRevenue)}
        </p>
      </div>

      {/* Rata-rata Pesanan */}
      <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-1 shadow-2xs">
        <div className="flex items-center justify-between text-text-muted text-xs">
          <span>Rata-rata Pesanan</span>
          <TrendingUp className="w-4 h-4 text-text-muted" />
        </div>
        <p className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums">
          {formatPrice(avgTicket)}
        </p>
      </div>

      {/* Total Dibatalkan */}
      <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-1 shadow-2xs">
        <div className="flex items-center justify-between text-text-muted text-xs">
          <span>Total Dibatalkan</span>
          <XCircle className="w-4 h-4 text-[#8C3426]" />
        </div>
        <p className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums">
          {cancelledCount}
        </p>
      </div>
    </div>
  );
}
