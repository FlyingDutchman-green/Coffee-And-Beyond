"use client";

import React, { useEffect, useState } from "react";
import { TableInfo } from "@/types/order";
import { QRCodeGenerator } from "@/components/admin/tables/QRCodeGenerator";
import { downloadQRCodeAsPNG } from "@/lib/qr-download-utils";
import { X, Printer, MapPin, Coffee, Download, CheckCircle2 } from "lucide-react";

interface PrintableStandeeModalProps {
  table: TableInfo | null;
  allTables?: TableInfo[];
  isBatchMode?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function PrintableStandeeModal({
  table,
  allTables = [],
  isBatchMode = false,
  isOpen,
  onClose,
}: PrintableStandeeModalProps) {
  const [origin, setOrigin] = useState<string>(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  );
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.origin) {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const tablesToRender = isBatchMode
    ? allTables.filter((t) => t.isActive)
    : table
    ? [table]
    : [];

  const handleDownloadQR = async () => {
    setIsDownloading(true);

    if (isBatchMode) {
      for (let i = 0; i < tablesToRender.length; i++) {
        const t = tablesToRender[i];
        const elementId = `qr-svg-${t.id.trim().toUpperCase()}`;
        await downloadQRCodeAsPNG(t.id, elementId, 1024);
        // Short pause between multiple browser downloads
        if (i < tablesToRender.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }
      setDownloadSuccess(`Downloaded QR codes for ${tablesToRender.length} tables!`);
    } else if (table) {
      const elementId = `qr-svg-${table.id.trim().toUpperCase()}`;
      await downloadQRCodeAsPNG(table.id, elementId, 1024);
      setDownloadSuccess(`QR-Table-${table.id}.png downloaded (1024x1024px)`);
    }

    setIsDownloading(false);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs transition-opacity duration-150 overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-canvas-primary border border-border-subtle rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8 print:my-0 print:border-none print:shadow-none print:w-full print:max-w-none print:rounded-none"
      >
        {/* Modal Toolbar (Hidden during Print) */}
        <div className="p-4 bg-canvas-primary border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-accent-warm" />
            <h3 className="font-bold text-sm text-text-primary">
              {isBatchMode
                ? `Print All Standees (${tablesToRender.length} Active Tables)`
                : `Table Standee: ${table?.id}`}
            </h3>
            {downloadSuccess && (
              <span className="text-[11px] text-[#3B5E2B] font-medium flex items-center gap-1 ml-2 bg-[#F5F8F3] px-2 py-0.5 rounded border border-[#D3DEC8]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{downloadSuccess}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Secondary Download QR PNG Button */}
            <button
              type="button"
              disabled={isDownloading}
              onClick={handleDownloadQR}
              title="Download high-resolution 1024x1024 PNG image"
              className="px-3.5 py-1.5 text-xs font-medium bg-white border border-[#E7E7E3] text-text-primary rounded-md hover:bg-[#F7F7F5] hover:border-[#D0D0CA] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5 text-accent-warm" />
              <span>{isDownloading ? "Generating..." : "Download QR PNG"}</span>
            </button>

            {/* Primary Print Standee Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold bg-[#1E1E1C] text-white rounded-md hover:bg-[#3A3A37] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Standee</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close standee modal"
              className="p-1.5 text-text-muted hover:text-text-primary rounded-md border border-border-subtle cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Standee Card Canvas Preview */}
        <div className="p-6 sm:p-8 bg-canvas-secondary flex flex-col items-center justify-center gap-8 print:p-0 print:bg-white print:block">
          {tablesToRender.map((t) => {
            const orderUrl = `${origin}/order/${t.id}`;

            return (
              <div
                key={t.id}
                className="w-full max-w-[340px] bg-white border border-[#E7E7E3] rounded-xl p-6 sm:p-7 flex flex-col items-center justify-between text-center space-y-6 shadow-sm print:border-2 print:border-black print:rounded-none print:shadow-none print:break-inside-avoid print:break-after-page print:mx-auto print:my-4 print:max-w-[105mm] print:min-h-[148mm] print:p-8"
              >
                {/* Brand Header */}
                <div className="space-y-1 w-full border-b border-[#E7E7E3] pb-4">
                  <div className="inline-flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[#A69B8C]">
                    <Coffee className="w-3 h-3" />
                    <span>Coffee And Beyond</span>
                  </div>
                  <h2 className="text-xs uppercase font-mono tracking-wider text-text-muted font-medium">
                    Table-Side Self Ordering
                  </h2>
                </div>

                {/* Table Title Block */}
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
                    Welcome to
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-[#1E1E1C]">
                    TABLE {t.id}
                  </h1>
                  <p className="text-xs text-text-muted flex items-center justify-center gap-1 pt-0.5">
                    <MapPin className="w-3 h-3 text-[#A69B8C]" />
                    <span>{t.zone || "Dine-in"}</span>
                    {t.capacity && <span>&bull; {t.capacity} Pax</span>}
                  </p>
                </div>

                {/* High Contrast Vector QR Code Frame */}
                <div className="p-4 bg-[#F7F7F5] border border-[#E7E7E3] rounded-lg flex flex-col items-center justify-center space-y-2.5 print:bg-white print:border-2 print:border-black">
                  <div className="p-3 bg-white rounded-md border border-[#E7E7E3] flex items-center justify-center shadow-2xs print:border-none print:shadow-none">
                    <QRCodeGenerator
                      id={`qr-svg-${t.id}`}
                      tableId={t.id}
                      size={180}
                    />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#777772] tracking-wider uppercase">
                    SCAN TO BROWSE &amp; ORDER
                  </span>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="space-y-1.5 text-xs text-[#777772] max-w-[240px]">
                  <p className="font-semibold text-[#1E1E1C] text-xs">
                    How it works:
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    1. Scan QR with your smartphone camera.
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    2. Browse artisanal coffees, bakery &amp; kitchen plates.
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    3. Submit order &bull; Pay at counter.
                  </p>
                </div>

                {/* Direct URL note for staff/fallback */}
                <div className="w-full pt-3 border-t border-[#E7E7E3] text-[9px] font-mono text-text-muted truncate">
                  {orderUrl}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar for Single View */}
        <div className="p-4 bg-canvas-primary border-t border-border-subtle flex items-center justify-between text-xs text-text-muted print:hidden">
          <span>Standard A6 Acrylic Standee Template (105mm &times; 148mm)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-canvas-secondary border border-border-subtle rounded text-text-primary hover:bg-[#EFEFEA] cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
