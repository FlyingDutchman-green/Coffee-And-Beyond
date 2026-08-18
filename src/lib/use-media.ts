"use client";

import { useState, useEffect } from "react";
import { getMediaUrl, resolveMediaUrl } from "@/lib/media-storage";

/**
 * Universal React hook for resolving media URLs with the following priority:
 * 1. If sourceUrl is "indexeddb://custom_intro_video" -> resolve blob URL from IndexedDB
 * 2. If sourceUrl is any other "indexeddb://<key>" -> resolve from IndexedDB
 * 3. If sourceUrl is a standard web/data URL -> return as-is
 * 4. Falls back to fallbackUrl at all times if resolution fails
 *
 * Also listens to all media update events for reactive cross-tab sync.
 */
export function useMediaUrl(
  sourceUrl?: string | null,
  fallbackUrl: string = ""
): string {
  const [resolvedUrl, setResolvedUrl] = useState<string>(() => {
    // Initialize with non-indexeddb URLs immediately for SSR/hydration
    if (sourceUrl && !sourceUrl.startsWith("indexeddb://")) {
      return sourceUrl;
    }
    return fallbackUrl;
  });

  useEffect(() => {
    let isMounted = true;

    async function resolve() {
      // Priority 1: indexeddb:// URI scheme — resolve from IndexedDB
      if (sourceUrl?.startsWith("indexeddb://")) {
        try {
          const url = await resolveMediaUrl(sourceUrl, fallbackUrl);
          if (isMounted && url) {
            setResolvedUrl(url);
            return;
          }
        } catch (err) {
          console.warn("Failed to resolve indexeddb media URL:", err);
        }
        if (isMounted) setResolvedUrl(fallbackUrl);
        return;
      }

      // Priority 2: Standard web or data URL — use directly
      if (sourceUrl) {
        if (isMounted) setResolvedUrl(sourceUrl);
        return;
      }

      // Priority 3: No sourceUrl at all — use fallback
      if (isMounted) setResolvedUrl(fallbackUrl);
    }

    resolve();

    const handleUpdate = () => resolve();
    window.addEventListener("cnb_media_updated", handleUpdate);
    window.addEventListener("cnb_settings_updated", handleUpdate);
    window.addEventListener("coffee_settings_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("cnb_media_updated", handleUpdate);
      window.removeEventListener("cnb_settings_updated", handleUpdate);
      window.removeEventListener("coffee_settings_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [sourceUrl, fallbackUrl]);

  return resolvedUrl;
}

/**
 * Specialized hook that ALWAYS prioritizes IndexedDB custom_intro_video
 * over any settings value. This is the correct hook for the video banner.
 *
 * Priority order:
 * 1. IndexedDB "custom_intro_video" key (if user uploaded a custom video)
 * 2. settingsVideoUrl (from settings store or passed explicitly)
 * 3. hardFallbackUrl (last resort, e.g. mixkit CDN URL)
 */
export function useIntroVideoUrl(
  settingsVideoUrl?: string | null,
  hardFallbackUrl: string = "https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-machine-brewing-coffee-42456-large.mp4"
): string {
  const [resolvedUrl, setResolvedUrl] = useState<string>(() => {
    // Initialize with settings URL if it's a plain web URL
    if (
      settingsVideoUrl &&
      !settingsVideoUrl.startsWith("indexeddb://") &&
      settingsVideoUrl !== hardFallbackUrl
    ) {
      return settingsVideoUrl;
    }
    return hardFallbackUrl;
  });

  useEffect(() => {
    let isMounted = true;

    async function resolve() {
      // Step 1: ALWAYS check IndexedDB for custom_intro_video first
      try {
        const customUrl = await getMediaUrl("custom_intro_video");
        if (customUrl && isMounted) {
          setResolvedUrl(customUrl);
          return;
        }
      } catch {
        // No custom video in IndexedDB, continue to fallback
      }

      // Step 2: If settingsVideoUrl is an indexeddb:// URI (for a different key)
      if (settingsVideoUrl?.startsWith("indexeddb://")) {
        try {
          const url = await resolveMediaUrl(settingsVideoUrl, hardFallbackUrl);
          if (isMounted && url) {
            setResolvedUrl(url);
            return;
          }
        } catch {
          // ignore
        }
        if (isMounted) setResolvedUrl(hardFallbackUrl);
        return;
      }

      // Step 3: Use settingsVideoUrl if it's a valid plain URL
      if (settingsVideoUrl && settingsVideoUrl !== "indexeddb://custom_intro_video") {
        if (isMounted) setResolvedUrl(settingsVideoUrl);
        return;
      }

      // Step 4: Use hard fallback
      if (isMounted) setResolvedUrl(hardFallbackUrl);
    }

    resolve();

    const handleUpdate = () => resolve();
    window.addEventListener("cnb_media_updated", handleUpdate);
    window.addEventListener("cnb_settings_updated", handleUpdate);
    window.addEventListener("coffee_settings_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("cnb_media_updated", handleUpdate);
      window.removeEventListener("cnb_settings_updated", handleUpdate);
      window.removeEventListener("coffee_settings_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [settingsVideoUrl, hardFallbackUrl]);

  return resolvedUrl;
}

export default useMediaUrl;
