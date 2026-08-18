"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { TableInfo } from "@/types/order";
import { useTableStore } from "@/lib/table-store";
import { useZoneStore } from "@/lib/zone-store";
import { QRCodeGenerator } from "@/components/admin/tables/QRCodeGenerator";
import { TableFormModal } from "@/components/admin/tables/TableFormModal";
import { PrintableStandeeModal } from "@/components/admin/tables/PrintableStandeeModal";
import { downloadQRCodeAsPNG, downloadQRCodeAsSVG } from "@/lib/qr-download-utils";
import {
  Search,
  X,
  Plus,
  Printer,
  Edit2,
  Trash2,
  RotateCcw,
  QrCode,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Download,
  FileDown,
} from "lucide-react";

export function TableFleetGrid() {
  const {
    tables,
    toggleTableStatus,
    updateTable,
    addTable,
    deleteTable,
    resetToDefaultTables,
  } = useTableStore();

  const { zones: storeZones } = useZoneStore();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [editingTable, setEditingTable] = useState<TableInfo | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [standeeModalTable, setStandeeModalTable] = useState<TableInfo | null>(null);
  const [isBatchPrintOpen, setIsBatchPrintOpen] = useState<boolean>(false);
  const [deletingTableId, setDeletingTableId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Extract unique zones dynamically from zoneStore and active tables
  const zones = useMemo(() => {
    const set = new Set<string>();
    storeZones.forEach((z) => set.add(z.name));
    tables.forEach((t) => {
      if (t.zone) set.add(t.zone);
    });
    return Array.from(set);
  }, [storeZones, tables]);

  // Metrics summary
  const activeCount = useMemo(() => tables.filter((t) => t.isActive).length, [tables]);
  const inactiveCount = useMemo(() => tables.filter((t) => !t.isActive).length, [tables]);
  const totalCapacity = useMemo(
    () => tables.reduce((sum, t) => sum + (t.capacity || 2), 0),
    [tables]
  );

  // Filtered tables list
  const filteredTables = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tables.filter((table) => {
      const matchesZone = selectedZone === "all" || table.zone === selectedZone;

      if (!query) return matchesZone;

      const matchesQuery =
        table.id.toLowerCase().includes(query) ||
        table.name.toLowerCase().includes(query) ||
        (table.zone || "").toLowerCase().includes(query);

      return matchesZone && matchesQuery;
    });
  }, [tables, selectedZone, searchQuery]);

  const handleDeleteConfirm = (tableId: string) => {
    deleteTable(tableId);
    setDeletingTableId(null);
    showNotification(`Table ${tableId} removed from fleet.`);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Reset all tables to default layout (A01–A06, B01–B04, T01–T02, VIP01, OUT-01–OUT-02, BAR-01)? Custom added tables will be replaced."
      )
    ) {
      resetToDefaultTables();
      showNotification("Tables reset to standard floor plan.");
    }
  };

  const handleDownloadPNG = async (tableId: string) => {
    setDownloadingId(tableId);
    const elementId = `qr-svg-${tableId.trim().toUpperCase()}`;
    const success = await downloadQRCodeAsPNG(tableId, elementId, 1024);
    setDownloadingId(null);
    if (success) {
      showNotification(`QR Code for Table ${tableId} downloaded (1024x1024px PNG).`);
    }
  };

  const handleDownloadSVG = (tableId: string) => {
    const elementId = `qr-svg-${tableId.trim().toUpperCase()}`;
    const success = downloadQRCodeAsSVG(tableId, elementId);
    if (success) {
      showNotification(`Vector QR Code for Table ${tableId} downloaded (SVG).`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 bg-[#F5F8F3] border border-[#D3DEC8] text-[#3B5E2B] rounded-lg text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-[#3B5E2B] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span>Total Tables</span>
            <QrCode className="w-4 h-4 text-accent-warm" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums">
            {tables.length}
          </p>
        </div>

        <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span>Active in Service</span>
            <CheckCircle2 className="w-4 h-4 text-[#3B5E2B]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#3B5E2B] tabular-nums">
            {activeCount}
          </p>
        </div>

        <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span>Paused / Inactive</span>
            <AlertCircle className="w-4 h-4 text-[#8C3426]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#8C3426] tabular-nums">
            {inactiveCount}
          </p>
        </div>

        <div className="p-4 bg-canvas-primary border border-border-subtle rounded-lg space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span>Total Seating Capacity</span>
            <Users className="w-4 h-4 text-accent-warm" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-text-primary tabular-nums">
            {totalCapacity} <span className="text-xs font-normal text-text-muted">Pax</span>
          </p>
        </div>
      </div>

      {/* Control Bar: Filters, Search, Print All & Add CTA */}
      <div className="bg-canvas-primary border border-border-subtle p-4 rounded-lg shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Zone Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setSelectedZone("all")}
              className={`px-3 py-1.5 rounded-md text-xs transition-colors border shrink-0 flex items-center gap-1.5 cursor-pointer ${
                selectedZone === "all"
                  ? "bg-[#1E1E1C] text-white border-[#1E1E1C] font-semibold shadow-xs"
                  : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary hover:bg-[#EFEFEA]"
              }`}
            >
              <span>All Zones</span>
              <span
                className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full border ${
                  selectedZone === "all"
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-canvas-primary text-text-muted border-border-subtle"
                }`}
              >
                {tables.length}
              </span>
            </button>

            {zones.map((zone) => {
              const isActive = selectedZone === zone;
              const count = tables.filter((t) => t.zone === zone).length;

              return (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setSelectedZone(zone)}
                  className={`px-3 py-1.5 rounded-md text-xs transition-colors border shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-[#1E1E1C] text-white border-[#1E1E1C] font-semibold shadow-xs"
                      : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary hover:bg-[#EFEFEA]"
                  }`}
                >
                  <span>{zone}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full border ${
                      isActive
                        ? "bg-white/20 text-white border-white/30"
                        : "bg-canvas-primary text-text-muted border-border-subtle"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              title="Reset to default tables"
              className="p-2 text-xs font-medium bg-canvas-secondary border border-border-subtle rounded-md text-text-muted hover:text-text-primary hover:bg-[#EFEFEA] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsBatchPrintOpen(true)}
              className="px-3 py-2 text-xs font-medium bg-canvas-secondary border border-border-subtle rounded-md text-text-primary hover:bg-[#EFEFEA] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-accent-warm" />
              <span>Print All Standees</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNewModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-[#1E1E1C] text-white rounded-md hover:bg-[#3A3A37] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Table</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="pt-2 border-t border-border-subtle">
          <div className="relative sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search table number (e.g. A01, VIP01) or zone..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-charcoal"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Physical Table Cards */}
      {filteredTables.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredTables.map((table) => {
            const orderUrl = `/order/${table.id}`;
            const isDownloading = downloadingId === table.id;

            return (
              <div
                key={table.id}
                className={`bg-white border border-[#E7E7E3] rounded-lg p-5 flex flex-col justify-between gap-4 shadow-2xs hover:border-[#D0D0CA] transition-colors ${
                  !table.isActive ? "bg-[#FAFAFA] opacity-75" : ""
                }`}
              >
                {/* Header: Table Number, Status Badge */}
                <div className="flex items-start justify-between gap-2 border-b border-border-subtle pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold font-mono tracking-tight text-[#1E1E1C]">
                        TABLE {table.id}
                      </h3>
                      {table.capacity && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-canvas-secondary border border-border-subtle text-text-muted">
                          {table.capacity} Pax
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-accent-warm" />
                      <span>{table.zone || "Indoor Main Hall"}</span>
                    </p>
                  </div>

                  {/* Active / Inactive Badge with Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleTableStatus(table.id)}
                    title={table.isActive ? "Click to deactivate" : "Click to activate"}
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-sm border cursor-pointer transition-colors ${
                      table.isActive
                        ? "bg-[#F5F8F3] border-[#D3DEC8] text-[#3B5E2B] hover:bg-[#ebf3e7]"
                        : "bg-[#FDF6F5] border-[#ECCEC9] text-[#8C3426] hover:bg-[#fcebe9]"
                    }`}
                  >
                    {table.isActive ? "Active" : "Inactive"}
                  </button>
                </div>

                {/* Center: QR Code Graphic */}
                <div className="p-3 bg-[#F7F7F5] border border-border-subtle rounded-md flex flex-col items-center justify-center space-y-2">
                  <div className="p-2 bg-white rounded border border-border-subtle flex items-center justify-center shadow-2xs">
                    <QRCodeGenerator
                      id={`qr-svg-${table.id}`}
                      tableId={table.id}
                      size={110}
                    />
                  </div>
                  <span className="font-mono text-[10px] font-semibold text-text-muted">
                    /order/{table.id}
                  </span>
                </div>

                {/* Actions Bottom Bar */}
                <div className="pt-2 border-t border-border-subtle space-y-2">
                  {/* Standee & Open Menu */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setStandeeModalTable(table)}
                      className="py-1.5 px-2 text-xs font-semibold bg-[#1E1E1C] text-white rounded-md hover:bg-[#3A3A37] transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Standee</span>
                    </button>

                    <Link
                      href={orderUrl}
                      target="_blank"
                      className="py-1.5 px-2 text-xs font-medium bg-canvas-secondary border border-border-subtle rounded-md text-text-primary hover:bg-[#EFEFEA] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Open Menu</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-text-muted" />
                    </Link>
                  </div>

                  {/* QR Code Export Actions (PNG High-Res & SVG) */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={isDownloading}
                      onClick={() => handleDownloadPNG(table.id)}
                      title="Download high-resolution 1024x1024 PNG for physical printing"
                      className="py-1.5 px-2 text-xs font-medium bg-white border border-[#E7E7E3] rounded-md text-text-primary hover:bg-[#F7F7F5] hover:border-[#D0D0CA] transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer disabled:opacity-60"
                    >
                      <Download className="w-3.5 h-3.5 text-accent-warm" />
                      <span>{isDownloading ? "Saving..." : "QR PNG"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadSVG(table.id)}
                      title="Download pure vector SVG for print shops and cutting machines"
                      className="py-1.5 px-2 text-xs font-medium bg-white border border-[#E7E7E3] rounded-md text-text-primary hover:bg-[#F7F7F5] hover:border-[#D0D0CA] transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5 text-text-muted" />
                      <span>QR SVG</span>
                    </button>
                  </div>

                  {/* Edit & Delete Actions */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border-subtle/60">
                    <button
                      type="button"
                      onClick={() => setEditingTable(table)}
                      className="text-text-muted hover:text-text-primary text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Table</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingTableId(table.id)}
                      className="text-text-muted hover:text-[#8C3426] text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center space-y-2 bg-canvas-primary border border-border-subtle rounded-lg max-w-md mx-auto my-8">
          <QrCode className="w-8 h-8 text-text-muted mx-auto" />
          <h3 className="font-semibold text-text-primary text-sm">
            No tables matched your search
          </h3>
          <p className="text-xs text-text-muted">
            Try resetting your zone filter or search query.
          </p>
        </div>
      )}

      {/* Form Modal (Add / Edit) */}
      <TableFormModal
        table={editingTable}
        isOpen={isNewModalOpen || !!editingTable}
        onClose={() => {
          setIsNewModalOpen(false);
          setEditingTable(null);
        }}
        onSave={(tableData) => {
          if (editingTable) {
            updateTable(editingTable.id, tableData);
            showNotification(`Table ${tableData.id} updated successfully.`);
          } else {
            addTable(tableData);
            showNotification(`New table ${tableData.id} registered.`);
          }
        }}
      />

      {/* Standee Modal (Single & Batch Print) */}
      <PrintableStandeeModal
        table={standeeModalTable}
        allTables={tables}
        isBatchMode={isBatchPrintOpen}
        isOpen={!!standeeModalTable || isBatchPrintOpen}
        onClose={() => {
          setStandeeModalTable(null);
          setIsBatchPrintOpen(false);
        }}
      />

      {/* Delete Confirmation Modal */}
      {deletingTableId && (
        <div
          onClick={() => setDeletingTableId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs transition-opacity duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-canvas-primary border border-border-subtle rounded-lg shadow-xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-left"
          >
            <div className="flex items-center gap-2 text-[#8C3426]">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-semibold text-sm text-text-primary">
                Delete Table {deletingTableId}?
              </h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Are you sure you want to delete Table {deletingTableId}? Its QR code will no longer be listed in the fleet.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingTableId(null)}
                className="px-3 py-1.5 text-xs font-medium bg-canvas-secondary border border-border-subtle rounded-md text-text-primary hover:bg-[#EFEFEA] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteConfirm(deletingTableId)}
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#8C3426] text-white rounded-md hover:bg-[#732B20] transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
