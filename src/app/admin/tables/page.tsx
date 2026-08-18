import React from "react";
import type { Metadata } from "next";
import { TableFleetGrid } from "@/components/admin/tables/TableFleetGrid";

export const metadata: Metadata = {
  title: "Table Fleet & QR Generator | Coffee And Beyond",
  description: "Manage dining table inventory, seating zones, and generate printable QR code standees.",
};

export default function AdminTablesPage() {
  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb */}
      <div className="border-b border-border-subtle pb-4 print:hidden">
        <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
          <span className="w-6 h-[1px] bg-accent-warm" />
          <span>Fleet &amp; QR Standees</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
          Table Fleet &amp; QR Standees
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Manage physical table zones, toggle dining status, and generate high-contrast A6 standees for table-side guest self-ordering.
        </p>
      </div>

      <TableFleetGrid />
    </div>
  );
}
