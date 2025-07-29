import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const TaskForm = ({ onTaskCreated, editingTask, onTaskUpdated, cancelEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: ''
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    if (!token) {
      toast.error("You need to login first");
      setIsSubmitting(false);
      return;
    }

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        ...(formData.dueDate && { dueDate: new Date(formData.dueDate).toISOString() })
      };

      if (editingTask) {
        const res = await axios.put(
          `${baseURL}/tasks/${editingTask._id}`,
          taskData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Task updated successfully!");
        onTaskUpdated(res.data);
      } else {
        const res = await axios.post(
          `${baseURL}/tasks`,
          taskData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Task created successfully!");
        onTaskCreated(res.data);
      }

      if (!editingTask) {
        setFormData({
          title: '',
          description: '',
          dueDate: ''
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-2xl mx-auto space-y-4"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-center text-cyber-blue-700">
        {editingTask ? "✏️ Edit Task" : "➕ Create New Task"}
      </h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Task title"
            className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-cyber-blue-500 focus:border-transparent"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Task details"
            className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg h-24 sm:h-32 resize-none focus:ring-2 focus:ring-cyber-blue-500 focus:border-transparent"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date (Optional)
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            className="w-full border border-gray-300 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-cyber-blue-500 focus:border-transparent"
            value={formData.dueDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
        {editingTask && (
          <button
            type="button"
            onClick={cancelEdit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !formData.title || !formData.description}
          className={`px-4 py-2 rounded-lg text-white transition-colors ${isSubmitting ? 'bg-cyber-blue-400' : 'bg-cyber-blue-600 hover:bg-cyber-blue-700'} disabled:opacity-50`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {editingTask ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            editingTask ? 'Update Task' : 'Create Task'
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;