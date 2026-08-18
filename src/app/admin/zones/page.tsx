import React from "react";
import type { Metadata } from "next";
import { ZoneManagementList } from "@/components/admin/zones/ZoneManagementList";

export const metadata: Metadata = {
  title: "Zone Management | Coffee And Beyond Admin",
  description:
    "Configure café seating zones, manage floor areas, and link physical dining tables.",
};

export default function AdminZonesPage() {
  return (
    <div className="space-y-6">
      {/* Page Title & Context */}
      <div className="border-b border-border-subtle pb-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
          <span className="w-6 h-[1px] bg-accent-warm" />
          <span>Floor &amp; Seating Layout</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
          Zone Management
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Add, configure, and reorder café zones. Physical tables and QR standees dynamically synchronize with these seating areas.
        </p>
      </div>

      <ZoneManagementList />
    </div>
  );
}
