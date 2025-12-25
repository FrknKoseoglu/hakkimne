/**
 * Storage abstraction for blog images
 * Uses local filesystem in development and Vercel Blob in production
 */

import { put, del } from "@vercel/blob";
import sharp from "sharp";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { getDatePath } from "./utils";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

interface UploadResult {
  url: string;
  pathname: string;
}

/**
 * Upload and optimize an image
 * - Converts to WebP format
 * - Resizes if larger than maxWidth
 * - Stores in date-based directory structure
 */
export async function uploadImage(
  file: Buffer,
  filename: string,
  options: {
    maxWidth?: number;
    quality?: number;
  } = {}
): Promise<UploadResult> {
  const { maxWidth = 1200, quality = 80 } = options;

  // Get just the filename without extension
  const baseName = path.basename(filename, path.extname(filename));
  const safeName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");
  const datePath = getDatePath();
  const webpFilename = `${safeName}-${Date.now()}.webp`;
  const pathname = `blog/${datePath}/${webpFilename}`;

  // Optimize image with sharp
  const optimizedBuffer = await sharp(file)
    .resize(maxWidth, null, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toBuffer();

  if (IS_PRODUCTION && BLOB_TOKEN) {
    // Production: Upload to Vercel Blob
    const blob = await put(pathname, optimizedBuffer, {
      access: "public",
      contentType: "image/webp",
      token: BLOB_TOKEN,
    });

    return {
      url: blob.url,
      pathname,
    };
  } else {
    // Development: Save to public directory
    const publicDir = path.join(process.cwd(), "public", "blog", datePath);
    await mkdir(publicDir, { recursive: true });

    const localPath = path.join(publicDir, webpFilename);
    await writeFile(localPath, optimizedBuffer);

    return {
      url: `/${pathname}`,
      pathname,
    };
  }
}

/**
 * Delete an image from storage
 */
export async function deleteImage(pathname: string): Promise<void> {
  if (IS_PRODUCTION && BLOB_TOKEN) {
    // Production: Delete from Vercel Blob
    try {
      await del(pathname, { token: BLOB_TOKEN });
    } catch (error) {
      console.error("Failed to delete from Vercel Blob:", error);
    }
  } else {
    // Development: Delete from public directory
    try {
      const localPath = path.join(process.cwd(), "public", pathname);
      await unlink(localPath);
    } catch (error) {
      console.error("Failed to delete local file:", error);
    }
  }
}
