import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary supports CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
// Or individual variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

let cloudinaryConfigured = false;

if (process.env.CLOUDINARY_URL) {
  // Parse CLOUDINARY_URL manually to ensure it's configured correctly
  try {
    const url = process.env.CLOUDINARY_URL;
    // Format: cloudinary://api_key:api_secret@cloud_name
    const match = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    
    if (match) {
      const [, apiKey, apiSecret, cloudName] = match;
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      cloudinaryConfigured = true;
      console.log('✅ Cloudinary configured using CLOUDINARY_URL');
    } else {
      // Try letting the SDK parse it automatically
      cloudinary.config();
      const config = cloudinary.config();
      if (config.cloud_name && config.api_key && config.api_secret) {
        cloudinaryConfigured = true;
        console.log('✅ Cloudinary configured using CLOUDINARY_URL (auto-parsed)');
      } else {
        console.warn('⚠️  CLOUDINARY_URL format is incorrect');
        console.warn('   Expected format: cloudinary://api_key:api_secret@cloud_name');
        console.warn('   Your URL:', url.substring(0, 20) + '...');
      }
    }
  } catch (error) {
    console.warn('⚠️  Error parsing CLOUDINARY_URL:', error.message);
  }
}

if (!cloudinaryConfigured) {
  // Fall back to individual environment variables
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    // Configure using individual variables
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    cloudinaryConfigured = true;
    console.log('✅ Cloudinary configured using individual variables');
  } else {
    console.warn('⚠️  WARNING: Cloudinary credentials not fully configured!');
    console.warn('   Please set either:');
    console.warn('   Option 1 (Recommended): CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name');
    console.warn('   Option 2: Set all three:');
    console.warn('     CLOUDINARY_CLOUD_NAME=your_cloud_name');
    console.warn('     CLOUDINARY_API_KEY=your_api_key');
    console.warn('     CLOUDINARY_API_SECRET=your_api_secret');
    console.warn('   Get these from: https://cloudinary.com/console');
    console.warn('   Images will fail to upload until configured properly.');
  }
}

/**
 * Upload image to Cloudinary
 * @param {String} filePath - Local file path or base64 string
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadToCloudinary = async (filePath, options = {}) => {
  // Check if Cloudinary is properly configured
  const isConfigured = process.env.CLOUDINARY_URL || 
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
  
  if (!isConfigured) {
    const error = new Error('Cloudinary not configured. Please set CLOUDINARY_URL or set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.');
    error.code = 'CLOUDINARY_NOT_CONFIGURED';
    throw error;
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: options.folder || 'ai-tryon',
      resource_type: 'image',
      ...options,
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    
    // Provide helpful error messages
    if (error.http_code === 401) {
      const helpfulError = new Error('Invalid Cloudinary credentials. Please check your API key and API secret in the .env file.');
      helpfulError.code = 'INVALID_CREDENTIALS';
      throw helpfulError;
    }
    
    throw error;
  }
};

/**
 * Upload buffer to Cloudinary
 * @param {Buffer} buffer - Image buffer
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadBufferToCloudinary = async (buffer, options = {}) => {
  // Check if Cloudinary is properly configured
  const isConfigured = process.env.CLOUDINARY_URL || 
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
  
  if (!isConfigured) {
    const error = new Error('Cloudinary not configured. Please set CLOUDINARY_URL or set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.');
    error.code = 'CLOUDINARY_NOT_CONFIGURED';
    return Promise.reject(error);
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'ai-tryon',
        resource_type: 'image',
        ...options,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          
          // Provide helpful error messages
          if (error.http_code === 401) {
            const helpfulError = new Error('Invalid Cloudinary credentials. Please check your API key and API secret in the .env file.');
            helpfulError.code = 'INVALID_CREDENTIALS';
            reject(helpfulError);
            return;
          }
          
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

export default cloudinary;
