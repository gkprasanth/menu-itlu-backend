import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3config.js";

/**
 * Delete an image from S3 bucket
 * @param {string} imageUrl - Full S3 URL of the image
 * @returns {Promise<boolean>}
 */
export const deleteImageFromS3 = async (imageUrl) => {
  try {
    if (!imageUrl) return false;

    // Extract key from URL
    // Example: https://bucket.s3.region.amazonaws.com/menu-items/123.jpg
    const urlParts = new URL(imageUrl);
    const key = urlParts.pathname.substring(1); // Remove leading '/'

    const command = new DeleteObjectCommand({
      Bucket: 'itlu-menu2',
      Key: key,
    });

    await s3Client.send(command);
    console.log(`✅ Deleted image from S3: ${key}`);
    return true;
  } catch (error) {
    console.error("❌ Error deleting image from S3:", error);
    return false;
  }
};

/**
 * Extract S3 key from full URL
 * @param {string} imageUrl
 * @returns {string|null}
 */
export const extractS3Key = (imageUrl) => {
  try {
    if (!imageUrl) return null;
    const urlParts = new URL(imageUrl);
    return urlParts.pathname.substring(1);
  } catch (error) {
    console.error("Error extracting S3 key:", error);
    return null;
  }
};
