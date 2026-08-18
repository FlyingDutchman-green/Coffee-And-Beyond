import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MenuCatalog } from "@/components/menu/MenuCatalog";
import { CATEGORIES, PRODUCTS } from "@/data/menu";
import { QrCode, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Curated Menu | Coffee And Beyond Pekalongan",
  description:
    "Jelajahi menu pilihan kami: cold bottled coffee signature, seduhan manual V60 & siphon Samasta Roastery, pasta fusion, steak Wagyu, sajian Nusantara, dan hidangan penutup manis.",
};

export default function MenuPage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas-primary text-text-primary">
      <Navbar />

      <main className="flex-1">
        {/* Editorial Page Header Banner */}
        <section className="w-full bg-canvas-secondary border-b border-border-subtle py-10 sm:py-14">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
                  <span className="w-6 h-[1px] bg-accent-warm" />
                  <span>Curated Offerings</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary">
                  Menu &amp; Roastery
                </h1>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  Single-origin manual brew hasil sangrai Samasta Coffee Roastery, minuman cold bottled signature, hidangan pasta &amp; steak, dan santapan Nusantara autentik.
                </p>
              </div>

              {/* Table Order Banner CTA */}
              <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg flex items-center justify-between gap-4 max-w-sm w-full shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-canvas-secondary border border-border-subtle text-text-primary">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">Dine-in Guest?</p>
                    <p className="text-[11px] text-text-muted">Order directly from your table</p>
                  </div>
                </div>
                <Link
                  href="/order"
                  className="px-3 py-1.5 text-xs font-medium bg-charcoal text-white rounded-md hover:bg-[#3A3A37] transition-colors inline-flex items-center gap-1 shrink-0"
                >
                  <span>Order</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Catalog Component with Sticky Nav & Dynamic Grid */}
        <section className="w-full pb-16 sm:pb-24">
          <MenuCatalog
            categories={CATEGORIES}
            initialProducts={PRODUCTS}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
