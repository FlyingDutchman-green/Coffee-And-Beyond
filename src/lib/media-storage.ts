"use client";

/**
 * Native IndexedDB Media Storage Engine for Coffee And Beyond
 * 
 * Provides client-side persistent storage for high-capacity media files (HD intro video >50MB,
 * high-res space photography) without exhausting the 5MB browser localStorage quota.
 */

const DB_NAME = "cnb_media_db";
const DB_VERSION = 1;
const STORE_NAME = "media_files";

export interface StoredMediaRecord {
  key: string;
  blob: Blob;
  type: string;
  size: number;
  name?: string;
  updatedAt: number;
}

export interface MediaMetadata {
  key: string;
  size: number;
  type: string;
  name?: string;
  updatedAt: number;
}

// In-memory cache of created object URLs to allow clean revocation and fast synchronous lookups
const activeObjectUrlCache = new Map<string, string>();

/**
 * Checks if IndexedDB is supported and accessible in the current browser environment.
 */
export function isIndexedDBSupported(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return "indexedDB" in window && window.indexedDB !== null && window.indexedDB !== undefined;
  } catch {
    return false;
  }
}

/**
 * Opens or initializes the native IndexedDB instance with error recovery.
 */
function openMediaDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBSupported()) {
      reject(new Error("IndexedDB is not supported or accessible in this environment."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error("Failed to open IndexedDB media database."));
    };

    request.onblocked = () => {
      console.warn("IndexedDB database open blocked. Please close other tabs of Coffee And Beyond.");
    };
  });
}

/**
 * Emits custom browser events to notify components when media files change or get deleted.
 */
function notifyMediaUpdated(key: string, deleted = false) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("cnb_media_updated", {
        detail: { key, deleted, timestamp: Date.now() },
      })
    );
  }
}

/**
 * Saves a File or Blob into IndexedDB with metadata and returns a fresh Object URL.
 * Safely handles large media files (>50MB - 100MB) without quota errors.
 */
export async function saveMediaFile(
  key: string,
  file: File | Blob,
  customName?: string
): Promise<string> {
  if (!isIndexedDBSupported()) {
    console.warn("IndexedDB not supported; generating transient object URL as fallback.");
    const fallbackUrl = URL.createObjectURL(file);
    activeObjectUrlCache.set(key, fallbackUrl);
    return fallbackUrl;
  }

  const db = await openMediaDatabase();

  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      const record: StoredMediaRecord = {
        key,
        blob: file,
        type: file.type || "application/octet-stream",
        size: file.size,
        name: customName || (file instanceof File ? file.name : `${key}.bin`),
        updatedAt: Date.now(),
      };

      const putRequest = store.put(record);

      putRequest.onsuccess = () => {
        // Revoke old object URL if existing to free memory
        const oldUrl = activeObjectUrlCache.get(key);
        if (oldUrl) {
          try {
            URL.revokeObjectURL(oldUrl);
          } catch {
            // ignore revocation error
          }
        }

        const newUrl = URL.createObjectURL(file);
        activeObjectUrlCache.set(key, newUrl);
        notifyMediaUpdated(key, false);
        resolve(newUrl);
      };

      putRequest.onerror = () => {
        reject(putRequest.error || new Error(`Failed to save media with key: ${key}`));
      };

      transaction.oncomplete = () => {
        db.close();
      };
    } catch (err) {
      db.close();
      reject(err);
    }
  });
}

/**
 * Retrieves the raw stored media Blob from IndexedDB.
 */
export async function getMediaBlob(key: string): Promise<Blob | null> {
  if (!isIndexedDBSupported()) return null;

  try {
    const db = await openMediaDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(key);

      getRequest.onsuccess = () => {
        const result = getRequest.result as StoredMediaRecord | undefined;
        db.close();
        if (result && result.blob) {
          resolve(result.blob);
        } else {
          resolve(null);
        }
      };

      getRequest.onerror = () => {
        db.close();
        resolve(null);
      };
    });
  } catch (err) {
    console.warn(`Error retrieving media blob for ${key}:`, err);
    return null;
  }
}

/**
 * Retrieves an active Object URL pointing to the Blob stored in IndexedDB.
 * Returns null if no record exists.
 */
export async function getMediaUrl(key: string): Promise<string | null> {
  if (!isIndexedDBSupported()) {
    return activeObjectUrlCache.get(key) || null;
  }

  const blob = await getMediaBlob(key);
  if (!blob) {
    return null;
  }

  // Create an object URL
  const existingUrl = activeObjectUrlCache.get(key);
  if (existingUrl) {
    try {
      URL.revokeObjectURL(existingUrl);
    } catch {
      // ignore
    }
  }

  const objectUrl = URL.createObjectURL(blob);
  activeObjectUrlCache.set(key, objectUrl);
  return objectUrl;
}

/**
 * Retrieves media metadata (size, MIME type, file name, timestamp) without full Blob decoding.
 */
export async function getMediaMetadata(key: string): Promise<MediaMetadata | null> {
  if (!isIndexedDBSupported()) return null;

  try {
    const db = await openMediaDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(key);

      getRequest.onsuccess = () => {
        const result = getRequest.result as StoredMediaRecord | undefined;
        db.close();
        if (result) {
          resolve({
            key: result.key,
            size: result.size || result.blob?.size || 0,
            type: result.type || result.blob?.type || "unknown",
            name: result.name,
            updatedAt: result.updatedAt || 0,
          });
        } else {
          resolve(null);
        }
      };

      getRequest.onerror = () => {
        db.close();
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

/**
 * Checks if a specific key exists in IndexedDB.
 */
export async function hasMediaFile(key: string): Promise<boolean> {
  const meta = await getMediaMetadata(key);
  return meta !== null;
}

/**
 * Deletes a media file by key from IndexedDB and cleans up allocated Object URLs.
 */
export async function deleteMediaFile(key: string): Promise<void> {
  // Revoke cached Object URL if present
  const existingUrl = activeObjectUrlCache.get(key);
  if (existingUrl) {
    try {
      URL.revokeObjectURL(existingUrl);
    } catch {
      // ignore
    }
    activeObjectUrlCache.delete(key);
  }

  if (!isIndexedDBSupported()) {
    notifyMediaUpdated(key, true);
    return;
  }

  try {
    const db = await openMediaDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const deleteRequest = store.delete(key);

      deleteRequest.onsuccess = () => {
        notifyMediaUpdated(key, true);
        resolve();
      };

      deleteRequest.onerror = () => {
        reject(deleteRequest.error || new Error(`Failed to delete media key: ${key}`));
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (err) {
    console.warn(`Error deleting media file ${key}:`, err);
  }
}

/**
 * Smart URL resolver:
 * If the URL starts with `indexeddb://<key>`, it queries IndexedDB and creates a Blob Object URL.
 * If the key is not in IndexedDB, returns fallbackUrl or the default video.
 * If it's a regular http(s), data, or relative URL, returns it as-is.
 */
export async function resolveMediaUrl(
  urlOrKey: string | undefined | null,
  fallbackUrl?: string
): Promise<string> {
  if (!urlOrKey) {
    return fallbackUrl || "";
  }

  if (urlOrKey.startsWith("indexeddb://")) {
    const key = urlOrKey.replace("indexeddb://", "").trim();
    const resolvedBlobUrl = await getMediaUrl(key);
    if (resolvedBlobUrl) {
      return resolvedBlobUrl;
    }
    return fallbackUrl || "";
  }

  return urlOrKey;
}

/**
 * Formats byte size into human readable string (e.g., 42.5 MB, 840 KB).
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
