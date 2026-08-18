"use client";

import React, { useEffect } from "react";
import { Order } from "@/types/order";
import { AlertTriangle, X } from "lucide-react";

interface CancelOrderDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (orderId: string) => void;
}

export function CancelOrderDialog({
  order,
  isOpen,
  onClose,
  onConfirmCancel,
}: CancelOrderDialogProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs transition-opacity duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-dialog-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-canvas-primary border border-border-subtle rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-5 sm:p-6 space-y-5 text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="cancel-dialog-title"
                className="text-base font-semibold text-text-primary"
              >
                Cancel Order #{order.id}?
              </h3>
              <p className="text-xs text-text-muted font-mono">
                Table {order.tableId} • {order.items.length} items
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-text-muted hover:text-text-primary rounded-md border border-border-subtle"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-text-muted leading-relaxed">
          Are you sure you want to cancel this order? This action will void the ticket
          and mark it as cancelled on both the customer screen and order history.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-canvas-primary border border-border-subtle rounded-md text-text-primary hover:bg-canvas-secondary transition-colors"
          >
            Keep Order
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirmCancel(order.id);
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold bg-[#8C3426] text-white rounded-md hover:bg-[#732B20] transition-colors shadow-xs"
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
}
