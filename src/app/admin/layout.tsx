import React from "react";
import type { Metadata } from "next";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export const metadata: Metadata = {
  title: "Kitchen & Operational Portal | Coffee And Beyond",
  description:
    "Realtime kitchen queue, order lifecycle management, transaction archives, and operational controls.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
