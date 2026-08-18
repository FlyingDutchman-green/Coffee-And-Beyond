"use client";

import React, { useState, useEffect } from "react";
import { TableInfo } from "@/types/order";
import { useZoneStore } from "@/lib/zone-store";
import { X, Check, QrCode, AlertCircle } from "lucide-react";

interface TableFormModalProps {
  table: TableInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (tableData: TableInfo) => void;
}

export function TableFormModal({
  table,
  isOpen,
  onClose,
  onSave,
}: TableFormModalProps) {
  const { zones } = useZoneStore();
  const [tableId, setTableId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [zone, setZone] = useState<string>("");
  const [customZone, setCustomZone] = useState<string>("");
  const [capacity, setCapacity] = useState<number>(2);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!table;

  useEffect(() => {
    const defaultZoneName = zones.length > 0 ? zones[0].name : "Indoor Main Hall";

    if (table) {
      setTableId(table.id);
      setName(table.name);
      const isKnownZone = zones.some(
        (z) => z.name.toLowerCase() === (table.zone || "").toLowerCase()
      );
      if (isKnownZone || !table.zone) {
        setZone(table.zone || defaultZoneName);
        setCustomZone("");
      } else {
        setZone("custom");
        setCustomZone(table.zone || "");
      }
      setCapacity(table.capacity || 2);
      setIsActive(table.isActive);
      setError(null);
    } else {
      setTableId("");
      setName("");
      setZone(defaultZoneName);
      setCustomZone("");
      setCapacity(2);
      setIsActive(true);
      setError(null);
    }
  }, [table, isOpen, zones]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = tableId.trim().toUpperCase();
    if (!cleanId) {
      setError("Table Identifier is required (e.g., A01, B02).");
      return;
    }

    const finalZone = zone === "custom" ? customZone.trim() || "Dine In Area" : zone;
    const finalName = name.trim() || `Table ${cleanId}`;

    onSave({
      id: cleanId,
      name: finalName,
      zone: finalZone,
      capacity: Number(capacity) || 2,
      isActive,
    });

    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs transition-opacity duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-canvas-primary border border-border-subtle rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-canvas-secondary border border-border-subtle text-text-primary">
              <QrCode className="w-4 h-4 text-accent-warm" />
            </div>
            <div>
              <h3 className="font-bold text-base text-text-primary">
                {isEditing ? `Edit Table: ${table?.id}` : "Add New Table"}
              </h3>
              <p className="text-xs text-text-muted">
                {isEditing
                  ? "Update table zone, capacity, and active availability."
                  : "Register a new café table and generate its QR code."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-text-muted hover:text-text-primary rounded-md border border-border-subtle cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Table ID & Display Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-text-primary block">
                Table Code / ID <span className="text-[#8C3426]">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isEditing}
                placeholder="e.g. A05, T03, VIP02"
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                className="w-full px-3 py-2 bg-canvas-secondary border border-border-subtle rounded-md text-text-primary font-mono uppercase focus:outline-none focus:ring-1 focus:ring-charcoal disabled:opacity-60"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-text-primary block">
                Display Name
              </label>
              <input
                type="text"
                placeholder="e.g. Table A05"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal"
              />
            </div>
          </div>

          {/* Zone Selector */}
          <div className="space-y-1">
            <label className="font-semibold text-text-primary block">
              Zone / Seating Area
            </label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full px-3 py-2 bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal cursor-pointer"
            >
              {zones.map((z) => (
                <option key={z.id} value={z.name}>
                  {z.name}
                </option>
              ))}
              <option value="custom">Other / Custom Zone...</option>
            </select>
          </div>

          {zone === "custom" && (
            <div className="space-y-1">
              <label className="font-semibold text-text-primary block">
                Custom Zone Name
              </label>
              <input
                type="text"
                placeholder="e.g. Rooftop Gazebo"
                value={customZone}
                onChange={(e) => setCustomZone(e.target.value)}
                className="w-full px-3 py-2 bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal"
              />
            </div>
          )}

          {/* Capacity */}
          <div className="space-y-1">
            <label className="font-semibold text-text-primary block">
              Seating Capacity (Guests / Pax)
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 1)}
              className="w-full px-3 py-2 bg-canvas-secondary border border-border-subtle rounded-md text-text-primary font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-charcoal"
            />
          </div>

          {/* Active Flag */}
          <div className="pt-2 border-t border-border-subtle">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-border-subtle text-charcoal focus:ring-0"
              />
              <span className="font-semibold text-text-primary">
                Active for Guest Ordering
              </span>
            </label>
            <p className="text-[11px] text-text-muted mt-0.5 ml-6">
              When disabled, guests scanning this table code will see a notice that ordering is temporarily paused.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-border-subtle flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-canvas-secondary border border-border-subtle rounded-md text-text-primary hover:bg-[#EFEFEA] font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1E1E1C] text-white rounded-md hover:bg-[#3A3A37] font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isEditing ? "Save Changes" : "Create Table"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
