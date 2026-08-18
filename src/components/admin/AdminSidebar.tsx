"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAllOrders } from "@/lib/order-store";
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderTree,
  Coffee,
  MapPin,
  QrCode,
  Settings,
  Radio,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AdminSidebar({
  isMobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [activeCount, setActiveCount] = useState<number>(0);

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
    window.addEventListener("coffee_new_order_created", handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("coffee_order_updated", handleCustom);
      window.removeEventListener("coffee_new_order_created", handleCustom);
    };
  }, []);

  const navLinks = [
    {
      name: "Dashboard Overview",
      href: "/admin",
      exact: true,
      icon: LayoutDashboard,
    },
    {
      name: "Live Orders",
      href: "/admin/live-orders",
      icon: UtensilsCrossed,
      badge: activeCount,
    },
    {
      name: "Category Management",
      href: "/admin/categories",
      icon: FolderTree,
    },
    {
      name: "Menu Management",
      href: "/admin/menu",
      icon: Coffee,
    },
    {
      name: "Zone Management",
      href: "/admin/zones",
      icon: MapPin,
    },
    {
      name: "Tables & QR Code",
      href: "/admin/tables",
      icon: QrCode,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const sidebarContent = (
    <aside className="w-60 bg-white border-r border-[#E7E7E3] h-full flex flex-col select-none overflow-y-auto">
      {/* Brand & Console Title */}
      <div className="p-5 border-b border-[#E7E7E3] flex items-center justify-between shrink-0">
        <Link
          href="/admin"
          onClick={onMobileClose}
          className="flex flex-col gap-1.5 group"
          aria-label="Coffee And Beyond Admin"
        >
          <BrandLogo size="sm" />
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#777772] font-semibold">
            Operational Admin
          </span>
        </Link>

        {/* Close button for mobile drawer */}
        {onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close sidebar navigation"
            className="lg:hidden p-1.5 text-text-muted hover:text-text-primary rounded-md border border-border-subtle cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Live Service Pulse Status */}
      <div className="p-4 mx-3 my-3 rounded-md bg-[#F5F8F3] border border-[#D3DEC8] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B5E2B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3B5E2B]"></span>
          </span>
          <span className="text-[11px] font-semibold text-[#3B5E2B]">
            Kitchen Live Sync
          </span>
        </div>
        <Radio className="w-3.5 h-3.5 text-[#3B5E2B]" />
      </div>

      {/* Navigation Menu Links */}
      <nav className="px-3 pb-8 space-y-1 flex-1">
        <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-[#777772]">
          Operations
        </div>

        {navLinks.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(link.href + "/");
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onMobileClose}
              className={`px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-between border ${
                isActive
                  ? "bg-[#F7F7F5] text-[#1E1E1C] border-[#E7E7E3] font-semibold shadow-2xs"
                  : "text-[#777772] hover:text-[#1E1E1C] hover:bg-[#F7F7F5] border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 text-accent-warm" />
                <span>{link.name}</span>
              </div>

              {typeof link.badge === "number" && link.badge > 0 && (
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1E1E1C] text-white">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar (width 240px = 15rem / w-60) */}
      <div className="hidden lg:block w-60 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Backdrop & Modal */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-50 bg-charcoal/40 lg:hidden backdrop-blur-2xs transition-opacity"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-64 h-full bg-white shadow-xl animate-in slide-in-from-left duration-200"
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
