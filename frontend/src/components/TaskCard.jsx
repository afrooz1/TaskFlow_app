import React from 'react';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const token = localStorage.getItem('token');

  const toggleStatus = async () => {
    try {
      const res = await axios.put(
        `${baseURL}/tasks/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(res.data);
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${baseURL}/tasks/${task._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onDelete(task._id);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div
      className={`
        p-4 border rounded-lg shadow-sm transition-all duration-200
        ${task.completed ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}
        hover:shadow-md hover:border-cyber-blue-300
        w-full sm:w-[48%] lg:w-[32%] xl:w-[24%] mb-4
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
          {task.title}
        </h3>
        <span
          className={`
            text-xs px-2 py-1 rounded-full ml-2
            ${task.completed ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}
          `}
        >
          {task.completed ? 'Completed' : 'Pending'}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">
        {task.description || 'No description provided'}
      </p>

      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <button
          onClick={toggleStatus}
          className={`
            flex-1 text-sm font-medium px-3 py-2 rounded-md transition-colors
            ${task.completed ? 
              'bg-cyber-blue-100 text-cyber-blue-800 hover:bg-cyber-blue-200' : 
              'bg-cyber-blue-600 text-white hover:bg-cyber-blue-700'}
          `}
        >
          {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        <button
          onClick={handleDelete}
          className="
            flex-1 text-sm font-medium px-3 py-2 rounded-md
            bg-red-100 text-red-700 hover:bg-red-200 transition-colors
          "
        >
          Delete
        </button>
      </div>

      {task.dueDate && (
        <div className="mt-3 text-xs text-gray-500">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
