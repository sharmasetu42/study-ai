// ============================================================
//  routes/auth.js
//  Public:    POST /api/auth/register
//             POST /api/auth/login
//  Protected: GET  /api/auth/me
//             PUT  /api/auth/profile
// ============================================================

const express    = require('express');
const { body }   = require('express-validator');
const router     = express.Router();

const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// Validation rules for register
const registerRules = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Validation rules for login
const loginRules = [
  body('email').isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', registerRules, validate, register);
router.post('/login',    loginRules,    validate, login);
router.get('/me',        protect, getMe);
router.put('/profile',   protect, updateProfile);

module.exports = router;
