"use client";

import React, { useEffect } from "react";
import { Zone } from "@/lib/zone-store";
import { TableInfo } from "@/types/order";
import { AlertTriangle, Trash2, X, ShieldAlert, QrCode } from "lucide-react";

interface DeleteZoneDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  zone: Zone | null;
  linkedTables: TableInfo[];
}

export function DeleteZoneDialog({
  isOpen,
  onClose,
  onConfirm,
  zone,
  linkedTables,
}: DeleteZoneDialogProps) {
  // Keyboard escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !zone) return null;

  const hasLinkedTables = linkedTables.length > 0;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs transition-opacity duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-canvas-primary border border-border-subtle rounded-lg shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 text-left"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-md border flex items-center justify-center shrink-0 ${
                hasLinkedTables
                  ? "bg-[#FFF9EB] border-[#F0DFA8] text-[#8C6D1F]"
                  : "bg-[#FDF6F5] border-[#ECCEC9] text-[#8C3426]"
              }`}
            >
              {hasLinkedTables ? (
                <ShieldAlert className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                {hasLinkedTables ? "Cannot Delete Zone" : "Delete Zone?"}
              </h3>
              <p className="text-xs text-text-muted">
                Zone: <strong className="text-text-primary">{zone.name}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 text-text-muted hover:text-text-primary rounded border border-border-subtle cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Details */}
        {hasLinkedTables ? (
          <div className="space-y-3">
            <div className="p-3.5 bg-[#FFF9EB] border border-[#F0DFA8] rounded-md text-xs text-[#6B5214] space-y-2 leading-relaxed">
              <p className="font-semibold text-[#8C6D1F]">
                Cannot delete zone. There are currently {linkedTables.length} tables assigned to this zone. Reassign or delete those tables first.
              </p>
              <p className="text-[11px] text-[#8C6D1F]/90">
                To maintain dining floor integrity, physical tables cannot be orphaned without a valid seating area.
              </p>
            </div>

            {/* List of affected tables */}
            <div className="p-3 bg-canvas-secondary border border-border-subtle rounded-md space-y-2">
              <div className="flex items-center justify-between text-[11px] text-text-muted font-medium">
                <span>Assigned Tables ({linkedTables.length}):</span>
                <span className="font-mono">Tables &amp; QR fleet</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pt-1">
                {linkedTables.map((t) => (
                  <span
                    key={t.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-border-subtle text-[10px] font-mono font-bold text-text-primary shadow-2xs"
                  >
                    <QrCode className="w-2.5 h-2.5 text-accent-warm" />
                    <span>Table {t.id}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-text-muted leading-relaxed">
            Are you sure you want to permanently delete the seating zone{" "}
            <strong className="text-text-primary">&ldquo;{zone.name}&rdquo;</strong>? This zone will no longer be available when configuring physical tables or filtering the fleet.
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-text-muted hover:text-text-primary bg-canvas-secondary border border-border-subtle rounded-md hover:bg-[#EFEFEA] transition-colors cursor-pointer"
          >
            {hasLinkedTables ? "Close" : "Cancel"}
          </button>

          {!hasLinkedTables && (
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#8C3426] hover:bg-[#782C20] rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Zone</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
