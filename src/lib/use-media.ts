"use client";

import { useState, useEffect } from "react";
import { getMediaUrl, resolveMediaUrl } from "@/lib/media-storage";

// When IndexedDB is empty and no other URL is available, we show the poster
// image instead of making a 404 request to a non-existent local file.
const LOCAL_VIDEO_FALLBACK = "";
const LOCAL_POSTER_FALLBACK =
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1600&auto=format&fit=crop";

/**
 * Universal React hook for resolving media URLs.
 *
 * Priority:
 * 1. indexeddb://<key>  → resolve Blob URL from IndexedDB (client-only, post-mount)
 * 2. data:/http(s):/blob: URL → return as-is immediately
 * 3. null/undefined → return fallbackUrl
 *
 * Re-resolves on cnb_media_updated / cnb_settings_updated events.
 */
export function useMediaUrl(
  sourceUrl?: string | null,
  fallbackUrl: string = ""
): string {
  const [resolvedUrl, setResolvedUrl] = useState<string>(() => {
    // SSR-safe: only use plain URLs on initial render
    if (sourceUrl && !sourceUrl.startsWith("indexeddb://")) {
      return sourceUrl;
    }
    return fallbackUrl;
  });

  useEffect(() => {
    let isMounted = true;

    async function resolve() {
      if (sourceUrl?.startsWith("indexeddb://")) {
        try {
          const url = await resolveMediaUrl(sourceUrl, fallbackUrl);
          if (isMounted) setResolvedUrl(url || fallbackUrl);
        } catch {
          if (isMounted) setResolvedUrl(fallbackUrl);
        }
        return;
      }
      if (isMounted) setResolvedUrl(sourceUrl || fallbackUrl);
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
 * Specialized hook for the intro video banner.
 *
 * ALWAYS checks IndexedDB "custom_intro_video" first — regardless of
 * whatever URL is stored in settings/localStorage. This prevents stale
 * localStorage values from overriding the user's uploaded video.
 *
 * Priority:
 * 1. IndexedDB "custom_intro_video" Blob URL  (user-uploaded, highest priority)
 * 2. settingsVideoUrl if it's an indexeddb:// URI for a different key
 * 3. settingsVideoUrl if it's a plain HTTP URL (not the local fallback)
 * 4. LOCAL_VIDEO_FALLBACK (/video/intro.mp4)
 *
 * Returns: { videoUrl, posterUrl }
 *   - videoUrl  — the resolved video src to pass to <video key={videoUrl} src={videoUrl}>
 *   - posterUrl — poster to show while video loads
 */
export function useIntroVideoUrl(
  settingsVideoUrl?: string | null,
  posterUrl: string = LOCAL_POSTER_FALLBACK
): { videoUrl: string; posterUrl: string } {
  // Initial state is EMPTY so the video element starts without a src.
  // After mount, useEffect resolves IndexedDB and sets the real URL.
  // This guarantees React will see a URL change (empty → blob URL) and,
  // combined with key={videoUrl}, will remount the <video> element.
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function resolve() {
      // Step 1: ALWAYS check IndexedDB for the user-uploaded custom video
      try {
        const customUrl = await getMediaUrl("custom_intro_video");
        if (customUrl && isMounted) {
          setVideoUrl(customUrl);
          return;
        }
      } catch {
        // IndexedDB not yet initialized or key missing — fall through
      }

      // Step 2: settingsVideoUrl is a non-default indexeddb:// key
      if (
        settingsVideoUrl?.startsWith("indexeddb://") &&
        settingsVideoUrl !== "indexeddb://custom_intro_video"
      ) {
        try {
          const url = await resolveMediaUrl(settingsVideoUrl, LOCAL_VIDEO_FALLBACK);
          if (isMounted && url) {
            setVideoUrl(url);
            return;
          }
        } catch {
          // ignore
        }
      }

      // Step 3: Plain HTTP URL in settings (not the local fallback itself)
      if (
        settingsVideoUrl &&
        !settingsVideoUrl.startsWith("indexeddb://") &&
        settingsVideoUrl !== LOCAL_VIDEO_FALLBACK
      ) {
        if (isMounted) {
          setVideoUrl(settingsVideoUrl);
          return;
        }
      }

      // Step 4: Use local video fallback
      if (isMounted) setVideoUrl(LOCAL_VIDEO_FALLBACK);
    }

    resolve();

    // Re-resolve whenever a video or settings update is broadcast
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
  }, [settingsVideoUrl]);

  return { videoUrl, posterUrl };
}

export default useMediaUrl;
