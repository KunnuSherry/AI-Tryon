/**
 * Load product image directly without any processing
 * PNGs already have transparent backgrounds, so no processing needed
 * @param {HTMLImageElement} image - Source image
 * @param {String} category - Product category (not used, kept for compatibility)
 * @returns {Promise<HTMLImageElement>} The same image, unchanged
 */
export async function processProductImage(image, category) {
  // Return the image as-is - no background removal or processing needed
  // PNGs already have transparent backgrounds
  return image;
}
