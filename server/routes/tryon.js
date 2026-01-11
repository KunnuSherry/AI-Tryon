import express from 'express';
import Product from '../models/Product.js';
import TryOn from '../models/TryOn.js';
import { authenticate } from '../middleware/auth.js';
import { requireAuth } from '../middleware/rbac.js';
import { upload } from '../middleware/upload.js';
import { uploadBufferToCloudinary } from '../utils/cloudinary.js';
import fs from 'fs';

const router = express.Router();

// All try-on routes require authentication
router.use(authenticate);
router.use(requireAuth);

/**
 * POST /api/tryon
 * Process try-on request and save result to Cloudinary
 * Input: productId, resultImage (base64 or blob), originalImageUrl (optional)
 */
router.post('/', async (req, res) => {
  try {
    const { productId, resultImage, originalImageUrl } = req.body;

    if (!productId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Product ID is required'
      });
    }

    if (!resultImage) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Result image is required'
      });
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      });
    }

    // Validate product is APPROVED
    if (product.status !== 'APPROVED') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Product is not approved for try-on'
      });
    }

    // Convert base64 to buffer if needed
    let imageBuffer;
    if (resultImage.startsWith('data:image')) {
      // Remove data URL prefix
      const base64Data = resultImage.replace(/^data:image\/\w+;base64,/, '');
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else {
      // Assume it's already a base64 string without prefix
      imageBuffer = Buffer.from(resultImage, 'base64');
    }

    // Upload result image to Cloudinary
    let cloudinaryResult;
    try {
      cloudinaryResult = await uploadBufferToCloudinary(imageBuffer, {
        folder: 'ai-tryon/tryons',
        public_id: `tryon_${req.user._id}_${Date.now()}`,
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to upload result image to Cloudinary'
      });
    }

    // Create TryOn record
    const tryOn = new TryOn({
      userId: req.user._id,
      productId: product._id,
      originalImageUrl: originalImageUrl || cloudinaryResult.secure_url,
      resultImageUrl: cloudinaryResult.secure_url,
      cloudinaryPublicId: cloudinaryResult.public_id,
      category: product.category,
    });

    await tryOn.save();

    // Increment tryOnCount
    product.tryOnCount += 1;
    await product.save();

    res.json({
      message: 'Try-on saved successfully',
      tryOn: {
        id: tryOn._id,
        resultImageUrl: tryOn.resultImageUrl,
        originalImageUrl: tryOn.originalImageUrl,
        product: {
          id: product._id,
          name: product.name,
          category: product.category,
          image: product.image,
          tryOnCount: product.tryOnCount,
        },
        createdAt: tryOn.createdAt,
      }
    });
  } catch (error) {
    console.error('Try-on error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process try-on request'
    });
  }
});

/**
 * GET /api/tryon/history
 * Get user's try-on history
 */
router.get('/history', async (req, res) => {
  try {
    const tryOns = await TryOn.find({ userId: req.user._id })
      .populate('productId', 'name category image price')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      tryOns: tryOns.map(tryOn => ({
        id: tryOn._id,
        product: tryOn.productId ? {
          id: tryOn.productId._id,
          name: tryOn.productId.name,
          category: tryOn.productId.category,
          image: tryOn.productId.image,
          price: tryOn.productId.price,
        } : null,
        originalImageUrl: tryOn.originalImageUrl,
        resultImageUrl: tryOn.resultImageUrl,
        category: tryOn.category,
        createdAt: tryOn.createdAt,
      }))
    });
  } catch (error) {
    console.error('Get try-on history error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get try-on history'
    });
  }
});

export default router;

