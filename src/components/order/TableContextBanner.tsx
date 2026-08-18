"use client";

import React from "react";
import Link from "next/link";
import { TableInfo } from "@/types/order";
import { MapPin, ArrowLeftRight } from "lucide-react";

interface TableContextBannerProps {
  table: TableInfo;
}

export function TableContextBanner({ table }: TableContextBannerProps) {
  return (
    <div className="w-full bg-canvas-primary border-b border-border-subtle py-3 px-4 sm:px-6">
      <div className="max-w-[480px] mx-auto flex items-center justify-between gap-3">
        {/* Table Identity & Location */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-canvas-secondary border border-border-subtle flex items-center justify-center text-text-primary shrink-0">
            <span className="font-mono text-xs font-bold">{table.id}</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-semibold text-text-primary leading-none">
                {table.name}
              </span>
              <span className="text-[10px] font-medium uppercase px-1.5 py-0.2 rounded-sm bg-[#F5F8F3] border border-[#D3DEC8] text-[#3B5E2B]">
                Makan di Tempat
              </span>
            </div>
            <p className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-accent-warm" />
              <span>{table.zone || "Area Utama"}</span>
            </p>
          </div>
        </div>

        {/* Change Table Action */}
        <Link
          href="/order"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-text-muted hover:text-text-primary hover:bg-canvas-secondary rounded-md border border-border-subtle transition-colors cursor-pointer"
          aria-label="Ganti Meja"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Ganti Meja</span>
        </Link>
      </div>
    </div>
  );
}
