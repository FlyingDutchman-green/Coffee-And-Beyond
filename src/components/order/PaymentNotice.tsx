"use client";

import React from "react";
import { OrderStatus } from "@/types/order";
import { CreditCard, ArrowRight, CheckCircle2 } from "lucide-react";

interface PaymentNoticeProps {
  orderId: string;
  tableId: string;
  status: OrderStatus;
}

export function PaymentNotice({ orderId, tableId, status }: PaymentNoticeProps) {
  if (status !== "NEW") {
    return (
      <div className="p-4 rounded-lg bg-[#FDFBF7] border border-[#E2D9C8] text-[#7A5E28] flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-[#7A5E28] shrink-0" />
        <div className="text-xs space-y-0.5">
          <p className="font-semibold">Pembayaran Terverifikasi &amp; Diterima</p>
          <p className="text-[#7A5E28]/85">
            Pembayaran untuk Meja {tableId} telah diverifikasi dan diterima oleh kasir.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-lg bg-canvas-secondary border border-border-subtle space-y-3">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-canvas-primary border border-border-subtle text-text-primary shrink-0">
          <CreditCard className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-sm text-text-primary">
            Bayar di Kasir untuk Mulai Pembuatan
          </h3>
          <p className="text-xs text-text-muted leading-relaxed">
            Silakan menuju meja kasir dan sebutkan{" "}
            <strong className="text-text-primary font-semibold">Meja {tableId}</strong> atau{" "}
            <strong className="text-text-primary font-semibold font-mono">#{orderId}</strong> untuk
            menyelesaikan pembayaran (Tunai, QRIS, atau Kartu).
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
        <span className="font-medium text-text-primary">
          Langkah 1 dari 2: Verifikasi Kasir
        </span>
        <span className="inline-flex items-center gap-1 text-accent-warm font-medium">
          <span>Menunggu Kasir</span>
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}
