import express from 'express';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';
import { requireAuth } from '../middleware/rbac.js';

const router = express.Router();

/**
 * GET /api/products
 * Get all approved products (public, but authenticated users get more info)
 */
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    const query = { status: 'APPROVED' };
    if (category && ['earrings', 'glasses'].includes(category)) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate('sellerId', 'username sellerProfile')
      .sort({ createdAt: -1 });

    res.json({
      products: products.map(product => ({
        id: product._id,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        image: product.image,
        tryOnCount: product.tryOnCount,
        sellerName: product.sellerId?.username || 'Unknown',
        createdAt: product.createdAt,
      }))
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get products'
    });
  }
});

/**
 * GET /api/products/trending
 * Get trending products (sorted by tryOnCount)
 */
router.get('/trending', async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    
    const query = { status: 'APPROVED' };
    if (category && ['earrings', 'glasses'].includes(category)) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate('sellerId', 'username sellerProfile')
      .sort({ tryOnCount: -1 })
      .limit(parseInt(limit));

    res.json({
      products: products.map(product => ({
        id: product._id,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        image: product.image,
        tryOnCount: product.tryOnCount,
        sellerName: product.sellerId?.username || 'Unknown',
        createdAt: product.createdAt,
      }))
    });
  } catch (error) {
    console.error('Get trending products error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get trending products'
    });
  }
});

/**
 * GET /api/products/:id
 * Get a single product by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate('sellerId', 'username sellerProfile');

    if (!product) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Product not found'
      });
    }

    // Only return approved products to non-admin users
    if (product.status !== 'APPROVED') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Product is not available'
      });
    }

    res.json({
      product: {
        id: product._id,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        image: product.image,
        tryOnCount: product.tryOnCount,
        sellerName: product.sellerId?.username || 'Unknown',
        createdAt: product.createdAt,
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get product'
    });
  }
});

export default router;

