"use client";

import React from "react";
import { TransitInfo, TransitOption, DEFAULT_SETTINGS } from "@/lib/settings-store";
import {
  Train,
  Car,
  Bike,
  Bus,
  MapPin,
  Plus,
  Trash2,
  LucideIcon,
  ExternalLink,
  Map,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  Navigation,
} from "lucide-react";

export const AVAILABLE_TRANSIT_ICONS: { name: string; label: string; icon: LucideIcon }[] = [
  { name: "Train", label: "Train / Stasiun Kereta Api", icon: Train },
  { name: "Car", label: "Car / Parkir Mobil & Motor", icon: Car },
  { name: "Bike", label: "Bike / Parkir Sepeda", icon: Bike },
  { name: "Bus", label: "Bus / Angkutan Umum", icon: Bus },
  { name: "MapPin", label: "Map Pin / Landmark", icon: MapPin },
];

export interface LocationSettingsTabProps {
  badge: string;
  heading: string;
  subtext: string;
  locationName: string;
  fullAddress: string;
  shortAddress: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  phone?: string;
  email?: string;
  transitInfo?: TransitInfo;
  accessOptions?: TransitOption[];
  onChangeBadge: (val: string) => void;
  onChangeHeading: (val: string) => void;
  onChangeSubtext: (val: string) => void;
  onChangeLocationName: (val: string) => void;
  onChangeFullAddress: (val: string) => void;
  onChangeShortAddress: (val: string) => void;
  onChangeGoogleMapsUrl: (val: string) => void;
  onChangeGoogleMapsEmbedUrl: (val: string) => void;
  onChangePhone?: (val: string) => void;
  onChangeEmail?: (val: string) => void;
  onChangeTransitInfo?: (partial: Partial<TransitInfo>) => void;
  onUpdateAccessOption?: (index: number, partial: Partial<TransitOption>) => void;
  onAddAccessOption?: () => void;
  onRemoveAccessOption?: (index: number) => void;
  onResetPekalonganPreset?: () => void;
}

export function LocationSettingsTab({
  badge,
  heading,
  subtext,
  locationName,
  fullAddress,
  shortAddress,
  googleMapsUrl,
  googleMapsEmbedUrl,
  phone = "+62 811-2748-585",
  email = "contact@coffeeandbeyond.id",
  transitInfo = DEFAULT_SETTINGS.location.transitInfo,
  accessOptions = DEFAULT_SETTINGS.location.accessOptions || [],
  onChangeBadge,
  onChangeHeading,
  onChangeSubtext,
  onChangeLocationName,
  onChangeFullAddress,
  onChangeShortAddress,
  onChangeGoogleMapsUrl,
  onChangeGoogleMapsEmbedUrl,
  onChangePhone,
  onChangeEmail,
  onChangeTransitInfo,
  onUpdateAccessOption,
  onAddAccessOption,
  onRemoveAccessOption,
  onResetPekalonganPreset,
}: LocationSettingsTabProps) {
  // Helper to extract src if user pastes full iframe HTML
  const handleEmbedChange = (raw: string) => {
    let cleanUrl = raw.trim();
    const match = cleanUrl.match(/src=["']([^"']+)["']/);
    if (match && match[1]) {
      cleanUrl = match[1];
    }
    onChangeGoogleMapsEmbedUrl(cleanUrl);
  };

  const handleApplyPekalonganPreset = () => {
    if (onResetPekalonganPreset) {
      onResetPekalonganPreset();
      return;
    }
    onChangeBadge(DEFAULT_SETTINGS.location.badge || "Visit Us");
    onChangeHeading(DEFAULT_SETTINGS.location.heading || "Find Our Sanctuary");
    onChangeSubtext(DEFAULT_SETTINGS.location.subheadline);
    onChangeLocationName(DEFAULT_SETTINGS.location.branchName);
    onChangeFullAddress(DEFAULT_SETTINGS.location.address);
    onChangeShortAddress(DEFAULT_SETTINGS.location.city);
    onChangeGoogleMapsUrl(DEFAULT_SETTINGS.location.googleMapsUrl);
    onChangeGoogleMapsEmbedUrl(DEFAULT_SETTINGS.location.googleMapsEmbedUrl);
    if (onChangePhone) onChangePhone(DEFAULT_SETTINGS.location.phone);
    if (onChangeEmail) onChangeEmail(DEFAULT_SETTINGS.location.email);
    if (onChangeTransitInfo) onChangeTransitInfo(DEFAULT_SETTINGS.location.transitInfo);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Preset Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-canvas-secondary border border-border-subtle rounded-xl shadow-2xs">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-accent-warm" />
            <span>Pekalongan Sanctuary Presets &amp; Coordinates</span>
          </h3>
          <p className="text-[11px] text-text-muted">
            Restore authentic brand data for Jl. Diponegoro No. 15, Pekalongan Utara.
          </p>
        </div>

        <button
          type="button"
          onClick={handleApplyPekalonganPreset}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1E1E1C] bg-canvas-primary border border-border-subtle rounded-md hover:bg-[#EFEFEA] transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-accent-warm" />
          <span>Reset to Pekalongan Coordinates</span>
        </button>
      </div>

      {/* Section Narrative */}
      <div className="bg-canvas-primary border border-border-subtle rounded-xl p-5 sm:p-6 space-y-5 shadow-2xs">
        <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-3">
          1. Location Narrative &amp; Eyebrow
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
              placeholder="e.g. Visit Us"
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal uppercase tracking-wider"
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
              placeholder="e.g. Find Our Sanctuary"
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-semibold text-sm"
            />
          </div>

          <div className="space-y-1.5 md:col-span-3">
            <label className="block text-xs font-semibold text-text-primary">
              Location Subheadline / Narasi Deskriptif
            </label>
            <textarea
              rows={2}
              value={subtext}
              onChange={(e) => onChangeSubtext(e.target.value)}
              placeholder="Terletak strategis di pusat kota Pekalongan di Jl. Diponegoro No. 15..."
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Physical Address & Concierge Contacts */}
      <div className="bg-canvas-primary border border-border-subtle rounded-xl p-5 sm:p-6 space-y-5 shadow-2xs">
        <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-3">
          2. Physical Address &amp; Direct Concierge
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary">
              Branch / Sanctuary Name
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => onChangeLocationName(e.target.value)}
              placeholder="e.g. Coffee And Beyond Pekalongan"
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary">
              City / Region (Short Address)
            </label>
            <input
              type="text"
              value={shortAddress}
              onChange={(e) => onChangeShortAddress(e.target.value)}
              placeholder="e.g. Pekalongan, Jawa Tengah"
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-semibold text-text-primary">
              Full Street Address (Displayed in Location card and Footer)
            </label>
            <textarea
              rows={2}
              value={fullAddress}
              onChange={(e) => onChangeFullAddress(e.target.value)}
              placeholder="Jl. Diponegoro No. 15, Dukuh, Kec. Pekalongan Utara, Kota Pekalongan, Jawa Tengah 51146"
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary flex items-center gap-1">
              <Phone className="w-3 h-3 text-accent-warm" />
              <span>Official WhatsApp / Concierge</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => onChangePhone && onChangePhone(e.target.value)}
              placeholder="+62 811-2748-585"
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary flex items-center gap-1">
              <Mail className="w-3 h-3 text-accent-warm" />
              <span>Official Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => onChangeEmail && onChangeEmail(e.target.value)}
              placeholder="contact@coffeeandbeyond.id"
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-mono"
            />
          </div>
        </div>
      </div>

      {/* Google Maps Navigation & Embed */}
      <div className="bg-canvas-primary border border-border-subtle rounded-xl p-5 sm:p-6 space-y-5 shadow-2xs">
        <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-3">
          3. Google Maps External &amp; Embed URLs
        </h3>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-text-primary">
                Google Maps External Navigation URL (Opens in Maps app)
              </label>
              {googleMapsUrl && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent-warm hover:underline inline-flex items-center gap-1"
                >
                  <span>Test External Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => onChangeGoogleMapsUrl(e.target.value)}
              placeholder="https://www.google.com/maps/place/..."
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-mono text-[11px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-primary flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-accent-warm" />
              <span>Google Maps Embed URL (Homepage Interactive Map)</span>
            </label>
            <input
              type="text"
              value={googleMapsEmbedUrl}
              onChange={(e) => handleEmbedChange(e.target.value)}
              placeholder="https://maps.google.com/maps?q=Coffee%20And%20Beyond,%20Jl.%20Diponegoro%20No.15,%20Pekalongan&t=&z=17&ie=UTF8&iwloc=&output=embed"
              className="w-full px-3 py-2 text-xs bg-canvas-secondary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal font-mono text-[11px]"
            />
            <p className="text-[11px] text-text-muted">
              Gunakan URL pencarian query bersih agar tidak muncul pesan error &ldquo;Info tempat tidak dapat dimuat&rdquo;.
            </p>
          </div>
        </div>
      </div>

      {/* Transit & Accessibility 3-Card Settings */}
      <div className="bg-canvas-primary border border-border-subtle rounded-xl p-5 sm:p-6 space-y-5 shadow-2xs">
        <h3 className="text-sm font-bold text-text-primary border-b border-border-subtle pb-3">
          4. Transit &amp; Parking Accessibility (3 Core Guidelines)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Train */}
          <div className="p-4 bg-canvas-secondary border border-border-subtle rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
              <Train className="w-4 h-4 text-accent-warm" />
              <span>Public Transit / Stasiun</span>
            </div>
            <textarea
              rows={3}
              value={transitInfo.trainStation}
              onChange={(e) =>
                onChangeTransitInfo &&
                onChangeTransitInfo({ trainStation: e.target.value })
              }
              placeholder="5 menit (~1,5 km) dari Stasiun Kereta Api Besar Pekalongan"
              className="w-full px-3 py-2 text-xs bg-canvas-primary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal"
            />
          </div>

          {/* Parking */}
          <div className="p-4 bg-canvas-secondary border border-border-subtle rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
              <Car className="w-4 h-4 text-accent-warm" />
              <span>Vehicle Parking</span>
            </div>
            <textarea
              rows={3}
              value={transitInfo.parking}
              onChange={(e) =>
                onChangeTransitInfo &&
                onChangeTransitInfo({ parking: e.target.value })
              }
              placeholder="Area parkir mobil & motor luas tersedia langsung di pelataran kafe"
              className="w-full px-3 py-2 text-xs bg-canvas-primary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal"
            />
          </div>

          {/* Bike */}
          <div className="p-4 bg-canvas-secondary border border-border-subtle rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
              <Bike className="w-4 h-4 text-accent-warm" />
              <span>Cycling Friendly</span>
            </div>
            <textarea
              rows={3}
              value={transitInfo.bike}
              onChange={(e) =>
                onChangeTransitInfo &&
                onChangeTransitInfo({ bike: e.target.value })
              }
              placeholder="Stand parkir sepeda aman tersedia di area outdoor patio"
              className="w-full px-3 py-2 text-xs bg-canvas-primary border border-border-subtle rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-charcoal"
            />
          </div>
        </div>
      </div>

      {/* Live Preview Simulator */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-accent-warm" />
            <span>Location Section Live Simulation Preview</span>
          </label>
          <span className="text-[11px] text-text-muted">Real-time render</span>
        </div>

        <div className="border border-border-subtle rounded-xl overflow-hidden bg-canvas-primary shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left Preview Summary */}
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-text-muted">
                  {badge || "Visit Us"}
                </div>
                <h4 className="text-xl font-bold text-[#1E1E1C]">
                  {heading || "Find Our Sanctuary"}
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  {subtext || "Terletak strategis di pusat kota Pekalongan..."}
                </p>
              </div>

              <div className="p-3 bg-canvas-secondary rounded-lg border border-border-subtle space-y-2 text-xs">
                <div>
                  <span className="font-bold text-[#1E1E1C] block">{locationName}</span>
                  <span className="text-text-muted">{fullAddress}</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] pt-1 border-t border-border-subtle text-text-muted">
                  <span>WA: <strong className="text-[#1E1E1C]">{phone}</strong></span>
                  <span>Email: <strong className="text-[#1E1E1C]">{email}</strong></span>
                </div>
              </div>
            </div>

            {/* Right Mini Map Preview */}
            <div className="h-48 rounded-lg overflow-hidden border border-border-subtle bg-canvas-secondary relative">
              {googleMapsEmbedUrl ? (
                <iframe
                  src={googleMapsEmbedUrl}
                  title="Live Preview Map"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  className="border-0 w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">
                  No Embed URL Provided
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationSettingsTab;
