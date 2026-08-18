"use client";

import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface StockQuickToggleProps {
  productId: string;
  isAvailable: boolean;
  onToggle: (productId: string) => void;
  disabled?: boolean;
}

export function StockQuickToggle({
  productId,
  isAvailable,
  onToggle,
  disabled = false,
}: StockQuickToggleProps) {
  return (
    <div className="inline-flex items-center gap-2.5">
      {/* Visual Badge */}
      {isAvailable ? (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded-sm bg-[#F5F8F3] border border-[#D3DEC8] text-[#3B5E2B]">
          <CheckCircle2 className="w-3 h-3 text-[#3B5E2B]" />
          <span>In Stock</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded-sm bg-[#F7F7F5] border border-[#E7E7E3] text-[#777772]">
          <AlertCircle className="w-3 h-3 text-[#777772]" />
          <span>Sold Out</span>
        </span>
      )}

      {/* Switch Control */}
      <button
        type="button"
        role="switch"
        aria-checked={isAvailable}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(productId);
        }}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E1E1C] focus-visible:ring-offset-2 ${
          isAvailable ? "bg-[#3B5E2B]" : "bg-[#D0D0CA]"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
            isAvailable ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
