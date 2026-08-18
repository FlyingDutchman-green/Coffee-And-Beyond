"use client";

import React from "react";
import { PhilosophyPillar } from "@/lib/settings-store";
import {
  Compass,
  Sparkles,
  HeartHandshake,
  Coffee,
  Leaf,
  Award,
  ShieldCheck,
  Globe,
  Layers,
  LucideIcon,
} from "lucide-react";

export const AVAILABLE_PILLAR_ICONS: { name: string; label: string; icon: LucideIcon }[] = [
  { name: "Compass", label: "Compass / Sourcing", icon: Compass },
  { name: "Sparkles", label: "Sparkles / Sanctuary", icon: Sparkles },
  { name: "HeartHandshake", label: "Handshake / Service", icon: HeartHandshake },
  { name: "Coffee", label: "Coffee Cup", icon: Coffee },
  { name: "Leaf", label: "Leaf / Sustainability", icon: Leaf },
  { name: "Award", label: "Award / Quality", icon: Award },
  { name: "ShieldCheck", label: "Shield / Integrity", icon: ShieldCheck },
  { name: "Globe", label: "Globe / Origins", icon: Globe },
  { name: "Layers", label: "Layers / Craft", icon: Layers },
];

interface PhilosophySettingsTabProps {
  badge: string;
  heading: string;
  subtext: string;
  pillars: PhilosophyPillar[];
  onChangeBadge: (val: string) => void;
  onChangeHeading: (val: string) => void;
  onChangeSubtext: (val: string) => void;
  onUpdatePillar: (index: number, partial: Partial<PhilosophyPillar>) => void;
}

export function PhilosophySettingsTab({
  badge,
  heading,
  subtext,
  pillars,
  onChangeBadge,
  onChangeHeading,
  onChangeSubtext,
  onUpdatePillar,
}: PhilosophySettingsTabProps) {
  return (
    <div className="space-y-8">
      {/* Section Header & Subtitle Configuration */}
      <div className="bg-canvas-primary border border-border-subtle rounded-lg p-5 sm:p-6 space-y-5">
        <h3 className="text-base font-semibold text-text-primary border-b border-border-subtle pb-3">
          Editorial Headline &amp; Narrative
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5 md:col-span-1">
            <label className="block text-xs font-semibold text-text-primary">
              Section Badge / Eyebrow
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => onChangeBadge(e.target.value)}
              placeholder="e.g. Our Philosophy"
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-semibold text-text-primary">
              Primary Section Heading
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => onChangeHeading(e.target.value)}
              placeholder="e.g. Coffee is our craft. Providing a mindful sanctuary is our purpose."
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-medium"
            />
          </div>

          <div className="space-y-1.5 md:col-span-3">
            <label className="block text-xs font-semibold text-text-primary">
              Brand Philosophy Narrative (Subtext)
            </label>
            <textarea
              rows={3}
              value={subtext}
              onChange={(e) => onChangeSubtext(e.target.value)}
              placeholder="Provide the core brand manifesto or story statement..."
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* 3 Core Pillars Configuration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              Three Guiding Pillars
            </h3>
            <p className="text-xs text-text-muted">
              Displayed as three focus cards in the Philosophy section
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {pillars.map((pillar, idx) => (
            <div
              key={pillar.id || idx}
              className="bg-canvas-primary border border-border-subtle rounded-lg p-5 space-y-4 shadow-2xs"
            >
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="text-[11px] font-mono font-semibold uppercase text-accent-warm">
                  Pillar 0{idx + 1}
                </span>
                <span className="text-xs font-semibold text-text-muted">
                  Card #{idx + 1}
                </span>
              </div>

              {/* Icon Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text-primary">
                  Pillar Icon
                </label>
                <select
                  value={pillar.iconName || "Compass"}
                  onChange={(e) =>
                    onUpdatePillar(idx, { iconName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal cursor-pointer"
                >
                  {AVAILABLE_PILLAR_ICONS.map((opt) => (
                    <option key={opt.name} value={opt.name}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pillar Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text-primary">
                  Title
                </label>
                <input
                  type="text"
                  value={pillar.title}
                  onChange={(e) =>
                    onUpdatePillar(idx, { title: e.target.value })
                  }
                  placeholder="e.g. Mindful Sourcing"
                  className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-semibold"
                />
              </div>

              {/* Pillar Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text-primary">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={pillar.description}
                  onChange={(e) =>
                    onUpdatePillar(idx, { description: e.target.value })
                  }
                  placeholder="Explain this core philosophy pillar..."
                  className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
