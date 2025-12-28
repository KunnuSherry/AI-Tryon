import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

const router = express.Router();

/**
 * POST /api/auth/signup
 * Register a new user
 */
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Username, email, and password are required' 
      });
    }

    // Validate role
    if (role && !['USER', 'SELLER'].includes(role)) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Invalid role. Only USER or SELLER allowed during signup' 
      });
    }

    // Prevent ADMIN signup
    if (role === 'ADMIN') {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Cannot signup as ADMIN' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({ 
        error: 'Conflict', 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: role || 'USER',
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({ 
      message: 'User created successfully', 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        sellerStatus: user.sellerStatus,
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({ 
        error: 'Conflict', 
        message: 'User with this email or username already exists' 
      });
    }

    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to create user' 
    });
  }
});

/**
 * POST /api/auth/login
 * Login with email/username and password
 */
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    // Validation
    if (!emailOrUsername || !password) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Email/username and password are required' 
      });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername }
      ]
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Invalid credentials' 
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        sellerStatus: user.sellerStatus,
        sellerProfile: user.sellerProfile,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to login' 
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', async (req, res) => {
  try {
    // Get token from Authorization header or cookie
    let token = null;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'No token provided' 
      });
    }

    const { verifyToken } = await import('../utils/jwt.js');
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: 'User not found' 
      });
    }

    res.json({ 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        sellerStatus: user.sellerStatus,
        sellerProfile: user.sellerProfile,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    // Don't log expired/invalid tokens as errors - this is expected behavior
    // Only log unexpected errors
    if (error.message !== 'Invalid or expired token' && error.message !== 'No token provided') {
      console.error('Get user error:', error);
    }
    res.status(401).json({ 
      error: 'Unauthorized', 
      message: error.message || 'Invalid token' 
    });
  }
});

export default router;

