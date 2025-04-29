const mongoose = require('mongoose');

// Define the Label Schema
const LabelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a label name'],
    trim: true,
  },
  color: {
    type: String,
    trim: true,
    match: [/^#(?:[0-9a-fA-F]{3}){1,2}$/, 'Please provide a valid hex color code (e.g., #ff0000)'],
    default: '#cccccc', // Default grey color
  },
  user: { // Each label belongs to a specific user
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // No createdAt needed if not explicitly required, Mongoose adds _id with timestamp info
});

// --- Indexes ---
// Index on user and name to ensure labels are unique per user (optional, depends on requirements)
// LabelSchema.index({ user: 1, name: 1 }, { unique: true });


// Create and export the Label model
module.exports = mongoose.model('Label', LabelSchema);
