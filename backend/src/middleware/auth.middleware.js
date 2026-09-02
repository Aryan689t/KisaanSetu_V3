import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kisansetu-jwt-secret-key-2026';

/**
 * Authentication middleware supporting both Bearer JWT and Demo Role headers.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const demoRole = req.headers['x-role'] || req.query.demoRole;

  // 1. If demo role header is provided, grant demo identity
  if (demoRole) {
    req.user = {
      id: `demo-${demoRole}`,
      role: demoRole.toLowerCase(),
      name: demoRole === 'farmer' ? 'Ramesh Singh' : demoRole === 'operator' ? 'Rajesh Kumar' : 'S. K. Sharma',
      isDemo: true
    };
    return next();
  }

  // 2. If Bearer token is provided, verify JWT
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token'
      });
    }
  }

  // 3. Optional auth: proceed as guest farmer if no auth provided
  req.user = {
    id: 'anonymous-farmer',
    role: 'farmer',
    name: 'Ramesh Singh (Guest)',
    isGuest: true
  };
  next();
};

/**
 * Role-Based Access Control middleware
 * @param {string[]} allowedRoles
 */
export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = (req.user.role || 'farmer').toLowerCase();
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: requires one of the following roles: [${allowedRoles.join(', ')}]`
      });
    }

    next();
  };
};
