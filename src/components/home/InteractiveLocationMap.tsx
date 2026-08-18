"use client";

import React from "react";
import { useSettingsStore } from "@/lib/settings-store";

export const DEFAULT_MAPS_EMBED_URL =
  "https://maps.google.com/maps?q=Coffee%20And%20Beyond,%20Jl.%20Diponegoro%20No.15,%20Pekalongan&t=&z=17&ie=UTF8&iwloc=&output=embed";

export default function InteractiveLocationMap() {
  const { settings } = useSettingsStore();
  const mapSrc = settings?.location?.googleMapsEmbedUrl || DEFAULT_MAPS_EMBED_URL;

  return (
    <div className="w-full h-full min-h-[340px] sm:min-h-[380px] lg:min-h-[420px] relative bg-[#F7F7F5] border border-[#E7E7E3] rounded-lg overflow-hidden shadow-2xs">
      <iframe
        src={mapSrc}
        title="Coffee And Beyond Location Map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen={true}
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full absolute inset-0 border-0"
      />
    </div>
  );
}
