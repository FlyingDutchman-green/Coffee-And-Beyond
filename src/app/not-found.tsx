import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Coffee, Compass, QrCode } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas-primary text-text-primary">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Subtle Emblem */}
          <div className="w-14 h-14 rounded-full bg-canvas-secondary border border-border-subtle flex items-center justify-center mx-auto text-accent-warm shadow-2xs">
            <Compass className="w-6 h-6 stroke-[1.5]" />
          </div>

          {/* Heading Block */}
          <div className="space-y-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-text-muted">
              404 &bull; Page Not Found
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
              You&apos;ve Stepped Off the Trail
            </h1>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              The page you are looking for doesn&apos;t exist or has moved. Let&apos;s guide you back to our coffees, dining, or table ordering.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <Link
              href="/menu"
              className="p-3.5 rounded-lg bg-canvas-secondary border border-border-subtle hover:border-[#D0D0CA] transition-colors group flex items-start gap-3"
            >
              <div className="p-2 rounded-md bg-canvas-primary border border-border-subtle text-text-primary shrink-0">
                <Coffee className="w-4 h-4 text-accent-warm" />
              </div>
              <div>
                <p className="font-semibold text-xs text-text-primary group-hover:underline underline-offset-2">
                  Explore Menu
                </p>
                <p className="text-[11px] text-text-muted">
                  Brews, botanicals &amp; bakery
                </p>
              </div>
            </Link>

            <Link
              href="/order"
              className="p-3.5 rounded-lg bg-canvas-secondary border border-border-subtle hover:border-[#D0D0CA] transition-colors group flex items-start gap-3"
            >
              <div className="p-2 rounded-md bg-canvas-primary border border-border-subtle text-text-primary shrink-0">
                <QrCode className="w-4 h-4 text-accent-warm" />
              </div>
              <div>
                <p className="font-semibold text-xs text-text-primary group-hover:underline underline-offset-2">
                  Table Ordering
                </p>
                <p className="text-[11px] text-text-muted">
                  Order from your seat
                </p>
              </div>
            </Link>
          </div>

          {/* Return Home Button */}
          <div className="pt-4 border-t border-border-subtle">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#1E1E1C] text-white rounded-md hover:bg-[#3A3A37] transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
