// routes/labelRoutes.js
const express = require('express');
const {
  createLabel,
  getLabels,
  getLabelById,
  updateLabel,
  deleteLabel
} = require('../controllers/labelController'); // Import the label controller functions

const { protect } = require('../middleware/auth'); // Assuming you have an auth middleware file

const router = express.Router();

// Apply the protect middleware to all routes in this router
// This ensures that only authenticated users can access these label endpoints
router.use(protect);

// Define routes
router.route('/')
  .get(getLabels)    // GET /api/v1/labels - Get all labels for the logged-in user
  .post(createLabel); // POST /api/v1/labels - Create a new label

router.route('/:id')
  .get(getLabelById)   // GET /api/v1/labels/:id - Get a specific label by ID
  .put(updateLabel)    // PUT /api/v1/labels/:id - Update a specific label by ID
  .delete(deleteLabel); // DELETE /api/v1/labels/:id - Delete a specific label by ID

module.exports = router;