"use client";

import React, { useState, useEffect } from "react";
import InteractiveLocationMap from "./InteractiveLocationMap";
import { useSettingsStore, DEFAULT_SETTINGS } from "@/lib/settings-store";
import { FadeInView } from "@/components/ui/motion";
import {
  Clock,
  MapPin,
  Navigation,
  Phone,
  Car,
  Bike,
  Train,
  Bus,
  ExternalLink,
  LucideIcon,
  Radio,
} from "lucide-react";

const TRANSIT_ICON_MAP: Record<string, LucideIcon> = {
  Train,
  Car,
  Bike,
  Bus,
  MapPin,
};

export function LocationHoursSection() {
  const { settings } = useSettingsStore();
  const { operatingHours, location } = settings;

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isOpenNow, setIsOpenNow] = useState<boolean | null>(null);
  const [closingTime, setClosingTime] = useState<string>("");
  const [todayIndex, setTodayIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setTodayIndex(new Date().getDay());
  }, []);

  // Determine dynamic operational status (Open Now / Closed) after mount
  useEffect(() => {
    if (!isMounted) return;

    try {
      const now = new Date();
      const currentDay = now.getDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      let openMin = 10 * 60; // 10:00
      let closeMin = 23 * 60; // 23:00
      let closeLabel = "23:00";

      // Try matching parsed schedule if standard format "HH:MM – HH:MM" exists
      if (operatingHours?.schedule?.length > 0) {
        for (const item of operatingHours.schedule) {
          const daysStr = item.days.toLowerCase();
          const isWeekend = currentDay === 5 || currentDay === 6;
          const isSunday = currentDay === 0;
          const isWeekday = currentDay >= 1 && currentDay <= 4;

          const match =
            (isWeekday && (daysStr.includes("mon") || daysStr.includes("senin") || daysStr.includes("thurs") || daysStr.includes("weekday"))) ||
            (isWeekend && (daysStr.includes("fri") || daysStr.includes("jumat") || daysStr.includes("sabtu") || daysStr.includes("sat") || daysStr.includes("weekend"))) ||
            (isSunday && (daysStr.includes("sun") || daysStr.includes("minggu"))) ||
            daysStr.includes("daily") ||
            daysStr.includes("setiap hari") ||
            daysStr.includes("every day");

          if (match && item.hours) {
            const timeParts = item.hours.split(/[–-]/).map((s) => s.trim());
            if (timeParts.length === 2) {
              const [startH, startM] = timeParts[0].split(":").map(Number);
              const [endH, endM] = timeParts[1].split(":").map(Number);
              if (!isNaN(startH) && !isNaN(endH)) {
                openMin = startH * 60 + (startM || 0);
                closeMin = endH * 60 + (endM || 0);
                closeLabel = timeParts[1].replace(/WIB/i, "").trim();
                break;
              }
            }
          }
        }
      }

      const isOpen = currentMinutes >= openMin && currentMinutes < closeMin;
      setIsOpenNow(isOpen);
      setClosingTime(closeLabel);
    } catch {
      setIsOpenNow(true);
      setClosingTime("23:00");
    }
  }, [isMounted, operatingHours]);

  const mapsExternalUrl: string =
    (isMounted && location.googleMapsUrl) ||
    DEFAULT_SETTINGS.location.googleMapsUrl ||
    "https://www.google.com/maps/place/Coffee+And+Beyond/@-6.8806458,109.6722259,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7025d3d9d6ae29:0x7944840678acb089!8m2!3d-6.8806458!4d109.6722259!16s%2Fg%2F11bt_hnkfc";

  const branchName = location.branchName || location.locationName || "Coffee And Beyond Pekalongan";
  const addressText = location.address || location.fullAddress || "Jl. Diponegoro No. 15, Dukuh, Kec. Pekalongan Utara, Kota Pekalongan, Jawa Tengah 51146";
  const subheadlineText = location.subheadline || location.subtext || "Terletak strategis di pusat kota Pekalongan di Jl. Diponegoro No. 15. Menyambut Anda setiap hari untuk seduhan kopi specialty, hidangan lezat, dan ruang temu hangat.";
  const phoneText = location.phone || "+62 811-2748-585";
  const emailText = location.email || "contact@coffeeandbeyond.id";

  const transitTrain = location.transitInfo?.trainStation || "5 menit (~1,5 km) dari Stasiun Kereta Api Besar Pekalongan";
  const transitParking = location.transitInfo?.parking || "Area parkir mobil & motor luas tersedia langsung di pelataran kafe";
  const transitBike = location.transitInfo?.bike || "Stand parkir sepeda aman tersedia di area outdoor patio";

  return (
    <section id="location" className="w-full bg-[#F7F7F5] border-b border-border-subtle py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <FadeInView delay={0.05} direction="up" distance={16}>
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-text-muted">
              <span className="w-6 h-[1px] bg-accent-warm" />
              <span>{location.badge || "Visit Us"}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#1E1E1C]">
              {location.heading || "Find Our Sanctuary"}
            </h2>

            <p className="text-base text-text-muted leading-relaxed">
              {subheadlineText}
            </p>
          </div>
        </FadeInView>

        {/* Location & Hours 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Column: Operating Hours Card */}
          <FadeInView delay={0.15} direction="up" distance={20} className="h-full">
            <div className="h-full bg-white border border-[#E7E7E3] rounded-lg p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xs">
              <div className="space-y-5">
                {/* Card Header with Live Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-[#F7F7F5] border border-[#E7E7E3] flex items-center justify-center text-[#1E1E1C]">
                      <Clock className="w-5 h-5 text-accent-warm" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1E1E1C] text-base sm:text-lg">
                        {operatingHours.heading || "Operating Hours"}
                      </h3>
                      <p className="text-xs text-text-muted">
                        {operatingHours.kitchenNote || operatingHours.subtext || "Last order makanan & minuman 30 menit sebelum jam tutup."}
                      </p>
                    </div>
                  </div>

                  {/* Live Pulse Open/Closed Badge (Hydration Protected with deterministic static fallback) */}
                  {isMounted && isOpenNow !== null ? (
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold self-start sm:self-center border transition-colors ${
                        isOpenNow
                          ? "bg-[#F5F8F3] border-[#D3DEC8] text-[#3B5E2B]"
                          : "bg-[#FDF6F5] border-[#ECCEC9] text-[#8C3426]"
                      }`}
                    >
                      <span className="relative flex h-2 w-2">
                        {isOpenNow && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B5E2B] opacity-75" />
                        )}
                        <span
                          className={`relative inline-flex rounded-full h-2 w-2 ${
                            isOpenNow ? "bg-[#3B5E2B]" : "bg-[#8C3426]"
                          }`}
                        />
                      </span>
                      <span>
                        {isOpenNow
                          ? `Open Now • Closes at ${closingTime || "23:00"}`
                          : "Currently Closed • Opens at 10:00"}
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold self-start sm:self-center bg-[#F5F8F3] border border-[#D3DEC8] text-[#3B5E2B]">
                      <span className="h-2 w-2 rounded-full bg-[#3B5E2B]" />
                      <span>{operatingHours.openStatusText || "Open Daily • 10:00 - 23:00 WIB"}</span>
                    </div>
                  )}
                </div>

                {/* Schedule Table (7 Days) */}
                <div className="space-y-1.5">
                  {/* Table Column Headers */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-border-subtle text-[11px] font-semibold uppercase tracking-wider text-[#777772]">
                    <span>HARI</span>
                    <span>JAM</span>
                  </div>

                  {/* 7-Day Rows */}
                  <div className="divide-y divide-border-subtle/50">
                    {(operatingHours.schedule || []).map((sched, idx) => {
                      const isToday =
                        isMounted &&
                        todayIndex !== null &&
                        (sched.dayIndex === todayIndex ||
                          (todayIndex === 1 && sched.days.toLowerCase().includes("senin")) ||
                          (todayIndex === 2 && sched.days.toLowerCase().includes("selasa")) ||
                          (todayIndex === 3 && sched.days.toLowerCase().includes("rabu")) ||
                          (todayIndex === 4 && sched.days.toLowerCase().includes("kamis")) ||
                          (todayIndex === 5 && sched.days.toLowerCase().includes("jumat")) ||
                          (todayIndex === 6 && sched.days.toLowerCase().includes("sabtu")) ||
                          (todayIndex === 0 && sched.days.toLowerCase().includes("minggu")));

                      return (
                        <div
                          key={sched.id || idx}
                          className={`flex items-center justify-between text-xs sm:text-sm transition-colors ${
                            isToday
                              ? "bg-[#1E1E1C]/5 font-bold text-[#1E1E1C] rounded-lg px-3 py-2 -mx-3 border-l-2 border-[#1E1E1C]"
                              : "text-[#777772] hover:text-[#1E1E1C] py-1.5"
                          }`}
                        >
                          <span className={isToday ? "text-[#1E1E1C]" : ""}>{sched.days}</span>
                          <span className="tabular-nums font-mono text-xs sm:text-sm tracking-tight">
                            {sched.hours}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Notice */}
              <div className="pt-4 border-t border-border-subtle flex items-center gap-2 text-xs text-text-muted">
                <Radio className="w-3.5 h-3.5 text-accent-warm shrink-0" />
                <span>Table-side QR ordering available throughout all operating hours.</span>
              </div>
            </div>
          </FadeInView>

          {/* Right Column: Google Maps Interactive Embed */}
          <FadeInView delay={0.25} direction="up" distance={20} className="h-full">
            <InteractiveLocationMap />
          </FadeInView>
        </div>

        {/* Bottom Info Bar: Address Summary, Contacts, & Quick Directions CTA */}
        <FadeInView delay={0.2} direction="up" distance={20}>
          <div className="bg-white border border-[#E7E7E3] rounded-lg p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* 1. Sanctuary Address Card */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-warm">
                  <MapPin className="w-4 h-4" />
                  <span>Sanctuary Address</span>
                </div>
                <h4 className="font-sans font-bold text-base text-[#1E1E1C]">
                  {settings.location.branchName || "Coffee And Beyond Pekalongan"}
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#777772] mt-1 leading-relaxed">
                  {settings.location.address || "Jl. Diponegoro No. 15, Dukuh, Kec. Pekalongan Utara, Kota Pekalongan, Jawa Tengah 51146"}
                </p>
              </div>

              {/* 2. Direct Contact & Concierge */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-warm">
                  <Phone className="w-4 h-4" />
                  <span>Direct Concierge</span>
                </div>
                <div className="space-y-1 text-xs sm:text-sm text-text-muted">
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-[#1E1E1C]">WhatsApp:</span>
                    <a
                      href={`https://wa.me/${phoneText.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline font-mono text-[#1E1E1C]"
                    >
                      {phoneText}
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-[#1E1E1C]">Email:</span>
                    <a
                      href={`mailto:${emailText}`}
                      className="hover:underline font-mono text-[#1E1E1C]"
                    >
                      {emailText}
                    </a>
                  </p>
                  <p className="text-[11px] text-text-muted pt-1">
                    Reservasi meja, pertemuan komunitas &amp; catering inquiries.
                  </p>
                </div>
              </div>

              {/* 3. External Navigation Action */}
              <div className="space-y-3 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-warm">
                  <Navigation className="w-4 h-4" />
                  <span>Navigation &amp; Route</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Open directions in Google Maps app for live traffic and turn-by-turn routing.
                </p>
                <a
                  href={settings.location.googleMapsUrl || "https://www.google.com/maps/place/Coffee+And+Beyond/@-6.8806458,109.6722259,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7025d3d9d6ae29:0x7944840678acb089!8m2!3d-6.8806458!4d109.6722259!16s%2Fg%2F11bt_hnkfc"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#1E1E1C] text-white hover:bg-black font-sans text-sm font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </div>

            {/* Transit & Accessibility 3-Card Bar */}
            <div className="pt-6 border-t border-[#E7E7E3]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E1E1C]">
                  Transit &amp; Parking Accessibility:
                </span>
                <span className="text-[11px] text-text-muted">
                  Conveniently reachable via public transit &amp; private vehicles
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Public Transit / Train */}
                <div className="p-3 rounded-md bg-[#F7F7F5] border border-[#E7E7E3] flex items-start gap-3 text-xs">
                  <div className="p-1.5 rounded bg-white border border-[#E7E7E3] text-[#1E1E1C] shrink-0">
                    <Train className="w-3.5 h-3.5 text-accent-warm" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#1E1E1C] block">
                      Public Transit / Stasiun
                    </span>
                    <span className="text-text-muted text-[11px] leading-relaxed block">
                      {transitTrain}
                    </span>
                  </div>
                </div>

                {/* 2. Vehicle Parking */}
                <div className="p-3 rounded-md bg-[#F7F7F5] border border-[#E7E7E3] flex items-start gap-3 text-xs">
                  <div className="p-1.5 rounded bg-white border border-[#E7E7E3] text-[#1E1E1C] shrink-0">
                    <Car className="w-3.5 h-3.5 text-accent-warm" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#1E1E1C] block">
                      Vehicle Parking
                    </span>
                    <span className="text-text-muted text-[11px] leading-relaxed block">
                      {transitParking}
                    </span>
                  </div>
                </div>

                {/* 3. Cycling Friendly */}
                <div className="p-3 rounded-md bg-[#F7F7F5] border border-[#E7E7E3] flex items-start gap-3 text-xs">
                  <div className="p-1.5 rounded bg-white border border-[#E7E7E3] text-[#1E1E1C] shrink-0">
                    <Bike className="w-3.5 h-3.5 text-accent-warm" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#1E1E1C] block">
                      Cycling Friendly
                    </span>
                    <span className="text-text-muted text-[11px] leading-relaxed block">
                      {transitBike}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  );
}
