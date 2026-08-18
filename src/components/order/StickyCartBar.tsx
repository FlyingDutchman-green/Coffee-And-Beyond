"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/menu";
import { ShoppingBag, ArrowRight } from "lucide-react";

export function StickyCartBar() {
  const { tableId, totalItems, subtotal, openDrawer } = useCart();

  if (totalItems === 0) return null;

  return (
    <aside
      aria-label="Ringkasan keranjang pesanan meja"
      className="fixed bottom-4 left-4 right-4 max-w-[448px] mx-auto z-40 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <button
        type="button"
        onClick={openDrawer}
        className="w-full bg-charcoal text-white rounded-lg p-3 px-4 shadow-[0_8px_24px_rgba(0,0,0,0.14)] flex items-center justify-between gap-3 border border-charcoal hover:bg-[#3A3A37] transition-all cursor-pointer select-none focus:outline-none focus:ring-1 focus:ring-white/50"
      >
        {/* Left: Item Badge Counter & Label */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-white/15 flex items-center justify-center text-white shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-xs font-semibold text-white block leading-none">
              Lihat Pesanan ({totalItems} Menu)
            </span>
            <span className="text-[10px] text-white/70">
              Meja {tableId} • Ketuk untuk memeriksa pesanan
            </span>
          </div>
        </div>

        {/* Right: Total Price & CTA Arrow */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tabular-nums text-white">
            {formatPrice(subtotal)}
          </span>
          <div className="p-1 rounded bg-white/20 text-white">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </button>
    </aside>
  );
}
