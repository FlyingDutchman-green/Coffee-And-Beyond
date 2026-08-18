"use client";

import React, { useState, useEffect } from "react";
import {
  useSettingsStore,
  CafeSettings,
  BrandingSettings,
  IntroVideoSettings,
  HeroEditorialSettings,
  SpaceVibeSettings,
  PhilosophyPillar,
  SpaceAmenity,
  OperatingHourItem,
  TransitOption,
  DEFAULT_SETTINGS,
} from "@/lib/settings-store";
import { GeneralSettingsTab } from "@/components/admin/settings/GeneralSettingsTab";
import { HeroSettingsTab } from "@/components/admin/settings/HeroSettingsTab";
import { PhilosophySettingsTab } from "@/components/admin/settings/PhilosophySettingsTab";
import { SpaceSettingsTab } from "@/components/admin/settings/SpaceSettingsTab";
import { HoursSettingsTab } from "@/components/admin/settings/HoursSettingsTab";
import { LocationSettingsTab } from "@/components/admin/settings/LocationSettingsTab";
import {
  Image as ImageIcon,
  Film,
  Sparkles,
  Layers,
  Clock,
  MapPin,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type TabKey = "branding" | "hero" | "philosophy" | "space" | "hours" | "location";

export function SettingsForm() {
  const { settings, updateSettings, resetSettings } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const [formData, setFormData] = useState<CafeSettings>(settings);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  // Sync formData when external settings store updates
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Tab definitions
  const tabs = [
    {
      id: "branding" as TabKey,
      label: "Brand Identity",
      icon: ImageIcon,
    },
    {
      id: "hero" as TabKey,
      label: "Hero & Intro",
      icon: Film,
    },
    {
      id: "philosophy" as TabKey,
      label: "Our Philosophy",
      icon: Sparkles,
    },
    {
      id: "space" as TabKey,
      label: "The Vibe",
      icon: Layers,
    },
    {
      id: "hours" as TabKey,
      label: "Operating Hours",
      icon: Clock,
    },
    {
      id: "location" as TabKey,
      label: "Location & Map",
      icon: MapPin,
    },
  ];

  // Save handler
  const handleSave = () => {
    updateSettings(formData);
    toast.success("Perubahan pengaturan berhasil dipublikasikan.");
    setSaveFeedback("Café brand settings successfully published!");
    setTimeout(() => {
      setSaveFeedback(null);
    }, 4000);
  };

  // Reset handler
  const handleConfirmReset = () => {
    resetSettings();
    setIsResetConfirmOpen(false);
    toast.info("Pengaturan dikembalikan ke default.");
    setSaveFeedback("Settings restored to factory default.");
    setTimeout(() => {
      setSaveFeedback(null);
    }, 4000);
  };


  // Branding Handler
  const handleUpdateBranding = (partial: Partial<BrandingSettings>) => {
    setFormData((prev) => ({
      ...prev,
      branding: {
        ...prev.branding,
        ...partial,
      },
    }));
  };

  // Hero / Intro Handlers
  const handleUpdateIntroVideo = (partial: Partial<IntroVideoSettings>) => {
    setFormData((prev) => ({
      ...prev,
      introVideo: {
        ...prev.introVideo,
        ...partial,
      },
    }));
  };

  const handleUpdateHeroEditorial = (
    partial: Partial<HeroEditorialSettings>
  ) => {
    setFormData((prev) => ({
      ...prev,
      heroEditorial: {
        ...prev.heroEditorial,
        ...partial,
      },
    }));
  };

  // Philosophy Handlers
  const handleUpdatePillar = (
    index: number,
    partial: Partial<PhilosophyPillar>
  ) => {
    setFormData((prev) => {
      const updated = [...prev.philosophy.pillars];
      updated[index] = { ...updated[index], ...partial };
      return {
        ...prev,
        philosophy: {
          ...prev.philosophy,
          pillars: updated,
        },
      };
    });
  };

  // Space / Vibe Handlers
  const handleUpdateSpaceVibe = (partial: Partial<SpaceVibeSettings>) => {
    setFormData((prev) => ({
      ...prev,
      spaceVibe: {
        ...prev.spaceVibe,
        ...partial,
      },
    }));
  };

  const handleUpdateAmenity = (
    index: number,
    partial: Partial<SpaceAmenity>
  ) => {
    setFormData((prev) => {
      const updated = [...prev.space.amenities];
      updated[index] = { ...updated[index], ...partial };
      return {
        ...prev,
        space: {
          ...prev.space,
          amenities: updated,
        },
      };
    });
  };

  const handleAddAmenity = () => {
    setFormData((prev) => {
      const newAmenity: SpaceAmenity = {
        id: `amenity-${Date.now()}`,
        title: "New Facility Feature",
        subtitle: "Dedicated Amenity",
        description: "Describe the feature available for café guests...",
        iconName: "Sparkles",
        imageUrl: "",
      };
      return {
        ...prev,
        space: {
          ...prev.space,
          amenities: [...prev.space.amenities, newAmenity],
        },
      };
    });
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData((prev) => {
      const updated = prev.space.amenities.filter((_, i) => i !== index);
      return {
        ...prev,
        space: {
          ...prev.space,
          amenities: updated,
        },
      };
    });
  };

  // Hours Handlers
  const handleUpdateSchedule = (
    index: number,
    partial: Partial<OperatingHourItem>
  ) => {
    setFormData((prev) => {
      const updated = [...prev.operatingHours.schedule];
      updated[index] = { ...updated[index], ...partial };
      return {
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          schedule: updated,
        },
      };
    });
  };

  const handleAddSchedule = () => {
    setFormData((prev) => {
      const newItem: OperatingHourItem = {
        id: `sched-${Date.now()}`,
        days: "Special Service Day",
        hours: "08:00 – 21:00",
        notes: "Seasonal Opening",
      };
      return {
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          schedule: [...prev.operatingHours.schedule, newItem],
        },
      };
    });
  };

  const handleRemoveSchedule = (index: number) => {
    setFormData((prev) => {
      const updated = prev.operatingHours.schedule.filter((_, i) => i !== index);
      return {
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          schedule: updated,
        },
      };
    });
  };

  // Location Handlers
  const handleUpdateAccess = (
    index: number,
    partial: Partial<TransitOption>
  ) => {
    setFormData((prev) => {
      const updated = [...(prev.location.accessOptions || [])];
      updated[index] = { ...updated[index], ...partial };
      return {
        ...prev,
        location: {
          ...prev.location,
          accessOptions: updated,
        },
      };
    });
  };

  const handleAddAccess = () => {
    setFormData((prev) => {
      const newItem: TransitOption = {
        id: `acc-${Date.now()}`,
        title: "New Access Mode",
        detail: "Provide commuting instructions...",
        iconName: "Train",
      };
      return {
        ...prev,
        location: {
          ...prev.location,
          accessOptions: [...(prev.location.accessOptions || []), newItem],
        },
      };
    });
  };

  const handleRemoveAccess = (index: number) => {
    setFormData((prev) => {
      const updated = (prev.location.accessOptions || []).filter((_, i) => i !== index);
      return {
        ...prev,
        location: {
          ...prev.location,
          accessOptions: updated,
        },
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast / Feedback Notice */}
      {saveFeedback && (
        <div className="p-3 bg-[#F5F8F3] border border-[#D3DEC8] text-[#3B5E2B] rounded-lg text-xs font-medium flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#3B5E2B]" />
            <span>{saveFeedback}</span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 text-xs underline underline-offset-4 hover:opacity-80"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Top Header Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border-subtle bg-white text-xs font-medium text-text-primary hover:bg-[#EFEFEA] transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3 h-3 text-text-muted" />
          </Link>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-3.5 py-2 text-xs font-medium bg-canvas-secondary border border-border-subtle rounded-md text-text-muted hover:text-text-primary hover:bg-[#EFEFEA] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold bg-[#1E1E1C] text-white rounded-md hover:bg-[#3A3A37] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {/* Clean Horizontal Navigation Tabs */}
      <div className="border-b border-[#E7E7E3] flex items-center gap-1 overflow-x-auto select-none no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "border-[#1E1E1C] text-[#1E1E1C] font-bold"
                  : "border-transparent text-[#777772] hover:text-[#1E1E1C] hover:border-[#D0D0CA]"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-[#1E1E1C]" : "text-accent-warm"
                }`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Form Content */}
      <div className="pt-2">
        {activeTab === "branding" && (
          <GeneralSettingsTab
            branding={formData.branding}
            onChangeBranding={handleUpdateBranding}
          />
        )}

        {activeTab === "hero" && (
          <HeroSettingsTab
            introVideo={formData.introVideo}
            heroEditorial={formData.heroEditorial}
            onChangeIntroVideo={handleUpdateIntroVideo}
            onChangeHeroEditorial={handleUpdateHeroEditorial}
          />
        )}

        {activeTab === "philosophy" && (
          <PhilosophySettingsTab
            badge={formData.philosophy.badge}
            heading={formData.philosophy.heading}
            subtext={formData.philosophy.subtext}
            pillars={formData.philosophy.pillars}
            onChangeBadge={(val) =>
              setFormData((prev) => ({
                ...prev,
                philosophy: { ...prev.philosophy, badge: val },
              }))
            }
            onChangeHeading={(val) =>
              setFormData((prev) => ({
                ...prev,
                philosophy: { ...prev.philosophy, heading: val },
              }))
            }
            onChangeSubtext={(val) =>
              setFormData((prev) => ({
                ...prev,
                philosophy: { ...prev.philosophy, subtext: val },
              }))
            }
            onUpdatePillar={handleUpdatePillar}
          />
        )}

        {activeTab === "space" && (
          <SpaceSettingsTab
            spaceVibe={formData.spaceVibe}
            onChangeSpaceVibe={handleUpdateSpaceVibe}
          />
        )}

        {activeTab === "hours" && (
          <HoursSettingsTab
            heading={formData.operatingHours.heading}
            subtext={formData.operatingHours.subtext}
            kitchenNote={formData.operatingHours.kitchenNote}
            openStatusText={formData.operatingHours.openStatusText}
            schedule={formData.operatingHours.schedule}
            onChangeHeading={(val) =>
              setFormData((prev) => ({
                ...prev,
                operatingHours: { ...prev.operatingHours, heading: val },
              }))
            }
            onChangeSubtext={(val) =>
              setFormData((prev) => ({
                ...prev,
                operatingHours: { ...prev.operatingHours, subtext: val },
              }))
            }
            onChangeKitchenNote={(val) =>
              setFormData((prev) => ({
                ...prev,
                operatingHours: { ...prev.operatingHours, kitchenNote: val },
              }))
            }
            onChangeOpenStatusText={(val) =>
              setFormData((prev) => ({
                ...prev,
                operatingHours: { ...prev.operatingHours, openStatusText: val },
              }))
            }
            onUpdateScheduleItem={handleUpdateSchedule}
            onAddScheduleItem={handleAddSchedule}
            onRemoveScheduleItem={handleRemoveSchedule}
            onResetPekalonganHours={() =>
              setFormData((prev) => ({
                ...prev,
                operatingHours: { ...DEFAULT_SETTINGS.operatingHours },
              }))
            }
          />
        )}

        {activeTab === "location" && (
          <LocationSettingsTab
            badge={formData.location.badge || "Visit Us"}
            heading={formData.location.heading || "Find Our Sanctuary"}
            subtext={formData.location.subheadline || formData.location.subtext || ""}
            locationName={formData.location.branchName || formData.location.locationName || ""}
            fullAddress={formData.location.address || formData.location.fullAddress || ""}
            shortAddress={formData.location.city || formData.location.shortAddress || ""}
            googleMapsUrl={formData.location.googleMapsUrl}
            googleMapsEmbedUrl={formData.location.googleMapsEmbedUrl || ""}
            phone={formData.location.phone}
            email={formData.location.email}
            transitInfo={formData.location.transitInfo}
            accessOptions={formData.location.accessOptions}
            onChangeBadge={(val) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, badge: val },
              }))
            }
            onChangeHeading={(val) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, heading: val },
              }))
            }
            onChangeSubtext={(val) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, subheadline: val, subtext: val },
              }))
            }
            onChangeLocationName={(val) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, branchName: val, locationName: val },
              }))
            }
            onChangeFullAddress={(val) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, address: val, fullAddress: val },
              }))
            }
            onChangeShortAddress={(val) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, city: val, shortAddress: val },
              }))
            }
            onChangeGoogleMapsUrl={(val) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, googleMapsUrl: val },
              }))
            }
            onChangeGoogleMapsEmbedUrl={(val) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, googleMapsEmbedUrl: val },
              }))
            }
            onChangePhone={(val) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, phone: val },
              }))
            }
            onChangeEmail={(val) =>
              setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, email: val },
              }))
            }
            onChangeTransitInfo={(partial) =>
              setFormData((prev) => ({
                ...prev,
                location: {
                  ...prev.location,
                  transitInfo: {
                    ...prev.location.transitInfo,
                    ...partial,
                  },
                },
              }))
            }
            onUpdateAccessOption={handleUpdateAccess}
            onAddAccessOption={handleAddAccess}
            onRemoveAccessOption={handleRemoveAccess}
            onResetPekalonganPreset={() =>
              setFormData((prev) => ({
                ...prev,
                location: { ...DEFAULT_SETTINGS.location },
              }))
            }
          />
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div
          onClick={() => setIsResetConfirmOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs transition-opacity duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-canvas-primary border border-border-subtle rounded-lg shadow-xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-left"
          >
            <div className="flex items-center gap-2 text-[#8C3426]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-semibold text-sm text-text-primary">
                Reset All Café Settings?
              </h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              This will revert all hero, philosophy, space amenities, operating hours, and location data back to the default factory configurations.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 text-xs font-medium bg-canvas-secondary border border-border-subtle rounded-md text-text-primary hover:bg-[#EFEFEA] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#8C3426] text-white rounded-md hover:bg-[#732B20] transition-colors cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
