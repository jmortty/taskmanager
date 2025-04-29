// middleware/error.js
const ErrorResponse = require('../utils/errorResponse'); // Import our custom error class
const colors = require('colors'); // Import colors for console output (optional)


const errorHandler = (err, req, res, next) => {
  // Log the original error to the console for debugging
  console.error("--- Error Caught by Error Handler ---".red.bold);
  console.error(err);
  console.error("------------------------------------".red.bold);


  // Create a copy of the original error
  // Use structuredClone if available (Node.js 17+) for deep copy,
  // otherwise simple spread might suffice depending on error structure
   let error = { ...err };
   // Ensure message is copied as it might not be enumerable in some error types
   error.message = err.message;


  // --- Handle specific Mongoose errors ---

  // Mongoose Bad ObjectId (CastError) - happens when an invalid ID format is used in a query
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404); // Treat as a 404 Not Found
  }

  // Mongoose Duplicate Key Error (Code 11000) - happens on unique field violation
  if (err.code === 11000) {
    // Extract the field name that caused the duplicate error (this might vary slightly based on MongoDB/Mongoose version)
    const field = Object.keys(err.keyValue)[0];
     const value = Object.values(err.keyValue)[0];
    const message = `Duplicate field value: "${value}" for key "${field}". Please use another value.`;
    error = new ErrorResponse(message, 400); // 400 Bad Request - Conflict is arguably better (409) but 400 is common. Let's stick with 400 for consistency with some guides.
    // Alternatively, for 409 Conflict: error = new ErrorResponse(message, 409);
  }

  // Mongoose Validation Errors - happens when schema validation fails on save/update
  if (err.name === 'ValidationError') {
    // Get all validation error messages and join them
    const messages = Object.values(err.errors).map(val => val.message);
    const message = messages.join(', ');
    error = new ErrorResponse(message, 400); // 400 Bad Request
  }

   // Handle JWT errors (e.g., invalid token, expired token) - though our protect middleware catches most of these,
   // adding here provides a fallback if an error bypasses protect somehow.
   if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
       const message = 'Not authorized to access this route';
       error = new ErrorResponse(message, 401);
   }


  // --- Send the formatted response ---

  // If the error is already a custom ErrorResponse instance, use its properties
  // Otherwise, use the generic error information derived above
  res.status(error.statusCode || 500).json({
    success: false,
    // In development, you might send more error details. In production, keep it simple for security.
    error: error.message || 'Server Error'
    // Optionally include error stack in development
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;