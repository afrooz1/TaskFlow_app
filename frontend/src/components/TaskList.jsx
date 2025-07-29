import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import TaskForm from './TaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getToken = () => JSON.parse(localStorage.getItem('user'))?.token;

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/tasks", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setTasks(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleComplete = async (task) => {
    try {
      await axios.put(
        `http://localhost:3000/api/tasks/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      toast.success(`Task marked as ${!task.completed ? 'completed' : 'pending'}`);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Task deleted successfully");
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center text-cyber-blue-700 mb-8">
        My Tasks
      </h1>

      <TaskForm
        editingTask={editingTask}
        onTaskCreated={fetchTasks}
        onTaskUpdated={() => {
          setEditingTask(null);
          fetchTasks();
        }}
        cancelEdit={() => setEditingTask(null)}
      />

      <div className="flex flex-wrap justify-center gap-3 my-6">
        {["all", "completed", "pending"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f 
                ? "bg-cyber-blue-600 text-white shadow-md" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} Tasks
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-blue-500"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg">
            {filter === 'all' 
              ? "You don't have any tasks yet. Add one above!" 
              : `No ${filter} tasks found.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${
                task.completed 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-yellow-500 bg-yellow-50'
              } transition-all hover:shadow-md`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-lg mb-1 truncate">{task.title}</h4>
                  {task.description && (
                    <p className="text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => toggleComplete(task)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      task.completed 
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </button>
                  <button
                    onClick={() => setEditingTask(task)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;