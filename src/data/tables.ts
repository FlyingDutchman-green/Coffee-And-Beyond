import { TableInfo } from "@/types/order";

export const DEFAULT_TABLES: TableInfo[] = [
  { id: "A01", name: "Table A01", zone: "Indoor Main Hall", capacity: 2, isActive: true },
  { id: "A02", name: "Table A02", zone: "Indoor Main Hall", capacity: 4, isActive: true },
  { id: "A03", name: "Table A03", zone: "Indoor Main Hall", capacity: 4, isActive: true },
  { id: "A04", name: "Table A04", zone: "Indoor Main Hall", capacity: 2, isActive: true },
  { id: "A05", name: "Table A05", zone: "Indoor Main Hall", capacity: 6, isActive: true },
  { id: "A06", name: "Table A06", zone: "Indoor Main Hall", capacity: 2, isActive: true },
  { id: "B01", name: "Table B01", zone: "Quiet Study Nook", capacity: 2, isActive: true },
  { id: "B02", name: "Table B02", zone: "Quiet Study Nook", capacity: 2, isActive: true },
  { id: "B03", name: "Table B03", zone: "Quiet Study Nook", capacity: 2, isActive: true },
  { id: "B04", name: "Table B04", zone: "Quiet Study Nook", capacity: 4, isActive: true },
  { id: "T01", name: "Table T01", zone: "Terrace & Garden", capacity: 4, isActive: true },
  { id: "T02", name: "Table T02", zone: "Terrace & Garden", capacity: 6, isActive: true },
  { id: "VIP01", name: "VIP Lounge 01", zone: "Private Mezzanine", capacity: 8, isActive: true },
  { id: "OUT-01", name: "Table OUT-01", zone: "Garden Patio", capacity: 4, isActive: true },
  { id: "OUT-02", name: "Table OUT-02", zone: "Garden Patio", capacity: 4, isActive: true },
  { id: "BAR-01", name: "Slow Bar Counter 01", zone: "Espresso Bar", capacity: 1, isActive: true },
];

export const TABLES: TableInfo[] = DEFAULT_TABLES;

export function normalizeTableId(rawId: string): string {
  return rawId.trim().toUpperCase();
}

export function getNormalizedTableId(rawId: string): string {
  return normalizeTableId(rawId);
}

export function getTableInfo(tableId: string): TableInfo {
  const normalized = normalizeTableId(tableId);
  const found = DEFAULT_TABLES.find((t) => t.id === normalized);
  if (found) return found;

  return {
    id: normalized,
    name: `Table ${normalized}`,
    zone: "Dine In Area",
    capacity: 2,
    isActive: true,
  };
}
