import React from "react";
import type { Metadata } from "next";
import { DashboardOverview } from "@/components/admin/dashboard/DashboardOverview";

export const metadata: Metadata = {
  title: "Dashboard Overview | Coffee And Beyond Admin",
  description:
    "Realtime operational overview, sales metrics, kitchen queue status, and catalog summary.",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Title & Context */}
      <div className="border-b border-border-subtle pb-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
          <span className="w-6 h-[1px] bg-accent-warm" />
          <span>Operational Command Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
          Dashboard Overview
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Monitor today&apos;s revenue, live kitchen order tickets, catalog stock availability, and table fleet status.
        </p>
      </div>

      <DashboardOverview />
    </div>
  );
}
