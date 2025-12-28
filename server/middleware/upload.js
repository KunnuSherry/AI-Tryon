import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
    // Get extension from original filename
    let ext = path.extname(file.originalname);
    
    // If no extension, derive from MIME type
    if (!ext && file.mimetype) {
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        ext = '.jpg';
      } else if (file.mimetype === 'image/png' || file.mimetype === 'image/x-png') {
        ext = '.png';
      }
    }
    
    // Fallback to .jpg if still no extension
    if (!ext) {
      ext = '.jpg';
    }
    
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file extension (remove dot and convert to lowercase)
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const allowedExtensions = ['jpg', 'jpeg', 'png'];
  
  // Check MIME type (more lenient - accept common variations)
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/x-png'];
  
  const isValidExtension = ext && allowedExtensions.includes(ext);
  const isValidMimeType = file.mimetype && allowedMimeTypes.includes(file.mimetype);

  // Accept file if either extension OR MIME type is valid
  // This handles cases where files are uploaded as "blob" without extension
  if (isValidExtension || isValidMimeType) {
    cb(null, true);
  } else {
    cb(new Error(`Only PNG and JPG images are allowed. Received: ${ext || 'no extension'} (${file.mimetype || 'no mimetype'})`), false);
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

