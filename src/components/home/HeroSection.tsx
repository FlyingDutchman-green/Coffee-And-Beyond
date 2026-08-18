"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Coffee, QrCode } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full bg-canvas-primary border-b border-border-subtle overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Editorial Copy */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-canvas-secondary border border-border-subtle rounded-md text-xs font-medium text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-warm inline-block" />
              <span>Specialty Coffee &amp; Mindful Workspace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.1]">
              A Space to Pause, Work, and Savor.
            </h1>

            <p className="text-base sm:text-lg text-text-muted max-w-xl leading-relaxed">
              Carefully curated single-origin roasts, honest comfort kitchen dishes, and an unhurried third space designed for deep focus and meaningful connections.
            </p>

            {/* Action Buttons (2 Clean Buttons) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-charcoal text-white font-medium text-sm rounded-md hover:bg-[#3A3A37] transition-colors"
              >
                <span>Explore Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/order"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent text-text-primary font-medium text-sm border border-border-subtle rounded-md hover:bg-canvas-secondary hover:border-[#D0D0CA] transition-colors"
              >
                <span>Order at Table &rarr;</span>
              </Link>
            </div>

            {/* Micro Feature Indicators */}
            <div className="pt-6 border-t border-border-subtle grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="font-semibold text-text-primary text-sm">100% Arabica</p>
                <p className="text-xs text-text-muted mt-0.5">Ethical Direct Trade</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm">High-Speed WiFi</p>
                <p className="text-xs text-text-muted mt-0.5">Dedicated Power</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm">QR Table Order</p>
                <p className="text-xs text-text-muted mt-0.5">No-Queue Convenience</p>
              </div>
            </div>
          </div>

          {/* Editorial Visual Composition */}
          <div className="lg:col-span-5">
            <div className="relative border border-border-subtle rounded-lg p-6 bg-canvas-secondary space-y-6">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Today&apos;s Feature
                  </span>
                  <h3 className="font-semibold text-text-primary text-lg mt-0.5">
                    Slow Bar &amp; Bakery
                  </h3>
                </div>
                <span className="p-2 rounded-md bg-canvas-primary border border-border-subtle text-text-primary">
                  <Coffee className="w-5 h-5" />
                </span>
              </div>

              {/* Editorial Highlight Snippet */}
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-canvas-primary border border-border-subtle space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Signature Bottled Coffee</span>
                    <span className="font-semibold text-text-primary tabular-nums">Rp 36.000</span>
                  </div>
                  <p className="font-medium text-text-primary text-sm">
                    Golden Hour Latte
                  </p>
                  <p className="text-xs text-text-muted">
                    Cold bottled coffee latte dengan tendangan kafein intens &amp; tekstur creamy.
                  </p>
                </div>

                <div className="p-4 rounded-md bg-canvas-primary border border-border-subtle space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Signature Waffle</span>
                    <span className="font-semibold text-text-primary tabular-nums">Rp 48.000</span>
                  </div>
                  <p className="font-medium text-text-primary text-sm">
                    Nougat Banana Nutella Waffle
                  </p>
                  <p className="text-xs text-text-muted">
                    Waffle renyah dengan pisang karamel, olesan Nutella, &amp; kacang nougat.
                  </p>
                </div>
              </div>

              {/* Table QR Callout */}
              <div className="pt-2 flex items-center justify-between text-xs text-text-muted border-t border-border-subtle">
                <span className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-text-primary" />
                  <span>Dine-in? Scan table QR to order</span>
                </span>
                <Link
                  href="/order"
                  className="font-medium text-text-primary hover:underline"
                >
                  Order Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
