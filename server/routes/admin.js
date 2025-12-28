import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';
import { requireAuth, requireAdmin } from '../middleware/rbac.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAuth);
router.use(requireAdmin);

/**
 * GET /api/admin/sellers/pending
 * Get all pending seller applications
 */
router.get('/sellers/pending', async (req, res) => {
  try {
    const pendingSellers = await User.find({
      role: 'SELLER',
      sellerStatus: 'PENDING',
    }).select('-password').sort({ createdAt: -1 });

    res.json({ 
      sellers: pendingSellers.map(seller => ({
        id: seller._id,
        username: seller.username,
        email: seller.email,
        role: seller.role,
        sellerStatus: seller.sellerStatus,
        sellerProfile: seller.sellerProfile,
        createdAt: seller.createdAt,
      }))
    });
  } catch (error) {
    console.error('Get pending sellers error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to get pending sellers' 
    });
  }
});

/**
 * POST /api/admin/sellers/:id/approve
 * Approve a seller application
 */
router.post('/sellers/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;

    const seller = await User.findById(id);

    if (!seller) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: 'Seller not found' 
      });
    }

    if (seller.role !== 'SELLER') {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'User is not a seller' 
      });
    }

    seller.sellerStatus = 'APPROVED';
    await seller.save();

    res.json({ 
      message: 'Seller approved successfully', 
      seller: {
        id: seller._id,
        username: seller.username,
        email: seller.email,
        role: seller.role,
        sellerStatus: seller.sellerStatus,
        sellerProfile: seller.sellerProfile,
      }
    });
  } catch (error) {
    console.error('Approve seller error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to approve seller' 
    });
  }
});

/**
 * POST /api/admin/sellers/:id/reject
 * Reject a seller application
 */
router.post('/sellers/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;

    const seller = await User.findById(id);

    if (!seller) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: 'Seller not found' 
      });
    }

    if (seller.role !== 'SELLER') {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'User is not a seller' 
      });
    }

    seller.sellerStatus = 'REJECTED';
    await seller.save();

    res.json({ 
      message: 'Seller rejected successfully', 
      seller: {
        id: seller._id,
        username: seller.username,
        email: seller.email,
        role: seller.role,
        sellerStatus: seller.sellerStatus,
        sellerProfile: seller.sellerProfile,
      }
    });
  } catch (error) {
    console.error('Reject seller error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to reject seller' 
    });
  }
});

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({ 
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        sellerStatus: user.sellerStatus,
        createdAt: user.createdAt,
      }))
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to get users' 
    });
  }
});

/**
 * GET /api/admin/products/pending
 * Get all pending products
 */
router.get('/products/pending', async (req, res) => {
  try {
    const products = await Product.find({ status: 'PENDING' })
      .populate('sellerId', 'username email sellerProfile')
      .sort({ createdAt: -1 });

    res.json({
      products: products.map(product => ({
        id: product._id,
        sellerId: product.sellerId._id,
        sellerName: product.sellerId.username,
        sellerEmail: product.sellerId.email,
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
    console.error('Get pending products error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get pending products'
    });
  }
});

/**
 * POST /api/admin/products/:id/approve
 * Approve a product
 */
router.post('/products/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      });
    }

    if (product.status !== 'PENDING') {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Product is not pending. Current status: ${product.status}`
      });
    }

    product.status = 'APPROVED';
    await product.save();

    res.json({
      message: 'Product approved successfully',
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
    console.error('Approve product error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to approve product'
    });
  }
});

/**
 * POST /api/admin/products/:id/reject
 * Reject a product
 */
router.post('/products/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      });
    }

    if (product.status !== 'PENDING') {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Product is not pending. Current status: ${product.status}`
      });
    }

    product.status = 'REJECTED';
    await product.save();

    res.json({
      message: 'Product rejected successfully',
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
    console.error('Reject product error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to reject product'
    });
  }
});

export default router;

