"use client";

/**
 * QR Code High-Resolution Export Utilities for Physical Table Standees.
 * Ensures crisp, unpixelated 1024x1024px print-ready PNG and vector SVG files.
 */

function getCleanSvgString(qrElementIdOrSvg: string | SVGElement): string | null {
  if (typeof window === "undefined") return null;

  // If already an SVGElement
  if (qrElementIdOrSvg instanceof SVGElement) {
    return new XMLSerializer().serializeToString(qrElementIdOrSvg);
  }

  // If string begins with <svg
  if (typeof qrElementIdOrSvg === "string" && qrElementIdOrSvg.trim().startsWith("<svg")) {
    return qrElementIdOrSvg;
  }

  // If passed an element ID
  if (typeof qrElementIdOrSvg === "string") {
    const el = document.getElementById(qrElementIdOrSvg);
    if (el) {
      if (el instanceof SVGElement) {
        return new XMLSerializer().serializeToString(el);
      }
      const svgChild = el.querySelector("svg");
      if (svgChild) {
        return new XMLSerializer().serializeToString(svgChild);
      }
    }
  }

  return null;
}

/**
 * Converts a QR Code SVG element into a high-resolution PNG file (default 1024x1024px)
 * with crisp white background and triggers automatic browser download.
 *
 * @param tableNumber Physical table identifier (e.g. "A01", "VIP01")
 * @param qrElementIdOrSvg DOM Element ID, SVG string, or SVGElement instance
 * @param size Target resolution width and height (default: 1024)
 */
export async function downloadQRCodeAsPNG(
  tableNumber: string,
  qrElementIdOrSvg: string | SVGElement,
  size: number = 1024
): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const rawSvg = getCleanSvgString(qrElementIdOrSvg);
    if (!rawSvg) {
      console.warn(`[qr-download] Could not find SVG for table "${tableNumber}".`);
      return false;
    }

    // Ensure standard SVG namespaces and attributes
    let normalizedSvg = rawSvg;
    if (!normalizedSvg.includes("xmlns=")) {
      normalizedSvg = normalizedSvg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const svgBlob = new Blob([normalizedSvg], {
      type: "image/svg+xml;charset=utf-8",
    });
    const blobUrl = URL.createObjectURL(svgBlob);

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          URL.revokeObjectURL(blobUrl);
          resolve(false);
          return;
        }

        // 1. Draw solid white background
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, size, size);

        // 2. Center QR code with padding (8% margin for aesthetic & scanner reliability)
        const padding = Math.round(size * 0.08);
        const qrSize = size - padding * 2;
        ctx.drawImage(img, padding, padding, qrSize, qrSize);

        // 3. Export to PNG Blob
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(blobUrl);
            if (!blob) {
              resolve(false);
              return;
            }

            const pngUrl = URL.createObjectURL(blob);
            const downloadLink = document.createElement("a");
            const cleanTableId = tableNumber.trim().replace(/[^a-zA-Z0-9_-]/g, "");
            downloadLink.href = pngUrl;
            downloadLink.download = `QR-Table-${cleanTableId}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            setTimeout(() => {
              URL.revokeObjectURL(pngUrl);
            }, 1000);

            resolve(true);
          },
          "image/png",
          1.0
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        console.error("[qr-download] Failed to rasterize SVG to Image.");
        resolve(false);
      };

      img.src = blobUrl;
    });
  } catch (err) {
    console.error("[qr-download] Error downloading PNG QR code:", err);
    return false;
  }
}

/**
 * Downloads a pure vector .svg file for vinyl cutters and high-end printing.
 *
 * @param tableNumber Physical table identifier
 * @param svgContentOrElementId DOM Element ID, SVG string, or SVGElement instance
 */
export function downloadQRCodeAsSVG(
  tableNumber: string,
  svgContentOrElementId: string | SVGElement
): boolean {
  if (typeof window === "undefined") return false;

  try {
    const rawSvg = getCleanSvgString(svgContentOrElementId);
    if (!rawSvg) {
      console.warn(`[qr-download] Could not find SVG for table "${tableNumber}".`);
      return false;
    }

    let normalizedSvg = rawSvg;
    if (!normalizedSvg.includes("xmlns=")) {
      normalizedSvg = normalizedSvg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const svgBlob = new Blob([normalizedSvg], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    const cleanTableId = tableNumber.trim().replace(/[^a-zA-Z0-9_-]/g, "");
    downloadLink.href = url;
    downloadLink.download = `QR-Table-${cleanTableId}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

    return true;
  } catch (err) {
    console.error("[qr-download] Error downloading SVG QR code:", err);
    return false;
  }
}
