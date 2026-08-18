"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Zone, useZoneStore } from "@/lib/zone-store";
import { useTableStore } from "@/lib/table-store";
import { ZoneFormModal } from "@/components/admin/zones/ZoneFormModal";
import { DeleteZoneDialog } from "@/components/admin/zones/DeleteZoneDialog";
import {
  MapPin,
  Plus,
  Search,
  Edit2,
  Trash2,
  QrCode,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ExternalLink,
  Layers,
  Users,
} from "lucide-react";

export function ZoneManagementList() {
  const {
    zones,
    addZone,
    updateZone,
    deleteZone,
    resetToDefaultZones,
    isLoading: isZonesLoading,
  } = useZoneStore();

  const { tables, isLoading: isTablesLoading } = useTableStore();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [deletingZone, setDeletingZone] = useState<Zone | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Map each zone to linked tables
  const zoneTablesMap = useMemo(() => {
    const map: Record<string, typeof tables> = {};
    zones.forEach((z) => {
      map[z.id] = tables.filter(
        (t) =>
          t.zone?.trim().toLowerCase() === z.name.trim().toLowerCase() ||
          t.zone?.trim().toLowerCase() === z.slug.trim().toLowerCase() ||
          t.zone === z.id
      );
    });
    return map;
  }, [zones, tables]);

  // Metrics summary
  const totalLinkedTables = useMemo(() => {
    return tables.length;
  }, [tables]);

  const mostPopulatedZone = useMemo(() => {
    if (zones.length === 0) return "None";
    let maxZone: Zone | null = null;
    let maxCount = -1;

    zones.forEach((z) => {
      const count = zoneTablesMap[z.id]?.length || 0;
      if (count > maxCount) {
        maxCount = count;
        maxZone = z;
      }
    });

    if (!maxZone || maxCount <= 0) return "None";
    return `${(maxZone as Zone).name} (${maxCount} Tables)`;
  }, [zones, zoneTablesMap]);

  // Filtered zones based on search query
  const filteredZones = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const sorted = [...zones].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    if (!query) return sorted;
    return sorted.filter(
      (z) =>
        z.name.toLowerCase().includes(query) ||
        z.slug.toLowerCase().includes(query) ||
        (z.description && z.description.toLowerCase().includes(query))
    );
  }, [zones, searchQuery]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  // Create or Update
  const handleSaveZone = (data: {
    name: string;
    slug: string;
    description?: string;
    sortOrder: number;
  }) => {
    if (editingZone) {
      updateZone(editingZone.id, data);
      showNotification(`Zone "${data.name}" updated successfully.`);
    } else {
      addZone(data);
      showNotification(`New zone "${data.name}" created successfully.`);
    }
  };

  // Delete
  const handleConfirmDelete = () => {
    if (!deletingZone) return;
    const res = deleteZone(deletingZone.id);
    if (res.success) {
      showNotification(`Zone "${deletingZone.name}" removed successfully.`);
    } else {
      showError(res.error || "Failed to delete zone.");
    }
    setDeletingZone(null);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Reset all zones to default configuration (Indoor Main Hall, Quiet Study Nook, Terrace & Garden, Private Mezzanine, Garden Patio, Espresso Bar)? Custom zones will be replaced."
      )
    ) {
      resetToDefaultZones();
      showNotification("Zones reset to standard café floor layout.");
    }
  };

  const isLoading = isZonesLoading || isTablesLoading;

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {notification && (
        <div className="p-3 bg-[#F5F8F3] border border-[#D3DEC8] text-[#3B5E2B] rounded-lg text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#3B5E2B]" />
            <span>{notification}</span>
          </div>
          <Link
            href="/admin/tables"
            className="inline-flex items-center gap-1 text-xs underline underline-offset-4 hover:opacity-80"
          >
            <span>View Tables Fleet</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] rounded-lg text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Header Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Zones */}
        <div className="bg-white border border-[#E7E7E3] rounded-lg p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-10 h-10 rounded-md bg-[#F7F7F5] border border-[#E7E7E3] flex items-center justify-center text-[#1E1E1C] shrink-0">
            <MapPin className="w-5 h-5 text-accent-warm" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-medium">Total Zones</p>
            <p className="text-xl font-bold text-[#1E1E1C] tabular-nums">
              {zones.length}
            </p>
          </div>
        </div>

        {/* Total Linked Tables */}
        <div className="bg-white border border-[#E7E7E3] rounded-lg p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-10 h-10 rounded-md bg-[#F7F7F5] border border-[#E7E7E3] flex items-center justify-center text-[#1E1E1C] shrink-0">
            <QrCode className="w-5 h-5 text-accent-warm" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-medium">Total Linked Tables</p>
            <p className="text-xl font-bold text-[#1E1E1C] tabular-nums">
              {totalLinkedTables} Tables
            </p>
          </div>
        </div>

        {/* Most Populated Zone */}
        <div className="bg-white border border-[#E7E7E3] rounded-lg p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-10 h-10 rounded-md bg-[#F7F7F5] border border-[#E7E7E3] flex items-center justify-center text-[#1E1E1C] shrink-0">
            <Users className="w-5 h-5 text-accent-warm" />
          </div>
          <div>
            <p className="text-xs text-text-muted font-medium">Most Populated Zone</p>
            <p className="text-sm sm:text-base font-bold text-[#1E1E1C] truncate max-w-[200px]">
              {mostPopulatedZone}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Reset & + Add New Zone CTA */}
      <div className="bg-white border border-[#E7E7E3] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search zones or slug..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-charcoal"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            title="Reset zones to default"
            className="p-2 text-xs font-medium bg-canvas-secondary border border-border-subtle rounded-md text-text-muted hover:text-text-primary hover:bg-[#EFEFEA] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingZone(null);
              setIsFormModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1E1E1C] rounded-md hover:bg-[#3A3A37] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Zone</span>
          </button>
        </div>
      </div>

      {/* Zones Table / List */}
      <div className="bg-white border border-[#E7E7E3] rounded-lg shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-text-muted">
            Loading café zones catalog...
          </div>
        ) : filteredZones.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <MapPin className="w-8 h-8 text-text-muted mx-auto" />
            <p className="text-sm font-semibold text-text-primary">
              No zones found
            </p>
            <p className="text-xs text-text-muted">
              No zones match your search &ldquo;{searchQuery}&rdquo;.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E7E7E3] bg-[#F7F7F5] text-text-muted font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 w-[30%]">Zone Name &amp; Slug</th>
                  <th className="py-3 px-4 w-[40%] hidden md:table-cell">Description &amp; Ambiance</th>
                  <th className="py-3 px-4 w-[15%] text-center">Linked Tables</th>
                  <th className="py-3 px-4 w-[15%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E7E3]">
                {filteredZones.map((zone) => {
                  const linkedTables = zoneTablesMap[zone.id] || [];
                  const count = linkedTables.length;

                  return (
                    <tr
                      key={zone.id}
                      className="hover:bg-[#F7F7F5]/60 transition-colors group"
                    >
                      {/* Name & Slug */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-text-primary text-sm block">
                            {zone.name}
                          </span>
                          <span className="text-[11px] font-mono text-text-muted block">
                            /{zone.slug}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 hidden md:table-cell text-text-muted max-w-sm">
                        <p className="line-clamp-2 leading-relaxed">
                          {zone.description || "—"}
                        </p>
                      </td>

                      {/* Linked Tables Indicator */}
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          href="/admin/tables"
                          className={`inline-flex items-center gap-1.5 font-mono text-xs font-semibold px-2.5 py-1 rounded-full border tabular-nums transition-colors ${
                            count > 0
                              ? "bg-canvas-secondary border-border-subtle text-text-primary hover:bg-[#EFEFEA]"
                              : "bg-[#FDF6F5] border-[#ECCEC9] text-[#8C3426]"
                          }`}
                        >
                          <QrCode className="w-3 h-3 text-accent-warm" />
                          <span>
                            {count} {count === 1 ? "Table" : "Tables"}
                          </span>
                        </Link>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingZone(zone);
                              setIsFormModalOpen(true);
                            }}
                            aria-label={`Edit ${zone.name}`}
                            className="p-1.5 text-text-muted hover:text-text-primary rounded hover:bg-canvas-secondary border border-transparent hover:border-border-subtle transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingZone(zone)}
                            aria-label={`Delete ${zone.name}`}
                            className="p-1.5 text-text-muted hover:text-[#8C3426] rounded hover:bg-[#FDF6F5] border border-transparent hover:border-[#ECCEC9] transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal (Add / Edit) */}
      <ZoneFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingZone(null);
        }}
        onSave={handleSaveZone}
        initialZone={editingZone}
        existingZones={zones}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteZoneDialog
        isOpen={!!deletingZone}
        onClose={() => setDeletingZone(null)}
        onConfirm={handleConfirmDelete}
        zone={deletingZone}
        linkedTables={deletingZone ? zoneTablesMap[deletingZone.id] || [] : []}
      />
    </div>
  );
}
