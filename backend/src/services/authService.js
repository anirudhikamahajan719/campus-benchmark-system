import jwt from 'jsonwebtoken';
import { getDB } from '../data/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'campus-benchmarking-secret-key-2026';

export const authService = {
  // Login or authenticate as a mock user / student / faculty / admin
  login: (email, role = 'student') => {
    const db = getDB();
    let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // Auto-create test user if doesn't exist
    if (!user) {
      user = {
        id: `u_${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        role: role,
        batch: "Batch 2025",
        section: "Section A",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        rating: 1500,
        skills: { FSD: 65, DSA: 65, DBMS: 65, CN: 65, CC: 65 },
        submissionsCount: 0
      };
      db.users.push(user);
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, user };
  },

  getAllUsers: () => {
    const db = getDB();
    return db.users;
  },

  getUserById: (id) => {
    const db = getDB();
    return db.users.find(u => u.id === id);
  },

  // Express middleware for JWT verification and RBAC
  verifyToken: (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  },

  requireRole: (roles) => {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: `Forbidden: requires one of [${roles.join(', ')}] roles` });
      }
      next();
    };
  }
};
