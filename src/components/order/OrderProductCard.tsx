"use client";

import React from "react";
import { Product } from "@/types/menu";
import { formatPrice } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Plus, Minus, Coffee, Leaf, Wheat, Utensils, Sparkles } from "lucide-react";
import { useMediaUrl } from "@/lib/use-media";

interface OrderProductCardProps {
  product: Product;
  onOpenDetail?: (product: Product) => void;
}

function CategoryIcon({ categorySlug }: { categorySlug?: string }) {
  const iconClass = "w-5 h-5 text-accent-warm stroke-[1.5]";
  switch (categorySlug) {
    case "signature-bottled":
    case "signature-coffee":
      return <Sparkles className={iconClass} />;
    case "coffee-manual-brew":
    case "manual-brew":
      return <Coffee className={iconClass} />;
    case "tea-beverages":
    case "tea-botanicals":
      return <Leaf className={iconClass} />;
    case "pasta-western":
    case "comfort-kitchen":
      return <Utensils className={iconClass} />;
    case "nusantara-series":
    case "nusantara-comfort":
      return <Utensils className={iconClass} />;
    case "steaks-mains":
      return <Utensils className={iconClass} />;
    case "bites-breakfast":
      return <Wheat className={iconClass} />;
    case "sweets-desserts":
    case "pastry-bakery":
      return <Wheat className={iconClass} />;
    default:
      return <Coffee className={iconClass} />;
  }
}

export function OrderProductCard({
  product,
  onOpenDetail,
}: OrderProductCardProps) {
  const { getItemQuantity, addItem, updateQuantity } = useCart();
  const quantity = getItemQuantity(product.id);
  const isSoldOut = !product.isAvailable;
  const resolvedImageUrl = useMediaUrl(product.imageUrl, "");

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) return;
    addItem(product, 1);
    toast.success("Ditambahkan ke pesanan", { duration: 1500 });
  };


  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) return;
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, quantity - 1);
  };

  return (
    <article
      onClick={() => onOpenDetail && onOpenDetail(product)}
      className={`p-4 bg-canvas-primary border border-border-subtle rounded-lg flex flex-col justify-between gap-3 transition-colors hover:border-[#D0D0CA] cursor-pointer select-none ${
        isSoldOut ? "opacity-60 bg-[#FAFAFA]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left Info */}
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
              {product.categoryName}
            </span>
            {isSoldOut && (
              <span className="text-[10px] font-medium uppercase px-1.5 py-0.2 rounded-sm bg-[#F7F7F5] border border-[#E7E7E3] text-[#777772]">
                Habis
              </span>
            )}
          </div>

          <h3 className="font-semibold text-text-primary text-sm sm:text-base leading-snug truncate">
            {product.name}
          </h3>

          <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Right Thumbnail Emblem / Photo */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md bg-canvas-secondary border border-border-subtle flex flex-col items-center justify-center shrink-0 text-text-muted overflow-hidden relative">
          {resolvedImageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolvedImageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.servingTemperature && (
                <span className="absolute bottom-1 right-1 text-[8px] sm:text-[9px] text-white bg-black/60 px-1 py-0.2 rounded font-mono backdrop-blur-xs">
                  {product.servingTemperature}
                </span>
              )}
            </>
          ) : (
            <div className="p-1 flex flex-col items-center justify-center w-full h-full">
              <CategoryIcon categorySlug={product.categorySlug} />
              {product.servingTemperature && (
                <span className="text-[9px] text-text-muted mt-1 font-mono text-center">
                  {product.servingTemperature}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Price & Quantity Controls */}
      <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-text-muted block font-normal">Harga</span>
          <span className="font-semibold text-sm sm:text-base text-text-primary tabular-nums">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Add Button or Stepper */}
        {isSoldOut ? (
          <button
            type="button"
            disabled
            className="px-3 py-1.5 text-xs font-medium text-[#777772] bg-canvas-secondary border border-border-subtle rounded-md cursor-not-allowed"
          >
            Habis
          </button>
        ) : quantity === 0 ? (
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className="min-h-[38px] px-4 py-1.5 text-xs font-semibold bg-canvas-primary text-text-primary border border-border-subtle rounded-md hover:bg-canvas-secondary hover:border-[#D0D0CA] transition-colors flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center border border-border-subtle rounded-md bg-canvas-primary shadow-xs overflow-hidden"
          >
            <button
              type="button"
              onClick={handleDecrement}
              aria-label={`Kurangi jumlah ${product.name}`}
              className="w-9 h-9 min-w-[36px] flex items-center justify-center text-text-primary hover:bg-canvas-secondary transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-mono text-xs font-semibold text-text-primary tabular-nums select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              aria-label={`Tambah jumlah ${product.name}`}
              className="w-9 h-9 min-w-[36px] flex items-center justify-center text-text-primary hover:bg-canvas-secondary transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
