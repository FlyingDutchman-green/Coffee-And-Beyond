"use client";

import React from "react";
import { OperatingHourItem, DEFAULT_SETTINGS } from "@/lib/settings-store";
import { Plus, Trash2, Clock, RotateCcw, Sparkles, AlertCircle } from "lucide-react";

export interface HoursSettingsTabProps {
  heading?: string;
  subtext?: string;
  kitchenNote?: string;
  openStatusText?: string;
  schedule: OperatingHourItem[];
  onChangeHeading: (val: string) => void;
  onChangeSubtext: (val: string) => void;
  onChangeKitchenNote?: (val: string) => void;
  onChangeOpenStatusText?: (val: string) => void;
  onUpdateScheduleItem: (index: number, partial: Partial<OperatingHourItem>) => void;
  onAddScheduleItem: () => void;
  onRemoveScheduleItem: (index: number) => void;
  onResetPekalonganHours?: () => void;
}

export function HoursSettingsTab({
  heading = "Operating Hours",
  subtext = "Open Daily • Dine-In, Takeaway, Delivery & Catering",
  kitchenNote = "Last order makanan & minuman 30 menit sebelum jam tutup.",
  openStatusText = "Open Daily • 10:00 - 23:00 WIB",
  schedule,
  onChangeHeading,
  onChangeSubtext,
  onChangeKitchenNote,
  onChangeOpenStatusText,
  onUpdateScheduleItem,
  onAddScheduleItem,
  onRemoveScheduleItem,
  onResetPekalonganHours,
}: HoursSettingsTabProps) {
  const handleApplyPreset = () => {
    if (onResetPekalonganHours) {
      onResetPekalonganHours();
      return;
    }
    onChangeHeading(DEFAULT_SETTINGS.operatingHours.heading || "Operating Hours");
    onChangeSubtext(DEFAULT_SETTINGS.operatingHours.subtext || "Open Daily • Dine-In, Takeaway, Delivery & Catering");
    if (onChangeKitchenNote) {
      onChangeKitchenNote(DEFAULT_SETTINGS.operatingHours.kitchenNote);
    }
    if (onChangeOpenStatusText) {
      onChangeOpenStatusText(DEFAULT_SETTINGS.operatingHours.openStatusText);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Preset Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-canvas-secondary border border-border-subtle rounded-xl shadow-2xs">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-accent-warm" />
            <span>Pekalongan Schedule Standard</span>
          </h3>
          <p className="text-[11px] text-text-muted">
            Open Daily from 10:00 to 23:00 WIB (Senin – Minggu).
          </p>
        </div>

        <button
          type="button"
          onClick={handleApplyPreset}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1E1E1C] bg-canvas-primary border border-border-subtle rounded-md hover:bg-[#EFEFEA] transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-accent-warm" />
          <span>Reset to Pekalongan Hours (10:00 – 23:00)</span>
        </button>
      </div>

      {/* Section Header & Policies */}
      <div className="bg-canvas-primary border border-border-subtle rounded-xl p-5 sm:p-6 space-y-5 shadow-2xs">
        <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-3">
          1. Header &amp; Kitchen Policy Notes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary">
              Section Title
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => onChangeHeading(e.target.value)}
              placeholder="e.g. Operating Hours"
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary">
              Open Status Pill Text
            </label>
            <input
              type="text"
              value={openStatusText}
              onChange={(e) =>
                onChangeOpenStatusText && onChangeOpenStatusText(e.target.value)
              }
              placeholder="e.g. Open Daily • 10:00 - 23:00 WIB"
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-mono"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-semibold text-text-primary">
              Kitchen Policy &amp; Last Order Note
            </label>
            <input
              type="text"
              value={kitchenNote}
              onChange={(e) => {
                if (onChangeKitchenNote) onChangeKitchenNote(e.target.value);
                onChangeSubtext(e.target.value);
              }}
              placeholder="e.g. Last order makanan & minuman 30 menit sebelum jam tutup."
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal"
            />
          </div>
        </div>
      </div>

      {/* Schedule Rows */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              2. Daily Service Schedule Rows
            </h3>
            <p className="text-xs text-text-muted">
              Configure operational hours, days of the week, and kitchen notes.
            </p>
          </div>

          <button
            type="button"
            onClick={onAddScheduleItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-primary bg-canvas-primary border border-border-subtle rounded-md hover:bg-canvas-secondary transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Schedule Row</span>
          </button>
        </div>

        <div className="space-y-3">
          {schedule.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-canvas-primary border border-border-subtle rounded-lg p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-canvas-secondary border border-border-subtle flex items-center justify-center text-text-primary shrink-0">
                  <Clock className="w-4 h-4 text-accent-warm" />
                </div>
                <span className="text-xs font-mono font-bold text-text-muted">
                  0{idx + 1}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                {/* Days */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-text-primary">
                    Days / Period
                  </label>
                  <input
                    type="text"
                    value={item.days}
                    onChange={(e) =>
                      onUpdateScheduleItem(idx, { days: e.target.value })
                    }
                    placeholder="e.g. Senin – Minggu (Setiap Hari)"
                    className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-medium"
                  />
                </div>

                {/* Hours */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-text-primary">
                    Opening Hours (tabular-nums)
                  </label>
                  <input
                    type="text"
                    value={item.hours}
                    onChange={(e) =>
                      onUpdateScheduleItem(idx, { hours: e.target.value })
                    }
                    placeholder="e.g. 10:00 – 23:00"
                    className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-mono tabular-nums font-semibold"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-text-primary">
                    Service Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={item.notes || ""}
                    onChange={(e) =>
                      onUpdateScheduleItem(idx, { notes: e.target.value })
                    }
                    placeholder="e.g. Full Coffee, Roastery & Kitchen"
                    className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal"
                  />
                </div>
              </div>

              {schedule.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveScheduleItem(idx)}
                  aria-label="Remove schedule item"
                  className="p-2 text-[#8C3426] hover:bg-[#FDF6F5] rounded-md border border-transparent hover:border-[#ECCEC9] transition-colors self-end md:self-center cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live Preview Simulator */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-accent-warm" />
            <span>Operating Hours Live Simulation Preview</span>
          </label>
          <span className="text-[11px] text-text-muted">Real-time render</span>
        </div>

        <div className="border border-border-subtle rounded-xl overflow-hidden bg-canvas-primary shadow-sm p-6 sm:p-8 max-w-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div>
                <h4 className="text-base font-bold text-[#1E1E1C]">{heading}</h4>
                <p className="text-xs text-text-muted">{kitchenNote || subtext}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F5F8F3] border border-[#D3DEC8] text-[#3B5E2B]">
                <span className="h-2 w-2 rounded-full bg-[#3B5E2B]" />
                <span>{openStatusText}</span>
              </span>
            </div>

            <div className="divide-y divide-border-subtle text-xs">
              {schedule.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <span className="font-medium text-[#1E1E1C]">{item.days}</span>
                  <span className="font-mono text-[#777772]">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HoursSettingsTab;
