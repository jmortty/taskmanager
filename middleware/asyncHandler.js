// src/middleware/asyncHandler.js

// This is a simple utility middleware function that wraps async controller functions
// It catches any errors and passes them to the next() middleware (which will be your error handler)
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
  
  module.exports = asyncHandler;