"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useOrderStore } from "@/lib/order-store";
import { useMenuStore } from "@/lib/menu-store";
import { useTableStore } from "@/lib/table-store";
import { useZoneStore } from "@/lib/zone-store";
import { OrderStatus } from "@/types/order";
import {
  DollarSign,
  UtensilsCrossed,
  AlertTriangle,
  QrCode,
  ArrowRight,
  TrendingUp,
  FolderTree,
  Coffee,
  MapPin,
  Settings,
  CheckCircle2,
  Clock,
  Radio,
} from "lucide-react";

const STATUS_BADGES: Record<
  OrderStatus,
  { label: string; bg: string; border: string; text: string }
> = {
  NEW: {
    label: "New Ticket",
    bg: "bg-[#F7F7F5]",
    border: "border-[#E7E7E3]",
    text: "text-[#1E1E1C]",
  },
  CONFIRMED: {
    label: "Confirmed",
    bg: "bg-[#FDFBF7]",
    border: "border-[#E2D9C8]",
    text: "text-[#7A5E28]",
  },
  PREPARING: {
    label: "Brewing / Kitchen",
    bg: "bg-[#F4F7FA]",
    border: "border-[#D2DCE5]",
    text: "text-[#2B4C6F]",
  },
  READY: {
    label: "Ready to Serve",
    bg: "bg-[#F5F8F3]",
    border: "border-[#D3DEC8]",
    text: "text-[#3B5E2B]",
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-[#FAFAFA]",
    border: "border-[#E7E7E3]",
    text: "text-[#777772]",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-[#FDF6F5]",
    border: "border-[#ECCEC9]",
    text: "text-[#8C3426]",
  },
};

export function DashboardOverview() {
  const { orders, isLoading: isOrdersLoading } = useOrderStore();
  const { products, categories, toggleAvailability, isLoading: isMenuLoading } = useMenuStore();
  const { tables, isLoading: isTablesLoading } = useTableStore();
  const { zones } = useZoneStore();

  // Metrics Calculations
  const metrics = useMemo(() => {
    // Today's Revenue (All non-cancelled orders)
    const validOrders = orders.filter((o) => o.status !== "CANCELLED");
    const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Active Live Orders count
    const activeOrders = orders.filter(
      (o) =>
        o.status === "NEW" ||
        o.status === "CONFIRMED" ||
        o.status === "PREPARING" ||
        o.status === "READY"
    );

    // Sold out products
    const soldOutProducts = products.filter((p) => !p.isAvailable);

    // Tables active
    const activeTables = tables.filter((t) => t.isActive);

    return {
      revenue: totalRevenue,
      activeOrdersCount: activeOrders.length,
      soldOutCount: soldOutProducts.length,
      soldOutList: soldOutProducts,
      activeTablesCount: activeTables.length,
      totalTablesCount: tables.length,
    };
  }, [orders, products, tables]);

  // Recent 6 Orders
  const recentOrders = useMemo(() => {
    return [...orders].slice(0, 6);
  }, [orders]);

  const formatCurrency = (val: number) => {
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="space-y-8">
      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Today's Revenue */}
        <div className="bg-canvas-primary border border-border-subtle rounded-lg p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Today&apos;s Revenue
            </span>
            <div className="w-8 h-8 rounded-md bg-canvas-secondary border border-border-subtle flex items-center justify-center text-text-primary">
              <DollarSign className="w-4 h-4 text-accent-warm" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-text-primary font-mono tabular-nums tracking-tight">
              {formatCurrency(metrics.revenue)}
            </p>
            <p className="text-[11px] text-text-muted flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#3B5E2B]" />
              <span>Realtime aggregated sales</span>
            </p>
          </div>
        </div>

        {/* Metric 2: Active Live Orders */}
        <div className="bg-canvas-primary border border-border-subtle rounded-lg p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Active Live Orders
            </span>
            <div className="w-8 h-8 rounded-md bg-[#F5F8F3] border border-[#D3DEC8] flex items-center justify-center text-[#3B5E2B]">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-text-primary font-mono tabular-nums tracking-tight">
                {metrics.activeOrdersCount}
              </p>
              <span className="text-xs font-medium text-text-muted">Tickets</span>
            </div>
            <p className="text-[11px] text-[#3B5E2B] flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B5E2B] animate-ping" />
              <span>Kitchen queue sync active</span>
            </p>
          </div>
        </div>

        {/* Metric 3: Currently Sold Out Items */}
        <div className="bg-canvas-primary border border-border-subtle rounded-lg p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Sold Out Items
            </span>
            <div
              className={`w-8 h-8 rounded-md border flex items-center justify-center ${
                metrics.soldOutCount > 0
                  ? "bg-[#FDF6F5] border-[#ECCEC9] text-[#8C3426]"
                  : "bg-canvas-secondary border-border-subtle text-text-primary"
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-accent-warm" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <p
                className={`text-2xl font-bold font-mono tabular-nums tracking-tight ${
                  metrics.soldOutCount > 0 ? "text-[#8C3426]" : "text-text-primary"
                }`}
              >
                {metrics.soldOutCount}
              </p>
              <span className="text-xs font-medium text-text-muted">
                of {products.length} Items
              </span>
            </div>
            <p className="text-[11px] text-text-muted">
              {metrics.soldOutCount > 0
                ? "Immediate restock required"
                : "All items available for ordering"}
            </p>
          </div>
        </div>

        {/* Metric 4: Active Tables Fleet */}
        <div className="bg-canvas-primary border border-border-subtle rounded-lg p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Active Tables Fleet
            </span>
            <div className="w-8 h-8 rounded-md bg-canvas-secondary border border-border-subtle flex items-center justify-center text-text-primary">
              <QrCode className="w-4 h-4 text-accent-warm" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-text-primary font-mono tabular-nums tracking-tight">
                {metrics.activeTablesCount} / {metrics.totalTablesCount}
              </p>
              <span className="text-xs font-medium text-text-muted">Tables</span>
            </div>
            <p className="text-[11px] text-text-muted">
              Ready for table-side QR ordering
            </p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Action Hub */}
      <div className="bg-canvas-primary border border-border-subtle rounded-lg p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              Management Quick Actions
            </h2>
            <p className="text-xs text-text-muted">
              Direct access to administrative consoles and brand operations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {/* Action 1: Live Orders */}
          <Link
            href="/admin/live-orders"
            className="p-3.5 rounded-lg border border-border-subtle bg-canvas-secondary hover:bg-canvas-primary hover:border-charcoal transition-all flex flex-col justify-between group"
          >
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-md bg-canvas-primary border border-border-subtle flex items-center justify-center text-text-primary group-hover:bg-charcoal group-hover:text-white transition-colors">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-text-primary group-hover:text-charcoal pt-1">
                Live Kitchen Queue
              </h3>
              <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                Manage tickets &amp; order progression in realtime.
              </p>
            </div>
            <div className="pt-3 flex items-center gap-1 text-[11px] font-semibold text-accent-warm group-hover:text-charcoal transition-colors">
              <span>Open Queue</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Action 2: Category Management */}
          <Link
            href="/admin/categories"
            className="p-3.5 rounded-lg border border-border-subtle bg-canvas-secondary hover:bg-canvas-primary hover:border-charcoal transition-all flex flex-col justify-between group"
          >
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-md bg-canvas-primary border border-border-subtle flex items-center justify-center text-text-primary group-hover:bg-charcoal group-hover:text-white transition-colors">
                <FolderTree className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-text-primary group-hover:text-charcoal pt-1">
                Category Management
              </h3>
              <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                {categories.length} categories configured with instant sync.
              </p>
            </div>
            <div className="pt-3 flex items-center gap-1 text-[11px] font-semibold text-accent-warm group-hover:text-charcoal transition-colors">
              <span>Manage Categories</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Action 3: Menu Management */}
          <Link
            href="/admin/menu"
            className="p-3.5 rounded-lg border border-border-subtle bg-canvas-secondary hover:bg-canvas-primary hover:border-charcoal transition-all flex flex-col justify-between group"
          >
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-md bg-canvas-primary border border-border-subtle flex items-center justify-center text-text-primary group-hover:bg-charcoal group-hover:text-white transition-colors">
                <Coffee className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-text-primary group-hover:text-charcoal pt-1">
                Menu &amp; Stock
              </h3>
              <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                Add products, upload photos, and modify prices.
              </p>
            </div>
            <div className="pt-3 flex items-center gap-1 text-[11px] font-semibold text-accent-warm group-hover:text-charcoal transition-colors">
              <span>Open Catalog</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Action 4: Zone Management */}
          <Link
            href="/admin/zones"
            className="p-3.5 rounded-lg border border-border-subtle bg-canvas-secondary hover:bg-canvas-primary hover:border-charcoal transition-all flex flex-col justify-between group"
          >
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-md bg-canvas-primary border border-border-subtle flex items-center justify-center text-text-primary group-hover:bg-charcoal group-hover:text-white transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-text-primary group-hover:text-charcoal pt-1">
                Zone Management
              </h3>
              <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                {zones.length} café seating zones &amp; floor layouts.
              </p>
            </div>
            <div className="pt-3 flex items-center gap-1 text-[11px] font-semibold text-accent-warm group-hover:text-charcoal transition-colors">
              <span>Manage Zones</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Action 5: Tables & QR Code */}
          <Link
            href="/admin/tables"
            className="p-3.5 rounded-lg border border-border-subtle bg-canvas-secondary hover:bg-canvas-primary hover:border-charcoal transition-all flex flex-col justify-between group"
          >
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-md bg-canvas-primary border border-border-subtle flex items-center justify-center text-text-primary group-hover:bg-charcoal group-hover:text-white transition-colors">
                <QrCode className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-text-primary group-hover:text-charcoal pt-1">
                Tables &amp; QR Codes
              </h3>
              <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                Printable QR standees, fleet zones &amp; high-res export.
              </p>
            </div>
            <div className="pt-3 flex items-center gap-1 text-[11px] font-semibold text-accent-warm group-hover:text-charcoal transition-colors">
              <span>View Fleet</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Action 6: Settings */}
          <Link
            href="/admin/settings"
            className="p-3.5 rounded-lg border border-border-subtle bg-canvas-secondary hover:bg-canvas-primary hover:border-charcoal transition-all flex flex-col justify-between group"
          >
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-md bg-canvas-primary border border-border-subtle flex items-center justify-center text-text-primary group-hover:bg-charcoal group-hover:text-white transition-colors">
                <Settings className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-text-primary group-hover:text-charcoal pt-1">
                Brand &amp; CMS Settings
              </h3>
              <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                Philosophy, 16:9 space images, hours, and location.
              </p>
            </div>
            <div className="pt-3 flex items-center gap-1 text-[11px] font-semibold text-accent-warm group-hover:text-charcoal transition-colors">
              <span>Edit Settings</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Main Grid: Recent Orders Feed & Stock Quick Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Recent Orders Feed */}
        <div className="lg:col-span-8 bg-canvas-primary border border-border-subtle rounded-lg p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Recent Orders Feed
              </h2>
              <p className="text-xs text-text-muted">
                Latest customer orders from table-side digital QR ordering
              </p>
            </div>

            <Link
              href="/admin/live-orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-text-primary hover:underline"
            >
              <span>Full Kitchen Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isOrdersLoading ? (
            <div className="py-8 text-center text-xs text-text-muted">
              Loading recent orders...
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-muted">
              No orders placed yet.
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {recentOrders.map((order) => {
                const badge =
                  STATUS_BADGES[order.status] || STATUS_BADGES.NEW;
                const itemsSummary = order.items
                  .map((i) => `${i.quantity}x ${i.name}`)
                  .join(", ");

                return (
                  <div
                    key={order.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-text-primary">
                          {order.id}
                        </span>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-canvas-secondary border border-border-subtle text-text-primary">
                          Table {order.tableId}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg} ${badge.border} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted truncate leading-relaxed">
                        {itemsSummary}
                      </p>
                      {order.customerNotes && (
                        <p className="text-[11px] text-accent-warm italic">
                          Note: &ldquo;{order.customerNotes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0">
                      <span className="font-mono font-bold text-xs text-text-primary tabular-nums">
                        {formatCurrency(order.totalAmount)}
                      </span>
                      <span className="text-[11px] text-text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3 text-accent-warm" />
                        <span>{formatTime(order.createdAt)}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 4 Cols: Sold Out Management & System Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Sold Out Action Box */}
          <div className="bg-canvas-primary border border-border-subtle rounded-lg p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-accent-warm" />
                <span>Stock Watch</span>
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-canvas-secondary border border-border-subtle text-text-muted tabular-nums">
                {metrics.soldOutCount} Sold Out
              </span>
            </div>

            {metrics.soldOutCount === 0 ? (
              <div className="py-4 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#F5F8F3] border border-[#D3DEC8] text-[#3B5E2B] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-text-primary">
                  All Items In Stock
                </p>
                <p className="text-[11px] text-text-muted">
                  Every product is currently active and orderable.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {metrics.soldOutList.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-[#FDF6F5] border border-[#ECCEC9] rounded-md flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-text-primary truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-text-muted font-mono">
                        {item.categoryName}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleAvailability(item.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-canvas-primary border border-border-subtle hover:border-[#D0D0CA] rounded text-text-primary transition-colors cursor-pointer shrink-0"
                    >
                      Make Available
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-border-subtle">
              <Link
                href="/admin/menu"
                className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-text-primary bg-canvas-secondary border border-border-subtle rounded-md hover:bg-[#EFEFEA] transition-colors"
              >
                <span>Full Menu &amp; Stock Manager</span>
                <ArrowRight className="w-3 h-3 text-accent-warm" />
              </Link>
            </div>
          </div>

          {/* Operational Pulse Card */}
          <div className="bg-canvas-secondary border border-border-subtle rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#3B5E2B]" />
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                System Pulse
              </h3>
            </div>

            <div className="space-y-2 text-xs text-text-muted leading-relaxed">
              <div className="flex items-center justify-between">
                <span>Multi-Tab Sync:</span>
                <span className="font-semibold text-[#3B5E2B]">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active Tables:</span>
                <span className="font-mono font-semibold text-text-primary">
                  {metrics.activeTablesCount} / {metrics.totalTablesCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Catalog Items:</span>
                <span className="font-mono font-semibold text-text-primary">
                  {products.length} Products
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
