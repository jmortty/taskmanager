// controllers/labelController.js
const Label = require('../models/Label'); // Import the Label model
const asyncHandler = require('../middleware/asyncHandler'); // Utility to handle async errors
const ErrorResponse = require('../utils/errorResponse'); // Custom error class
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

// --- Controller Functions ---

/**
 * @desc    Create a new label
 * @route   POST /api/v1/labels
 * @access  Private (Requires login)
 */
exports.createLabel = asyncHandler(async (req, res, next) => {
  // Add user ID to req.body
  req.body.user = req.user.id; // Assuming req.user.id is set by your authentication middleware

  const label = await Label.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Label created successfully',
    data: label,
  });
});

/**
 * @desc    Get all labels for the logged-in user
 * @route   GET /api/v1/labels
 * @access  Private (Requires login)
 */
exports.getLabels = asyncHandler(async (req, res, next) => {
  // Find labels that belong only to the logged-in user
  const labels = await Label.find({ user: req.user.id }).sort('name'); // Optional: sort by name

  res.status(200).json({
    success: true,
    count: labels.length,
    data: labels,
  });
});

/**
 * @desc    Get a single label by ID for the logged-in user
 * @route   GET /api/v1/labels/:id
 * @access  Private (Requires login)
 */
exports.getLabelById = asyncHandler(async (req, res, next) => {
  const labelId = req.params.id;

  // Validate if the ID is a valid MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(labelId)) {
    return next(new ErrorResponse('Invalid Label ID format', 400));
  }

  const label = await Label.findOne({
    _id: labelId,
    user: req.user.id // Ensure the label belongs to the logged-in user
  });

  if (!label) {
    // It's important not to reveal if the ID exists but belongs to another user vs. not existing at all
    return next(new ErrorResponse(`Label not found`, 404));
  }

  res.status(200).json({
    success: true,
    data: label,
  });
});

/**
 * @desc    Update a label by ID for the logged-in user
 * @route   PUT /api/v1/labels/:id
 * @access  Private (Requires login)
 */
exports.updateLabel = asyncHandler(async (req, res, next) => {
  const labelId = req.params.id;
  const updateData = req.body; // Data to update

  // Validate if the ID is a valid MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(labelId)) {
    return next(new ErrorResponse('Invalid Label ID format', 400));
  }

  // Prevent user from changing the 'user' field
  if (updateData.user) {
      delete updateData.user;
  }

  let label = await Label.findOne({
      _id: labelId,
      user: req.user.id // Ensure the label belongs to the logged-in user
  });

  if (!label) {
      return next(new ErrorResponse(`Label not found`, 404));
  }

  // Update the label fields manually or use findByIdAndUpdate with careful options
  // Using findByIdAndUpdate here for simplicity, but manual update gives more control
  label = await Label.findByIdAndUpdate(labelId, updateData, {
    new: true, // Return the updated document
    runValidators: true, // Run schema validators
    // Important: Do NOT allow finding by ID only; ensure user ownership
    // This is why we did the findOne check first
  });

  // Re-fetch with user check just to be absolutely sure, although findOne already did it
   label = await Label.findOne({
      _id: labelId,
      user: req.user.id
  });

  if (!label) {
       // This should ideally not happen if the previous findOne succeeded, but belt-and-suspenders
      return next(new ErrorResponse(`Something went wrong after finding the label`, 500));
  }


  res.status(200).json({
    success: true,
    message: 'Label updated successfully',
    data: label,
  });
});

/**
 * @desc    Delete a label by ID for the logged-in user
 * @route   DELETE /api/v1/labels/:id
 * @access  Private (Requires login)
 */
exports.deleteLabel = asyncHandler(async (req, res, next) => {
  const labelId = req.params.id;

  // Validate if the ID is a valid MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(labelId)) {
    return next(new ErrorResponse('Invalid Label ID format', 400));
  }

  // Find the label and ensure it belongs to the logged-in user
  const label = await Label.findOne({
    _id: labelId,
    user: req.user.id
  });


  if (!label) {
    return next(new ErrorResponse(`Label not found`, 404));
  }

  // TODO: Optional Enhancement: Check if any tasks are using this label
  // If tasks are using it, decide whether to prevent deletion,
  // remove the label from those tasks, or mark the label as inactive.
  // For now, we'll just delete it, which leaves the ObjectId in tasks.labels
  // Mongoose population will just return null/undefined for that ID.

  await label.deleteOne(); // Use deleteOne on the document found

  res.status(200).json({
    success: true,
    message: 'Label deleted successfully',
    data: {}, // Conventionally return empty object or deleted ID on success
  });
});