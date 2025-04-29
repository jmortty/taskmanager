// middleware/auth.js
const jwt = require('jsonwebtoken'); // For verifying JWTs
const asyncHandler = require('./asyncHandler'); // Re-using our async handler
const ErrorResponse = require('../utils/errorResponse'); // Re-using our custom error class
const User = require('../models/User'); // Import the User model

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Option 1: Get token from Cookies (Recommended for browser-based apps using httpOnly cookies)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Option 2: Get token from Authorization Header (Common for APIs, e.g., "Bearer TOKEN")
  // Else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
  //   // Set token from Bearer token in header
  //   token = req.headers.authorization.split(' ')[1];
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401)); // 401 Unauthorized
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT_SECRET from .env

    // console.log(decoded); // Log decoded payload for debugging

    // Find user by the ID encoded in the token payload
    const user = await User.findById(decoded.id);

    if (!user) {
        // Token was valid, but user no longer exists in DB
        return next(new ErrorResponse('User no longer exists, not authorized', 401));
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware/controller
    next();

  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return next(new ErrorResponse('Not authorized to access this route', 401)); // 401 Unauthorized
  }
});

// Optional: Middleware for role-based authorization (e.g., admin access)
/*
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403)); // 403 Forbidden
        }
        next();
    };
};
*/