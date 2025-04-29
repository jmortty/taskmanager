// routes/projectRoutes.js
const express = require('express');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember
} = require('../controllers/projectController'); // Import project controller functions

const { protect } = require('../middleware/auth'); // Assuming your auth middleware is here

// We can also potentially re-route tasks under a project,
// e.g., /api/v1/projects/:projectId/tasks
// For now, tasks are standalone, but keep this in mind for nesting resources later.
// const taskRouter = require('./taskRoutes'); // If nesting tasks under projects

const router = express.Router();

// Apply the protect middleware to all routes in this router
// This ensures that only authenticated users can access these project endpoints
router.use(protect);

// --- Standard Project CRUD Routes ---
router.route('/')
  .get(getProjects)    // GET /api/v1/projects - Get all projects user is involved in
  .post(createProject); // POST /api/v1/projects - Create a new project

router.route('/:id')
  .get(getProjectById)   // GET /api/v1/projects/:id - Get a single project
  .put(updateProject)    // PUT /api/v1/projects/:id - Update a project
  .delete(deleteProject); // DELETE /api/v1/projects/:id - Delete a project

// --- Project Member Management Routes ---
// Note: These routes are nested under a specific project ID
router.route('/:id/members')
    .put(addProjectMember); // PUT /api/v1/projects/:id/members - Add a member to the project (body: { memberId: '...' })
    router.route('/').get(getProjects); // and other routes
router.route('/:id/members/:memberId')
    .delete(removeProjectMember); // DELETE /api/v1/projects/:id/members/:memberId - Remove a member from the project


// Optional: If you want to nest task routes under projects
// router.use('/:projectId/tasks', taskRouter); // Example: /api/v1/projects/:projectId/tasks

module.exports = router;