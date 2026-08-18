"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAllOrders } from "@/data/orderStore";
import {
  UtensilsCrossed,
  History,
  Coffee,
  QrCode,
  ArrowUpRight,
  Radio,
  Menu,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function AdminNavbar() {
  const pathname = usePathname();
  const [activeCount, setActiveCount] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Synchronize active orders count
  useEffect(() => {
    const updateCount = () => {
      const orders = getAllOrders();
      const count = orders.filter(
        (o) =>
          o.status === "NEW" ||
          o.status === "CONFIRMED" ||
          o.status === "PREPARING" ||
          o.status === "READY"
      ).length;
      setActiveCount(count);
    };

    updateCount();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "coffee_and_beyond_orders") {
        updateCount();
      }
    };

    const handleCustom = () => {
      updateCount();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("coffee_order_updated", handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("coffee_order_updated", handleCustom);
    };
  }, []);

  const navLinks = [
    {
      name: "Live Kitchen Queue",
      href: "/admin/live-orders",
      aliasHref: "/admin",
      icon: UtensilsCrossed,
      badge: activeCount,
    },
    {
      name: "Order History",
      href: "/admin/history",
      icon: History,
    },
    {
      name: "Menu & Stock",
      href: "/admin/menu",
      icon: Coffee,
    },
    {
      name: "Tables & QR",
      href: "/admin/tables",
      icon: QrCode,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-canvas-primary border-b border-border-subtle shadow-2xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Admin Badge */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 text-text-primary hover:opacity-85 transition-opacity"
            aria-label="Coffee And Beyond Admin"
          >
            <BrandLogo size="sm" />
            <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-sm bg-charcoal text-white tracking-wider">
              Admin &amp; Kitchen
            </span>
          </Link>

          {/* Live Sync Pulse */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F8F3] border border-[#D3DEC8] text-[#3B5E2B] text-xs font-medium">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[11px]">Realtime Active</span>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || (link.aliasHref && pathname === link.aliasHref);
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors flex items-center gap-2 border ${
                  isActive
                    ? "bg-canvas-secondary text-text-primary border-border-subtle font-semibold"
                    : "text-text-muted hover:text-text-primary hover:bg-canvas-secondary border-transparent"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.name}</span>
                {typeof link.badge === "number" && link.badge > 0 && (
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-charcoal text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Public Site CTA & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/order"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-primary bg-canvas-secondary border border-border-subtle rounded-md hover:bg-[#EFEFEA] transition-colors"
          >
            <span>Customer QR View</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-text-muted" />
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle admin menu"
            className="md:hidden p-2 text-text-primary hover:bg-canvas-secondary rounded-md border border-border-subtle"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border-subtle bg-canvas-primary p-4 space-y-2">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || (link.aliasHref && pathname === link.aliasHref);
              const Icon = link.icon;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-xs font-medium flex items-center justify-between ${
                    isActive
                      ? "bg-canvas-secondary text-text-primary font-semibold"
                      : "text-text-muted hover:bg-canvas-secondary hover:text-text-primary"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </div>
                  {typeof link.badge === "number" && link.badge > 0 && (
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-charcoal text-white">
                      {link.badge} active
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="pt-2 border-t border-border-subtle">
            <Link
              href="/order"
              target="_blank"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-text-primary bg-canvas-secondary border border-border-subtle rounded-md"
            >
              <span>Open Customer Ordering View</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-text-muted" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
