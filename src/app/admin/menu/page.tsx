import React from "react";
import type { Metadata } from "next";
import { MenuManagementList } from "@/components/admin/menu/MenuManagementList";

export const metadata: Metadata = {
  title: "Menu & Stock Controls | Coffee And Beyond",
  description: "Realtime catalog, item availability, and pricing management for café offerings.",
};

export default function AdminMenuPage() {
  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb */}
      <div className="border-b border-border-subtle pb-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
          <span className="w-6 h-[1px] bg-accent-warm" />
          <span>Catalog Management</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
          Menu &amp; Stock Controls
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Manage product availability, modify pricing, and configure offerings. Changes instantly propagate to online and table menus.
        </p>
      </div>

      <MenuManagementList />
    </div>
  );
}
