"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Compass,
  Utensils,
  Leaf,
  Thermometer,
  Layers,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";
import { Product } from "@/types/menu";
import { formatPrice } from "@/data/menu";
import { useOptionalCart } from "@/context/CartContext";
import { toast } from "sonner";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const router = useRouter();
  const cart = useOptionalCart();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [quantity, setQuantity] = useState(1);
  const [temperature, setTemperature] = useState<string>("Dingin (Iced)");
  const [sugarLevel, setSugarLevel] = useState<string>("Normal Sweet");
  const [customNote, setCustomNote] = useState<string>("");

  // Reset state on product change
  useEffect(() => {
    if (product) {
      setQuantity(1);
      const isHotDefault = product.servingTemperature?.toLowerCase().includes("hot");
      setTemperature(isHotDefault ? "Hangat (Hot)" : "Dingin (Iced)");
      setSugarLevel("Normal Sweet");
      setCustomNote("");
    }
  }, [product]);

  // Close on Escape key & lock body scroll
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button for keyboard accessibility
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [product, onClose]);

  if (!product) return null;

  const isSoldOut = !product.isAvailable;
  const calculatedPrice = product.price * quantity;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    if (isSoldOut) return;

    const noteParts: string[] = [temperature, sugarLevel];
    if (customNote.trim()) {
      noteParts.push(customNote.trim());
    }
    const finalNote = noteParts.join(" • ");

    if (cart) {
      cart.addItem(product, quantity, finalNote);
      toast.success("Ditambahkan ke pesanan", { duration: 1500 });
      onClose();
    } else {
      router.push("/order");
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-charcoal/45 backdrop-blur-xs transition-opacity duration-150 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      <div
        className="relative w-full max-w-xl bg-canvas-primary border border-border-subtle rounded-t-xl sm:rounded-lg shadow-xl overflow-hidden my-0 sm:my-auto animate-in slide-in-from-bottom sm:zoom-in-95 duration-150 flex flex-col max-h-[92vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-border-subtle flex items-start justify-between gap-4 shrink-0 bg-canvas-primary">
          <div className="space-y-1.5 pr-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-medium tracking-wider uppercase text-text-muted">
                {product.categoryName || "Menu Pilihan"}
              </span>

              {isSoldOut && (
                <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-sm bg-[#F7F7F5] border border-[#E7E7E3] text-[#777772]">
                  Stok Habis
                </span>
              )}
            </div>

            <h2
              id="modal-product-title"
              className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight leading-snug"
            >
              {product.name}
            </h2>
          </div>

          {/* Close '✕' Button */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup rincian menu"
            className="p-2 text-text-muted hover:text-text-primary hover:bg-canvas-secondary rounded-md border border-border-subtle transition-colors focus:outline-none focus:ring-1 focus:ring-charcoal shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-left">
          {/* Product Photography Hero if available */}
          {product.imageUrl && (
            <div className="w-full aspect-4/3 rounded-lg overflow-hidden border border-border-subtle bg-canvas-secondary relative shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 rounded text-[10px] font-mono font-medium bg-black/60 text-white backdrop-blur-xs shadow-xs">
                  #{product.id.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Origin & Roast Details Banner (For Coffee & Botanicals) */}
          {(product.origin || product.roastLevel) && (
            <div className="p-4 rounded-md bg-canvas-secondary border border-border-subtle space-y-2">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span className="flex items-center gap-1.5 font-medium text-text-primary">
                  <Compass className="w-3.5 h-3.5 text-accent-warm" />
                  <span>Asal &amp; Terroir</span>
                </span>
                <span className="font-mono text-[10px] text-text-muted">
                  #{product.id.toUpperCase()}
                </span>
              </div>
              <p className="font-medium text-text-primary text-sm leading-snug">
                {product.origin}
              </p>
              {product.roastLevel && (
                <p className="text-xs text-text-muted">
                  <strong className="font-medium text-text-primary">Profil Sangrai:</strong>{" "}
                  {product.roastLevel}
                </p>
              )}
            </div>
          )}

          {/* Narrative Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-text-primary">
              Deskripsi
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Ingredients / Composition (For Pastry & Kitchen) */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs uppercase font-semibold tracking-wider text-text-primary flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-accent-warm" />
                <span>Bahan Utama</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="text-xs px-2.5 py-1 rounded-sm bg-canvas-primary border border-border-subtle text-text-muted"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dietary & Temperature Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Serving Temperature */}
            {product.servingTemperature && (
              <div className="p-3 bg-canvas-secondary border border-border-subtle rounded-md flex items-center gap-2.5">
                <Thermometer className="w-4 h-4 text-text-muted shrink-0" />
                <div className="text-xs">
                  <span className="text-text-muted block text-[11px]">Suhu Penyajian</span>
                  <span className="font-medium text-text-primary">
                    {product.servingTemperature}
                  </span>
                </div>
              </div>
            )}

            {/* Dietary Information */}
            {product.dietary && product.dietary.length > 0 ? (
              <div className="p-3 bg-canvas-secondary border border-border-subtle rounded-md flex items-center gap-2.5">
                <Leaf className="w-4 h-4 text-accent-warm shrink-0" />
                <div className="text-xs">
                  <span className="text-text-muted block text-[11px]">Info Diet</span>
                  <span className="font-medium text-text-primary">
                    {product.dietary.join(", ")}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-canvas-secondary border border-border-subtle rounded-md flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-text-muted shrink-0" />
                <div className="text-xs">
                  <span className="text-text-muted block text-[11px]">Kategori</span>
                  <span className="font-medium text-text-primary">
                    {product.categoryName}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Customization Options Section */}
          <div className="p-4 sm:p-5 rounded-lg bg-canvas-secondary border border-border-subtle space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-warm" />
              <h3 className="text-xs uppercase font-semibold tracking-wider text-text-primary">
                Pilihan &amp; Catatan Tambahan
              </h3>
            </div>

            {/* Temperature Option */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-primary block">
                Suhu Penyajian
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["Dingin (Iced)", "Hangat (Hot)"] as const).map((temp) => (
                  <button
                    key={temp}
                    type="button"
                    onClick={() => setTemperature(temp)}
                    className={`py-2 px-3 text-xs font-medium rounded-md border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      temperature === temp
                        ? "bg-charcoal text-white border-charcoal font-semibold shadow-xs"
                        : "bg-canvas-primary text-text-muted border-border-subtle hover:text-text-primary hover:bg-[#EFEFEA]"
                    }`}
                  >
                    <Thermometer className="w-3.5 h-3.5" />
                    <span>{temp}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sugar Level Option */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-primary block">
                Tingkat Kemanisan
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    "Normal Sweet",
                    "Less Sugar (Sedikit Gula)",
                    "No Sugar (Tanpa Gula)",
                  ] as const
                ).map((sugar) => (
                  <button
                    key={sugar}
                    type="button"
                    onClick={() => setSugarLevel(sugar)}
                    className={`py-2 px-1.5 text-center text-[11px] font-medium rounded-md border transition-all cursor-pointer leading-tight flex items-center justify-center ${
                      sugarLevel === sugar
                        ? "bg-charcoal text-white border-charcoal font-semibold shadow-xs"
                        : "bg-canvas-primary text-text-muted border-border-subtle hover:text-text-primary hover:bg-[#EFEFEA]"
                    }`}
                  >
                    {sugar}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Request Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="modal-item-note"
                  className="font-semibold text-text-primary block"
                >
                  Catatan Khusus untuk Menu Ini
                </label>
                <span className="text-[11px] text-text-muted font-mono">
                  {customNote.length}/150
                </span>
              </div>
              <input
                id="modal-item-note"
                type="text"
                maxLength={150}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Contoh: Susu oat, ekstra espresso shot..."
                className="w-full text-xs px-3 py-2.5 bg-canvas-primary border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-charcoal"
              />
            </div>

            {/* Quantity Stepper Row */}
            <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
              <span className="text-xs font-semibold text-text-primary">
                Jumlah Pesanan
              </span>
              <div className="flex items-center border border-border-subtle rounded-md bg-canvas-primary overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Kurangi jumlah"
                  className="w-8 h-8 flex items-center justify-center text-text-primary hover:bg-canvas-secondary transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono text-xs font-semibold text-text-primary tabular-nums select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Tambah jumlah"
                  className="w-8 h-8 flex items-center justify-center text-text-primary hover:bg-canvas-secondary transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Availability Status Box */}
          <div className="p-3.5 bg-canvas-secondary border border-border-subtle rounded-md flex items-center justify-between text-xs">
            <span className="text-text-muted">Ketersediaan Dapur:</span>
            {product.isAvailable ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-[#3B5E2B]">
                <CheckCircle2 className="w-4 h-4 text-[#3B5E2B]" />
                <span>Tersedia • Disiapkan Segar Sesuai Pesanan</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-medium text-[#777772]">
                <AlertCircle className="w-4 h-4 text-[#777772]" />
                <span>Stok Habis Hari Ini</span>
              </span>
            )}
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="p-5 sm:p-6 pt-4 border-t border-border-subtle bg-canvas-secondary/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[11px] text-text-muted block uppercase tracking-wide font-medium">
              Harga ({quantity}x)
            </span>
            <span className="text-xl sm:text-2xl font-semibold text-text-primary tabular-nums">
              Rp {calculatedPrice.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs sm:text-sm font-medium text-text-primary border border-border-subtle bg-canvas-primary rounded-md hover:bg-canvas-secondary transition-colors cursor-pointer"
            >
              Kembali
            </button>

            {!isSoldOut ? (
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-charcoal rounded-md hover:bg-[#3A3A37] transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah ke Pesanan — Rp {calculatedPrice.toLocaleString("id-ID")}</span>
              </button>
            ) : (
              <button
                disabled
                className="flex-1 sm:flex-none px-5 py-2.5 text-xs sm:text-sm font-medium text-[#777772] bg-[#F7F7F5] border border-[#E7E7E3] rounded-md cursor-not-allowed opacity-60"
              >
                Stok Habis
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
