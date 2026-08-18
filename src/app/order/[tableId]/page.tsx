import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTableInfo } from "@/data/tables";
import { CATEGORIES, PRODUCTS } from "@/data/menu";
import { CartProvider } from "@/context/CartContext";
import { TableOrderExperience } from "@/components/order/TableOrderExperience";

interface OrderPageProps {
  params: Promise<{
    tableId: string;
  }>;
}

export async function generateMetadata({
  params,
}: OrderPageProps): Promise<Metadata> {
  const { tableId } = await params;
  const table = getTableInfo(tableId);

  return {
    title: `Pesan di ${table.name} | Coffee And Beyond`,
    description: `Pemesanan mandiri untuk ${table.name}. Pilih racikan kopi, teh botanikal, pastry, dan hidangan dapur langsung dari meja Anda.`,
  };
}

export default async function TableOrderPage({ params }: OrderPageProps) {
  const { tableId } = await params;

  if (!tableId || tableId.trim().length === 0) {
    notFound();
  }

  const table = getTableInfo(tableId);

  return (
    <CartProvider tableId={table.id}>
      <TableOrderExperience
        table={table}
        categories={CATEGORIES}
        products={PRODUCTS}
      />
    </CartProvider>
  );
}
