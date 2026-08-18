"use client";

import { useState, useEffect, useCallback } from "react";
import { TableInfo } from "@/types/order";
import { DEFAULT_TABLES, normalizeTableId } from "@/data/tables";

export const TABLES_STORAGE_KEY = "coffee_and_beyond_tables";

export function getAllTables(): TableInfo[] {
  if (typeof window === "undefined") return DEFAULT_TABLES;
  try {
    const raw = localStorage.getItem(TABLES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TABLES_STORAGE_KEY, JSON.stringify(DEFAULT_TABLES));
      return DEFAULT_TABLES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse tables from localStorage:", e);
    return DEFAULT_TABLES;
  }
}

export function getTableById(tableId: string): TableInfo | null {
  const tables = getAllTables();
  const normalized = normalizeTableId(tableId);
  return tables.find((t) => t.id.toUpperCase() === normalized) || null;
}

export function getTableInfo(tableId: string): TableInfo {
  const normalized = normalizeTableId(tableId);
  const found = getTableById(normalized);
  if (found) return found;

  return {
    id: normalized,
    name: `Table ${normalized}`,
    zone: "Dine In Area",
    capacity: 2,
    isActive: true,
  };
}

function notifyTableSubscribers() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("coffee_tables_updated"));
  }
}

export function saveTables(tables: TableInfo[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TABLES_STORAGE_KEY, JSON.stringify(tables));
    notifyTableSubscribers();
  } catch (e) {
    console.error("Failed to save tables to localStorage:", e);
  }
}

export function toggleTableStatus(tableId: string): boolean {
  const tables = getAllTables();
  const normalized = normalizeTableId(tableId);
  const index = tables.findIndex((t) => t.id.toUpperCase() === normalized);
  if (index === -1) return false;

  const current = tables[index];
  const newStatus = !current.isActive;
  const updated = [...tables];
  updated[index] = { ...current, isActive: newStatus };

  saveTables(updated);
  return newStatus;
}

export function updateTable(
  tableId: string,
  partial: Partial<TableInfo>
): TableInfo | null {
  const tables = getAllTables();
  const normalized = normalizeTableId(tableId);
  const index = tables.findIndex((t) => t.id.toUpperCase() === normalized);
  if (index === -1) return null;

  const current = tables[index];
  const updatedTable: TableInfo = {
    ...current,
    ...partial,
    id: partial.id ? normalizeTableId(partial.id) : current.id,
  };

  const updated = [...tables];
  updated[index] = updatedTable;
  saveTables(updated);
  return updatedTable;
}

export function addTable(tableData: TableInfo): TableInfo {
  const tables = getAllTables();
  const normalized = normalizeTableId(tableData.id);

  const existingIndex = tables.findIndex((t) => t.id.toUpperCase() === normalized);
  const table: TableInfo = {
    ...tableData,
    id: normalized,
    name: tableData.name || `Table ${normalized}`,
    zone: tableData.zone || "Indoor Area",
    isActive: tableData.isActive ?? true,
  };

  let updated: TableInfo[];
  if (existingIndex >= 0) {
    updated = [...tables];
    updated[existingIndex] = table;
  } else {
    updated = [...tables, table];
  }

  saveTables(updated);
  return table;
}

export function deleteTable(tableId: string): boolean {
  const tables = getAllTables();
  const normalized = normalizeTableId(tableId);
  const filtered = tables.filter((t) => t.id.toUpperCase() !== normalized);
  if (filtered.length === tables.length) return false;

  saveTables(filtered);
  return true;
}

export function resetToDefaultTables(): TableInfo[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(TABLES_STORAGE_KEY, JSON.stringify(DEFAULT_TABLES));
    notifyTableSubscribers();
  }
  return DEFAULT_TABLES;
}

/**
 * Custom React hook for reactive table fleet synchronization.
 */
export function useTableStore() {
  const [tables, setTables] = useState<TableInfo[]>(DEFAULT_TABLES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshTables = useCallback(() => {
    setTables(getAllTables());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshTables();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === TABLES_STORAGE_KEY) {
        refreshTables();
      }
    };

    const handleTableUpdate = () => {
      refreshTables();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("coffee_tables_updated", handleTableUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("coffee_tables_updated", handleTableUpdate);
    };
  }, [refreshTables]);

  const toggleStatus = useCallback(
    (tableId: string) => {
      const res = toggleTableStatus(tableId);
      refreshTables();
      return res;
    },
    [refreshTables]
  );

  const update = useCallback(
    (tableId: string, partial: Partial<TableInfo>) => {
      const res = updateTable(tableId, partial);
      refreshTables();
      return res;
    },
    [refreshTables]
  );

  const add = useCallback(
    (table: TableInfo) => {
      const res = addTable(table);
      refreshTables();
      return res;
    },
    [refreshTables]
  );

  const remove = useCallback(
    (tableId: string) => {
      const res = deleteTable(tableId);
      refreshTables();
      return res;
    },
    [refreshTables]
  );

  const reset = useCallback(() => {
    const res = resetToDefaultTables();
    refreshTables();
    return res;
  }, [refreshTables]);

  return {
    tables,
    isLoading,
    refreshTables,
    toggleTableStatus: toggleStatus,
    updateTable: update,
    addTable: add,
    deleteTable: remove,
    resetToDefaultTables: reset,
  };
}

export { DEFAULT_TABLES, normalizeTableId };
