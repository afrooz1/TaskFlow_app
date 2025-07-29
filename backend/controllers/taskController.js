const Task = require("../models/Task");

// Helper function for error handling
const handleError = (res, err, customMessage = "Server Error") => {
  console.error(err.message);
  res.status(500).json({ message: customMessage });
};

// Get all tasks with optional filtering
exports.getTasks = async (req, res) => {
  try {
    const { completed, priority } = req.query;
    const filter = { user: req.user.id };

    if (completed) filter.completed = completed === 'true';
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    handleError(res, err);
  }
};

// Create new task with validation
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority = "medium", dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = new Task({
      user: req.user.id,
      title,
      description,
      priority: ['high', 'medium', 'low'].includes(priority) ? priority : "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      completed: false
    });

    await task.validate(); // Validate before saving
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    handleError(res, err, "Failed to create task");
  }
};

// Update task with validation
exports.updateTask = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'completed', 'priority', 'dueDate'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: "Invalid updates!" });
    }

    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    updates.forEach(update => task[update] = req.body[update]);
    await task.save();
    res.json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    handleError(res, err, "Failed to update task");
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    handleError(res, err, "Failed to delete task");
  }
};

// Get comprehensive task statistics
exports.getTaskStats = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    const now = new Date();

    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      priorities: {
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length
      },
      overdue: tasks.filter(t => 
        t.dueDate && new Date(t.dueDate) < now && !t.completed
      ).length,
      dueThisWeek: tasks.filter(t => {
        if (!t.dueDate || t.completed) return false;
        const dueDate = new Date(t.dueDate);
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return dueDate >= now && dueDate <= nextWeek;
      }).length
    };

    res.json(stats);
  } catch (err) {
    handleError(res, err, "Failed to get task statistics");
  }
};