"use client";

import React, { useState, useEffect } from "react";
import { getAllOrders } from "@/lib/order-store";
import { Clock, Radio, Menu, UtensilsCrossed } from "lucide-react";

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
}

export function AdminHeader({ onToggleMobileSidebar }: AdminHeaderProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [timeString, setTimeString] = useState<string>("");
  const [activeCount, setActiveCount] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Live clock updating every second after mount
  useEffect(() => {
    if (!isMounted) return;

    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [isMounted]);

  // Synchronize active orders count after mount
  useEffect(() => {
    if (!isMounted) return;

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
  }, [isMounted]);

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-[#E7E7E3] h-16 flex items-center justify-between px-4 sm:px-6 shadow-2xs select-none">
      {/* Left: Mobile hamburger & Context Label */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
          className="lg:hidden p-2 rounded-md text-text-primary hover:bg-canvas-secondary border border-border-subtle cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F8F3] border border-[#D3DEC8] text-[#3B5E2B] text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[11px] hidden sm:inline">Kitchen Online</span>
            <span className="text-[11px] sm:hidden">Live</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted">
            <span className="w-1 h-1 rounded-full bg-[#A69B8C]" />
            <span>Service Station 01</span>
          </div>
        </div>
      </div>

      {/* Right: Tabular Live Clock & Active Counter */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Active orders counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F7F7F5] border border-[#E7E7E3] text-xs">
          <UtensilsCrossed className="w-3.5 h-3.5 text-accent-warm" />
          <span className="text-text-muted hidden sm:inline">Active Queue:</span>
          <span className="font-mono font-bold text-[#1E1E1C] tabular-nums">
            {isMounted ? `${activeCount} ${activeCount === 1 ? "Order" : "Orders"}` : "0 Orders"}
          </span>
        </div>

        {/* Live Clock with tabular-nums */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#E7E7E3] bg-[#F7F7F5] text-xs font-mono text-[#777772]">
          <Clock className="w-3.5 h-3.5 text-accent-warm" />
          <span className="tabular-nums tracking-wide">
            {isMounted && timeString ? timeString : "--:--:--"}
          </span>
        </div>
      </div>
    </header>
  );
}
