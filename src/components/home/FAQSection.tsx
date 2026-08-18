"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FAQ_DATA } from "@/data/faq";
import { FadeInView } from "@/components/ui/motion";
import { Plus, Minus, ArrowUpRight, MessageCircle } from "lucide-react";

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0]?.id || null);

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="w-full bg-canvas-secondary border-b border-border-subtle py-16 md:py-24"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <FadeInView delay={0.05} direction="up" distance={16}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
                <span className="w-6 h-[1px] bg-accent-warm" />
                <span>Frequently Asked Questions</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-text-primary">
                Everything You Need to Know Before Your Visit
              </h2>

              <p className="text-base text-text-muted leading-relaxed">
                From our high-speed workstation amenities and ethical bean sourcing to frictionless table-side ordering.
              </p>
            </div>

            {/* Quick Help Card */}
            <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg flex items-center gap-4 max-w-sm shrink-0 shadow-2xs">
              <div className="w-10 h-10 rounded-md bg-canvas-secondary border border-border-subtle flex items-center justify-center text-text-primary shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-text-primary">Have another inquiry?</p>
                <p className="text-text-muted">Our concierge team is available daily.</p>
                <a
                  href="https://wa.me/628112748585"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-text-primary hover:underline inline-flex items-center gap-1 pt-0.5"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </FadeInView>

        {/* Accordion Container */}
        <FadeInView delay={0.15} direction="up" distance={20}>
          <div className="bg-canvas-primary border border-border-subtle rounded-lg divide-y divide-border-subtle overflow-hidden shadow-2xs">
            {FAQ_DATA.map((item, index) => {
              const isOpen = openId === item.id;
              const headingId = `faq-heading-${item.id}`;
              const panelId = `faq-panel-${item.id}`;

              return (
                <div
                  key={item.id}
                  className="transition-colors hover:bg-canvas-secondary/40"
                >
                  <button
                    type="button"
                    id={headingId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full text-left py-5 px-6 sm:px-8 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-inset cursor-pointer"
                  >
                    <div className="flex items-baseline gap-4 sm:gap-6 pr-2">
                      <span className="font-mono text-xs font-semibold text-text-muted tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-semibold text-base sm:text-lg text-text-primary tracking-tight">
                        {item.question}
                      </span>
                    </div>

                    <div className="w-7 h-7 rounded-md border border-border-subtle bg-canvas-secondary flex items-center justify-center text-text-primary shrink-0 transition-transform duration-200">
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headingId}
                      className="px-6 sm:px-8 pb-6 pt-1 text-sm text-[#777772] leading-relaxed border-t border-border-subtle/50 bg-canvas-secondary/20"
                    >
                      <p className="max-w-3xl pl-7 sm:pl-10">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </FadeInView>

        {/* Bottom Banner */}
        <FadeInView delay={0.2} direction="up" distance={12}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 text-xs text-text-muted">
            <p>
              Planning a private event or team session? We accommodate custom seating &amp; catering.
            </p>
            <Link
              href="/about"
              className="font-medium text-text-primary hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Learn more about our space philosophy</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}

export default FAQSection;

