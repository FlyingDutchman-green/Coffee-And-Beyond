"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTableStore } from "@/lib/table-store";
import { QrCode, ArrowRight, MapPin, Search } from "lucide-react";

export default function OrderTableSelectPage() {
  const router = useRouter();
  const { tables } = useTableStore();
  const [customTable, setCustomTable] = useState("");

  const activeTables = tables.filter((t) => t.isActive);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customTable.trim().toUpperCase();
    if (trimmed) {
      router.push(`/order/${trimmed}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas-primary text-text-primary">
      <Navbar />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-xl mx-auto space-y-8 text-center sm:text-left">
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
              <span className="w-6 h-[1px] bg-accent-warm" />
              <span>Pemesanan Meja Mandiri</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
              Pilih Nomor Meja Anda
            </h1>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              Pindai kode QR fisik yang ada di meja kafe Anda, atau pilih nomor meja di
              bawah ini untuk mulai memesan racikan kopi dan hidangan langsung ke tempat duduk Anda.
            </p>
          </div>

          {/* Quick Table Number Input */}
          <div className="p-5 sm:p-6 bg-canvas-secondary border border-border-subtle rounded-lg space-y-4">
            <h2 className="text-xs uppercase font-semibold tracking-wider text-text-primary flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-accent-warm" />
              <span>Masukkan Kode Meja Manual</span>
            </h2>

            <form onSubmit={handleCustomSubmit} className="flex gap-2">
              <input
                type="text"
                value={customTable}
                onChange={(e) => setCustomTable(e.target.value.toUpperCase())}
                placeholder="Contoh: A01, B02, OUT-01"
                aria-label="Kode Meja"
                className="flex-1 px-3.5 py-2.5 text-sm bg-canvas-primary border border-border-subtle rounded-md text-text-primary font-mono placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-charcoal"
              />
              <button
                type="submit"
                disabled={!customTable.trim()}
                className="px-5 py-2.5 text-sm font-semibold bg-charcoal text-white rounded-md hover:bg-[#3A3A37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>Buka Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Available Café Tables Grid */}
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase font-semibold tracking-wider text-text-primary">
                Meja Kafe Tersedia ({activeTables.length})
              </h2>
              <span className="text-xs text-text-muted">Ketuk untuk membuka sesi pesanan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeTables.map((table) => (
                <Link
                  key={table.id}
                  href={`/order/${table.id}`}
                  className="p-4 bg-canvas-primary border border-border-subtle rounded-lg flex items-center justify-between hover:border-[#D0D0CA] hover:bg-canvas-secondary transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-canvas-secondary border border-border-subtle flex items-center justify-center text-text-primary group-hover:bg-canvas-primary transition-colors">
                      <span className="font-mono text-sm font-bold">{table.id}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-text-primary leading-tight">
                        {table.name}
                      </p>
                      <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-accent-warm" />
                        <span>{table.zone}</span>
                        {table.capacity && <span>&bull; {table.capacity} Orang</span>}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 text-text-muted group-hover:text-text-primary group-hover:translate-x-0.5 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* QR Help Card */}
          <div className="p-4 rounded-md bg-canvas-secondary border border-border-subtle flex items-center gap-3 text-left">
            <div className="p-2 rounded-md bg-canvas-primary border border-border-subtle text-text-primary shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Setiap meja dilengkapi dengan kode QR akrilik. Arahkan kamera ponsel Anda
              ke kode QR meja untuk langsung masuk ke menu pemesanan meja tersebut.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
