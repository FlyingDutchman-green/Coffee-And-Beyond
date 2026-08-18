"use client";

import { useState, useEffect, useCallback } from "react";

export interface BrandingSettings {
  name?: string;
  tagline?: string;
  established?: string;
  rating?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  linktree?: string;
  logoSvgUrl: string;
  brandTextSvgUrl: string;
  altText: string;
}

export interface IntroVideoSettings {
  isEnabled: boolean;
  videoUrl: string;
  posterUrl: string;
}

export interface HeroEditorialSettings {
  badgeText: string;
  headline: string;
  subheadline: string;
  poster1x1Url: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

export interface HeroSettings {
  mode: "video" | "image";
  videoUrl: string;
  posterUrl: string;
  badgeText: string;
  headline: string;
  subheadline: string;
}

export interface SpaceVibeSettings {
  badgeText: string;
  headline: string;
  storyParagraph1: string;
  storyParagraph2: string;
  quoteText: string;
  quoteAuthor: string;
  image1Url: string; // Top Left (Spot seduh / Nook)
  image2Url: string; // Top Right (Detail cup / Barista)
  image3Url: string; // Bottom Wide (Interior atmosphere)
  highlights: Array<{ label: string; description: string }>;
}

export interface PhilosophyPillar {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface SpaceAmenity {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  imageUrl?: string;
}

export interface OperatingHourItem {
  id?: string;
  days: string;
  hours: string;
  isOpen?: boolean;
  notes?: string;
  dayIndex?: number;
}

export interface TransitInfo {
  trainStation: string;
  parking: string;
  bike: string;
}

export interface TransitOption {
  id: string;
  title: string;
  detail: string;
  iconName: string;
}

export interface LocationSettings {
  branchName: string;
  tagline: string;
  subheadline: string;
  address: string;
  city: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  phone: string;
  email: string;
  transitInfo: TransitInfo;
  // Optional / backwards compatibility fields
  badge?: string;
  heading?: string;
  subtext?: string;
  locationName?: string;
  fullAddress?: string;
  shortAddress?: string;
  accessOptions?: TransitOption[];
}

export interface OperatingHoursSettings {
  heading?: string;
  subtext?: string;
  kitchenNote: string;
  openStatusText: string;
  schedule: OperatingHourItem[];
}

export interface CafeSettings {
  branding: BrandingSettings;
  introVideo: IntroVideoSettings;
  heroEditorial: HeroEditorialSettings;
  hero: HeroSettings;
  philosophy: {
    badge: string;
    heading: string;
    subtext: string;
    pillars: PhilosophyPillar[];
  };
  spaceVibe: SpaceVibeSettings;
  space: {
    badge: string;
    heading: string;
    subtext: string;
    amenities: SpaceAmenity[];
  };
  operatingHours: OperatingHoursSettings;
  location: LocationSettings;
}

export const SETTINGS_STORAGE_KEY = "coffee_and_beyond_settings";

export const DEFAULT_SETTINGS: CafeSettings = {
  branding: {
    name: "Coffee And Beyond",
    tagline: "Specialty Coffee, In-House Roastery & Casual Dining",
    established: "2015",
    rating: "4.5★ from 3,000+ Guests",
    phone: "+62 811-2748-585",
    email: "contact@coffeeandbeyond.id",
    instagram: "https://instagram.com/coffeeandbeyond.id",
    linktree: "https://linktr.ee/coffeeandbeyond",
    logoSvgUrl: "/logo.svg",
    brandTextSvgUrl: "/teks-brand.svg",
    altText: "Coffee And Beyond Pekalongan",
  },
  introVideo: {
    isEnabled: true,
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-machine-brewing-coffee-42456-large.mp4",
    posterUrl:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1600&auto=format&fit=crop",
  },
  heroEditorial: {
    badgeText: "ESTABLISHED 2015 • PEKALONGAN",
    headline: "Crafted with Passion, Brewed with Precision.",
    subheadline:
      "Destinasi specialty coffee dan casual dining di Pekalongan. Menyajikan kopi sangrai mandiri, hidangan Nusantara & Western, serta ruang hangat untuk berkumpul dan bekerja.",
    poster1x1Url:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop",
    primaryCtaText: "Explore Menu",
    primaryCtaLink: "/menu",
    secondaryCtaText: "Order at Table →",
    secondaryCtaLink: "/order/A01",
  },
  hero: {
    mode: "video",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-machine-brewing-coffee-42456-large.mp4",
    posterUrl:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1600&auto=format&fit=crop",
    badgeText: "ESTABLISHED 2015 • PEKALONGAN",
    headline: "Crafted with Passion, Brewed with Precision.",
    subheadline:
      "Destinasi specialty coffee dan casual dining di Pekalongan. Menyajikan kopi sangrai mandiri, hidangan Nusantara & Western, serta ruang hangat untuk berkumpul dan bekerja.",
  },
  philosophy: {
    badge: "Our Philosophy",
    heading: "Specialty Coffee, In-House Roastery & Authentic Culinary Craft.",
    subtext:
      "Di Coffee And Beyond, kami memadukan dedikasi sangrai presisi bersama Samasta Coffee Roastery dengan kenyamanan casual dining dan ruang temu yang hangat di Pekalongan sejak 2015.",
    pillars: [
      {
        id: "pillar-1",
        title: "In-House Roastery Precision",
        description:
          "Bekerja sama dengan Samasta Coffee Roastery menggunakan mesin Giesen 6 untuk memanggang biji kopi pilihan terbaik Nusantara dan dunia.",
        iconName: "Compass",
      },
      {
        id: "pillar-2",
        title: "Artisanal Brew & Siphon Bar",
        description:
          "Diekstraksi lewat mesin La Marzocco, Mahlkönig, hingga racikan Kopi Tahlil khas Pekalongan beraroma rempah autentik.",
        iconName: "Sparkles",
      },
      {
        id: "pillar-3",
        title: "Casual Dining & Warm Gathering",
        description:
          "Ruang temu ramah keluarga dan profesional dengan sajian pasta bebek betutu, wagyu steak, hingga masakan Nusantara istimewa.",
        iconName: "HeartHandshake",
      },
    ],
  },
  spaceVibe: {
    badgeText: "THE VIBE & ROASTERY SPACE",
    headline: "A Welcoming Sanctuary for Coffee, Dining & Meaningful Gatherings.",
    storyParagraph1:
      "Berdiri sejak 1 Juli 2015 di Jl. Diponegoro No. 15 Pekalongan, Coffee And Beyond hadir sebagai ruang temu yang memadukan sajian specialty coffee berkualitas dengan kenyamanan casual dining keluarga dan profesional.",
    storyParagraph2:
      "Bekerja sama dengan Samasta Coffee Roastery, setiap biji kopi disangrai presisi menggunakan mesin Giesen 6 dan diekstraksi lewat mesin La Marzocco serta slow bar Siphon—menghadirkan kreasi signature mulai dari Pandan Latte hingga Kopi Tahlil kontemporer.",
    quoteText:
      "Kami tidak terburu-buru dalam menyeduh. Kami tidak terburu-buru menikmati momen.",
    quoteAuthor: "COFFEE AND BEYOND PEKALONGAN",
    image1Url:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1000&auto=format&fit=crop",
    image2Url:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop",
    image3Url:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1600&auto=format&fit=crop",
    highlights: [
      {
        label: "IN-HOUSE ROASTERY",
        description:
          "Sangrai mandiri bersama Samasta Coffee dengan mesin Giesen 6.",
      },
      {
        label: "POWER AT EVERY SEAT",
        description:
          "Stopkontak AC & fast-charging di setiap meja untuk kenyamanan kerja.",
      },
      {
        label: "OPEN DAILY 10:00 - 23:00",
        description:
          "Layanan dine-in, takeaway, delivery & catering setiap hari.",
      },
    ],
  },
  space: {
    badge: "The Space",
    heading: "Designed for Comfort, Dining & Quiet Productivity.",
    subtext:
      "Whether you are catching up with family, hosting team discussions, or enjoying solo focus time, our sanctuary is tailored to welcome you.",
    amenities: [
      {
        id: "amenity-1",
        title: "High-Speed Internet",
        subtitle: "300+ Mbps Synchronous",
        description:
          "High-density mesh WiFi network engineered for seamless video calls, large file transfers, and uninterrupted cloud workflow.",
        iconName: "Wifi",
        imageUrl: "",
      },
      {
        id: "amenity-2",
        title: "Universal Power at Every Seat",
        subtitle: "AC + USB-C Fast Charging",
        description:
          "Discreetly integrated power outlets and fast-charging USB ports embedded into communal benches and private booths.",
        iconName: "Zap",
        imageUrl: "",
      },
      {
        id: "amenity-3",
        title: "Ergonomic & Mindful Seating",
        subtitle: "Acoustic Comfort & Daylight",
        description:
          "Custom solid oak tables, sound-dampening acoustic partitions, and expansive natural light to keep you energized through long working sessions.",
        iconName: "Armchair",
        imageUrl: "",
      },
      {
        id: "amenity-4",
        title: "Curated Acoustic Landscape",
        subtitle: "Non-Intrusive Sound Levels",
        description:
          "Carefully leveled playlists featuring ambient jazz, neoclassical, and warm lo-fi that enhance concentration without overpowering speech.",
        iconName: "Music2",
        imageUrl: "",
      },
    ],
  },
  operatingHours: {
    heading: "Operating Hours",
    subtext: "Open Daily • Dine-In, Takeaway, Delivery & Catering",
    kitchenNote: "Last order makanan & minuman 30 menit sebelum jam tutup.",
    openStatusText: "Open Daily • 10:00 - 23:00 WIB",
    schedule: [
      { id: "mon", days: "Senin", hours: "10:00 – 23:00 WIB", isOpen: true, dayIndex: 1 },
      { id: "tue", days: "Selasa", hours: "10:00 – 23:00 WIB", isOpen: true, dayIndex: 2 },
      { id: "wed", days: "Rabu", hours: "10:00 – 23:00 WIB", isOpen: true, dayIndex: 3 },
      { id: "thu", days: "Kamis", hours: "10:00 – 23:00 WIB", isOpen: true, dayIndex: 4 },
      { id: "fri", days: "Jumat", hours: "10:00 – 23:00 WIB", isOpen: true, dayIndex: 5 },
      { id: "sat", days: "Sabtu", hours: "10:00 – 23:00 WIB", isOpen: true, dayIndex: 6 },
      { id: "sun", days: "Minggu", hours: "10:00 – 23:00 WIB", isOpen: true, dayIndex: 0 },
    ],
  },
  location: {
    branchName: "Coffee And Beyond Pekalongan",
    tagline: "Sanctuary & Roastery",
    subheadline:
      "Terletak strategis di pusat kota Pekalongan di Jl. Diponegoro No. 15. Menyambut Anda setiap hari untuk seduhan kopi specialty, hidangan lezat, dan ruang temu hangat.",
    address:
      "Jl. Diponegoro No. 15, Dukuh, Kec. Pekalongan Utara, Kota Pekalongan, Jawa Tengah 51146",
    city: "Pekalongan, Jawa Tengah",
    googleMapsUrl:
      "https://www.google.com/maps/place/Coffee+And+Beyond/@-6.8806458,109.6722259,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7025d3d9d6ae29:0x7944840678acb089!8m2!3d-6.8806458!4d109.6722259!16s%2Fg%2F11bt_hnkfc",
    googleMapsEmbedUrl:
      "https://maps.google.com/maps?q=Coffee%20And%20Beyond,%20Jl.%20Diponegoro%20No.15,%20Pekalongan&t=&z=17&ie=UTF8&iwloc=&output=embed",
    phone: "+62 811-2748-585",
    email: "contact@coffeeandbeyond.id",
    transitInfo: {
      trainStation: "5 menit (~1,5 km) dari Stasiun Kereta Api Besar Pekalongan",
      parking: "Area parkir mobil & motor luas tersedia langsung di pelataran kafe",
      bike: "Stand parkir sepeda aman tersedia di area outdoor patio",
    },
    // Backwards compatibility fallbacks
    badge: "Visit Us",
    heading: "Find Our Sanctuary",
    subtext:
      "Terletak strategis di pusat kota Pekalongan di Jl. Diponegoro No. 15. Menyambut Anda setiap hari untuk seduhan kopi specialty, hidangan lezat, dan ruang temu hangat.",
    locationName: "Coffee And Beyond Pekalongan",
    fullAddress:
      "Jl. Diponegoro No. 15, Dukuh, Kec. Pekalongan Utara, Kota Pekalongan, Jawa Tengah 51146",
    shortAddress: "Jl. Diponegoro No. 15, Pekalongan",
    accessOptions: [
      {
        id: "acc-1",
        title: "Public Transit / Stasiun",
        detail: "5 menit (~1,5 km) dari Stasiun Kereta Api Besar Pekalongan",
        iconName: "Train",
      },
      {
        id: "acc-2",
        title: "Vehicle Parking",
        detail: "Area parkir mobil & motor luas tersedia langsung di pelataran kafe",
        iconName: "Car",
      },
      {
        id: "acc-3",
        title: "Cycling Friendly",
        detail: "Stand parkir sepeda aman tersedia di area outdoor patio",
        iconName: "Bike",
      },
    ],
  },
};

function notifySettingsSubscribers() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("coffee_settings_updated"));
  }
}

export function getSettings(): CafeSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(DEFAULT_SETTINGS)
      );
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);

    // Auto-heal legacy cache: if old cached data contains obsolete location, contacts, or hours
    const isLegacy =
      JSON.stringify(parsed).includes("Senopati") ||
      JSON.stringify(parsed).includes("Jakarta Selatan") ||
      JSON.stringify(parsed).includes("0812-3456") ||
      JSON.stringify(parsed).includes("hello@coffeeandbeyond") ||
      JSON.stringify(parsed).includes("07:00");

    if (isLegacy) {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(DEFAULT_SETTINGS)
      );
      return DEFAULT_SETTINGS;
    }

    // Jika data tersimpan masih mengandung "Senopati", timpa dengan data resmi Pekalongan
    if (
      parsed.location?.branchName?.includes("Senopati") ||
      parsed.location?.address?.includes("Senopati") ||
      parsed.location?.googleMapsUrl?.includes("Senopati")
    ) {
      parsed.location = { ...DEFAULT_SETTINGS.location };
    }
    if (
      !parsed.operatingHours?.schedule ||
      parsed.operatingHours.schedule.length < 7 ||
      parsed.operatingHours?.schedule?.some((s: any) => typeof s?.hours === "string" && s.hours.includes("07:00"))
    ) {
      parsed.operatingHours = { ...DEFAULT_SETTINGS.operatingHours };
    }

    // Ensure all nested fields exist with fallbacks
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      branding: {
        ...DEFAULT_SETTINGS.branding,
        ...(parsed.branding || {}),
      },
      introVideo: {
        ...DEFAULT_SETTINGS.introVideo,
        ...(parsed.introVideo || {}),
      },
      heroEditorial: {
        ...DEFAULT_SETTINGS.heroEditorial,
        ...(parsed.heroEditorial || {}),
      },
      hero: {
        ...DEFAULT_SETTINGS.hero,
        ...(parsed.hero || {}),
      },
      philosophy: {
        ...DEFAULT_SETTINGS.philosophy,
        ...(parsed.philosophy || {}),
      },
      spaceVibe: {
        ...DEFAULT_SETTINGS.spaceVibe,
        ...(parsed.spaceVibe || {}),
        highlights:
          parsed.spaceVibe?.highlights ||
          DEFAULT_SETTINGS.spaceVibe.highlights,
      },
      space: {
        ...DEFAULT_SETTINGS.space,
        ...(parsed.space || {}),
      },
      operatingHours: {
        ...DEFAULT_SETTINGS.operatingHours,
        ...(parsed.operatingHours || {}),
        schedule:
          parsed.operatingHours?.schedule?.length >= 7
            ? parsed.operatingHours.schedule
            : DEFAULT_SETTINGS.operatingHours.schedule,
        kitchenNote:
          parsed.operatingHours?.kitchenNote ||
          DEFAULT_SETTINGS.operatingHours.kitchenNote,
        openStatusText:
          parsed.operatingHours?.openStatusText ||
          DEFAULT_SETTINGS.operatingHours.openStatusText,
      },
      location: {
        ...DEFAULT_SETTINGS.location,
        ...(parsed.location || {}),
        branchName:
          parsed.location?.branchName ||
          parsed.location?.locationName ||
          DEFAULT_SETTINGS.location.branchName,
        address:
          parsed.location?.address ||
          parsed.location?.fullAddress ||
          DEFAULT_SETTINGS.location.address,
        subheadline:
          parsed.location?.subheadline ||
          parsed.location?.subtext ||
          DEFAULT_SETTINGS.location.subheadline,
        googleMapsUrl:
          parsed.location?.googleMapsUrl ||
          DEFAULT_SETTINGS.location.googleMapsUrl,
        googleMapsEmbedUrl:
          parsed.location?.googleMapsEmbedUrl ||
          DEFAULT_SETTINGS.location.googleMapsEmbedUrl,
        phone:
          parsed.location?.phone ||
          DEFAULT_SETTINGS.location.phone,
        email:
          parsed.location?.email ||
          DEFAULT_SETTINGS.location.email,
        transitInfo: {
          ...DEFAULT_SETTINGS.location.transitInfo,
          ...(parsed.location?.transitInfo || {}),
        },
      },
    };
  } catch (e) {
    console.error("Failed to parse settings from localStorage:", e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: CafeSettings): CafeSettings {
  if (typeof window === "undefined") return settings;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    notifySettingsSubscribers();
    return settings;
  } catch (e) {
    console.error("Failed to save settings to localStorage:", e);
    return settings;
  }
}

export function resetSettingsToDefault(): CafeSettings {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(DEFAULT_SETTINGS)
    );
    notifySettingsSubscribers();
  }
  return DEFAULT_SETTINGS;
}

/**
 * Custom React hook for reactive brand settings synchronization across components and tabs.
 */
export function useSettingsStore() {
  const [settings, setSettings] = useState<CafeSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSettings = useCallback(() => {
    setSettings(getSettings());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshSettings();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SETTINGS_STORAGE_KEY) {
        refreshSettings();
      }
    };

    const handleCustomUpdate = () => {
      refreshSettings();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("coffee_settings_updated", handleCustomUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("coffee_settings_updated", handleCustomUpdate);
    };
  }, [refreshSettings]);

  const updateSettings = useCallback(
    (newSettings: CafeSettings | ((prev: CafeSettings) => CafeSettings)) => {
      const updated =
        typeof newSettings === "function" ? newSettings(settings) : newSettings;
      const res = saveSettings(updated);
      refreshSettings();
      return res;
    },
    [settings, refreshSettings]
  );

  const resetSettings = useCallback(() => {
    const res = resetSettingsToDefault();
    refreshSettings();
    return res;
  }, [refreshSettings]);

  return {
    settings,
    isLoading,
    refreshSettings,
    updateSettings,
    resetSettings,
  };
}
