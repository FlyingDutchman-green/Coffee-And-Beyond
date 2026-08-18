"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Mail,
  Phone,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { useSettingsStore } from "@/lib/settings-store";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Footer() {
  const { settings } = useSettingsStore();
  const { location, operatingHours, branding } = settings;

  const primaryHours =
    operatingHours.schedule && operatingHours.schedule.length > 0
      ? `${operatingHours.schedule[0].days}: ${operatingHours.schedule[0].hours}`
      : "Setiap Hari (Open Daily): 10:00 – 23:00 WIB";

  return (
    <footer className="w-full bg-[#F7F7F5] border-t border-[#E7E7E3] mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
              aria-label="Coffee And Beyond Home"
            >
              <BrandLogo size="md" />
            </Link>

            <p className="text-sm font-medium text-[#1E1E1C] italic">
              &ldquo;Coffee and everything beyond it.&rdquo;
            </p>

            <p className="text-xs text-[#777772] leading-relaxed">
              Ruang temu dan santap di Pekalongan yang memadukan specialty coffee sangrai mandiri bersama Samasta Coffee Roastery, casual dining lezat, dan suasana hangat.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#E7E7E3] text-[11px] text-[#1E1E1C]">
                <Sparkles className="w-3.5 h-3.5 text-accent-warm" />
                <span>Est. 2015 • Pekalongan</span>
              </div>
            </div>
          </div>

          {/* Column 2: Offerings / Products */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#1E1E1C]">
              Offerings &amp; Menu
            </h4>
            <ul className="space-y-2.5 text-xs text-[#777772]">
              <li>
                <Link
                  href="/menu?category=signature-bottled"
                  className="hover:text-[#1E1E1C] transition-colors inline-flex items-center gap-1"
                >
                  <span>Signature &amp; Bottled Coffee</span>
                  <ArrowUpRight className="w-3 h-3 opacity-50" />
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=coffee-manual-brew"
                  className="hover:text-[#1E1E1C] transition-colors inline-flex items-center gap-1"
                >
                  <span>Espresso &amp; Manual Brew</span>
                  <ArrowUpRight className="w-3 h-3 opacity-50" />
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=pasta-western"
                  className="hover:text-[#1E1E1C] transition-colors inline-flex items-center gap-1"
                >
                  <span>Pasta &amp; Western Kitchen</span>
                  <ArrowUpRight className="w-3 h-3 opacity-50" />
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=nusantara-series"
                  className="hover:text-[#1E1E1C] transition-colors inline-flex items-center gap-1"
                >
                  <span>Nusantara Heritage Plates</span>
                  <ArrowUpRight className="w-3 h-3 opacity-50" />
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=sweets-desserts"
                  className="hover:text-[#1E1E1C] transition-colors inline-flex items-center gap-1"
                >
                  <span>Sweets, Waffles &amp; Pancakes</span>
                  <ArrowUpRight className="w-3 h-3 opacity-50" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Informations */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#1E1E1C]">
              Informations
            </h4>
            <ul className="space-y-2.5 text-xs text-[#777772]">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#1E1E1C] transition-colors inline-flex items-center gap-1"
                >
                  <span>About Us &amp; Journey</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="hover:text-[#1E1E1C] transition-colors inline-flex items-center gap-1"
                >
                  <span>Curated Menu</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/promotions"
                  className="hover:text-[#1E1E1C] transition-colors inline-flex items-center gap-1"
                >
                  <span>Privileges &amp; Promotions</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="hover:text-[#1E1E1C] transition-colors inline-flex items-center gap-1"
                >
                  <span>The Beyond Journal</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#space"
                  className="hover:text-[#1E1E1C] transition-colors inline-flex items-center gap-1"
                >
                  <span>The Space &amp; Roastery</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="hover:text-[#1E1E1C] transition-colors inline-flex items-center gap-1"
                >
                  <span>Frequently Asked Questions</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/order"
                  className="hover:text-[#1E1E1C] transition-colors inline-flex items-center gap-1 font-medium text-[#1E1E1C]"
                >
                  <span>Order at Table (QR)</span>
                  <ArrowUpRight className="w-3 h-3 opacity-70" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Visit */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#1E1E1C]">
              Contact &amp; Visit
            </h4>
            <div className="space-y-3 text-xs text-[#777772]">
              {/* Location */}
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#1E1E1C] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#1E1E1C]">{location.locationName || "Coffee And Beyond Pekalongan"}</p>
                  <address className="not-italic text-[#777772] text-[11px] leading-relaxed">
                    Jl. Diponegoro No. 15, Dukuh, Pekalongan Utara, Kota Pekalongan, Jawa Tengah 51146
                  </address>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#1E1E1C] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-[#1E1E1C]">Setiap Hari (Open Daily)</p>
                  <p className="text-[11px] text-[#777772]">10:00 – 23:00 WIB</p>
                </div>
              </div>

              {/* Direct Inquiries */}
              <div className="space-y-1.5 pt-1 border-t border-[#E7E7E3]">
                <a
                  href="mailto:contact@coffeeandbeyond.id"
                  className="flex items-center gap-2 text-[#777772] hover:text-[#1E1E1C] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#1E1E1C] shrink-0" />
                  <span>contact@coffeeandbeyond.id</span>
                </a>
                <a
                  href="https://wa.me/628112748585"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#777772] hover:text-[#1E1E1C] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#1E1E1C] shrink-0" />
                  <span>+62 811-2748-585</span>
                </a>
              </div>

              {/* Social Channels Row */}
              <div className="pt-2 border-t border-[#E7E7E3]">
                <p className="text-[10px] uppercase font-semibold tracking-wider text-[#1E1E1C] mb-2.5">
                  Social Channels
                </p>
                <div className="flex items-center gap-2">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/628112748585"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contact us on WhatsApp"
                    className="w-9 h-9 flex items-center justify-center rounded-md border border-[#E7E7E3] hover:border-[#1E1E1C] bg-white hover:bg-[#F7F7F5] text-[#777772] hover:text-[#1E1E1C] transition-colors duration-200"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.03c-.24.68-1.2 1.25-1.68 1.3-.46.06-.99.11-3.23-.78-2.67-1.07-4.4-3.81-4.54-3.99-.13-.18-1.09-1.45-1.09-2.77 0-1.32.69-1.97.94-2.23.25-.26.54-.33.72-.33.18 0 .36 0 .52.01.17.01.4.06.62.59.24.57.81 1.98.88 2.13.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.32.39-.45.53-.15.15-.31.31-.13.62.18.31.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.49 1.53.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.16.29.11 1.83.86 2.14 1.02.31.15.52.23.6.36.07.13.07.76-.17 1.44z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com/coffeeandbeyond.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Instagram @coffeeandbeyond.id"
                    className="w-9 h-9 flex items-center justify-center rounded-md border border-[#E7E7E3] hover:border-[#1E1E1C] bg-white hover:bg-[#F7F7F5] text-[#777772] hover:text-[#1E1E1C] transition-colors duration-200"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  {/* Linktree */}
                  <a
                    href="https://linktr.ee/coffeeandbeyond"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Coffee And Beyond Linktree"
                    className="w-9 h-9 flex items-center justify-center rounded-md border border-[#E7E7E3] hover:border-[#1E1E1C] bg-white hover:bg-[#F7F7F5] text-[#777772] hover:text-[#1E1E1C] transition-colors duration-200"
                    title="Linktree"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                      <path d="M13.736 5.853l4.005-4.117 2.325 2.38-4.2 4.005h5.908v3.305h-5.937l4.229 4.108-2.325 2.38-4.005-4.117v7.976H9.764v-7.976l-4.005 4.117-2.325-2.38 4.229-4.108H1.726V8.121h5.908l-4.2-4.005 2.325-2.38 4.005 4.117V0h3.972v5.853z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E7E7E3] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777772]">
          <p>© 2015–2026 Coffee And Beyond Pekalongan. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span>Pekalongan, Jawa Tengah</span>
            <span className="inline-block w-1 h-1 rounded-full bg-[#E7E7E3]" />
            <span>Specialty Roastery &amp; Casual Dining</span>
            <span className="inline-block w-1 h-1 rounded-full bg-[#E7E7E3]" />
            <Link href="/privacy" className="hover:text-[#1E1E1C] transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
