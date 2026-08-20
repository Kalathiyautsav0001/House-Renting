/**
 * Uploads a single file directly from browser to Cloudinary via unsigned upload preset.
 * @param {File} file - File object to upload
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<string>} - Resolves to secure_url string
 */
export async function uploadToCloudinary(file, folder = "house-rent-sell") {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dtennrzvm";
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET || "ml_default1";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  if (folder) {
    formData.append("folder", folder);
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Failed to upload image to Cloudinary");
  }

  const data = await response.json();
  return data.secure_url;
}

/**
 * Uploads multiple files directly to Cloudinary concurrently.
 * @param {File[]} files - Array of File objects
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<string[]>} - Resolves to array of secure_url strings
 */
export async function uploadMultipleToCloudinary(files, folder = "house-rent-sell") {
  if (!files || files.length === 0) return [];
  const promises = files.map((file) => uploadToCloudinary(file, folder));
  return Promise.all(promises);
}
