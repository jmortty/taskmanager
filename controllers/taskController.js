// taskController.js – Full CRUD for tasks
const Task = require('../models/Task');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all tasks for current user
// @route   GET /api/v1/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: tasks.length, data: tasks });
});

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

  if (!task) {
    return next(new ErrorResponse('Task not found', 404));
  }

  res.status(200).json({ success: true, data: task });
});

// @desc    Create new task
// @route   POST /api/v1/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res, next) => {
  const { title, description, status, project } = req.body;

  if (!title) {
    return next(new ErrorResponse('Title is required', 400));
  }

  const task = await Task.create({
    title,
    description,
    status,
    project,
    owner: req.user._id,
  });

  res.status(201).json({ success: true, data: task });
});

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

  if (!task) {
    return next(new ErrorResponse('Task not found', 404));
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: task });
});

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

  if (!task) {
    return next(new ErrorResponse('Task not found', 404));
  }

  await task.remove();

  res.status(200).json({ success: true, data: {} });
});