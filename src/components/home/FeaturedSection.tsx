"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useMenuStore } from "@/lib/menu-store";
import { formatPrice, PRODUCTS as DEFAULT_PRODUCTS } from "@/data/menu";
import { FadeInView, StaggerGroup, StaggerItem } from "@/components/ui/motion";
import {
  ArrowRight,
  Coffee,
  Sparkles,
  Leaf,
  Wheat,
  Utensils,
  QrCode,
} from "lucide-react";

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

export function FeaturedSection() {
  const { products } = useMenuStore();

  const featuredItems = useMemo(() => {
    const list = products.filter((p) => p.isFeatured && p.isAvailable);
    if (list.length >= 4) return list.slice(0, 4);
    // Fallback to top available items or default seed items
    const available = products.filter((p) => p.isAvailable);
    if (available.length >= 4) return available.slice(0, 4);
    return DEFAULT_PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);
  }, [products]);

  return (
    <section className="w-full bg-canvas-primary border-b border-border-subtle py-16 md:py-24 select-none">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <FadeInView direction="up" distance={16}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
                <span className="w-6 h-[1px] bg-accent-warm" />
                <span>Curated Selections</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
                Crafted with Precision &amp; Care
              </h2>
            </div>

            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-text-primary hover:text-accent-warm transition-colors group"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeInView>

        {/* Product Cards Grid (Clean Warm Editorial Minimalism with Stagger) */}
        <StaggerGroup
          staggerDelay={0.08}
          delay={0.1}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featuredItems.map((item) => (
            <StaggerItem key={item.id} className="h-full">
              <article className="h-full bg-canvas-primary border border-border-subtle rounded-lg p-4 flex flex-col justify-between hover:border-[#D0D0CA] transition-all duration-200 hover:-translate-y-1 hover:shadow-md group shadow-2xs">
                <div className="space-y-4">
                  {/* Visual Ratio Container / Minimalist Category Canvas (4:3 Aspect Ratio) */}
                  <div className="w-full aspect-4/3 rounded-md bg-canvas-secondary border border-border-subtle p-3.5 sm:p-4 flex flex-col justify-between relative overflow-hidden transition-colors group-hover:bg-[#F2F2EE]">
                    {item.imageUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/35 pointer-events-none" />
                        <div className="flex items-center justify-between z-10 relative">
                          <span className="text-[11px] font-medium tracking-wide uppercase text-white/95 drop-shadow-xs">
                            {item.categoryName || "Artisanal"}
                          </span>
                          {item.servingTemperature && (
                            <span className="text-[9px] font-mono tracking-wide font-medium bg-black/40 text-white/90 px-1.5 py-0.5 rounded backdrop-blur-xs">
                              {item.servingTemperature}
                            </span>
                          )}
                        </div>
                        <div className="self-end z-10 relative">
                          <span className="text-xs text-white/80 font-mono drop-shadow-xs">
                            #{item.id.toUpperCase()}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between z-10">
                          <span className="text-[11px] font-medium tracking-wide uppercase text-text-muted">
                            {item.categoryName || "Artisanal"}
                          </span>
                          {item.servingTemperature && (
                            <span className="text-[9px] font-mono font-medium text-text-muted">
                              {item.servingTemperature}
                            </span>
                          )}
                        </div>

                        {/* Center Minimalist Visual Emblem */}
                        <div className="my-auto flex items-center justify-center">
                          <div className="w-12 h-12 rounded-md bg-canvas-primary border border-border-subtle flex items-center justify-center text-text-muted shadow-xs transition-transform duration-300 group-hover:scale-105">
                            <CategoryIcon categorySlug={item.categorySlug} />
                          </div>
                        </div>

                        <div className="self-end z-10">
                          <span className="text-xs text-text-muted font-mono">
                            #{item.id.toUpperCase()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-text-primary text-base leading-snug group-hover:text-black transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    {item.origin && (
                      <p className="text-[11px] text-text-muted/90 truncate font-normal pt-0.5">
                        <span className="text-accent-warm font-medium">Origin:</span> {item.origin}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Price & Table Order Action */}
                <div className="pt-4 mt-4 border-t border-border-subtle flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-text-muted block">Price</span>
                    <span className="font-semibold text-sm sm:text-base text-text-primary tabular-nums">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  <Link
                    href="/order"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-canvas-primary text-text-primary border border-border-subtle rounded-md hover:bg-canvas-secondary hover:border-[#D0D0CA] active:scale-95 transition-all shadow-xs"
                  >
                    <QrCode className="w-3.5 h-3.5 text-accent-warm" />
                    <span>Order</span>
                  </Link>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

export default FeaturedSection;

