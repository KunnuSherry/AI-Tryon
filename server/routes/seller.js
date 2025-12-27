import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { requireAuth } from '../middleware/rbac.js';

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

export default router;

