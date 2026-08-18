import React from "react";
import type { Metadata } from "next";
import { CategoryManagementList } from "@/components/admin/categories/CategoryManagementList";

export const metadata: Metadata = {
  title: "Category Management | Coffee And Beyond Admin",
  description:
    "Organize menu categories, configure section hierarchy, and manage product classifications.",
};

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Page Title & Context */}
      <div className="border-b border-border-subtle pb-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
          <span className="w-6 h-[1px] bg-accent-warm" />
          <span>Catalog Structure</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1C]">
          Category Management
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Add, configure, and reorder menu categories. Changes immediately synchronize with public menu views and table-side ordering.
        </p>
      </div>

      <CategoryManagementList />
    </div>
  );
}
