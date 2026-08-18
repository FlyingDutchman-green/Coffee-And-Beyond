"use client";

import React from "react";
import { Product } from "@/types/menu";
import { formatPrice } from "@/data/menu";
import { motion } from "@/components/ui/motion";
import { Coffee, Eye, Sparkles, Leaf, Wheat, Utensils } from "lucide-react";
import { useMediaUrl } from "@/lib/use-media";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

// Category visual icon selector for the editorial 4:3 placeholder
function CategoryIcon({ categorySlug }: { categorySlug?: string }) {
  const iconClass = "w-6 h-6 stroke-[1.5] text-accent-warm";
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

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const isSoldOut = !product.isAvailable;
  const resolvedImageUrl = useMediaUrl(product.imageUrl, "");

  return (
    <motion.article
      onClick={() => onSelect(product)}
      whileHover={{ y: isSoldOut ? 0 : -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative bg-canvas-primary border border-border-subtle rounded-lg p-4 sm:p-5 flex flex-col justify-between cursor-pointer transition-colors duration-150 hover:border-[#D0D0CA] hover:shadow-md select-none ${
        isSoldOut ? "opacity-60 hover:opacity-75" : ""
      }`}
    >
      <div className="space-y-4">
        {/* Editorial Visual Ratio Box (4:3 Aspect Ratio) */}
        <div className="w-full aspect-4/3 rounded-md bg-canvas-secondary border border-border-subtle p-3.5 sm:p-4 flex flex-col justify-between relative overflow-hidden transition-colors group-hover:bg-[#F2F2EE]">
          {resolvedImageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolvedImageUrl}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Subtle gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/35 pointer-events-none" />

              {/* Top Row: Category tag and sold out status */}
              <div className="flex items-center justify-between z-10 gap-2">
                <span className="text-[11px] font-medium tracking-wider uppercase text-white/90 drop-shadow-xs">
                  {product.categoryName || "Artisanal"}
                </span>

                {isSoldOut && (
                  <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-sm bg-[#F7F7F5] border border-[#E7E7E3] text-[#777772]">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Quick View Button overlay on hover */}
              <div className="z-10 my-auto flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-canvas-primary/95 text-text-primary border border-border-subtle rounded-md shadow-xs backdrop-blur-xs">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </span>
              </div>

              {/* Bottom Info in Visual Box */}
              <div className="flex items-center justify-between text-[11px] text-white/95 z-10 drop-shadow-xs">
                <span className="font-mono text-[10px] text-white/80">
                  #{product.id.toUpperCase()}
                </span>
                {product.servingTemperature && (
                  <span className="text-[10px] tracking-wide font-medium bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
                    {product.servingTemperature}
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Top Row: Category tag and sold out status */}
              <div className="flex items-center justify-between z-10 gap-2">
                <span className="text-[11px] font-medium tracking-wider uppercase text-text-muted">
                  {product.categoryName || "Artisanal"}
                </span>

                {isSoldOut && (
                  <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-sm bg-[#F7F7F5] border border-[#E7E7E3] text-[#777772]">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Center Graphic & Quick View Trigger */}
              <div className="my-auto flex flex-col items-center justify-center relative">
                {/* Category Minimalist Visual Emblem */}
                <div className="w-12 h-12 rounded-md bg-canvas-primary border border-border-subtle flex items-center justify-center text-text-muted shadow-xs transition-transform duration-200 group-hover:scale-105">
                  <CategoryIcon categorySlug={product.categorySlug} />
                </div>

                {/* Quick View Button overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-canvas-primary/95 text-text-primary border border-border-subtle rounded-md shadow-xs backdrop-blur-xs">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </span>
                </div>
              </div>

              {/* Bottom Info in Visual Box */}
              <div className="flex items-center justify-between text-[11px] text-text-muted z-10">
                <span className="font-mono text-[10px] text-text-muted/80">
                  #{product.id.toUpperCase()}
                </span>
                {product.servingTemperature && (
                  <span className="text-[10px] tracking-wide font-medium">
                    {product.servingTemperature}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-text-primary text-base leading-snug group-hover:text-black transition-colors">
              {product.name}
            </h3>
          </div>
          <p className="text-xs sm:text-[13px] text-text-muted leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Sourcing / Origin snippet if present */}
        {product.origin && (
          <p className="text-[11px] text-text-muted/90 truncate font-normal">
            <span className="text-accent-warm font-medium">Origin:</span> {product.origin}
          </p>
        )}
      </div>

      {/* Bottom Row: Price and View Detail trigger */}
      <div className="pt-4 mt-4 border-t border-border-subtle flex items-center justify-between">
        <div>
          <span className="text-[11px] text-text-muted block">Price</span>
          <span className="font-semibold text-base text-text-primary tabular-nums">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isSoldOut ? (
            <span className="text-xs font-medium text-text-muted px-2.5 py-1 rounded bg-canvas-secondary border border-border-subtle">
              Sold Out
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-text-primary group-hover:underline underline-offset-4 decoration-1">
              <span>Explore</span>
              <span aria-hidden="true">&rarr;</span>
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;

