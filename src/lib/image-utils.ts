import { Area } from "react-easy-crop";

export const MAX_IMAGE_FILE_SIZE_BYTES = 10 * 1024 * 1024; // Allow up to 10MB input before client-side canvas compression
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates file size (max 10MB input) and mime type (jpeg, png, webp).
 */
export function validateImageFile(file: File): FileValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    return {
      isValid: false,
      error: "Format file tidak didukung. Harap gunakan format JPG, PNG, atau WebP.",
    };
  }

  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: "Ukuran file melebihi 10MB. Silakan pilih foto dengan resolusi lebih wajar.",
    };
  }

  return { isValid: true };
}

/**
 * Reads a File object and converts it to a base64 Data URL.
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read image as Data URL."));
      }
    };
    reader.onerror = () => {
      reject(reader.error || new Error("Error reading file."));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Creates an HTML Image element and waits for it to load.
 */
export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

/**
 * Converts degrees to radians.
 */
function getRadianAngle(degreeValue: number): number {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Crops and compresses an image to an ideal 4:3 ratio (max 800x600 px) using HTML Canvas.
 * Exports as high-efficiency WebP Data URL (~40KB - 90KB, <150KB).
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to create canvas 2D rendering context.");
  }

  const rotRad = getRadianAngle(rotation);

  // Calculate bounding box of rotated image if rotation is non-zero
  let safeCanvas: HTMLCanvasElement;
  let safeCtx: CanvasRenderingContext2D;

  if (rotation !== 0) {
    const sin = Math.abs(Math.sin(rotRad));
    const cos = Math.abs(Math.cos(rotRad));
    const boundingBoxWidth = image.width * cos + image.height * sin;
    const boundingBoxHeight = image.width * sin + image.height * cos;

    safeCanvas = document.createElement("canvas");
    safeCanvas.width = boundingBoxWidth;
    safeCanvas.height = boundingBoxHeight;
    const sCtx = safeCanvas.getContext("2d");

    if (!sCtx) {
      throw new Error("Unable to create rotated canvas context.");
    }
    safeCtx = sCtx;

    // Translate canvas center to image center and rotate
    safeCtx.translate(boundingBoxWidth / 2, boundingBoxHeight / 2);
    safeCtx.rotate(rotRad);
    safeCtx.drawImage(image, -image.width / 2, -image.height / 2);
  } else {
    safeCanvas = document.createElement("canvas");
    safeCanvas.width = image.width;
    safeCanvas.height = image.height;
    const sCtx = safeCanvas.getContext("2d");
    if (!sCtx) {
      throw new Error("Unable to create safe canvas context.");
    }
    safeCtx = sCtx;
    safeCtx.drawImage(image, 0, 0);
  }

  // Destination dimensions: Max width 800px with locked 4:3 aspect ratio (800x600 max)
  const maxOutputWidth = 800;
  const targetWidth = Math.min(
    maxOutputWidth,
    Math.max(200, Math.round(pixelCrop.width))
  );
  const targetHeight = Math.round((targetWidth * 3) / 4);

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Configure high-quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Draw the cropped portion onto the output canvas
  ctx.drawImage(
    safeCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  // Export with compression quality 0.85 (WebP preferred, fallback to JPEG)
  try {
    const webpDataUrl = canvas.toDataURL("image/webp", 0.85);
    if (webpDataUrl.startsWith("data:image/webp")) {
      return webpDataUrl;
    }
  } catch {
    // Fallback if browser throws on webp
  }

  return canvas.toDataURL("image/jpeg", 0.85);
}

/**
 * Crops and compresses an image to a modern 16:9 widescreen ratio (max 1280x720 px) using HTML Canvas.
 * Exports as compressed WebP/JPEG Data URL (~60KB - 110KB).
 */
export async function getCroppedImg16x9(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to create canvas 2D rendering context.");
  }

  const rotRad = getRadianAngle(rotation);

  let safeCanvas: HTMLCanvasElement;
  let safeCtx: CanvasRenderingContext2D;

  if (rotation !== 0) {
    const sin = Math.abs(Math.sin(rotRad));
    const cos = Math.abs(Math.cos(rotRad));
    const boundingBoxWidth = image.width * cos + image.height * sin;
    const boundingBoxHeight = image.width * sin + image.height * cos;

    safeCanvas = document.createElement("canvas");
    safeCanvas.width = boundingBoxWidth;
    safeCanvas.height = boundingBoxHeight;
    const sCtx = safeCanvas.getContext("2d");

    if (!sCtx) {
      throw new Error("Unable to create rotated canvas context.");
    }
    safeCtx = sCtx;

    safeCtx.translate(boundingBoxWidth / 2, boundingBoxHeight / 2);
    safeCtx.rotate(rotRad);
    safeCtx.drawImage(image, -image.width / 2, -image.height / 2);
  } else {
    safeCanvas = document.createElement("canvas");
    safeCanvas.width = image.width;
    safeCanvas.height = image.height;
    const sCtx = safeCanvas.getContext("2d");
    if (!sCtx) {
      throw new Error("Unable to create safe canvas context.");
    }
    safeCtx = sCtx;
    safeCtx.drawImage(image, 0, 0);
  }

  // Destination dimensions: Max width 1280px with locked 16:9 aspect ratio (1280x720)
  const maxOutputWidth = 1280;
  const targetWidth = Math.min(
    maxOutputWidth,
    Math.max(320, Math.round(pixelCrop.width))
  );
  const targetHeight = Math.round((targetWidth * 9) / 16);

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    safeCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  try {
    const webpDataUrl = canvas.toDataURL("image/webp", 0.85);
    if (webpDataUrl.startsWith("data:image/webp")) {
      return webpDataUrl;
    }
  } catch {
    // Fallback if browser throws on webp
  }

  return canvas.toDataURL("image/jpeg", 0.85);
}

/**
 * Crops and compresses an image to a 1:1 square ratio (max 800x800 px) using HTML Canvas.
 * Exports as compressed WebP/JPEG Data URL (<100KB).
 */
export async function getCroppedImg1x1(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to create canvas 2D rendering context.");
  }

  const rotRad = getRadianAngle(rotation);

  let safeCanvas: HTMLCanvasElement;
  let safeCtx: CanvasRenderingContext2D;

  if (rotation !== 0) {
    const sin = Math.abs(Math.sin(rotRad));
    const cos = Math.abs(Math.cos(rotRad));
    const boundingBoxWidth = image.width * cos + image.height * sin;
    const boundingBoxHeight = image.width * sin + image.height * cos;

    safeCanvas = document.createElement("canvas");
    safeCanvas.width = boundingBoxWidth;
    safeCanvas.height = boundingBoxHeight;
    const sCtx = safeCanvas.getContext("2d");

    if (!sCtx) {
      throw new Error("Unable to create rotated canvas context.");
    }
    safeCtx = sCtx;

    safeCtx.translate(boundingBoxWidth / 2, boundingBoxHeight / 2);
    safeCtx.rotate(rotRad);
    safeCtx.drawImage(image, -image.width / 2, -image.height / 2);
  } else {
    safeCanvas = document.createElement("canvas");
    safeCanvas.width = image.width;
    safeCanvas.height = image.height;
    const sCtx = safeCanvas.getContext("2d");
    if (!sCtx) {
      throw new Error("Unable to create safe canvas context.");
    }
    safeCtx = sCtx;
    safeCtx.drawImage(image, 0, 0);
  }

  // Max 800x800 for square
  const maxOutputSize = 800;
  const targetSize = Math.min(
    maxOutputSize,
    Math.max(200, Math.round(Math.min(pixelCrop.width, pixelCrop.height)))
  );

  canvas.width = targetSize;
  canvas.height = targetSize;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    safeCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetSize,
    targetSize
  );

  try {
    const webpDataUrl = canvas.toDataURL("image/webp", 0.85);
    if (webpDataUrl.startsWith("data:image/webp")) {
      return webpDataUrl;
    }
  } catch {
    // Fallback if browser throws on webp
  }

  return canvas.toDataURL("image/jpeg", 0.85);
}

/**
 * Converts a base64 data URL string into a Blob object.
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/webp";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

/**
 * Universal Cropper Function:
 * Crops and compresses an image to any arbitrary aspect ratio with high quality smoothing,
 * WebP encoding (quality 0.85), and returns both a WebP base64 Data URL and a raw Blob (<100KB target).
 */
export async function getCroppedImgUniversal(
  imageSrc: string,
  pixelCrop: Area,
  aspectRatio = 4 / 3,
  rotation = 0,
  maxDimension = 1200,
  quality = 0.85
): Promise<{ dataUrl: string; blob: Blob }> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to create canvas 2D rendering context.");
  }

  const rotRad = getRadianAngle(rotation);

  let safeCanvas: HTMLCanvasElement;
  let safeCtx: CanvasRenderingContext2D;

  if (rotation !== 0) {
    const sin = Math.abs(Math.sin(rotRad));
    const cos = Math.abs(Math.cos(rotRad));
    const boundingBoxWidth = image.width * cos + image.height * sin;
    const boundingBoxHeight = image.width * sin + image.height * cos;

    safeCanvas = document.createElement("canvas");
    safeCanvas.width = boundingBoxWidth;
    safeCanvas.height = boundingBoxHeight;
    const sCtx = safeCanvas.getContext("2d");

    if (!sCtx) {
      throw new Error("Unable to create rotated canvas context.");
    }
    safeCtx = sCtx;

    safeCtx.translate(boundingBoxWidth / 2, boundingBoxHeight / 2);
    safeCtx.rotate(rotRad);
    safeCtx.drawImage(image, -image.width / 2, -image.height / 2);
  } else {
    safeCanvas = document.createElement("canvas");
    safeCanvas.width = image.width;
    safeCanvas.height = image.height;
    const sCtx = safeCanvas.getContext("2d");
    if (!sCtx) {
      throw new Error("Unable to create safe canvas context.");
    }
    safeCtx = sCtx;
    safeCtx.drawImage(image, 0, 0);
  }

  // Calculate target dimensions based on aspectRatio
  let targetWidth: number;
  let targetHeight: number;

  if (aspectRatio < 1) {
    // Portrait (e.g. 4/5 = 0.8)
    targetHeight = Math.min(
      maxDimension,
      Math.max(250, Math.round(pixelCrop.height))
    );
    targetWidth = Math.round(targetHeight * aspectRatio);
  } else {
    // Landscape / Square (e.g. 16/9, 4/3, 1/1)
    targetWidth = Math.min(
      maxDimension,
      Math.max(250, Math.round(pixelCrop.width))
    );
    targetHeight = Math.round(targetWidth / aspectRatio);
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    safeCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  let dataUrl = "";
  try {
    const webpDataUrl = canvas.toDataURL("image/webp", quality);
    if (webpDataUrl.startsWith("data:image/webp")) {
      dataUrl = webpDataUrl;
    }
  } catch {
    // Fallback if browser throws on webp
  }

  if (!dataUrl) {
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }

  // Convert to Blob
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (b) => {
        if (b) {
          resolve(b);
        } else {
          resolve(dataUrlToBlob(dataUrl));
        }
      },
      dataUrl.startsWith("data:image/webp") ? "image/webp" : "image/jpeg",
      quality
    );
  });

  return { dataUrl, blob };
}

/**
 * Crops and compresses an image to a 4:5 vertical ratio (max 960x1200 px) using HTML Canvas.
 * Exports as compressed WebP/JPEG Data URL (<100KB).
 */
export async function getCroppedImg4x5(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<string> {
  const { dataUrl } = await getCroppedImgUniversal(
    imageSrc,
    pixelCrop,
    4 / 5,
    rotation,
    1200,
    0.85
  );
  return dataUrl;
}

/**
 * Automatically resizes and compresses any image (File or Data URL) into lightweight WebP format (<150KB).
 * Preserves aspect ratio with max dimension limit (default 1200px) and 0.85 quality.
 */
export async function compressImageToWebP(
  input: File | string,
  maxDimension = 1200,
  quality = 0.85
): Promise<string> {
  const dataUrl = typeof input === "string" ? input : await readFileAsDataURL(input);
  const image = await createImage(dataUrl);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2D context unavailable for image compression.");
  }

  // Calculate scaled dimensions
  let width = image.width;
  let height = image.height;

  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      height = Math.round((height * maxDimension) / width);
      width = maxDimension;
    } else {
      width = Math.round((width * maxDimension) / height);
      height = maxDimension;
    }
  }

  canvas.width = width;
  canvas.height = height;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(image, 0, 0, width, height);

  try {
    const webp = canvas.toDataURL("image/webp", quality);
    if (webp.startsWith("data:image/webp")) {
      return webp;
    }
  } catch {
    // fallback
  }

  return canvas.toDataURL("image/jpeg", quality);
}

/**
 * Estimates base64 Data URL payload size in bytes.
 */
export function getImageDataUrlSize(dataUrl: string): number {
  if (!dataUrl) return 0;
  const base64Str = dataUrl.split(",")[1] || dataUrl;
  return Math.round((base64Str.length * 3) / 4);
}

/**
 * Formats data URL size into KB or MB string.
 */
export function formatDataUrlSize(dataUrl: string): string {
  const bytes = getImageDataUrlSize(dataUrl);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
