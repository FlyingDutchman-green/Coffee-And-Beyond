"use client";

import React from "react";
import { useSettingsStore } from "@/lib/settings-store";
import { FadeInView, StaggerGroup, StaggerItem } from "@/components/ui/motion";
import {
  Sparkles,
  Compass,
  HeartHandshake,
  Coffee,
  Leaf,
  Award,
  ShieldCheck,
  Globe,
  Layers,
  LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Compass,
  Sparkles,
  HeartHandshake,
  Coffee,
  Leaf,
  Award,
  ShieldCheck,
  Globe,
  Layers,
};

export function BrandIntroSection() {
  const { settings } = useSettingsStore();
  const { philosophy } = settings;

  return (
    <section
      id="story"
      className="w-full bg-canvas-secondary border-b border-border-subtle py-16 md:py-24"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Heading & Statement */}
        <div className="max-w-3xl space-y-6">
          <FadeInView delay={0.05} direction="up" distance={16}>
            <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
              <span className="w-6 h-[1px] bg-accent-warm" />
              <span>{philosophy.badge || "Our Philosophy"}</span>
            </div>
          </FadeInView>

          <FadeInView delay={0.15} direction="up" distance={20}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-text-primary leading-tight">
              {philosophy.heading}
            </h2>
          </FadeInView>

          <FadeInView delay={0.25} direction="up" distance={16}>
            <p className="text-base text-text-muted leading-relaxed">
              {philosophy.subtext}
            </p>
          </FadeInView>
        </div>

        {/* Three Pillar Cards with Stagger Reveal */}
        <StaggerGroup
          staggerDelay={0.12}
          delay={0.1}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {philosophy.pillars.map((pillar) => {
            const IconComponent =
              ICON_MAP[pillar.iconName] || Sparkles;

            return (
              <StaggerItem
                key={pillar.id || pillar.title}
                className="h-full"
              >
                <div className="h-full bg-canvas-primary border border-border-subtle rounded-lg p-6 space-y-4 hover:border-[#D0D0CA] transition-all hover:shadow-xs group">
                  <div className="w-10 h-10 rounded-md bg-canvas-secondary border border-border-subtle flex items-center justify-center text-text-primary group-hover:scale-105 transition-transform duration-200">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}

