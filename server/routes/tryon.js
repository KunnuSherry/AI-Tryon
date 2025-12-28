import express from 'express';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';
import { requireAuth } from '../middleware/rbac.js';
import { upload } from '../middleware/upload.js';
import fs from 'fs';

const router = express.Router();

// All try-on routes require authentication
router.use(authenticate);
router.use(requireAuth);

/**
 * POST /api/tryon
 * Process try-on request
 * Input: productId, uploaded photo or video
 * Backend: Validate product is APPROVED, increment tryOnCount, return processed media
 */
router.post('/', upload.single('media'), async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Product ID is required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Photo or video is required'
      });
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      });
    }

    // Validate product is APPROVED
    if (product.status !== 'APPROVED') {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Product is not approved for try-on'
      });
    }

    // Increment tryOnCount
    product.tryOnCount += 1;
    await product.save();

    // Return the uploaded media path
    // In a real implementation, you would process the image/video here
    // For now, we return the path and let the frontend handle MediaPipe processing
    res.json({
      message: 'Try-on request processed successfully',
      mediaUrl: `/uploads/${req.file.filename}`,
      product: {
        id: product._id,
        name: product.name,
        category: product.category,
        image: product.image,
        tryOnCount: product.tryOnCount,
      }
    });
  } catch (error) {
    console.error('Try-on error:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process try-on request'
    });
  }
});

export default router;

