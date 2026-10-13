// ============================================================
//  controllers/authController.js
//  Handles: register, login, getMe (current user profile)
// ============================================================

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper: sign a JWT for a user ────────────────────────────
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

// ── Helper: send token + user data response ──────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Build a clean user object (no password)
  const userData = {
    id:       user._id,
    fullName: user.fullName,
    email:    user.email,
    year:     user.year,
    avatar:   user.avatar,
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: userData,
  });
};

// ── POST /api/auth/register ──────────────────────────────────
const register = async (req, res) => {
  const { fullName, email, password, year } = req.body;

  // Check if email already exists
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email already exists',
    });
  }

  // Create user (password gets hashed by pre-save hook in model)
  const user = await User.create({ fullName, email, password, year });

  sendTokenResponse(user, 201, res);
};

// ── POST /api/auth/login ─────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  // Explicitly select password (it's hidden by default)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  sendTokenResponse(user, 200, res);
};

// ── GET /api/auth/me  (protected) ────────────────────────────
const getMe = async (req, res) => {
  // req.user is set by the protect middleware
  res.status(200).json({
    success: true,
    user: {
      id:       req.user._id,
      fullName: req.user.fullName,
      email:    req.user.email,
      year:     req.user.year,
      avatar:   req.user.avatar,
    },
  });
};

// ── PUT /api/auth/profile  (protected) ───────────────────────
const updateProfile = async (req, res) => {
  const { fullName, year } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { fullName, year },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    user: {
      id:       user._id,
      fullName: user.fullName,
      email:    user.email,
      year:     user.year,
    },
  });
};

module.exports = { register, login, getMe, updateProfile };
