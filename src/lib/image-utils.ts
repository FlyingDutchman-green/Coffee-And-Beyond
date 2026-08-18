import { Area } from "react-easy-crop";

export const MAX_IMAGE_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
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
 * Validates file size (max 5MB) and mime type (jpeg, png, webp).
 */
export function validateImageFile(file: File): FileValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    return {
      isValid: false,
      error: "Invalid file type. Please upload a JPG, PNG, or WebP image.",
    };
  }

  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: "File size exceeds 5MB limit. Please choose a smaller image.",
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
 * Exports as compressed WebP/JPEG Data URL (~80-150KB).
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

  // Calculate destination dimensions: Max width 800px with locked 4:3 aspect ratio (800x600)
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
 * Exports as compressed WebP/JPEG Data URL (~80-120KB).
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

  // Calculate destination dimensions: Max width 1280px with locked 16:9 aspect ratio (1280x720)
  const maxOutputWidth = 1280;
  const targetWidth = Math.min(
    maxOutputWidth,
    Math.max(320, Math.round(pixelCrop.width))
  );
  const targetHeight = Math.round((targetWidth * 9) / 16);

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

  // Export with compression quality 0.82 (WebP preferred, fallback to JPEG)
  try {
    const webpDataUrl = canvas.toDataURL("image/webp", 0.82);
    if (webpDataUrl.startsWith("data:image/webp")) {
      return webpDataUrl;
    }
  } catch {
    // Fallback if browser throws on webp
  }

  return canvas.toDataURL("image/jpeg", 0.85);
}

/**
 * Crops and compresses an image to a 1:1 square ratio (max 1000x1000 px) using HTML Canvas.
 * Exports as compressed WebP/JPEG Data URL.
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

  // Calculate destination dimensions: Max 1000px with locked 1:1 aspect ratio
  const maxOutputSize = 1000;
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
