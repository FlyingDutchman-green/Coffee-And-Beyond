"use client";

import React from "react";
import { OrderStatus } from "@/types/order";
import { Clock, Sparkles, CheckCircle, Coffee } from "lucide-react";

export type FilterStatusTab = "ALL" | "NEW" | "CONFIRMED" | "PREPARING" | "READY";

interface StatusFilterBarProps {
  activeTab: FilterStatusTab;
  onTabChange: (tab: FilterStatusTab) => void;
  counts: {
    all: number;
    new: number;
    confirmed: number;
    preparing: number;
    ready: number;
  };
}

export function StatusFilterBar({
  activeTab,
  onTabChange,
  counts,
}: StatusFilterBarProps) {
  const tabs: {
    id: FilterStatusTab;
    label: string;
    count: number;
    icon?: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: "ALL",
      label: "All Active",
      count: counts.all,
    },
    {
      id: "NEW",
      label: "New",
      count: counts.new,
      icon: Clock,
    },
    {
      id: "CONFIRMED",
      label: "Confirmed",
      count: counts.confirmed,
      icon: CheckCircle,
    },
    {
      id: "PREPARING",
      label: "Preparing",
      count: counts.preparing,
      icon: Coffee,
    },
    {
      id: "READY",
      label: "Ready",
      count: counts.ready,
      icon: Sparkles,
    },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-2 rounded-md text-xs transition-colors flex items-center gap-1.5 shrink-0 border cursor-pointer ${
              isActive
                ? "bg-[#1E1E1C] text-white border-[#1E1E1C] font-semibold shadow-xs"
                : "bg-canvas-secondary text-text-muted border-border-subtle hover:text-text-primary hover:bg-[#EFEFEA]"
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{tab.label}</span>
            <span
              className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full border ${
                isActive
                  ? "bg-white/20 text-white border-white/30 font-bold"
                  : "bg-canvas-primary text-text-muted border-border-subtle"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
