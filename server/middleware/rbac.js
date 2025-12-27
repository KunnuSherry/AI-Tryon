/**
 * Role-Based Access Control Middleware
 */

/**
 * Requires authenticated user (any role)
 */
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Authentication required' 
    });
  }
  next();
};

/**
 * Requires USER role
 */
export const requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Authentication required' 
    });
  }

  if (req.user.role !== 'USER') {
    return res.status(403).json({ 
      error: 'Forbidden', 
      message: 'User role required' 
    });
  }

  next();
};

/**
 * Requires SELLER role with APPROVED status
 */
export const requireSeller = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Authentication required' 
    });
  }

  if (req.user.role !== 'SELLER') {
    return res.status(403).json({ 
      error: 'Forbidden', 
      message: 'Seller role required' 
    });
  }

  if (req.user.sellerStatus !== 'APPROVED') {
    return res.status(403).json({ 
      error: 'Forbidden', 
      message: 'Seller account must be approved' 
    });
  }

  next();
};

/**
 * Requires ADMIN role
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Authentication required' 
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Forbidden', 
      message: 'Admin role required' 
    });
  }

  next();
};

