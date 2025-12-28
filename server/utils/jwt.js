import jwt from 'jsonwebtoken';

// Get JWT_SECRET lazily to allow dotenv to load first
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set in environment variables. Please add JWT_SECRET to your .env file.');
  }
  return secret;
};

const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

/**
 * Generate JWT token
 */
export const generateToken = (userId, role) => {
  const JWT_SECRET = getJWTSecret();
  
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  const JWT_SECRET = getJWTSecret();
  
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // Provide more specific error messages
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Invalid or expired token');
    }
  }
};

