import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';
import { requireAuth, requireSeller } from '../middleware/rbac.js';
import { upload } from '../middleware/upload.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// All seller routes require authentication
router.use(authenticate);
router.use(requireAuth);

/**
 * POST /api/seller/apply
 * Submit seller application (only for SELLER role with PENDING status)
 */
router.post('/apply', async (req, res) => {
  try {
    // Check if user is a SELLER
    if (req.user.role !== 'SELLER') {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Only sellers can submit applications' 
      });
    }

    // Check if seller status is PENDING
    if (req.user.sellerStatus !== 'PENDING') {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: `Cannot submit application. Current status: ${req.user.sellerStatus}` 
      });
    }

    const { brandName, businessEmail, gstNumber, address } = req.body;

    // Validation
    if (!brandName || !businessEmail || !gstNumber || !address) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'All fields are required: brandName, businessEmail, gstNumber, address' 
      });
    }

    // Update seller profile
    req.user.sellerProfile = {
      brandName,
      businessEmail,
      gstNumber,
      address,
    };

    await req.user.save();

    res.json({ 
      message: 'Seller application submitted successfully', 
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        sellerStatus: req.user.sellerStatus,
        sellerProfile: req.user.sellerProfile,
      }
    });
  } catch (error) {
    console.error('Seller apply error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to submit seller application' 
    });
  }
});

/**
 * GET /api/seller/profile
 * Get seller's own profile
 */
router.get('/profile', async (req, res) => {
  try {
    if (req.user.role !== 'SELLER') {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'User is not a seller' 
      });
    }

    res.json({ 
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        sellerStatus: req.user.sellerStatus,
        sellerProfile: req.user.sellerProfile,
        createdAt: req.user.createdAt,
      }
    });
  } catch (error) {
    console.error('Get seller profile error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to get seller profile' 
    });
  }
});

/**
 * POST /api/seller/products
 * Upload a new product (only APPROVED sellers)
 */
router.post('/products', requireSeller, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Product image is required'
      });
    }

    const { name, category, description, price } = req.body;

    // Validation
    if (!name || !category || !price) {
      // Delete uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Name, category, and price are required'
      });
    }

    if (!['earrings', 'glasses'].includes(category)) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Category must be either "earrings" or "glasses"'
      });
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Price must be a valid positive number'
      });
    }

    // Upload to Cloudinary
    let cloudinaryResult;
    try {
      cloudinaryResult = await uploadToCloudinary(req.file.path, {
        folder: 'ai-tryon/products',
      });
      
      // Delete local file after successful upload
      fs.unlinkSync(req.file.path);
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      // Delete local file on error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to upload image to Cloudinary'
      });
    }

    // Create product with Cloudinary URL
    const product = new Product({
      sellerId: req.user._id,
      name,
      category,
      description: description || '',
      price: priceNum,
      image: {
        original: cloudinaryResult.secure_url,
      },
      status: 'PENDING',
    });

    await product.save();

    res.status(201).json({
      message: 'Product uploaded successfully',
      product: {
        id: product._id,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        image: product.image,
        status: product.status,
        tryOnCount: product.tryOnCount,
        createdAt: product.createdAt,
      }
    });
  } catch (error) {
    console.error('Upload product error:', error);
    // Delete uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to upload product'
    });
  }
});

/**
 * GET /api/seller/products
 * Get all products uploaded by the seller
 */
router.get('/products', async (req, res) => {
  try {
    if (req.user.role !== 'SELLER') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only sellers can view their products'
      });
    }

    const products = await Product.find({ sellerId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      products: products.map(product => ({
        id: product._id,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        image: product.image,
        status: product.status,
        tryOnCount: product.tryOnCount,
        createdAt: product.createdAt,
      }))
    });
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get products'
    });
  }
});

export default router;

