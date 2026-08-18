"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PROMOTIONS_DATA, PromotionItem } from "@/data/promotions";
import { formatPrice } from "@/data/menu";
import {
  Tag,
  Clock,
  Calendar,
  Check,
  ArrowRight,
  QrCode,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function PromotionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedTerms, setExpandedTerms] = useState<Record<string, boolean>>({});

  const categories = [
    { id: "all", label: "All Privileges" },
    { id: "morning", label: "Morning Rituals" },
    { id: "workday", label: "Workday Passes" },
    { id: "weekend", label: "Weekend Specials" },
    { id: "flights", label: "Coffee Flights" },
  ];

  const filteredPromotions =
    selectedCategory === "all"
      ? PROMOTIONS_DATA
      : PROMOTIONS_DATA.filter((p) => p.category === selectedCategory);

  const toggleTerms = (id: string) => {
    setExpandedTerms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas-primary text-text-primary">
      <Navbar />

      <main className="flex-1">
        {/* Header Banner */}
        <section className="w-full bg-canvas-secondary border-b border-border-subtle py-12 sm:py-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
                  <span className="w-6 h-[1px] bg-accent-warm" />
                  <span>Curated Privileges</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary">
                  Promotions &amp; Daily Rituals
                </h1>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  Tailored bundles and seasonal offerings curated to enrich your morning focus, workday productivity, and slow weekend gatherings.
                </p>
              </div>

              {/* Order at Table Quick Card */}
              <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg flex items-center justify-between gap-4 max-w-sm w-full shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-canvas-secondary border border-border-subtle text-text-primary">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">Dine-in at Table?</p>
                    <p className="text-[11px] text-text-muted">Promos auto-apply at checkout</p>
                  </div>
                </div>
                <Link
                  href="/order"
                  className="px-3.5 py-1.5 text-xs font-medium bg-charcoal text-white rounded-md hover:bg-[#3A3A37] transition-colors inline-flex items-center gap-1 shrink-0"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Pills Navigation */}
        <section className="w-full bg-canvas-primary border-b border-border-subtle sticky top-16 z-30 backdrop-blur-xs bg-canvas-primary/95">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors border ${
                    selectedCategory === cat.id
                      ? "bg-charcoal text-white border-charcoal"
                      : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary hover:border-[#D0D0CA]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Promotions Grid */}
        <section className="w-full py-12 sm:py-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPromotions.map((promo) => {
                const isTermsOpen = expandedTerms[promo.id];

                return (
                  <div
                    key={promo.id}
                    className="bg-canvas-primary border border-border-subtle rounded-lg p-6 flex flex-col justify-between hover:border-[#D0D0CA] transition-colors shadow-xs group"
                  >
                    <div className="space-y-4">
                      {/* Badge and Discount Indicator */}
                      <div className="flex items-center justify-between gap-2 border-b border-border-subtle pb-3.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted bg-canvas-secondary border border-border-subtle px-2 py-0.5 rounded-sm">
                          {promo.badge}
                        </span>
                        {promo.discountLabel && (
                          <span className="text-xs font-bold font-mono text-[#1E1E1C] bg-[#F7F7F5] border border-[#E7E7E3] px-2 py-0.5 rounded-sm">
                            {promo.discountLabel}
                          </span>
                        )}
                      </div>

                      {/* Title & Subtitle */}
                      <div className="space-y-1">
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
                          {promo.title}
                        </h2>
                        <p className="text-xs font-medium text-text-muted">
                          {promo.subtitle}
                        </p>
                      </div>

                      {/* Pricing Tag & Time Slot */}
                      <div className="p-3 bg-canvas-secondary border border-border-subtle rounded-md space-y-2">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-2">
                            {promo.price > 0 ? (
                              <>
                                <span className="font-mono text-xl font-bold text-text-primary">
                                  {formatPrice(promo.price)}
                                </span>
                                {promo.originalPrice && (
                                  <span className="font-mono text-xs text-text-muted line-through">
                                    {formatPrice(promo.originalPrice)}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="font-mono text-lg font-bold text-text-primary">
                                Use Code: BEYOND15
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider">
                            Special Rate
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-text-muted pt-1 border-t border-border-subtle/60">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-text-primary shrink-0" />
                            <span>{promo.timeSlot}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-accent-warm shrink-0" />
                            <span className="font-medium text-text-primary text-[11px]">
                              {promo.validUntil}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-text-muted leading-relaxed">
                        {promo.description}
                      </p>

                      {/* What is Included */}
                      <div className="space-y-2 pt-2 border-t border-border-subtle">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-primary">
                          Includes:
                        </p>
                        <ul className="space-y-1.5 text-xs text-text-muted">
                          {promo.includedItems.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-text-primary shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Action Area with Collapsible T&C and CTA */}
                    <div className="pt-4 mt-4 border-t border-border-subtle space-y-3">
                      {/* Terms Toggle */}
                      <div>
                        <button
                          type="button"
                          onClick={() => toggleTerms(promo.id)}
                          className="w-full flex items-center justify-between text-[11px] text-text-muted hover:text-text-primary transition-colors py-1"
                        >
                          <span className="inline-flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            <span>Terms &amp; Conditions</span>
                          </span>
                          {isTermsOpen ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {isTermsOpen && (
                          <div className="mt-2 p-3 bg-canvas-secondary border border-border-subtle rounded-md text-[11px] text-text-muted space-y-1">
                            {promo.terms.map((t, tIdx) => (
                              <p key={tIdx}>• {t}</p>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <Link
                        href="/order"
                        className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-charcoal rounded-md hover:bg-[#3A3A37] transition-colors"
                      >
                        <span>Order at Table</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom Banner */}
        <section className="w-full bg-canvas-secondary border-t border-border-subtle py-12">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-semibold text-text-primary">
                Corporate Inquiries &amp; Group Hospitality
              </h3>
              <p className="text-xs text-text-muted">
                Looking for monthly team focus passes or private workshop packages?
              </p>
            </div>
            <a
              href="mailto:contact@coffeeandbeyond.id"
              className="px-5 py-2.5 text-xs font-semibold text-text-primary bg-canvas-primary border border-border-subtle rounded-md hover:bg-[#EFEFEA] transition-colors inline-flex items-center gap-1.5 shrink-0"
            >
              <span>Contact Concierge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
