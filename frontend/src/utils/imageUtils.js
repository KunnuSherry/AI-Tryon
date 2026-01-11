/**
 * Get the full image URL
 * Handles both Cloudinary URLs (full URLs) and local paths
 * @param {String} imagePath - Image path from product.image.original
 * @returns {String} Full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL (Cloudinary or other), return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a local path, construct the full URL
  // In production, this should use the backend URL from env
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const backendBaseUrl = API_BASE_URL.replace('/api', ''); // Remove /api to get base URL
  
  return `${backendBaseUrl}${imagePath}`;
};
