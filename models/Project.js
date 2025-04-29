// models/Project.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
    maxlength: [100, 'Project name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Project description cannot be more than 500 characters']
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // Reference to the User model
    required: true // Each project must have an owner
  },
  members: [ // Array of user IDs who are members of this project (many-to-many)
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User' // Reference to the User model
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
  // Optional: Add a status field for the project itself (e.g., Active, Completed, Archived)
  // status: {
  //   type: String,
  //   enum: ['Active', 'Completed', 'Archived'],
  //   default: 'Active'
  // }
});

// --- Schema Middleware ---

// Add the owner to the members list automatically before saving
// This ensures the owner is always considered a member for access checks
ProjectSchema.pre('save', function(next) {
    if (!this.members.includes(this.owner)) {
        this.members.push(this.owner);
    }
    next();
});

// --- Indexes ---

// Ensure a user cannot have multiple projects with the same name
ProjectSchema.index({ name: 1, owner: 1 }, { unique: true });


module.exports = mongoose.model('Project', ProjectSchema);