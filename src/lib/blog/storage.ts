/**
 * Storage abstraction for blog images using Cloudinary
 */

import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadResult {
  url: string;
  publicId: string;
}

/**
 * Upload and optimize an image to Cloudinary
 * - Converts to WebP format using Sharp
 * - Resizes if larger than maxWidth
 * - Uploads to Cloudinary 'hakkimne-blog' folder
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

  // Get safe filename
  const baseName = filename.replace(/\.[^/.]+$/, ""); // Remove extension
  const safeName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");
  const uniqueName = `${safeName}-${Date.now()}`;

  // Optimize image with sharp before upload
  const optimizedBuffer = await sharp(file)
    .resize(maxWidth, null, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toBuffer();

  // Upload to Cloudinary using upload_stream
  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "hakkimne-blog",
          public_id: uniqueName,
          format: "webp",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload failed"));
          } else {
            resolve(result);
          }
        }
      );

      // Write buffer to stream
      uploadStream.end(optimizedBuffer);
    }
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Failed to delete from Cloudinary:", error);
  }
}

/**
 * Upload image from File object (for API routes)
 */
export async function uploadImageFromFile(
  file: File,
  options: {
    maxWidth?: number;
    quality?: number;
  } = {}
): Promise<UploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return uploadImage(buffer, file.name, options);
}
