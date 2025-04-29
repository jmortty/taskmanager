// controllers/projectController.js
const Project = require('../models/Project'); // Import the Project model
const User = require('../models/User');       // Import the User model (for member validation)
const Task = require('../models/Task');       // Import the Task model (for cascading delete)
const asyncHandler = require('../middleware/asyncHandler'); // Utility to handle async errors
const ErrorResponse = require('../utils/errorResponse'); // Custom error class
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

// Helper function to check if user is owner or member of a project
// Used internally by other controllers
const checkProjectAccess = async (projectId, userId) => {
    const project = await Project.findById(projectId).populate('owner members', 'username email'); // Populate owner/members
    if (!project) {
        throw new ErrorResponse(`Project not found with id ${projectId}`, 404);
    }

    const isOwner = project.owner._id.toString() === userId.toString();
    const isMember = project.members.some(member => member._id.toString() === userId.toString());

    if (!isOwner && !isMember) {
        throw new ErrorResponse(`User not authorized to access this project`, 403);
    }

    // Return the project document with populated owner/members
    return { project, isOwner, isMember };
};


// --- Controller Functions ---

/**
 * @desc    Create a new project
 * @route   POST /api/v1/projects
 * @access  Private (Requires login)
 */
exports.createProject = asyncHandler(async (req, res, next) => {
    const { name, description } = req.body;
    const userId = req.user.id; // Logged-in user ID

    // Basic validation
    if (!name) {
        return next(new ErrorResponse('Please provide a project name', 400));
    }

    // Create the project - owner and initial member (the creator) handled by schema pre-save hook
    const project = await Project.create({
        name,
        description,
        owner: userId, // Set the owner to the logged-in user
        // members array will automatically include the owner via the pre-save hook
    });

    // Populate owner and members for the response
    const populatedProject = await Project.findById(project._id)
                                        .populate('owner', 'username email')
                                        .populate('members', 'username email');

    res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: populatedProject,
    });
});

/**
 * @desc    Get all projects for the logged-in user (owned or a member of)
 * @route   GET /api/v1/projects
 * @access  Private (Requires login)
 */
exports.getProjects = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    // Find projects where the user is either the owner or a member
    const projects = await Project.find({
        $or: [
            { owner: userId },
            { members: userId }
        ]
    })
    .populate('owner', 'username email')
    .populate('members', 'username email')
    .sort('name'); // Optional: sort projects by name

    // TODO: Implement filtering, sorting, and pagination similar to getTasks if needed

    res.status(200).json({
        success: true,
        count: projects.length,
        data: projects,
    });
});

/**
 * @desc    Get a single project by ID
 * @route   GET /api/v1/projects/:id
 * @access  Private (Requires login, user must be owner or member)
 */
exports.getProjectById = asyncHandler(async (req, res, next) => {
    const projectId = req.params.id;
    const userId = req.user.id;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new ErrorResponse('Invalid Project ID format', 400));
    }

    // Check access using the helper function
    const { project } = await checkProjectAccess(projectId, userId);

    // The project document with populated owner/members is already returned by checkProjectAccess
    res.status(200).json({
        success: true,
        data: project,
    });
});

/**
 * @desc    Update a project by ID
 * @route   PUT /api/v1/projects/:id
 * @access  Private (Requires login, user must be owner for full update, members for basic?)
 */
exports.updateProject = asyncHandler(async (req, res, next) => {
    const projectId = req.params.id;
    const userId = req.user.id;
    const updateData = { ...req.body }; // Copy update data

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new ErrorResponse('Invalid Project ID format', 400));
    }

    // Check access and ownership using the helper function
    const { project, isOwner, isMember } = await checkProjectAccess(projectId, userId);

    // Define which fields can be updated by whom
    if (isOwner) {
        // Owner can update name and description
        // Prevent changing owner or members array directly via this route
        delete updateData.owner;
        delete updateData.members;
        delete updateData.createdAt;

    } else if (isMember) {
         // Members can only update name and description (or maybe just description?)
         // For simplicity, let members update name and description but prevent other fields
         const allowedUpdates = ['name', 'description'];
         Object.keys(updateData).forEach(key => {
             if (!allowedUpdates.includes(key)) {
                 delete updateData[key]; // Remove disallowed fields
             }
         });
         if (Object.keys(updateData).length === 0) {
             return next(new ErrorResponse('Members can only update name or description.', 403));
         }
    } else {
         // This case should be caught by checkProjectAccess, but included for clarity
        return next(new ErrorResponse('User not authorized to update this project', 403));
    }

    // Perform the update
    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        updateData,
        { new: true, runValidators: true } // Return updated doc, run schema validators
    )
    .populate('owner', 'username email')
    .populate('members', 'username email'); // Populate after update

    if (!updatedProject) {
         // Should not happen if checkProjectAccess succeeded, but included as a safeguard
        return next(new ErrorResponse(`Project not found`, 404));
    }

    res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: updatedProject,
    });
});

/**
 * @desc    Delete a project by ID
 * @route   DELETE /api/v1/projects/:id
 * @access  Private (Requires login, user must be the owner)
 */
exports.deleteProject = asyncHandler(async (req, res, next) => {
    const projectId = req.params.id;
    const userId = req.user.id;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new ErrorResponse('Invalid Project ID format', 400));
    }

    // Find the project and ensure the user is the owner
    const { project, isOwner } = await checkProjectAccess(projectId, userId);

    if (!isOwner) {
        return next(new ErrorResponse(`Only the project owner can delete this project`, 403));
    }

    // --- Cascading Delete ---
    // Delete all tasks associated with this project
    await Task.deleteMany({ project: projectId });
    console.log(`Deleted tasks for project ${projectId}`);

    // Delete the project itself
    await project.deleteOne(); // Use deleteOne on the document found

    res.status(200).json({
        success: true,
        message: 'Project and associated tasks deleted successfully',
        data: {},
    });
});

// --- Member Management Functions ---

/**
 * @desc    Add a member to a project
 * @route   PUT /api/v1/projects/:id/members
 * @access  Private (Requires login, user must be the owner)
 */
exports.addProjectMember = asyncHandler(async (req, res, next) => {
    const projectId = req.params.id;
    const { memberId } = req.body; // The ID of the user to add
    const userId = req.user.id; // Logged-in user (the caller)

     // Validate Project ID format
     if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new ErrorResponse('Invalid Project ID format', 400));
    }
     // Validate Member ID format
    if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) {
        return next(new ErrorResponse('Please provide a valid memberId', 400));
    }

    // Check if caller is the project owner
    const { project, isOwner } = await checkProjectAccess(projectId, userId);

    if (!isOwner) {
        return next(new ErrorResponse(`Only the project owner can add members`, 403));
    }

    // Check if the target user exists
    const memberToAdd = await User.findById(memberId);
    if (!memberToAdd) {
        return next(new ErrorResponse(`User not found with ID ${memberId}`, 404));
    }

    // Check if the user is already a member
    if (project.members.some(member => member._id.toString() === memberId)) {
        return next(new ErrorResponse(`User is already a member of this project`, 400));
    }

    // Add the member to the members array
    project.members.push(memberId);
    await project.save();

    // Re-populate for response
    const updatedProject = await Project.findById(projectId)
                                    .populate('owner', 'username email')
                                    .populate('members', 'username email');

    res.status(200).json({
        success: true,
        message: 'Member added successfully',
        data: updatedProject.members, // Return updated members list
    });
});

/**
 * @desc    Remove a member from a project
 * @route   DELETE /api/v1/projects/:id/members/:memberId
 * @access  Private (Requires login, user must be the owner)
 */
exports.removeProjectMember = asyncHandler(async (req, res, next) => {
    const projectId = req.params.id;
    const { memberId } = req.params; // The ID of the member to remove
    const userId = req.user.id; // Logged-in user (the caller)

    // Validate Project ID format
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return next(new ErrorResponse('Invalid Project ID format', 400));
    }
    // Validate Member ID format
   if (!memberId || !mongoose.Types.ObjectId.isValid(memberId)) {
       return next(new ErrorResponse('Please provide a valid memberId', 400));
   }

    // Check if caller is the project owner
    const { project, isOwner } = await checkProjectAccess(projectId, userId);

    if (!isOwner) {
        return next(new ErrorResponse(`Only the project owner can remove members`, 403));
    }

    // Prevent the owner from removing themselves
    if (project.owner._id.toString() === memberId) {
         return next(new ErrorResponse(`The project owner cannot be removed from the project`, 400));
    }


    // Check if the user to remove is actually a member
    const initialMemberCount = project.members.length;
    project.members = project.members.filter(member => member._id.toString() !== memberId);

    if (project.members.length === initialMemberCount) {
        return next(new ErrorResponse(`User with ID ${memberId} is not a member of this project`, 404));
    }

     // TODO: Consider reassigning tasks owned by the removed member within this project?
     // For now, tasks remain assigned to the removed user. This might need clarification
     // based on desired application logic (e.g., unassign tasks, assign to owner).

    await project.save();

    // Re-populate for response
    const updatedProject = await Project.findById(projectId)
                                .populate('owner', 'username email')
                                .populate('members', 'username email');

    res.status(200).json({
        success: true,
        message: 'Member removed successfully',
        data: updatedProject.members, // Return updated members list
    });
});