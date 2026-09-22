import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma, supabase, hasDatabaseUrl } from '../config/db.js';
import { isValidPersonName, isValidMobile, sanitizePersonName, sanitizeMobile } from '../utils/validation.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kisansetu-jwt-secret-key-2026';

// Demo users database with 3 Online Operators & 2 Physical Operators
const demoUsers = [
  {
    id: 'usr-farmer-1',
    email: 'farmer@annagati.gov.in',
    full_name: 'Ramesh Singh',
    role: 'farmer',
    operator_channel: 'online',
    phone: '9876543210'
  },
  {
    id: 'usr-farmer-1-legacy',
    email: 'farmer@kisansetu.gov.in',
    full_name: 'Ramesh Singh',
    role: 'farmer',
    operator_channel: 'online',
    phone: '9876543210'
  },
  {
    id: 'usr-operator-online1',
    email: 'operator.online1@annagati.gov.in',
    full_name: 'Rajesh Kumar (Online Op 1)',
    role: 'operator',
    operator_channel: 'online',
    phone: '9812345671'
  },
  {
    id: 'usr-operator-online1-legacy',
    email: 'operator.online1@kisansetu.gov.in',
    full_name: 'Rajesh Kumar (Online Op 1)',
    role: 'operator',
    operator_channel: 'online',
    phone: '9812345671'
  },
  {
    id: 'usr-operator-online2',
    email: 'operator.online2@annagati.gov.in',
    full_name: 'Anil Verma (Online Op 2)',
    role: 'operator',
    operator_channel: 'online',
    phone: '9812345672'
  },
  {
    id: 'usr-operator-online2-legacy',
    email: 'operator.online2@kisansetu.gov.in',
    full_name: 'Anil Verma (Online Op 2)',
    role: 'operator',
    operator_channel: 'online',
    phone: '9812345672'
  },
  {
    id: 'usr-operator-online3',
    email: 'operator.online3@annagati.gov.in',
    full_name: 'Vikas Sharma (Online Op 3)',
    role: 'operator',
    operator_channel: 'online',
    phone: '9812345673'
  },
  {
    id: 'usr-operator-online3-legacy',
    email: 'operator.online3@kisansetu.gov.in',
    full_name: 'Vikas Sharma (Online Op 3)',
    role: 'operator',
    operator_channel: 'online',
    phone: '9812345673'
  },
  {
    id: 'usr-operator-physical1',
    email: 'operator.physical1@annagati.gov.in',
    full_name: 'Suresh Patel (Physical Op 1)',
    role: 'operator',
    operator_channel: 'physical',
    phone: '9812345674'
  },
  {
    id: 'usr-operator-physical1-legacy',
    email: 'operator.physical1@kisansetu.gov.in',
    full_name: 'Suresh Patel (Physical Op 1)',
    role: 'operator',
    operator_channel: 'physical',
    phone: '9812345674'
  },
  {
    id: 'usr-operator-physical2',
    email: 'operator.physical2@annagati.gov.in',
    full_name: 'Devender Singh (Physical Op 2)',
    role: 'operator',
    operator_channel: 'physical',
    phone: '9812345675'
  },
  {
    id: 'usr-operator-physical2-legacy',
    email: 'operator.physical2@kisansetu.gov.in',
    full_name: 'Devender Singh (Physical Op 2)',
    role: 'operator',
    operator_channel: 'physical',
    phone: '9812345675'
  },
  {
    id: 'usr-admin-1',
    email: 'admin@annagati.gov.in',
    full_name: 'S. K. Sharma (DoCA Admin)',
    role: 'admin',
    operator_channel: 'online',
    phone: '9811002233'
  },
  {
    id: 'usr-admin-1-legacy',
    email: 'admin@kisansetu.gov.in',
    full_name: 'S. K. Sharma (DoCA Admin)',
    role: 'admin',
    operator_channel: 'online',
    phone: '9811002233'
  }
];

export const register = async (req, res) => {
  try {
    const { email, password, fullName, role = 'farmer', phone } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email and full name are required'
      });
    }

    if (!isValidPersonName(fullName)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid full name. Must contain only letters and spaces (2-60 characters).'
      });
    }

    if (phone && !isValidMobile(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile number. Must be a valid 10-digit Indian mobile number.'
      });
    }

    const sanitizedFullName = sanitizePersonName(fullName);
    const sanitizedPhone = phone ? sanitizeMobile(phone) : null;

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    if (hasDatabaseUrl && prisma) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'User already exists' });
      }

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          full_name: fullName,
          role: role.toLowerCase(),
          phone
        }
      });

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.full_name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token,
          user: { id: newUser.id, email: newUser.email, fullName: newUser.full_name, role: newUser.role }
        }
      });
    }

    // Demo / In-Memory fallback registration
    const newUser = {
      id: `usr-${Date.now()}`,
      email,
      full_name: fullName,
      role: role.toLowerCase(),
      phone
    };
    demoUsers.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully (Demo Mode)',
      data: {
        token,
        user: { id: newUser.id, email: newUser.email, fullName: newUser.full_name, role: newUser.role }
      }
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email && !role) {
      return res.status(400).json({
        success: false,
        message: 'Email or role is required'
      });
    }

    // Quick role-based demo login
    if (role && !email) {
      const matchedDemo = demoUsers.find(u => u.role === role.toLowerCase()) || demoUsers[0];
      const token = jwt.sign(
        { id: matchedDemo.id, email: matchedDemo.email, role: matchedDemo.role, name: matchedDemo.full_name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: `Authenticated as demo ${matchedDemo.role}`,
        data: {
          token,
          user: matchedDemo
        }
      });
    }

    // Prisma DB lookup if configured
    if (hasDatabaseUrl && prisma) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      if (password && user.password) {
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.full_name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        data: {
          token,
          user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role }
        }
      });
    }

    // Lookup in demo users
    const matched = demoUsers.find(u => u.email === email) || {
      id: `usr-${Date.now()}`,
      email: email || 'farmer@annagati.gov.in',
      full_name: 'Ramesh Singh',
      role: 'farmer'
    };

    const token = jwt.sign(
      { id: matched.id, email: matched.email, role: matched.role, name: matched.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      data: {
        token,
        user: matched
      }
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
