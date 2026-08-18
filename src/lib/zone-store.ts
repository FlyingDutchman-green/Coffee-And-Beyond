"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllTables } from "@/lib/table-store";

export interface Zone {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  createdAt: string;
}

export const ZONES_STORAGE_KEY = "coffee_and_beyond_zones";

export const DEFAULT_ZONES: Zone[] = [
  {
    id: "zone-1",
    name: "Indoor Main Hall",
    slug: "indoor-main-hall",
    description: "Central dining room with abundant natural light, communal oak tables, and direct view of the main bar.",
    sortOrder: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "zone-2",
    name: "Quiet Study Nook",
    slug: "quiet-study-nook",
    description: "Dedicated deep-work corner with individual power outlets, acoustic dampening panels, and focused ambient light.",
    sortOrder: 2,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "zone-3",
    name: "Terrace & Garden",
    slug: "terrace-garden",
    description: "Semi-outdoor breezy terrace surrounded by lush tropical greenery, ideal for afternoon casual chats and reading.",
    sortOrder: 3,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "zone-4",
    name: "Private Mezzanine",
    slug: "private-mezzanine",
    description: "Elevated private loft designed for small team syncs, VIP meetings, and intimate collaborative gatherings.",
    sortOrder: 4,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "zone-5",
    name: "Garden Patio",
    slug: "garden-patio",
    description: "Open-air patio area with natural airflow and pet-friendly outdoor seating under shaded parasols.",
    sortOrder: 5,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "zone-6",
    name: "Espresso Bar",
    slug: "espresso-bar",
    description: "High-top counter seats directly in front of the manual pour-over station and Slayer espresso machine.",
    sortOrder: 6,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

function notifyZoneSubscribers() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("coffee_zones_updated"));
  }
}

export function getZones(): Zone[] {
  if (typeof window === "undefined") return DEFAULT_ZONES;
  try {
    const raw = localStorage.getItem(ZONES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ZONES_STORAGE_KEY, JSON.stringify(DEFAULT_ZONES));
      return DEFAULT_ZONES;
    }
    const parsed: Zone[] = JSON.parse(raw);
    return parsed.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  } catch (e) {
    console.error("Failed to parse zones from localStorage:", e);
    return DEFAULT_ZONES;
  }
}

export function getZoneById(zoneId: string): Zone | null {
  const zones = getZones();
  return zones.find((z) => z.id === zoneId) || null;
}

export function getZoneBySlug(slug: string): Zone | null {
  const zones = getZones();
  return zones.find((z) => z.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export function getZoneByName(name: string): Zone | null {
  const zones = getZones();
  return zones.find((z) => z.name.toLowerCase() === name.toLowerCase()) || null;
}

export function saveZones(zones: Zone[]): void {
  if (typeof window === "undefined") return;
  try {
    const sorted = [...zones].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    localStorage.setItem(ZONES_STORAGE_KEY, JSON.stringify(sorted));
    notifyZoneSubscribers();
  } catch (e) {
    console.error("Failed to save zones to localStorage:", e);
  }
}

export function addZone(
  data: Omit<Zone, "id" | "createdAt"> & { id?: string }
): Zone {
  const zones = getZones();
  const newZone: Zone = {
    id: data.id || `zone-${Date.now()}`,
    name: data.name.trim(),
    slug: data.slug.trim().toLowerCase(),
    description: data.description?.trim(),
    sortOrder: Number(data.sortOrder) || zones.length + 1,
    createdAt: new Date().toISOString(),
  };

  const updated = [...zones, newZone];
  saveZones(updated);
  return newZone;
}

export function updateZone(
  zoneId: string,
  partial: Partial<Omit<Zone, "id">>
): Zone | null {
  const zones = getZones();
  const index = zones.findIndex((z) => z.id === zoneId);
  if (index === -1) return null;

  const current = zones[index];
  const updatedZone: Zone = {
    ...current,
    ...partial,
    name: partial.name !== undefined ? partial.name.trim() : current.name,
    slug: partial.slug !== undefined ? partial.slug.trim().toLowerCase() : current.slug,
    description:
      partial.description !== undefined
        ? partial.description.trim()
        : current.description,
    sortOrder:
      partial.sortOrder !== undefined ? Number(partial.sortOrder) : current.sortOrder,
  };

  const updated = [...zones];
  updated[index] = updatedZone;
  saveZones(updated);
  return updatedZone;
}

/**
 * Check if a zone is currently assigned to any active physical table.
 */
export function getLinkedTablesForZone(zone: Zone) {
  const tables = getAllTables();
  return tables.filter(
    (t) =>
      t.zone?.trim().toLowerCase() === zone.name.trim().toLowerCase() ||
      t.zone?.trim().toLowerCase() === zone.slug.trim().toLowerCase() ||
      t.zone === zone.id
  );
}

export function deleteZone(zoneId: string): { success: boolean; error?: string } {
  const zones = getZones();
  const zoneToDelete = zones.find((z) => z.id === zoneId);
  if (!zoneToDelete) {
    return { success: false, error: "Zone not found." };
  }

  // Safety check: protect zone if active tables are still assigned to it
  const linkedTables = getLinkedTablesForZone(zoneToDelete);
  if (linkedTables.length > 0) {
    return {
      success: false,
      error: `Cannot delete zone. There are currently ${linkedTables.length} tables assigned to this zone. Reassign or delete those tables first.`,
    };
  }

  const filtered = zones.filter((z) => z.id !== zoneId);
  saveZones(filtered);
  return { success: true };
}

export function resetToDefaultZones(): Zone[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(ZONES_STORAGE_KEY, JSON.stringify(DEFAULT_ZONES));
    notifyZoneSubscribers();
  }
  return DEFAULT_ZONES;
}

/**
 * Custom React hook for reactive zone management and multi-tab synchronization.
 */
export function useZoneStore() {
  const [zones, setZones] = useState<Zone[]>(DEFAULT_ZONES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshZones = useCallback(() => {
    setZones(getZones());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshZones();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ZONES_STORAGE_KEY) {
        refreshZones();
      }
    };

    const handleZoneUpdate = () => {
      refreshZones();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("coffee_zones_updated", handleZoneUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("coffee_zones_updated", handleZoneUpdate);
    };
  }, [refreshZones]);

  const add = useCallback(
    (data: Omit<Zone, "id" | "createdAt"> & { id?: string }) => {
      const res = addZone(data);
      refreshZones();
      return res;
    },
    [refreshZones]
  );

  const update = useCallback(
    (zoneId: string, partial: Partial<Omit<Zone, "id">>) => {
      const res = updateZone(zoneId, partial);
      refreshZones();
      return res;
    },
    [refreshZones]
  );

  const remove = useCallback(
    (zoneId: string) => {
      const res = deleteZone(zoneId);
      refreshZones();
      return res;
    },
    [refreshZones]
  );

  const reset = useCallback(() => {
    const res = resetToDefaultZones();
    refreshZones();
    return res;
  }, [refreshZones]);

  return {
    zones,
    isLoading,
    refreshZones,
    addZone: add,
    updateZone: update,
    deleteZone: remove,
    resetToDefaultZones: reset,
  };
}
