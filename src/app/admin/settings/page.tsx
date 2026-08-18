import React from "react";
import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";

export const metadata: Metadata = {
  title: "Brand & Content Settings | Coffee And Beyond Admin",
  description:
    "Manage brand philosophy, space amenities with 16:9 imagery, operating hours, and location address.",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Title & Context */}
      <div className="border-b border-border-subtle pb-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
          <span className="w-6 h-[1px] bg-accent-warm" />
          <span>Brand &amp; CMS Controls</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
          Café Brand Settings
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Configure cafe identity, showcase media, and operational hours.
        </p>
      </div>

      <SettingsForm />
    </div>
  );
}
