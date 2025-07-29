const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require("../controllers/taskController");
const verifyToken = require("../middleware/verifyToken");

// Apply verifyToken middleware to all task routes
router.use(verifyToken);

// Task routes
router.route("/")
  .get(getTasks)          // GET /api/tasks - Get all tasks
  .post(createTask);      // POST /api/tasks - Create new task

router.route("/:id")
  .put(updateTask)        // PUT /api/tasks/:id - Update task
  .delete(deleteTask);    // DELETE /api/tasks/:id - Delete task

// Statistics route
router.get("/stats", getTaskStats);  // GET /api/tasks/stats - Get task statistics

module.exports = router;