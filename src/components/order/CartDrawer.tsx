"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/menu";
import {
  X,
  Plus,
  Minus,
  Trash2,
  FileText,
  AlertCircle,
  ShieldCheck,
  QrCode,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export function CartDrawer() {
  const router = useRouter();
  const {
    tableId,
    items,
    updateQuantity,
    updateItemNotes,
    removeItem,
    clearCart,
    subtotal,
    totalItems,
    isDrawerOpen,
    closeDrawer,
    submitOrder,
    isSubmitting,
    error,
    clearError,
  } = useCart();

  const [customerNotes, setCustomerNotes] = useState("");
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [localSubmitting, setLocalSubmitting] = useState(false);

  // Close on Escape key & lock body scroll
  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeDrawer();
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast.info("Keranjang pesanan dikosongkan");
  };

  const handleConfirmOrder = async () => {
    if (localSubmitting || isSubmitting || items.length === 0) return;
    setLocalSubmitting(true);
    try {
      clearError();
      const sanitizedNotes = customerNotes.trim().slice(0, 200);
      const order = await submitOrder(sanitizedNotes);
      toast.success("Pesanan Meja " + tableId + " berhasil dikirim ke dapur!");
      router.push(`/order/${tableId}/status/${order.id}`);
    } catch (e) {
      console.error("Order submission failed:", e);
      setLocalSubmitting(false);
    }
  };

  const isButtonDisabled = localSubmitting || isSubmitting || items.length === 0;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-charcoal/45 backdrop-blur-xs transition-opacity duration-150 p-0 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-canvas-primary border border-border-subtle rounded-t-xl sm:rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-in slide-in-from-bottom duration-200"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-border-subtle flex items-center justify-between gap-4 bg-canvas-primary shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-canvas-secondary border border-border-subtle flex items-center justify-center text-text-primary">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="cart-drawer-title"
                className="text-base font-semibold text-text-primary tracking-tight leading-tight"
              >
                Pesanan Meja {tableId}
              </h2>
              <p className="text-[11px] text-text-muted">
                {totalItems} menu di keranjang
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={handleClearCart}
                aria-label="Kosongkan semua pesanan dari keranjang"
                className="text-xs text-text-muted hover:text-[#8C3426] px-2 py-1 transition-colors cursor-pointer font-medium"
              >
                Kosongkan
              </button>
            )}
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Tutup keranjang pesanan"
              className="p-1.5 text-text-muted hover:text-text-primary hover:bg-canvas-secondary rounded-md border border-border-subtle transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Cart Items List */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-left">
          {error && (
            <div className="p-3 rounded-md bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm font-medium text-text-primary">
                Keranjang pesanan masih kosong
              </p>
              <p className="text-xs text-text-muted">
                Pilih racikan kopi atau menu pilihan untuk mulai memesan.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border-subtle space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-text-primary leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-text-muted tabular-nums">
                        {formatPrice(item.price)}
                      </p>

                      {/* Item Specific Note Tag */}
                      {item.notes && editingNotesId !== item.productId && (
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-accent-warm bg-canvas-secondary border border-border-subtle px-2 py-0.5 rounded-sm w-fit">
                          <FileText className="w-3 h-3 shrink-0" />
                          <span className="italic truncate max-w-[200px]">
                            &ldquo;{item.notes}&rdquo;
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingNotesId(item.productId)}
                            aria-label={`Ubah catatan khusus untuk ${item.name}`}
                            className="text-text-muted hover:text-text-primary ml-1 underline text-[10px] cursor-pointer"
                          >
                            Ubah
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Quantity Stepper & Remove */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-border-subtle rounded-md bg-canvas-primary overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          aria-label={`Kurangi jumlah ${item.name}`}
                          className="w-8 h-8 min-w-[32px] flex items-center justify-center text-text-primary hover:bg-canvas-secondary transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-mono text-xs font-semibold text-text-primary tabular-nums select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          aria-label={`Tambah jumlah ${item.name}`}
                          className="w-8 h-8 min-w-[32px] flex items-center justify-center text-text-primary hover:bg-canvas-secondary transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Hapus ${item.name} dari keranjang`}
                        className="p-1.5 text-text-muted hover:text-[#8C3426] transition-colors rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Add / Edit Note Field */}
                  {editingNotesId === item.productId ? (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        maxLength={150}
                        id={`note-input-${item.productId}`}
                        aria-label={`Catatan menu untuk ${item.name}`}
                        defaultValue={item.notes || ""}
                        placeholder="Contoh: Less ice, jangan terlalu manis..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateItemNotes(item.productId, (e.target as HTMLInputElement).value.slice(0, 150));
                            setEditingNotesId(null);
                          }
                        }}
                        onBlur={(e) => {
                          updateItemNotes(item.productId, e.target.value.slice(0, 150));
                          setEditingNotesId(null);
                        }}
                        autoFocus
                        className="flex-1 text-xs px-2.5 py-1.5 bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingNotesId(null)}
                        className="text-xs px-2.5 py-1.5 bg-canvas-primary border border-border-subtle rounded text-text-primary font-medium cursor-pointer"
                      >
                        Simpan
                      </button>
                    </div>
                  ) : !item.notes ? (
                    <button
                      type="button"
                      onClick={() => setEditingNotesId(item.productId)}
                      aria-label={`Tambah catatan menu untuk ${item.name}`}
                      className="text-[11px] text-text-muted hover:text-text-primary flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Tambah catatan menu (opsional)</span>
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          )}

          {/* General Order Instructions */}
          {items.length > 0 && (
            <div className="pt-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="order-customer-notes"
                  className="uppercase font-semibold tracking-wide text-text-primary block text-[11px]"
                >
                  CATATAN UNTUK BARISTA &amp; DAPUR (OPSIONAL)
                </label>
                <span className="text-[11px] text-text-muted font-mono">
                  {customerNotes.length}/200
                </span>
              </div>
              <textarea
                id="order-customer-notes"
                rows={2}
                maxLength={200}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Tulis permintaan umum untuk barista atau dapur (contoh: minuman disajikan duluan, sedotan ramah lingkungan)..."
                className="w-full text-xs p-2.5 bg-canvas-secondary border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-charcoal resize-none leading-relaxed"
              />
            </div>
          )}

          {/* Operational Policy Callout */}
          {items.length > 0 && (
            <div className="p-3 bg-canvas-secondary border border-border-subtle rounded-md flex items-start gap-2.5 text-xs text-text-muted">
              <ShieldCheck className="w-4 h-4 text-accent-warm shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Bayar di Kasir:</strong> Pesanan Anda akan diverifikasi oleh kasir
                sebelum barista dan dapur mulai meracik hidangan.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer & Submit Button */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-border-subtle bg-canvas-secondary/60 shrink-0 space-y-3">
            {/* Price Row */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted font-medium">Total Pembayaran</span>
              <span className="text-lg font-bold text-text-primary tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>

            {/* Confirm Submit Button with Double-Click Protection */}
            <button
              type="button"
              disabled={isButtonDisabled}
              onClick={handleConfirmOrder}
              className="w-full h-12 bg-charcoal text-white font-semibold text-sm rounded-md hover:bg-[#3A3A37] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-charcoal cursor-pointer"
            >
              {localSubmitting || isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Mengirim ke Dapur...</span>
                </>
              ) : (
                <span>Konfirmasi &amp; Kirim Pesanan ({formatPrice(subtotal)})</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
