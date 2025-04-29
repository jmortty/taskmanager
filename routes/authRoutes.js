// routes/authRoutes.js
const express = require('express');
const {
  register,
  login,
  getMe,
  logout,
  // forgotPassword, // Uncomment if implementing password reset
  // resetPassword   // Uncomment if implementing password reset
} = require('../controllers/authController'); // Import auth controller functions

const { protect } = require('../middleware/auth'); // Import the protect middleware

const router = express.Router();

// These routes do NOT require authentication
router.post('/register', register); // POST /api/v1/auth/register
router.post('/login', login);     // POST /api/v1/auth/login

// Uncomment these if implementing password reset
// router.post('/forgotpassword', forgotPassword); // POST /api/v1/auth/forgotpassword
// router.put('/resetpassword/:resettoken', resetPassword); // PUT /api/v1/auth/resetpassword/:resettoken


// These routes DO require authentication, so apply the 'protect' middleware
router.get('/me', protect, getMe);     // GET /api/v1/auth/me
router.get('/logout', protect, logout); // GET /api/v1/auth/logout


module.exports = router;