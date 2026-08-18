import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTableInfo } from "@/data/tables";
import { OrderStatusView } from "@/components/order/OrderStatusView";

interface StatusPageProps {
  params: Promise<{
    tableId: string;
    orderId: string;
  }>;
}

export async function generateMetadata({
  params,
}: StatusPageProps): Promise<Metadata> {
  const { tableId, orderId } = await params;
  const table = getTableInfo(tableId);

  return {
    title: `Status Pesanan #${orderId} (${table.name}) | Coffee And Beyond`,
    description: `Pelacak status langsung untuk pesanan #${orderId} di ${table.name}. Pantau verifikasi kasir, peracikan barista, dan penyajian secara real-time.`,
  };
}

export default async function OrderStatusPage({ params }: StatusPageProps) {
  const { tableId, orderId } = await params;

  if (!tableId || !orderId) {
    notFound();
  }

  const table = getTableInfo(tableId);

  return <OrderStatusView table={table} orderId={orderId} />;
}
