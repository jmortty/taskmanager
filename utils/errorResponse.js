// src/utils/errorResponse.js
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message); // Call the parent class constructor (Error)
        this.statusCode = statusCode; // Add a statusCode property to the error instance
    }
}

module.exports = ErrorResponse;