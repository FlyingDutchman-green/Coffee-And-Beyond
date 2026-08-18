"use client";

import React from "react";
import Link from "next/link";
import { TABLES } from "@/data/tables";
import { QrCode, Printer, ArrowUpRight, MapPin, Sparkles } from "lucide-react";

export function TableQRManager() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Print CTA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-canvas-primary border border-border-subtle p-4 sm:p-5 rounded-lg shadow-2xs print:hidden">
        <div>
          <h2 className="text-base font-bold text-text-primary tracking-tight">
            Table QR Code Standee Generator
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Physical QR standees for all active café tables. Print these cards on acrylic
            or wooden stands for table-side guest self-ordering.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2 text-xs font-semibold bg-charcoal text-white rounded-md hover:bg-[#3A3A37] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Print All Standees</span>
        </button>
      </div>

      {/* Grid of Printable Table QR Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {TABLES.map((table) => {
          const orderUrl = `/order/${table.id}`;

          return (
            <div
              key={table.id}
              className="bg-canvas-primary border border-border-subtle rounded-lg p-6 flex flex-col items-center justify-between text-center space-y-5 shadow-xs print:border-2 print:border-black print:break-inside-avoid"
            >
              {/* Brand Header */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-accent-warm">
                  Coffee And Beyond
                </span>
                <h3 className="font-bold text-xl text-text-primary font-mono tracking-tight">
                  {table.name.toUpperCase()}
                </h3>
                <p className="text-xs text-text-muted flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3 text-accent-warm" />
                  <span>{table.zone}</span>
                </p>
              </div>

              {/* QR Code Graphic Box */}
              <div className="p-4 bg-canvas-secondary border border-border-subtle rounded-lg flex flex-col items-center justify-center space-y-2">
                <div className="w-32 h-32 bg-white border border-border-subtle rounded-md flex flex-col items-center justify-center p-2 relative shadow-2xs">
                  {/* Stylized high-contrast QR Matrix */}
                  <QrCode className="w-24 h-24 text-charcoal stroke-[1.25]" />
                  <span className="font-mono text-[9px] font-bold text-text-muted mt-1">
                    SCAN TO ORDER
                  </span>
                </div>
                <span className="font-mono text-[11px] font-semibold text-text-primary">
                  {table.id}
                </span>
              </div>

              {/* Table Instructions */}
              <div className="space-y-1 text-xs text-text-muted">
                <p className="font-medium text-text-primary">
                  Scan QR with your smartphone
                </p>
                <p className="text-[11px]">
                  Browse menu &bull; Order at your pace &bull; Pay at counter
                </p>
              </div>

              {/* Test Action (Hidden on Print) */}
              <div className="w-full pt-2 border-t border-border-subtle print:hidden">
                <Link
                  href={orderUrl}
                  target="_blank"
                  className="w-full py-1.5 text-xs font-medium bg-canvas-secondary border border-border-subtle rounded text-text-primary hover:bg-[#EFEFEA] transition-colors flex items-center justify-center gap-1"
                >
                  <span>Test Ordering View</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-text-muted" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
