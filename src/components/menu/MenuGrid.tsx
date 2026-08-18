"use client";

import React from "react";
import { Product } from "@/types/menu";
import { ProductCard } from "@/components/menu/ProductCard";

interface MenuGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export function MenuGrid({ products, onSelectProduct }: MenuGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelectProduct}
        />
      ))}
    </div>
  );
}
