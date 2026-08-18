import React from "react";
import type { Metadata } from "next";
import { LiveOrderFeed } from "@/components/admin/LiveOrderFeed";

export const metadata: Metadata = {
  title: "Live Kitchen Queue | Coffee And Beyond",
  description: "Realtime incoming order queue for baristas and kitchen staff.",
};

export default function AdminLiveOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border-subtle pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
            <span className="w-6 h-[1px] bg-accent-warm" />
            <span>Operational Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
            Live Kitchen &amp; Barista Queue
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Realtime live order tickets. Manage preparation progression from confirmation to delivery.
          </p>
        </div>
      </div>

      <LiveOrderFeed />
    </div>
  );
}
